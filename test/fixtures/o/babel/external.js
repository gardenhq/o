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
                var world = "World";
                print(`Hello ${world}!`);
            }
        ).catch(
            function(e)
            {
                console.error(e);
            }
        );
    }
)(o(function(promised){return promised(document)}))

