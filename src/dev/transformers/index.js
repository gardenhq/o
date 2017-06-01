module.exports = function()
{
    var root = __dirname;
    return {
        "imports": [
            root + "/babel/index.js"
        ],
        "babel.transformer.js": {
         "tags": [
             "system.transformer.js"
         ]
        },
        "js-yaml": {
            "object": "js-yaml/dist/js-yaml.min.js",
            "version": "3.8.4"
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
