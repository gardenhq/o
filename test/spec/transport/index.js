const loader = require("../../");
var builder, expect, metrics, getAjaxDouble;
[
    {
        name: "XMLHttpRequest",
        path: "../../../src/transport/xhr.js"
    }//,
    // {
    //  name: "XMLHttpRequest with Nodelike Resolver",
    //  path: "../../../src/transport/xhrNodeResolver.js"
    // }
].forEach(
    function(item)
    {
        var _transport;
        global.transport = function(func)
        {
            _transport = func;
        }
        require(item.path);
        describe(
            item.name + ' loader',
            function()
            {
                var getModule = _transport;
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
                    "loading path.js",
                    function()
                    {
                        var module = getModule("actual/script/path");
                        it(
                            "loads",
                            function()
                            {
                                var double = getAjaxDouble("content");
                                return module(
                                    "path.js",
                                    double
                                ).then(
                                    function(data)
                                    {
                                        expect(data.content).to.equal("content");

                                    }
                                );

                            }
                        );
                        it(
                            "throws",
                            function()
                            {
                                var double = getAjaxDouble();
                                return module(
                                    "path.js",
                                    double
                                ).then(
                                    function(data)
                                    {

                                        expect(true).to.equal(false);
                                    }
                                ).catch(
                                    function(e)
                                    {
                                        expect(e).to.be.an("Error");
                                        // expect(e.message).to.be.equal("Unable to load path.js (404)");
                                    }
                                );

                            }
                        );
                        it.skip(
                            "gives the correct error message",
                            function()
                            {
                                var double = getAjaxDouble();
                                return module(
                                    "path.js",
                                    double
                                ).then(
                                    function(data)
                                    {

                                        expect(true).to.equal(false);
                                    }
                                ).catch(
                                    function(e)
                                    {
                                        expect(e.message).to.be.equal("Unable to load path.js (404)");
                                    }
                                );

                            }
                        );
                    }
                );

            }
        );

    }
);
