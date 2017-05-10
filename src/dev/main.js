module.exports = function(translator, reloader, flash, clearCache, bundler, toolbar, component, win, doc)
{
    return function(config)
    {
        flash();
        win.dirty = function()
        {
            clearCache().then(function(reload){reload()});  
        };
        win.bundle = bundler(config);
        if(win.location.hash.substr(1) == "bundle") {
            setTimeout(
                function()
                {
                    win.bundle(null, null, true).then(
                        function(bundle)
                        {
                            document.documentElement.innerHTML = "<pre>\n\n" + bundle + "\n</pre>";
                        }
                    );
                },  
                1000
            );
        } else {
            reloader();
            component(toolbar, "toolbar");
            doc.body.appendChild(doc.createElement("x-toolbar"));
            console.info("Type `dirty()` to clear the entire cache.");
        }
        return translator;
    }
}

