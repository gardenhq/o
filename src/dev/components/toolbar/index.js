module.exports = function(builder)
{
    var root = __dirname;
    return {
        "o.dev.toolbar.template":
        {
            "object": root + "/template.html"
        },
        "o.dev.toolbar.css":
        {
            "object": root + "/toolbar.css"
        },
        "o.dev.toolbar": {
            "callable": root + "/toolbar.js",
            "arguments": [
                "@o.dev.toolbar.template",
                "@o.dev.toolbar.css",
                "@o.dev.cache.invalidator",
                "@filesaver",
                "@mousetrap"
            ]
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
}
