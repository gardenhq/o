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
            "object": "js-yaml/dist/js-yaml.js"
        },
        "system.loaders.css": {
            "callable": root + "/css.js"
        },
        "system.loaders.yaml": {
            "callable": root + "/yaml.js",
            "arguments": [
                "@js-yaml"
            ]
        },
        "system.loaders.html": {
            "callable": root + "/html.js"
        },
        "system.loaders.js": {
            "callable": root + "/js.js",
            "arguments": [
                "#system.transformer.js"
            ]
        }
    };
}
