module.exports = function()
{
    var root = __dirname;
    return {
        "babel.plugin.transform.es2015.template-literals": {
            "object": root + "/plugins/template-literals.js"
        },
        "babel.transformer": {
            "callable": root + "/transformer.js",
            "arguments": [
                "@babel.pipeline",
                "@babel.plugins"
            ]
        },
        "babel.plugins": {
            "iterator": "@babel.plugin.factory",
            "arguments": [
                "#babel.plugin"
            ]
        },
        "babel.plugin.factory": {
            "callable": root + "/factory.js",
            "arguments": [
                "@babel.core",
                "@babel.plugin"
            ]
        },
        "babel.core": {
            "object": root + "/babel-core.js"
        },
        "babel.pipeline": {
            "class": "@babel.core:Pipeline"
        },
        // TODO: this needs investigating
        "babel.plugin": {
            "object": "@babel.core:Pipeline.Plugin"
        }
    };
}
