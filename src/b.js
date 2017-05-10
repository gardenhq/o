module.exports = function(load)
{
    return load.then(
        function(System)
        {
            var register;
            if(System.registerDynamic != null) {
                register = System.registerDynamic.bind(System);
            }
            return System.import(
                "@gardenhq/willow/index.js"
            ).then(
                function(builder)
                {
                    return builder(
                        System,
                        register,
                        "@gardenhq/willow/conf/javascript"
                    );
                }
            ).then(
                function(builder)
                {
                    var config = System.getConfig();
                    var services = config.hash;
                    if(!services && typeof document !== "undefined") {
                        var scripts = document.getElementsByTagName("script");
                        var script = scripts[scripts.length - 1];
                        if(script.hasAttribute("src")) {
                            var src = script.getAttribute("src");
                            var temp  = src.split("#");
                            if(temp.length > 1) {
                                services = System.resolve(temp[1], location.pathname);
                            }
                        }
                    }
                    if(services) {
                        var temp = services.split(":");
                        if(!config.basepath) {
                            System.config(
                                {
                                    baseURL: temp[0]
                                }
                            );
                        }
                        return builder.build(
                            temp[0]
                        ).run(temp[1] || "main");
                    } else {
                        return builder;
                    }
                }
            );
        }
    );
};
