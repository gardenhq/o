module.exports = function(builder)
{
    return {
        "imports": [
            {
                resource: "@gardenhq/js-test-harness/conf/"
            }
        ],
        "o": {
            "object": "../"
        },
        "double.parser.loader": {
            "resolve": [
                "@test.match",
                "@test.calledWith"
            ],
            "service": function(match, calledWith)
            {
                return function(content, headers)
                {
                    headers = headers || {
                        "Content-Type": "application/javascript"
                    };
                    return calledWith(
                        [
                            match.anything()
                        ]
                    ).resolvesWith(
                        {
                            headers: headers,
                            content: content || "module.exports = function(){ return 'hi'; }"
                        }
                    );

                }
            }
        },
        "double.parser.registry": {
            "resolve": [
                "@test.match",
                "@test.calledWith"
            ],
            "service": function(match, calledWith)
            {
                return function()
                {
                    var registry = function()
                    {

                    }
                    registry.set = function(path, module)
                    {
                        return module;
                    }
                    return registry;

                }
            }
        },
        "double.parser.require": {
            "resolve": [
                "@test.match",
                "@test.calledWith"
            ],
            "service": function(match, calledWith)
            {
                return function()
                {
                    return function()
                    {

                    }
                }
            }
        },
        "double.loader.ajax": {
            "resolve": [
                "@test.match",
                "@test.calledWith"
            ],
            "service": function(match, calledWith)
            {
                return function(content)
                {
                    var Ajax = function()
                    {

                    }
                    Object.assign(
                        Ajax.prototype,
                        {
                            readyState: 4,
                            status: content == null ? 404 : 200,
                            responseText: content,
                            open: calledWith(
                                [
                                    match.anything(),
                                    match.anything(),
                                    match.anything()
                                ]
                            ).returns(null),
                            getResponseHeader: calledWith(
                                [
                                    match.anything()
                                ]
                            ).returns("application/javascript"),
                            send: function()
                            {
                                this.onreadystatechange();
                            }
                        }
                    );
                    return Ajax;

                }
            }
        },
        "double.require": {
            "resolve": [
                "@test.match",
                "@test.calledWith"
            ],
            "service": function(match, calledWith)
            {
                return calledWith(
                    [
                        match.anything()
                    ]
                ).returns("module");
            }
        }
    };
}
