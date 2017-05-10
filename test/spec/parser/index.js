const loader = require("../../");
// var expect, metrics, o;
var builder, expect, metrics, getLoaderDouble, getRegistryDouble, getRequireDouble;

[
    {
        name: "eval",
        path: "../../../src/parser/eval.js"
    },
    {
        name: "function",
        path: "../../../src/parser/function.js"
    }
].forEach(
    function(item)
    {
        var _parser;
        global.parser = function(func)
        {
            _parser = func;
        }
        require(item.path);
        describe(
            item.name + ' parser',
            function()
            {
                var _require;
                var getParser = _parser;
                before(
                    function()
                    {
                        return loader.then(
                            function(loaded)
                            {
                                ({expect, metrics, builder} = loaded);
                                return Promise.all(
                                    [
                                        "double.parser.loader",
                                        "double.parser.registry",
                                        "double.parser.require"
                                    ].map(
                                        function(item)
                                        {
                                            return builder.get(item);
                                        }
                                    )
                                ).then(
                                    function(services)
                                    {
                                        [getLoaderDouble, getRegistryDouble, getRequireDouble] = services;
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
                        expect(getParser).to.be.a("function");
                        var parser = getParser("actual/script/path");
                        expect(parser).to.be.a("function");
                    }
                );
                context(
                    "with a .js script path",
                    function()
                    {
                        var parser = getParser("actual/script/path");
                        it(
                            "evaluates",
                            function()
                            {
                                var loaderDouble = getLoaderDouble();
                                var requireDouble = getRequireDouble();
                                var registryDouble = getRegistryDouble();
                                var module = parser(
                                    "path.js",
                                    loaderDouble,
                                    requireDouble,
                                    registryDouble                                  
                                )
                                return module.then(
                                    function(data)
                                    {
                                        // expect(wrapper).to.be.a("function");
                                        // var module = {
                                        //  exports: {}
                                        // };
                                        // wrapper(module, module.exports);
                                        expect(loaderDouble).to.have.been.calledWith("path.js");
                                        // expect(module.exports).to.be.a("function");
                                        // expect(module.exports()).to.equal("hi");

                                    }
                                );

                            }
                        );
                        it(
                            "evaluates a lot",
                            function()
                            {
                                var loaderDouble = getLoaderDouble();
                                var requireDouble = getRequireDouble();
                                var registryDouble = getRegistryDouble();
                                var module = parser(
                                    "path.js",
                                    loaderDouble,
                                    requireDouble,
                                    registryDouble                                  
                                )
                                return module.then(
                                    function(wrapper)
                                    {
                                        expect(wrapper).to.be.a("function");
                                        var module = {
                                            exports: {}
                                        };
                                        var results = [];
                                        metrics.aggregate(item.name);
                                        Array.apply(null, Array(10)).forEach(
                                            function()
                                            {
                                                metrics.start(item.name);
                                                Array.apply(null, Array(1000)).forEach(
                                                    function(item, i)
                                                    {
                                                        wrapper(module, module.exports);
                                                    }
                                                );
                                                metrics.stop(item.name);
                                            }
                                        );
                                        metrics.average();
                                        expect(loaderDouble).to.have.been.calledWith("path.js");
                                        expect(module.exports).to.be.a("function");
                                        expect(module.exports()).to.equal("hi");

                                    }
                                );

                            }
                        );
                        it(
                            "appends the source path",
                            function()
                            {
                                var loaderDouble = getLoaderDouble();
                                var requireDouble = getRequireDouble();
                                var registryDouble = getRegistryDouble();
                                var parserCalled = false;
                                var module = parser(
                                    "path.js",
                                    loaderDouble,
                                    requireDouble,
                                    registryDouble,                             
                                    function(source)
                                    {
                                        return function(module, exports, require)
                                        {
                                            parserCalled = true;
                                            expect(source).to.contain("//# sourceURL=");
                                        }
                                    }
                                )
                                return module.then(
                                    function(wrapper)
                                    {
                                        expect(wrapper).to.be.a("function");
                                        var module = {
                                            exports: {}
                                        };
                                        wrapper(module, module.exports);
                                        expect(loaderDouble).to.have.been.calledWith("path.js");
                                        expect(parserCalled).to.equal(true);
                                    }
                                );

                            }
                        );

                    }
                );
                context(
                    "with a .json script path",
                    function()
                    {
                        var parser = getParser("actual/script/path");
                        it(
                            "parses",
                            function()
                            {
                                var loaderDouble = getLoaderDouble('{"value": 1}', {"Content-Type": "application/json"});
                                var requireDouble = getRequireDouble();
                                var registryDouble = getRegistryDouble();
                                var module = parser(
                                    "path.json",
                                    loaderDouble,
                                    requireDouble,
                                    registryDouble                                  
                                )
                                return module.then(
                                    function(wrapper)
                                    {
                                        expect(wrapper).to.be.a("function");
                                        var module = {
                                            exports: {}
                                        };
                                        var result = wrapper(module, module.exports);
                                        expect(loaderDouble).to.have.been.calledWith("path.json");
                                        expect(result).to.deep.equal({value: 1});
                                        expect(module.exports).to.deep.equal({value: 1});

                                    }
                                );

                            }
                        );
                        it(
                            "doesn't append a source path",
                            function()
                            {
                                var loaderDouble = getLoaderDouble('{"value": 1}', {"Content-Type": "application/json"});
                                var requireDouble = getRequireDouble();
                                var registryDouble = getRegistryDouble();
                                var parserCalled = false;
                                var module = parser(
                                    "path.json",
                                    loaderDouble,
                                    requireDouble,
                                    registryDouble,                             
                                    function(source)
                                    {
                                        // this just uses JSON.parse
                                        parserCalled = true;
                                    }
                                )
                                return module.then(
                                    function(wrapper)
                                    {
                                        expect(wrapper).to.be.a("function");
                                        var module = {
                                            exports: {}
                                        };
                                        wrapper(module, module.exports);
                                        expect(loaderDouble).to.have.been.calledWith("path.json");
                                        expect(parserCalled).to.equal(false);
                                    }
                                );

                            }
                        );

                    }
                );
                context(
                    "with a .txt path",
                    function()
                    {
                        var parser = getParser("actual/script/path");
                        it(
                            "assigns",
                            function()
                            {
                                var loaderDouble = getLoaderDouble('hi', {"Content-Type": "text/plain"});
                                var requireDouble = getRequireDouble();
                                var registryDouble = getRegistryDouble();
                                var module = parser(
                                    "path.txt",
                                    loaderDouble,
                                    requireDouble,
                                    registryDouble                                  
                                )
                                return module.then(
                                    function(wrapper)
                                    {
                                        expect(wrapper).to.be.a("function");
                                        var module = {
                                            exports: {}
                                        };
                                        var result = wrapper(module, module.exports);
                                        expect(loaderDouble).to.have.been.calledWith("path.txt");
                                        expect(result).to.equal("hi");

                                    }
                                );

                            }
                        );
                        it(
                            "doesn't append a source path",
                            function()
                            {
                                var parserCalled = false;
                                var loaderDouble = getLoaderDouble('hi', {"Content-Type": "text/plain"});
                                var requireDouble = getRequireDouble();
                                var registryDouble = getRegistryDouble();
                                var module = parser(
                                    "path.txt",
                                    loaderDouble,
                                    requireDouble,
                                    registryDouble,                             
                                    function(source)
                                    {
                                        parserCalled = true;
                                    }
                                )
                                return module.then(
                                    function(wrapper)
                                    {
                                        expect(wrapper).to.be.a("function");
                                        var module = {
                                            exports: {}
                                        };
                                        wrapper(module, module.exports);
                                        expect(loaderDouble).to.have.been.calledWith("path.txt");
                                        expect(parserCalled).to.equal(false);

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
