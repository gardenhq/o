var expect, metrics;
var loader = require("../");
var load = require("../../builder.js")(function(o){return o(require)});
describe(
    'b',
    function()
    {
        before(
            function()
            {
                return loader.then(
                    function(loaded)
                    {
                        ({expect, metrics} = loaded);
                    }
                );
            }
        );
        it(
            "builds from a hash",
            function()
            {
                return load.then(
                    function(builder)
                    {
                        return builder.build(
                            {
                                "a.class": {
                                    "class": "../fixtures/class",
                                    "arguments": [
                                        "hi"
                                    ]
                                }
                            }
                        ).get("a.class").then(
                            function(instance)
                            {
                                expect(instance.constructor).to.be.a("function");
                                expect(instance.constructor.name).to.equal("Klass");
                            }
                        );
                    }
                );
            }
        );
        it(
            "builds from a required file",
            function()
            {
                return load.then(
                    function(builder)
                    {
                        return builder.build(
                            "../fixtures/conf"
                        ).get("klass").then(
                            function(instance)
                            {
                                expect(instance.constructor).to.be.a("function");
                                expect(instance.constructor.name).to.equal("Klass");
                            }
                        );
                    }
                );
            }
        );

    }
);
