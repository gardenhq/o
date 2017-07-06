module.exports = function()
{
    return {
        "rollup.transformer.js": {
            "callable": __dirname + "/transformer.js",
            "arguments": [
                "@rollup",
                "@rollup.plugin.memory",
                "#rollup.plugin"
            ]
        },
        "o.dev.transformers.js.rollup.loader": {
            "callable": __dirname + "/loader.js",
            "arguments": [
                "@o.dev.loader",
                "@willow.system.resolve",
                "@babel.transformer.js"
            ],
            "tags": [
                "rollup.plugin"
            ]
        },
        "rollup": {
            "object": "rollup/dist/rollup.browser.js",
            "version": "0.41.6"
        },
        "rollup.plugin.memory": {
            "object": "rollup-plugin-memory/dist/rollup-plugin-memory.cjs.js",
            "version": "2.0.0"
        }
    };
}
