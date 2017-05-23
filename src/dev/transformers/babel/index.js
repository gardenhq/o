module.exports = function()
{
    return {
        "babel.transformer": {
            "callable": __dirname + "/transformer.js",
            "arguments": [
                "@babel.standalone"
            ]
        },
        "babel.standalone": {
            "object": "babel-standalone/babel.min.js",
            "version": "6.24.2" 
        }
    };
}
