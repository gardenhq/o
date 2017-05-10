module.exports = function(storage, prefix, engine, bundleTemplate, appTemplate, oMin, oMax)
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
                        if(path == "/node_modules/o/_o.js" || path == "/node_modules/o/src/_o.js") {
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
                console.log(bundled);
                if(download) {
                    return Promise.resolve(bundled);
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
                    const bundle = app.render(
                        {
                            o: o,
                            bundles: bundled,
                            main: config.src,
                            config: config
                        }
                    );
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
