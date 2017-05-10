(
    function(load)
    {
        var print = function(helloWorld)
        {
            if(typeof document !== "undefined") {
                var h1 = document.createElement("h1");
                h1.textContent = helloWorld;
                document.body.appendChild(h1);
            }
            console.log(helloWorld);
        }
        load.then(
            function(builder)
            {
                return builder.build(
                    {
                        "app.hello": {
                            "object": "../hello-world.js"
                        },
                        "main": {
                            "resolve": [
                                "@app.hello"
                            ],
                            "service": function(container, helloWorld)
                            {
                                return function()
                                {
                                    print(helloWorld + " (using a relative path)");
                                }
                            }
                        }
                    }       
                ).run("main");

            }
        ).catch(
            function(e)
            {
                throw e;
            }
        );
    }
)(o(function(promised){return promised(document)}))

