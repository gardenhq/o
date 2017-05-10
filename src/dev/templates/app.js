(
    function(o)
    {
        (
            function(load)
            {
                load.then(
                    function(System)
                    {
                        load = o = undefined;
                        System.config(
                            {
                                bundled: true,
                                ${
                                    Object.keys(config).map(
                                        function(key)
                                        {
                                            return key + ': "' + config[key] + '"';
                                        }
                                    ).join(",\n")
                                }
                            }
                        );
                        ${bundles}.then(
                            function()
                            {
                                System.import("${ main }").then(
                                    function(module)
                                    {
                                        if(typeof module === "function") {
                                            module(Promise.resolve(System));
                                        }
                                    }
                                );
                            }
                        );
                    }
                );
            }
        )(
            o(
                function(promised)
                {
                    return promised(document);
                }
            )
        );
    }
)(${ o })
