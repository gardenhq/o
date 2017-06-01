module.exports = function(translator, reloader, flash, clearCache, bundler, toolbar, component, win, doc)
{
    return function(config)
    {
        flash();
        var bundle = bundler(config);
        switch(win.location.hash.substr(1)) {
            case "bundle":
                function htmlEscape(str) {
                    return str
                        .replace(/&/g, '&amp;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                }
                setTimeout(
                    function()
                    {
                        bundle(null, null, true).then(
                            function(bundle)
                            {
                                doc.documentElement.innerHTML = "<pre>\n\n" + htmlEscape(bundle) + "\n</pre>";
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
                win.bundle = function()
                {
                    bundle(null, null, true).then(
                        function(bundle)
                        {
                            // console.log(bundle);
                        }
                    );   
                };
                console.info("Type `bundle()` to bundle. Type `dirty()` to clear the entire cache.");
                reloader();
                component(toolbar, "toolbar");
                doc.body.appendChild(doc.createElement("x-toolbar"));
        }
        return translator;
    }
}

