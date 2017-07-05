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
                _import("./import-export.js").then(
                    function(world)
                    {
                        print(`Hello ${world.default}!`);
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

