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
                        "javascript", "js", "x-javascript",
                        "jsx", "es6"
                    ],
                    "yaml": ["yaml", "yml"],
                    "css": ["css"],
                    "html": ["html"]
                };
            }
        }
    };
}
