module.exports = function(builder)
{
    // TODO: imports are in reverse??
    var win = window;
    var doc = document;
    var bundlerPrefix = "o+file://";
    var invalidatorPrefix = "*";
    var root = __dirname;
    var env = function(key, defaultValue)
    {
        key = "o+env://" + key;
        return typeof win.localStorage[key] !== "undefined" ? win.localStorage[key] : defaultValue;
    }
    return {
        "imports": [
            {
                resource: root + "/transformers/index"
            },
            {
                resource: "@gardenhq/component-factory/conf/index",
                version: "^1.1.0"
            },
            {
                resource: root + "/components/toolbar/index"
            }
        ],
        "o.dev.toolbar.defaults": {
            "resolve": [
                "@o.dev.reloader.websocket.url",
                "@o.dev.bundler.filename",
                "@o.dev.cache.invalidator.files"
            ],
            "service": function(filewatcher, bundle, files)
            {
                return function(key, defaultValue)
                {
                    switch(key) {
                        case "filewatcher":
                            return filewatcher;
                            break
                        case "bundle":
                            return bundle;
                            break;
                        case "invalidate":
                            return files;
                            break
                        default:
                            return defaultValue;
                    }
                }
            }
        },
        // TODO: replace with 'process' and ${O_DEV_RELOADER_URL:-/_index.ws}
        "o.dev.reloader.websocket.url": env("O_DEV_RELOADER_URL", "/_index.ws"),
        "o.dev.bundler.filename": env("O_DEV_BUNDLER_FILENAME", "bundle.min.js"),
        "o.dev.cache.invalidator.files": env("O_DEV_INVALIDATOR_FILES", "*"),

        "o.dev.bundler.o.maximal": root + "/oMaximal.js",
        "o.dev.bundler.o.minimal": root + "/oMinimal.js",
        
        "main": {
            "callable": root + "/main.js",
            "arguments": [
                "@o.dev.translator",
                "@o.dev.reloader.websocket",
                "@o.dev.flash",
                "@o.dev.cache.invalidator",
                "@o.dev.bundler",
                "@o.dev.toolbar",
                "@component-factory.factory",
                "@filesaver",
                "@mousetrap",
                win,
                doc
            ],
        },
        "o.dev.flash": {
            "callable": root + "/flash.js",
            "arguments": [
                win.localStorage
            ]
        },
        "o.dev.cache.invalidator": {
            "callable": root + "/clearCache.js",
            "arguments": [
                win.localStorage,
                win.location.reload.bind(win.location),
                "@o.dev.flash",
                invalidatorPrefix
            ]
        },
        "o.dev.translator": {
            "callable": root + "/translator.js",
            "arguments": [
                builder
            ]
        },
        "o.dev.reloader.websocket": {
            "callable": root + "/reload.js",
            "arguments": [
                "@o.dev.reloader.websocket.url",
                "@o.dev.cache.invalidator",
                "@o.dev.flash"
            ]
        },
        "o.dev.bundler.template.app":{
            "object": root + "/templates/app.js#text/javascript+literal"
        },
        "o.dev.bundler.template.bundle":{
            "object": root + "/templates/bundle.js#text/javascript+literal"
        },
        "o.dev.bundler": {
            "callable": root + "/bundler.js",
            "arguments": [
                win.localStorage,
                bundlerPrefix,
                "@parse-template-literal",
                "@o.dev.bundler.template.bundle",
                "@o.dev.bundler.template.app",
                "@o.dev.bundler.o.minimal",
                "@o.dev.bundler.o.maximal",
                "@babili.standalone"
            ]
        },
        "babili.standalone": {
            "requires": {
                "Babel": "@babel.standalone"
            },
            "object": "babili-standalone/babili.min.js",
            "version": "0.0.10",
            "ignore-require": true
        },
        "parse-template-literal": {
            "object": "@gardenhq/parse-template-literal/index.js"
        },
        "filesaver": {
            "object": "file-saver/FileSaver",
            "version": "^1.3.3"
        },
        "mousetrap": {
            "object": "mousetrap/mousetrap",
            "version": "^1.6.1"
        }
    };
};
