module.exports = function(reloader, invalidate, transformer, bundler, hashShell, consoleShell, gui, win, doc)
{
    return function(config)
    {
        var bundle = bundler(config);
        // commands?
        // shells should be constructed by tagging
        // so I can have multiple
        if(!hashShell(bundle, invalidate)) {
            // reloader will no longer be reloader, just socket
            reloader();
            gui(
                consoleShell(bundle, invalidate)
            );
        }
        return transformer;
    }
}

