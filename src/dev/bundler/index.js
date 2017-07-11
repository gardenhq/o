module.exports = function(storage, prefix, bundles, app, oMin, oMax, minify)
{
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
                        if(path.indexOf("@gardenhq/o/_o.js") !== -1 || path.indexOf("/src/_o.js") !== -1) {
                            return;
                        }
                        try {
                            var data = JSON.parse(storage.getItem(key));
                            if(data.headers['Cache-Control'] === "private") {
                                o = function(config){ return oMax.render(); };
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
                    register: register || "function(path, func, filename){ return _import.registerDynamic(path, [], true, func, path + (filename || '')); }",
                    items: files,
                    exports: config.export
                }
            );
            if(bundleOnly) {
                if(download) {
                    // return Promise.resolve(bundled);
                    return Promise.resolve(minify(bundled));
                }
                return "Bundled '" + bundleOnly + "'";
            }
            var bundle = app.render(
                {
                    o: o(config),
                    bundles: bundled,
                    main: config.src,
                    config: config
                }
            );
            // console.log(bundle.length);
            console.debug("Bundling " + config.src + " (if your source is large this may take a few seconds to minify...)");
            bundle = minify(bundle);
            console.log(bundle);
            console.debug("Bundled " + config.src);
            if(download) {
                return Promise.resolve(bundle);
            }
            bundleOnly = bundleOnly || "*";
            return "Bundling '" + bundleOnly + "'";
        }
    };

}
