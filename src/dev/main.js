module.exports = function(translator, reloader, flash, clearCache, bundler, toolbar, component, File, Key, win, doc)
{
    var htmlEscape = function(str)
    {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    // TODO: really this has nothing to do with o
    // beginning of willow's web based env vars
    var exportEnv = function(key)
    {
        return function(e)
        {
            var value = e.detail.callback.bind(e.target);
            var val = value(e.detail.event);
            win.localStorage.setItem("o+env://" + key, val);
        }
    }
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
                                doc.documentElement.innerHTML = "<pre>" + htmlEscape(bundle) + "</pre>";
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
                reloader();
                component(toolbar, "toolbar");
                var $toolbar = doc.createElement("x-toolbar")
                doc.body.appendChild($toolbar);
                $toolbar.addEventListener("filewatcher", exportEnv("O_DEV_RELOADER_URL"));
                $toolbar.addEventListener("bundle", exportEnv("O_DEV_BUNDLER_FILENAME"));
                $toolbar.addEventListener("invalidate", exportEnv("O_DEV_INVALIDATOR_FILES"));
                win.dirty = function(file)
                {
                    file = file == "*" ? null : file;
                    clearCache(file).then(function(reload){reload()});  
                };
                Key.bind(
                    [
                        'command+r',
                        'ctrl+r'
                    ],
                    function()
                    {
                        win.dirty($toolbar.getAttribute("invalidate"))
                    }
                );
                win.bundle = function()
                {
                    bundle(null, null, true).then(
                        function(bundle)
                        {
                            var blob = new Blob(
                                [bundle],
                                {type: "text/javascript;charset=utf-8"}
                            );
                            File.saveAs(blob, $toolbar.getAttribute("bundle"));
                        }
                    );   
                };
                $toolbar.addEventListener(
                    "clear",
                    function(e)
                    {
                        win.dirty(e.target.getAttribute("invalidate"));
                    }
                );
                $toolbar.addEventListener("build", win.bundle);
                console.info("Type `bundle()` to bundle. Type `dirty()` to clear the entire cache.");
        }
        return translator;
    }
}

