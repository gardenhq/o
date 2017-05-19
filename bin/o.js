#!/usr/bin/env node
(
    function(load)
    {
        load.then(
            function(builder)
            {
                return builder.build(__dirname + "/o/container.yaml").run("main");
            }
        ).then(
            function(o)
            {
                console.log(o);
            }
        ).catch(
            function(e)
            {
                console.error(e);
            }
        );
    }
)(require("../builder.js")(function(o){return o(require)}));
