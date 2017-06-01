module.exports = function()
{
    return {
        "babel.presets": ['es2015', 'react'],
        "babel.plugins": [],
        "babel.transformer.js": {
            "callable": __dirname + "/transformer.js",
            "arguments": [
                "@babel.standalone",
                "@babel.presets",
                "@babel.plugins"
            ]
        },
        "babel.transformer.jsx.args": [],
        "babel.transformer.jsx": {
            "callable": __dirname + "/jsx-transformer.js",
            "arguments": [
                "@babel.standalone",
                "@babel.presets",
                "@babel.plugins",
                "@babel.transformer.jsx.args"
            ]
        },
        "babel.standalone": {
            "object": "babel-standalone/babel.min.js",
            "version": "6.24.2" 
        }
    };
}
