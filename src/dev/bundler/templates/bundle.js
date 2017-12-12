        Promise.all(
            [
${ 
    items.map(
        function(item)
        {
            var filename = "";
            if(item.path !== item.url) {
                // console.log(item.path, item.url);
                // filename = ',"' + item.url.replace(item.path, "") + '"';
                filename = ',"' + item.url + '"';
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
        ${ main == item.path ? "var " + exports + " = function(cb){return cb(function(){return Promise.resolve(function(path){return Promise.resolve(require(path));});});};" : ""}
        ${ item.content }
    }${ filename }
)`;
            }
        }
    ).join(",\n")
}
            ]
        )
