module.exports = function()
{
    return {
        "imports": [
            __dirname + "/rollup/container",
            __dirname + "/babel/container"
        ],
        "babel.transformer.js": {
            "tags": [
                "system.transformer.js"
            ]
        },
        // "babel.presets": [['es2015', { modules: false } ], 'react'],
        // "rollup.transformer.js": {
        //     "tags": [
        //         "system.transformer.js"
        //     ]
        // },
        "js-yaml": {
            "object": "js-yaml/dist/js-yaml.min.js",
            "version": "3.8.4"
        },
        "system.loaders.css": {
            "callable": __dirname + "/css"
        },
        "system.loaders.yaml": {
            "callable": __dirname + "/yaml",
            "arguments": [
                "@js-yaml"
            ]
        },
        "system.loaders.html": {
            "callable": __dirname + "/html"
        },
        "system.loaders.js": {
            "callable": __dirname + "/js",
            "arguments": [
                "#system.transformer.js"
            ]
        } 
    };
}
