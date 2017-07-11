const loader = require("../../");
var expect, metrics, o, getResolve;
describe(
    "browser resolve",
    function()
    {
        before(
            function()
            {
                global.window = {
                    test: true,
                    location: {
                        pathname: ""
                    }
                };

                global.document = {
                    getElementsByTagName: function()
                    {
                        return [
                            {
                                hasAttribute: function()
                                {

                                },
                                getAttribute: function()
                                {

                                }
                            }
                        ];
                    }

                };
                require("../../../src/o.js");
                getResolve = window.getResolve;
                return loader.then(
                    function(loaded)
                    {
                        ({expect, metrics} = loaded);
                    }
                );
            }
        );
        after(
            function()
            {
                global.window = undefined;
                global.document = undefined;
            }
        );
        context(
            "browser",
            function()
            {
                it(
                    "resolves with a CDN Base",
                    function()
                    {
                        const resolve = getResolve("/node_modules/", "http://cdn.somewhere.com/react-dom@15.5.4");
                        var res;
                        res = resolve(
                        	"./lib/ReactDOM"
                        );
						expect(res).to.equal("http://cdn.somewhere.com/react-dom@15.5.4/lib/ReactDOM");
                        res = resolve(
                        	"./lib/ReactDOM/deep/down/elsewhere"
                        );
						expect(res).to.equal("http://cdn.somewhere.com/react-dom@15.5.4/lib/ReactDOM/deep/down/elsewhere");
                    }
                )
            }
        )
    }
);
