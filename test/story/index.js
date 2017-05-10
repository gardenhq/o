const loader = require("../");
var expect, metrics, o;
describe(
    'o',
    function()
    {
        var _require;
        before(
            function()
            {
                return loader.then(
                    function(loaded)
                    {
                        ({expect, metrics, o} = loaded);
                        return o(
                            function(promised)
                            {
                                return promised(require);
                            }
                        ).then(
                            function(require)
                            {
                                _require = require;
                            }
                        );

                    }
                );
            }
        );
        context(
            "native require pre",
            function()
            {
                it(
                    "loads a single module",
                    function()
                    {
                        const name = this.test.fullTitle();
                        metrics.start(name);
                        require("../fixtures/native-require/module.js");
                        metrics.stop(name);
                    }
                );
                it(
                    "loads multiple modules",
                    function()
                    {
                        const name = this.test.fullTitle();
                        const modules = [
                            "../fixtures/native-require/one.js",
                            "../fixtures/native-require/two.js"
                        ];
                        metrics.start(name);
                        modules.map(
                            function(item)
                            {
                                return require(item);
                            }
                        );
                        metrics.stop(name);
                    }
                ) 

            }
        );
        context(
            "promised require with o pre",
            function()
            {
                it(
                    "loads a single module",
                    function()
                    {
                        const require = _require;
                        // metrics.start();
                        const name = this.test.fullTitle();
                        metrics.start(name);
                        return require("../fixtures/promised-require/module.js").then(
                            function(m)
                            {
                                metrics.stop(name);
                                expect(m).to.equal("module");
                            }
                        );
                    }
                );
                it(
                    "loads multiple modules",
                    function()
                    {
                        const require = _require;
                        var name = this.test.fullTitle();
                        const modules = [
                            "../fixtures/promised-require/one.js",
                            "../fixtures/promised-require/two.js"
                        ];
                        metrics.start(name);
                        const load = Promise.all(modules.map(function(item){return require(item)}));
                        // const load = require.all(
                            // modules
                        // );
                        
                        
                        return load.then(
                            function(loaded)
                            {
                                metrics.stop(name);
                                const [one, two] = loaded;
                                expect(one).to.equal("one");
                                expect(two).to.equal("two");
                            }
                        );
                    }
                );
            }
        );
        context(
            "native require post",
            function()
            {
                it(
                    "loads a single module",
                    function()
                    {
                        const name = this.test.fullTitle();
                        metrics.start(name);
                        require("../fixtures/native-require/module.js");
                        metrics.stop(name);
                    }
                ) 
                it(
                    "loads multiple modules",
                    function()
                    {
                        const name = this.test.fullTitle();
                        const modules = [
                            "../fixtures/native-require/one.js",
                            "../fixtures/native-require/two.js"
                        ];
                        metrics.start(name);
                        modules.map(
                            function(item)
                            {
                                return require(item);
                            }
                        );
                        metrics.stop(name);
                    }
                ) 
            }
        );
        context(
            "promised require with o post",
            function()
            {
                it(
                    "loads a single module",
                    function()
                    {
                        const require = _require;
                        // metrics.start();
                        const name = this.test.fullTitle();
                        metrics.start(name);
                        return require("../fixtures/promised-require/module.js").then(
                            function(m)
                            {
                                metrics.stop(name);
                                expect(m).to.equal("module");
                            }
                        );
                    }
                );
                it(
                    "loads multiple modules",
                    function()
                    {
                        const require = _require;
                        var name = this.test.fullTitle();
                        const modules = [
                            "../fixtures/promised-require/one.js",
                            "../fixtures/promised-require/two.js"
                        ];
                        metrics.start(name);
                        const load = Promise.all(modules.map(function(item){return require(item)}));
                        // const load = require.all(
                            // modules
                        // );
                        
                        
                        return load.then(
                            function(loaded)
                            {
                                metrics.stop(name);
                                const [one, two] = loaded;
                                expect(one).to.equal("one");
                                expect(two).to.equal("two");
                            }
                        );
                    }
                );
            }
        );

    }
);
