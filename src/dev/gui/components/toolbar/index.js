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
        "o.dev.toolbar.defaults": {
            "service": function()
            {
                return function(key, defaultValue)
                {
                    return defaultValue;
                }
            }
        },
        "o.dev.toolbar": {
            "callable": root + "/toolbar.js",
            "arguments": [
                "@o.dev.toolbar.template",
                "@o.dev.toolbar.css",
                "@o.dev.toolbar.defaults"
            ]
        },
    };
}
