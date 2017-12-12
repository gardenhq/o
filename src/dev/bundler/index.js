module.exports = function(storage, prefix, bundles, app, oMin, oMax, minify)
{
    return function(config)
    {
        return function(bundleOnly, register, download)
        {
            var o = oMin;
            var files = [];
            var maxConfigIgnore = [
                "transport",
                "proxy",
                "parser",
                "registry",
                "export",
                "entry-dev"
            ];
            var configIgnore = maxConfigIgnore.concat(
                [
                    "includepath",
                    "basepath",
                    "src",
                    "baseURL"
                ]
            );
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
                        } catch(e) {
                            throw e;
                        }
                        if(data.headers['Cache-Control'] === "private") {
                            configIgnore = maxConfigIgnore;
                            o = function(config){ return oMax.render(); };
                            return;
                        }
                        data.path = path;
                        if(path.indexOf(bundleOnly) !== -1 || bundleOnly == null) {
                            files.push(data);
                        }
                    }
                }
            );
            var bundled = bundles.render(
                {
                    items: files,
                    exports: config.export,
                    main: config.src
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
                    main: '"' + config.src + '"',
                    config: config,
                    keys: Object.keys(config).filter(
                        function(key)
                        {
                            return configIgnore.indexOf(key) === -1;
                        }
                    )
                }
            );
            // console.log(bundle.length);
            console.debug("Bundling " + config.src + " (if your source is large this may take a few seconds to minify...)");
            try {
                bundle = minify(bundle);
            } catch(e) {
                console.log(e);
            }
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
