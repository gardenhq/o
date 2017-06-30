module.exports = function()
{
    var bundlerPrefix = "o+file://";
    var root = __dirname + "/..";
    return {
        "imports": [
            __dirname + "/uglify/container.js"
        ],
        "o.dev.bundler": {
            "callable": __dirname + "/index.js",
            "arguments": [
                "@dom.localStorage",
                bundlerPrefix,
                "@o.dev.templates:bundle",
                "@o.dev.templates:app",
                "@o.dev.templates:minimal",
                "@o.dev.templates:maximal",
                "@o.dev.bundler.minifier"
            ]
        },
        "o.dev.bundler.minifier": {
            "callable": __dirname + "/minifier.js",
            "arguments": [
                "@uglify-js",
                {
                    compress: {
                        inline: false,
                        unsafe: true
                    }
                }
            ]
        },
        // "o.dev.bundler.minifier": {
        //     "callable": __dirname + "/minifier.js",
        //     "arguments": [
        //         "@babili-standalone"
        //     ]
        // },
        "o.dev.bundler.template.o.minimal": {
            "object": root + "/oMinimal.js#text/javascript",
            "tags": [ { name: "o.dev.template", key: "minimal" } ]
        },
        "o.dev.bundler.template.o.maximal": {
            "object": root + "/oMaximal.js#text/javascript",
            "tags": [ { name: "o.dev.template", key: "maximal" } ]
        },
        "o.dev.bundler.template.app": {
            "object": __dirname + "/templates/app.js#text/javascript+literal",
            "tags": [ { name: "o.dev.template", key: "app" } ]
        },
        "o.dev.bundler.template.bundle": {
            "object": __dirname + "/templates/bundle.js#text/javascript+literal",
            "tags": [ { name: "o.dev.template", key: "bundle" } ]
        }
        // "babili-standalone": {
        //     "requires": {
        //         "Babel": "@babel.standalone"
        //     },
        //     "object": "babili-standalone/babili.min.js",
        //     "version": "0.0.10",
        //     "ignore-require": true
        // }
    };
}
