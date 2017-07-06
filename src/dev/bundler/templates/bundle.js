(
                    /* o */
    function(r${ exports ? ", " + exports : "" })
    {
        return Promise.all(
            [
${ 
    items.map(
        function(item)
        {
            if(item.headers['Content-Type'] != "application/javascript") {
                return `
r(
    "${ item.path }",
    function(module, exports, require, __filename, __dirname)
    {
        module.exports = ${ JSON.stringify(item.content) };
    }
)`;
            } else {
                return `
r(
    "${ item.path }",
    function(module, exports, require, __filename, __dirname)
    {
        ${ item.content }
    }
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
            return Promise.resolve(_import);
        }` : "")
    }
)
