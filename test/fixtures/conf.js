module.exports = function()
{
    return {
        "test": {
            "service": function(container)
            {
                return "test";
            }
        },
        "klass": {
            "class": "../fixtures/class",
            "arguments": [
                "hi"
            ]
        }
    };

}
