(
    function(load)
    {
        module.exports = load.then(
            function(builder)
            {
                return builder.build("./container.js").get("test.loader").then(
                    function(loader)
                    {
                        return loader(
                            "o"
                        );
                    }
                );
            }
        );
    }
)(
     typeof document !== "undefined" ?
        b(function(o){return o(document)}) :
        require("../builder")(function(o){return o(require)})
);
