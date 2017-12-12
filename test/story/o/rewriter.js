const loader = require("../../");
var expect, metrics, o, defaultRewriter, appendVersionToPackageNameRewriter, fixtures;
describe(
    "o > rewriters",
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
                                defaultRewriter = global.window.defaultRewriter(); // its a factory
                                appendVersionToPackageNameRewriter = global.window.appendVersionToPackageNameRewriter(
                                    "http://cdn.somewhere.com",
                                    defaultRewriter
                                );
                                global.window = undefined;
                                global.document = undefined;
                            }
                        );
                    }
                );
            }
        );
        context(
            "using ./fixtures.yaml#rewriter",
            function()
            {
                it(
                    "are functions",
                    function()
                    {
                        expect(defaultRewriter).to.be.a("function");
                        expect(appendVersionToPackageNameRewriter).to.be.a("function");
                    }
                )
                it(
                    "rewriter",
                    function()
                    {
                        fixtures.rewriter.fixtures.forEach(
                            function(item, i, arr)
                            {
                                var actual = defaultRewriter(item.path, item.headers);
                                expect(actual.path).to.equal(fixtures.rewriter.default.expected[i].path);
                                expect(actual.hash).to.equal(fixtures.rewriter.default.expected[i].hash);
                                actual = appendVersionToPackageNameRewriter(item.path, item.headers);
                                expect(actual.path).to.equal(fixtures.rewriter.versionAppending.expected[i].path);
                                expect(actual.hash).to.equal(fixtures.rewriter.versionAppending.expected[i].hash);
                            }
                        );
                    }
                )
            }
        );
    }
);
