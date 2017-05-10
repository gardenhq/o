const loader = require("../../");
var builder, expect, metrics, getAjaxDouble;
[
    {
        name: "memory",
        path: "../../../src/registry/memory.js"
    }
].forEach(
    function(item)
    {
        var _registry;
        global.registry = function(func)
        {
            _registry = func;
        }
        require(item.path);
        describe(
            item.name + ' register',
            function()
            {
                var getModule = _registry;
                before(
                    function()
                    {
                        return loader.then(
                            function(loaded)
                            {
                                ({expect, metrics, builder} = loaded);
                                return Promise.all(
                                    [
                                        "double.loader.ajax"
                                    ].map(
                                        function(item)
                                        {
                                            return builder.get(item);
                                        }
                                    )
                                ).then(
                                    function(services)
                                    {
                                        [getAjaxDouble] = services;
                                    }
                                );
                            }
                        );
                    }
                );
                it(
                    "is a function",
                    function()
                    {
                        expect(getModule).to.be.a("function");
                        var module = getModule("actual/script/path");
                        expect(module).to.be.a("function");
                    }
                );
                context(
                    "with",
                    function()
                    {
                        var module = getModule("actual/script/path");
                        it.skip(
                            "does",
                            function()
                            {
                                var double = getAjaxDouble("content");
                                expect(module).to.be.a("function");
                                var registry = module();
                                console.log(registry.set);
                                // return module(
                                //  "path.js",
                                //  double
                                // ).then(
                                //  function(data)
                                //  {
                                //      expect(data.content).to.equal("content");

                                //  }
                                // );

                            }
                        );
                    }
                );

            }
        );

    }
);
