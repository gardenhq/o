module.exports = function()
{
    var root = __dirname;
    return {
        // "imports": [
        //     root + "/babel/index.js"
        // ],
        // "babel.plugin.transform.es2015.template-literals": {
        //  "tags": [
        //      "babel.plugin"
        //  ]
        // },
        // "babel.transformer": {
        //  "tags": [
        //      "system.transformer.js"
        //  ]
        // },
        "js-yaml": {
            "object": "js-yaml/index",
            // "object": "js-yaml/dist/js-yaml",
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
