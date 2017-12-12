const loader = require("../../");
var expect, metrics, o, getResolve, fixtures;
describe(
    "o > resolve",
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
                                getResolve = global.window.getResolve;
                                global.window = undefined;
                                global.document = undefined;
                            }
                        );
                    }
                );
            }
        );
        context(
            ">",
            function()
            {
                it(
                    "url",
                    function()
                    {
                        expect(getResolve).to.be.a("function");
                        const resolve = getResolve("/node_modules/", "http://cdn.somewhere.com/react-dom@15.5.4");
                        var res;
                        res = resolve(
                            "./lib/ReactDOM"
                        );
                        console.log(res);
                        expect(res).to.equal("http://cdn.somewhere.com/react-dom@15.5.4/lib/ReactDOM");
                        res = resolve(
                            "./lib/ReactDOM/deep/down/elsewhere"
                        );
                        expect(res).to.equal("http://cdn.somewhere.com/react-dom@15.5.4/lib/ReactDOM/deep/down/elsewhere");
                        // fixtures.getResolve.forEach(
                        //     function(item, i, arr)
                        //     {
                        //         console.log(item.includepath);
                        //         const resolve = getResolve(item.includepath, item.base);
                        //         item.resolve.forEach(
                        //             function(item, i, arr)
                        //             {
                        //                 console.log(item.path);
                        //                 const actual = url(item.path);
                        //                 console.log(actual);
                        //                 expect(actual).to.equal(item.expected);
                        //             }
                        //         )
                        //     }
                        // );
                    }
                )
            }
        )
    }
);
