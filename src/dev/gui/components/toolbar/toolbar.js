module.exports = function(template, css, defaults)
{
    return {
        shadow: true,
        attributes: {
            root: {
                value: __dirname,
                visibility: "hidden"
            },
            bundle: {
                bind: true,
                value: defaults("bundle", "bundle.min.js")
            },
            filewatcher: {
                bind: true,
                value: defaults("filewatcher", "/_index.ws")
            },
            invalidate: {
                bind: true,
                value: defaults("invalidate", "*")
            },
            uid: {
                visibility: "hidden",
                value: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                })
            }
        },
        lifecycle: {
            connectedCallback: function()
            {
                setTimeout(
                    function()
                    {
                        var marginTop = 0;
                        this.ownerDocument.body.style.marginTop = marginTop + this.offsetHeight + "px";
                    }.bind(this),
                    200
                );
            }
        },
        template: template,
        css: css
    };

}
