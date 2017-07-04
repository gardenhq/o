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
            function(_import)
            {
                // when data-basepath is not set then window.location.pathname is used
                _import("../hello-world.js").then(
                    function(helloWorld)
                    {
                        print(helloWorld);
                    }
                );

            }
        ).catch(
            function(e)
            {
                console.error(e);
            }
        );
    }
)(o(function(promised){return promised(document)}))

