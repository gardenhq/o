(
                    /* o */
    function(module${ exports ? ", " + exports : "" })
    {
        return Promise.all(
            [
${ 
    items.map(
        function(item)
        {
            var filename = "";
            if(item.path !== item.url) {
                filename = ',"' + item.url.replace(item.path, "") + '"';
            }
            if(item.headers['Content-Type'] != "application/javascript") {
                return `
module(
    "${ item.path }",
    function(module, exports, require, __filename, __dirname)
    {
        module.exports = ${ JSON.stringify(item.content) };
    }${ filename }
)`;
            } else {
                return `
module(
    "${ item.path }",
    function(module, exports, require, __filename, __dirname)
    {
        ${ item.content }
    }${ filename }
)`;
            }
        }
    ).join(",\n")
}
            ]
        );
    }
)(
    ${ register }${(exports ? `,
        function()
        {
            return Promise.resolve(module);
        }` : "")
    }
)
