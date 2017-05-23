module.exports = function(builder)
{
    // TODO: imports are in reverse??
    var win = window;
    var doc = document;
    var bundlerPrefix = "o+file://";
    var invalidatorPrefix = "*";
    var root = __dirname;
    return {
        "imports": [
            {
                resource: root + "/transformers/index"
            },
            {
                resource: "@gardenhq/component-factory/conf/index",
                version: "^1.0.0"
            },
            {
                resource: root + "/components/toolbar/index"
            }
        ],
        // TODO: replace with process and $O_DEV_RELOADER_URL
        "o.dev.reloader.websocket.url": win.localStorage["o+env://O_DEV_RELOADER_URL"],
        "o.dev.bundler.o.maximal": root + "/oMaximal.js",
        "o.dev.bundler.o.minimal": root + "/oMinimal.js",
        "babili.standalone": {
            "requires": {
                "Babel": "@babel.standalone"
            },
            "object": "babili-standalone/babili.min.js",
            "version": "0.0.10",
            "ignore-require": true
        },
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
        "parse-template-literal": {
            "object": "@gardenhq/parse-template-literal/index.js"
        }
    };
};
