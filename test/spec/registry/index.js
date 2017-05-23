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
                    ">",
                    function()
                    {
                        // TODO: Decide how to make an injectable Module
                        var module = getModule("actual/script/path");
                        it(
                            "is a function",
                            function()
                            {
                                expect(module).to.be.a("function");
                            }
                        );
                        it(
                            "sets and gets (and too much other stuff)",
                            function()
                            {
                                const filename = "/my/path.js";
                                const dirname = "/my";
                                const _exports = "hi";
                                var called = false;
                                const cache = {};
                                const registry = module(cache);// m

                                registry.set(
                                    filename,
                                    // TODO: Change order
                                    function(module, exports, require, __filename, __dirname)
                                    {
                                        expect(__filename).to.equal(filename);
                                        expect(__dirname).to.equal(dirname);
                                        module.exports = _exports;
                                        called = true;
                                    }
                                );
                                expect(registry.set(filename, "")).to.equal(undefined);
                                console.log(cache.keys);
                                expect(cache.keys[filename]).to.equal(true);
                                expect(cache.modules[filename]).to.not.equal(null);
                                return registry.get(filename).then(
                                    function(module)
                                    {
                                        expect(module).to.equal(_exports);
                                        expect(called).to.equal(true);
                                        
                                        registry.delete(filename);
                                        expect(registry.has(filename)).to.equal(false);
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
