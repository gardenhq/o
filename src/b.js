module.exports = function(load)
{
    var version = "#@6.1.0";
    return load.then(
        function(System)
        {
            var register;
            var resolve;
            // not available in node
            if(System.registerDynamic != null) {
                register = System.registerDynamic.bind(System);
            }
            // not available in node, but should? be on require.resolve
            if(System.resolve != null) {
                resolve = System.resolve.bind(System);
            }
            return System.import(
                "@gardenhq/willow/index.js" + version
            ).then(
                function(createJsBuilder)
                {
                    return createJsBuilder(
                        System.import.bind(System),
                        resolve,
                        register,
                        "@gardenhq/willow/conf/javascript.js" + version
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
                            var temp = src.split("#");
                            if(temp.length > 1) {
                                services = System.resolve(temp[1], location.pathname);
                            } else if(script.hasAttribute("data-container")) {
                                src = script.getAttribute("data-container");
                                temp = src.split("#");
                                if(temp.length > 1) {
                                    services = System.resolve(temp[0], location.pathname) + ":" + temp[1];
                                }
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
            ).catch(
                function(e)
                {
                    console.error(e);
                }
            );
        }
    );
};
