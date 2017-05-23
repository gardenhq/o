module.exports = function()
{
    var root = __dirname;
    return {
        "imports": [
            root + "/babel/index.js"
        ],
        "babel.transformer": {
         "tags": [
             "system.transformer.js"
         ]
        },
        "js-yaml": {
            "object": "js-yaml/index",
            "version": "3.8.4"
            //headers: {"Cache-Control": "private", "Content-Type": ""} etc
            // "ignore-require": true
        },
        "system.loaders.css": {
            "callable": root + "/css"
        },
        "system.loaders.yaml": {
            "callable": root + "/yaml",
            "arguments": [
                "@js-yaml"
            ]
        },
        "system.loaders.html": {
            "callable": root + "/html"
        },
        "system.loaders.js": {
            "callable": root + "/js",
            "arguments": [
                "#system.transformer.js"
            ]
        }
    };
}
