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
            function(System)
            {
                // when data-basepath is not set then window.location.pathname is used
                System.import("./hello-world.js").then(
                    function(helloWorld)
                    {
                        print(helloWorld + " (from examples/o/sub/external.js)");
                    }
                );

            }
        ).catch(
            function()
            {
                console.log(arguments);
            }
        );
    }
)(o(function(promised){return promised(document)}))

