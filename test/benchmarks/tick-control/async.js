(
    function(load)
    {
        load.then(
            function(_import)
            {
                _import("@gardenhq/tick-control/").then(
                    function(tickControl)
                    {
                        tickControl(_import).then(
                            function(TemplateLiteral)
                            {
                                var template = new TemplateLiteral("Hello World");
                                console.log(template.render());
                            }
                        );
                    }
                );

            }
        );
    }
)(o(function(promised){return promised(document)}))

