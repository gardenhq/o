module.exports = function(builder)
{
    var invalidatorPrefix = "*";
    return {
        "imports": [
            {
                resource: "@gardenhq/tick-control/container.js",
                version: "^1.0.0"
            },
            {
                resource: "@gardenhq/domino/container.js",
                version: "^1.0.0"
            },
            {
                resource: __dirname + "/transformer/container.js"
            },
            {
                resource: __dirname + "/shell/container.js"
            },
            {
                resource: __dirname + "/gui/container.js"
            },
            {
                resource: __dirname + "/bundler/container.js"
            }
        ],
        "o.dev.templates": {
            "iterator": "@gardenhq.tick-control.iterator",
            "arguments": [
                "#o.dev.template"
            ]
        },
        
        "main": {
            "callable": __dirname + "/main.js",
            "arguments": [
                "@o.dev.reloader.websocket",
                "@o.dev.cache.invalidator",
                "@o.dev.transformer",
                "@o.dev.bundler",
                "@o.dev.shell.hash",
                "@o.dev.shell.console",
                "@o.dev.gui",
                "@dom.window",
                "@dom.document"
            ],
        },
        "o.dev.cache.invalidator": {
            "callable": __dirname + "/cache/invalidator.js",
            "arguments": [
                "@dom.localStorage",
                "@dom.location.reload",
                "@o.dev.shell.flash",
                invalidatorPrefix
            ]
        },
        "o.dev.reloader.websocket": {
            "callable": __dirname + "/reloader/websocket.js",
            "arguments": [
                "@O_DEV_RELOADER_URL",
                "@o.dev.cache.invalidator",
                "@o.dev.shell.flash"
            ]
        }
    };
};
