module.exports = function(html, win, doc)
{
    return function(bundle, invalidate)
    {
        switch(win.location.hash.substr(1)) {
            case "bundle":
                setTimeout(
                    function()
                    {
                        bundle(null, null, true).then(
                            function(bundle)
                            {
                                doc.documentElement.innerHTML = "<pre>" + html(bundle) + "</pre>";
                            }
                        );
                    },  
                    2000
                );
                break;
            case "dirty":
            case "clear":
                invalidate().then(
                    function()
                    {
                        win.location.href = win.location.pathname;
                    }
                );
                break;
            default:
                return false;
        }
        return true;

    }
}
