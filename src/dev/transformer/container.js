module.exports = function(builder)
{
    return {
        "imports": [
            {
                resource: __dirname + "/transformers/container"
            }
        ],
        "o.dev.transformer": {
            "callable": __dirname + "/index.js",
            "arguments": [
                builder,
                "@o.dev.transformer.types"
            ]
        },
        "o.dev.transformer.types": {
            "service": function()
            {
                return {
                    "js": [
                        "javascript", "json", "js",
                        "jsx", "es6" // its just javascript!
                    ], 
                    "css": ["css"],
                    "html": ["html"],
                    "yaml": ["yaml", "yml"]
                };
            }
        }
    };
}
