(
    function(o)
    {
        (
            function(load)
            {
                load.then(
                    function(_import)
                    {
                        load = o = undefined;
                        ${bundles}.then(
                            function()
                            {
                                _import("${ main }").then(
                                    function(module)
                                    {
                                        // this is needed for data-module support
                                        if(typeof module === "function") {
                                            module(Promise.resolve(_import));
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
)(
    (
        function(_bundleConfig)
        {
            return (${o});
        }
    )(
        {
            ${
                Object.keys(config).filter(
                    function(key)
                    {
                        return [
                            "transport",
                            "proxy",
                            "parser",
                            "registry",
                            "export"
                        ].indexOf(key) === -1;
                    }
                ).map(
                    function(key)
                    {
                        return '"' + key + '": "' + config[key] + '"';
                    }
                ).join(",\n")
            }
        }
    )
)
