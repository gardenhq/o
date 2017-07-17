(
    function(exports)
    {
        ${o}(
            // this never gets called in minimal
            function(o){return o(document);} 
        ).then(
            function(module) // actually import but module will get overwritten
            {
                ${bundles}.then(
                    function()
                    {
                        module("${ main }").then(
                            function(_module)
                            {
                                // this is needed for data-module support
                                if(typeof _module === "function") {
                                    _module(Promise.resolve(module), exports);
                                }
                            }
                        );
                    }
                );
            }
        );
    }
)(
    {
        ${
            keys.map(
                function(key)
                {
                    return '"' + key + '": "' + config[key] + '"';
                }
            ).join(",\n")
        }
    }
);
