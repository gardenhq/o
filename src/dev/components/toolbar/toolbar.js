module.exports = function(template, css, clearCache, file, Key)
{
    Key.bind(
        [
            'command+r',
            'ctrl+r'
        ],
            function(e)
            {
                clearCache().then(function(reload){reload()});
                return false;
            }
    );
    var definition = {
        shadow: true,
        attributes: {
            root: {
                value: __dirname,
                visibility: "hidden"
            },
            fullclear: {
                bind: true,
                value: false
            },
            autobundle: {
                type: Boolean,
                bind: true,
                value: false
            },
            out: {
                bind: true,
                value: ""
            },
            only: {
                bind: true,
                value: ""
            }
        },
        events: {
            clear: "clearCache"
        },
        methods: {
            "save": function()
            {
                window.bundle(null, null, true).then(
                    function(str)
                    {
                        var blob = new Blob(
                            [str],
                            {type: "text/javascript;charset=utf-8"}
                        );
                        file.saveAs(blob, this.getAttribute("out") + ".js");

                    }.bind(this)
                );
            },
            "clearCache": function()
            {
                clearCache().then(function(reload){reload()});
            }
        },
        lifecycle: {
            beforeAnimationFrameCallback: function(props)
            {
                // console.log(props.autobundle === true);
                return arguments;
            },
            connectedCallback: function()
            {
                setTimeout(
                    function()
                    {
                        document.body.style.marginTop = this.offsetHeight + "px";
                    }.bind(this),
                    200
                );
            },
            constructedCallback: function(props, on)
            {
                // on("clear", this.clearCache);
                // on(
                //  "clear",
                //  function()
                //  {

                //  }
                // )
                this.addEventListener(
                    "clear",
                    this.clearCache
                );
                this.addEventListener(
                    "build",
                    this.save
                );
                
            }   
        },
        template: template,
        css: css
    };

    return definition;
}
