module.exports = function()
{
    return {
        "imports": [
            {
                resource: "@gardenhq/component-factory/conf/index.js",
                version: "^1.1.0"
            },
            {
                resource: __dirname + "/components/toolbar/index.js"
            }
        ],
        "o.dev.gui": {
            "callable": __dirname + "/index.js",
            "arguments": [
                "@component-factory.factory",
                "@o.dev.toolbar",
                "@o.dev.shell.env.export",
                "@dom.document"
            ]
        },
        "o.dev.toolbar.defaults": {
            "resolve": [
                "@O_DEV_RELOADER_URL",
                "@O_DEV_BUNDLER_FILENAME",
                "@O_DEV_INVALIDATOR_FILES"
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
    };
}
