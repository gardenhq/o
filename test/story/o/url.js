const loader = require("../../");
var expect, metrics, o, url, fixtures;
describe(
    "o > url",
    function()
    {
        before(
            function()
            {
                return loader.then(
                    function(loaded)
                    {
                        ({expect, metrics, builder} = loaded);
                        return Promise.all(
                            [
                                "fixtures",
                                "double.dom.window",
                                "double.dom.document"
                            ].map(
                                function(item)
                                {
                                    return builder.get(item);
                                }
                            )
                        ).then(
                            function(services)
                            {
                                var window, document;
                                [fixtures, window, document] = services;
                                global.window = window;
                                global.document = document;
                                require("../../../src/o.js");
                                url = global.window.url;
                                global.window = undefined;
                                global.document = undefined;
                            }
                        );
                    }
                );
            }
        );
        context(
            "using /fixtures.yaml#url",
            function()
            {
                it(
                    "url",
                    function()
                    {
                        expect(url).to.be.a("function");
                        fixtures.url.forEach(
                            function(item, i, arr)
                            {
                                const actual = url(item.path, item.base);
                                expect(actual).to.equal(item.expected)
                            }
                        );
                    }
                )
            }
        )
    }
);
