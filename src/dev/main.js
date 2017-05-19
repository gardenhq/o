module.exports = function(translator, reloader, flash, clearCache, bundler, toolbar, component, win, doc)
{
    return function(config)
    {
        flash();
        var bundle = bundler(config);
        switch(win.location.hash.substr(1)) {
            case "bundle":
                setTimeout(
                    function()
                    {
                        bundle(null, null, true).then(
                            function(bundle)
                            {
                                doc.documentElement.innerHTML = "<pre>\n\n" + bundle + "\n</pre>";
                            }
                        );
                    },  
                    1000
                );
                break;
            case "clear":
                clearCache().then(
                    function()
                    {
                        location.href = location.pathname;
                    }
                );
                break;
            default:
                win.dirty = function()
                {
                    clearCache().then(function(reload){reload()});  
                };
                win.bundle = bundle;
                console.info("Type `dirty()` to clear the entire cache.");
                reloader();
                component(toolbar, "toolbar");
                doc.body.appendChild(doc.createElement("x-toolbar"));
        }
        return translator;
    }
}

