module.exports = function(storage, prefix, engine, bundleTemplate, appTemplate, oMin, oMax, minner)
{
    var bundles = engine.compile(bundleTemplate, ["register", "items", "exports"], "/node_modules/o/util/templates/bundle.js");
    var app = engine.compile(appTemplate, ["o", "bundles", "main", "config"], "/node_modules/o/util/templates/app.js");
    return function(config)
    {
        return function(bundleOnly, register, download)
        {
            var o = oMin;
            var files = [];
            Object.keys(
                storage
            ).forEach(
                function(key)
                {
                    if(key.indexOf(prefix) === 0) {
                        var path = key.substr(prefix.length);
                        // TODO: This should change!
                        if(path.indexOf("@gardenhq/o/_o.js") !== -1 || path.indexOf("@gardenhq/o/src/_o.js") !== -1) {
                            return;
                        }
                        try {
                            var data = JSON.parse(storage.getItem(key));
                            if(data.headers['Cache-Control'] === "private") {
                                o = oMax;
                                return;
                            }
                            data.path = path;
                        } catch(e) {
                            throw e;
                        }
                        if(path.indexOf(bundleOnly) !== -1 || bundleOnly == null) {
                            files.push(data);
                        }
                    }
                }
            );
            var bundled = bundles.render(
                {
                    register: register || "function(path, func){ return System.registerDynamic(path, [], true, func); }",
                    items: files,
                    exports: config.export
                }
            );
            if(bundleOnly) {
                if(download) {
                    // return Promise.resolve(bundled);
                    return Promise.resolve(minner.transform(bundled).code);
                }
                return "Bundled '" + bundleOnly + "'";
            }
            return fetch(o).then(
                function(response)
                {
                    return response.text()
                }
            ).then(
                function(o)
                {
                    var bundle = app.render(
                        {
                            o: o,
                            bundles: bundled,
                            main: config.src,
                            config: config
                        }
                    );
                    bundle = minner.transform(bundle).code;
                    console.debug("Bundling " + location.protocol + "//" + location.host + config.src);
                    console.log(bundle);
                    console.debug("Bundled " + location.protocol + "//" + location.host + config.src);
                    if(download) {
                        return bundle;
                    }
                }
            );
            bundleOnly = bundleOnly || "*";
            return "Bundling '" + bundleOnly + "'";
        }
    };

}
