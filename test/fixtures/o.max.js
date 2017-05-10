(
    function(load)
    {
        load.then(
            function(builder)
            {
                const container = builder.build(
                    {
                        "test": {
                            "service": function(container)
                            {
                                return "test";
                            }
                        },
                        "klass": {
                            "class": "./class.js",
                            "arguments": [
                                "This is klass"
                            ]
                        },
                        "vue.core": {
                            "object": "https://unpkg.com/vuex@2.1.1/dist/vuex.min.js"
                        }
                    }
                );  
                container.get("klass").then(
                    function(klass)
                    {
                        klass.method();
                    }
                );
                container.get("vue.core").then(
                    function(vue)
                    {
                        document.write("<p>" + vue.version + "</p>");
                        console.log(vue.version);
                    }
                );
            }
        );
    }
)(
    typeof require !== "function" ? module.exports(function(o){return o(document)}) : require("../../b")(function(o){return o(require)})
)

