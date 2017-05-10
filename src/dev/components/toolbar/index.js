module.exports = function(builder)
{
    const root = __dirname;
    return {
        "o.dev.toolbar.template":
        {
            "object": root + "/template.html#text/html+moustache"
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
            "object": "file-saver/FileSaver"
        },
        "mousetrap": {
            "object": "mousetrap/mousetrap"
        }
    };
}
