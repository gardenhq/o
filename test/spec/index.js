const loader = require("../");
var builder, expect, td, metrics, o, load, _require;
describe(
    'o spec',
    function()
    {
        before(
            function()
            {
                return loader.then(
                    function(loaded)
                    {
                        ({expect, metrics, td, builder, o} = loaded);
                        return builder.get("double.require").then(
                            function(_r)
                            {
                                _require = _r;
                                load = o(
                                    function(promised)
                                    {
                                        expect(promised).to.be.a("function")
                                        return promised(
                                            _require
                                        )
                                    }
                                );
                                return load;

                            }
                        );

                    }
                ).catch(
                    function(e)
                    {
                        console.error(e);
                    }
                );
            }
        );
        context(
            "Using o's custom api",
            function()
            {
                it(
                    'requires like require("module")',
                    function()
                    {
                        expect(o).to.be.a("function");
                        expect(load).to.be.a("Promise");
                        return load.then(
                            function(require)
                            {
                                expect(
                                    require
                                ).to.be.a("function");
                                const p = require("./module.js");
                                expect(
                                    p
                                ).to.be.a("Promise");
                                expect(_require).to.have.been.calledTimes(1);
                                expect(_require).to.have.been.calledWith("./module.js");
                                return p;
                            }
                        );

                    }
                );
            }
        );
        context(
            "Using o's custom api",
            function()
            {
                it(
                    'requires like require("module")',
                    function()
                    {
                        return load.then(
                            function(System)
                            {
                                td.reset();
                                expect(
                                    System.import
                                ).to.be.a("function");
                                const p = System.import("./module.js");
                                expect(
                                    p
                                ).to.be.a("Promise");
                                expect(_require).to.have.been.calledTimes(1);
                                expect(_require).to.have.been.calledWith("./module.js");
                                return p;
                            }
                        );

                    }
                );
                it(
                    'requires lots of modules via more standard Promise.all([].map((item) => System.import(item)))',
                    function()
                    {
                        return load.then(
                            function(System)
                            {
                                td.reset();
                                const p = Promise.all(
                                    [
                                        "./path/to/one.js",
                                        "./path/to/two.js"
                                    ].map(
                                        function(item, i, arr)
                                        {
                                            return System.import(item);
                                        }
                                    )
                                );
                                expect(
                                    p
                                ).to.be.a("Promise");
                                expect(_require).to.have.been.calledTimes(2);
                                expect(_require).to.have.been.calledWith("./path/to/one.js");
                                expect(_require).to.have.been.calledWith("./path/to/two.js");
                                return p;
                                
                            }
                        );

                    }
                );
            }
        );

    }
);
