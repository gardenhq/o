module.exports = function()
{
    return {
        // TODO: replace with 'process' and ${O_DEV_RELOADER_URL:-/_index.ws}
        "O_DEV_RELOADER_URL": {
            "resolve": ["@o.dev.shell.env"],
            "service": function(env)
            {
               return env("O_DEV_RELOADER_URL", "/_index.ws");
            }
        },
        "O_DEV_BUNDLER_FILENAME": {
            "resolve": ["@o.dev.shell.env"],
            "service": function(env)
            {
               return env("O_DEV_BUNDLER_FILENAME", "bundle.min.js");
            }
        },
        "O_DEV_INVALIDATOR_FILES": {
            "resolve": ["@o.dev.shell.env"],
            "service": function(env)
            {
               return env("O_DEV_INVALIDATOR_FILES", "*");
            }
        },
        "o.dev.shell.flash": {
            "callable": __dirname + "/flash.js",
            "arguments": [
                "@dom.localStorage"
            ]
        },
        "o.dev.shell.env": {
            "callable": __dirname + "/env.js",
            "arguments": [
                "o+env://",
                "@dom.window"
            ]
        },
        "o.dev.shell.env.export": {
            "callable": __dirname + "/exportEnv.js",
            "arguments": [
                "o+env://",
                "@dom.window"
            ]
        },
        "o.dev.shell.hash": {
            "callable": __dirname + "/hash/index.js",
            "arguments": [
                "@o.dev.shell.hash.html",
                "@dom.window",
                "@dom.document"
            ]
        },
        "o.dev.shell.hash.html": {
            "object": __dirname + "/hash/html.js"
        },
        "o.dev.shell.console": {
            "callable": __dirname + "/console/index.js",
            "arguments": [
                "@dom.window",
                "@o.dev.shell.env",
                "@filesaver",
                "@mousetrap",
                "@o.dev.shell.flash",
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
