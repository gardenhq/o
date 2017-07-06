module.exports = function()
{
    return {
        "imports": [
            __dirname + "/container.js"
        ],
        "babel.presets": [['es2015', { modules: false } ], 'react'],
        "rollup.transformer.js": {
            "tags": [
                "system.transformer.js"
            ]
        }
    };
}
