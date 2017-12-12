(
    // bundleConfig //, register, require, resolve
    function(exports, module, require, __filename)
    {
        Promise.resolve(
            ${o}
        ).then(
            function(o)
            {
                return o(function(o){return o(document);})
            }
        ).then(
            function(require) // actually import but require will get overwritten
            {
                ${bundles}.then(
                    function()
                    {
                        require(${ main }).then(
                            function(_module)
                            {
                                // this is needed for data-module support
                                if(typeof _module === "function") {
                                    // load, config, register, resolve
                                    _module(Promise.resolve(require), exports, module, __filename);
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
