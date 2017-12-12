module.exports = function(config)
{
    return function(path, doc)
    {
        doc = doc || document;
        var $iframe = doc.createElement("iframe");
        return new Promise(
            function(resolve, reject)
            {
                $iframe.onload = function()
                {
                    resolve(
                        {
                            headers: {
                                "Content-Type": "application/javascript" 
                            },
                            content: $iframe.contentDocument.firstChild.textContent
                        }
                    );
                    doc.body.removeChild($iframe);
                }

                $iframe.setAttribute("src", path);
                $iframe.setAttribute("style", "display: none;");
                doc.body.appendChild($iframe);
            }
        );
    }
};

