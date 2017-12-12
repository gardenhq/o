module.exports = function()
{
    var UglifyJS = {};
    var FILES = UglifyJS.FILES = [
        "../lib/utils.js",
        "../lib/ast.js",
        "../lib/parse.js",
        "../lib/transform.js",
        "../lib/scope.js",
        "../lib/output.js",
        "../lib/compress.js",
        "../lib/sourcemap.js",
        "../lib/mozilla-ast.js",
        "../lib/propmangle.js",
        "../lib/minify.js",
        "./exports.js"
    ].map(function(file){
        return file.replace("..", "uglify-es").replace("./", "uglify-es/tools/")
    }).reduce(
        function(prev, item, i, arr)
        {
            var key = item.split("/").pop().split(".")[0];
            prev["uglify-js." + key] = {
                "object": item + "#text/javascript",
                "tags": [{name: "uglify-js.lib", key: key}],
                "version": "3.1"
            };
            return prev;
        },
        {}
    );
    return Object.assign(
        FILES,
        {
            "uglify-js": {
                "callable": __dirname + "/index.js",
                "arguments": [
                    "#uglify-js.lib"
                ]
            }
        }
    );
}
