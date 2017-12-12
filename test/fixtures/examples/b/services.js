module.exports = function()
{
    return {
        "app.print": {
            "service": function()
            {
                return function(helloWorld)
                {
                    if(typeof document !== "undefined") {
                        var h1 = document.createElement("h1");
                        h1.textContent = helloWorld;
                        document.body.appendChild(h1);
                    }
                    console.log(helloWorld);
                }
            }
        },
        "app.hello": {
            "object": "../hello-world.js",
            "bundle": false
        },
        "main": {
            "resolve": [
                "@app.hello",
                "@app.print"
            ],
            "service": function(helloWorld, print)
            {
                return function()
                {
                    print(helloWorld);
                }
            }
        }
    };
}
