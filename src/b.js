module.exports = function(load, config, register, resolve)
{
    return load.then(
        function(_import)
        {
            return _import(
                "@gardenhq/willow/index.js#@6.2.0"
            ).then(
                function(createJsBuilder)
                {
                    return createJsBuilder(
                        _import,
                        resolve,
                        register//,
                        // "@gardenhq/willow/conf/javascript.js" + version
                    );
                }
            ).then(
                function(builder)
                {
                    if(config) {
                        var services = config.entry || config.hash || false;
                        if(services) {
                            var temp = services.split(":");
                            temp = temp.length > 1 ? temp : services.split("#");
                            return builder.build(
                                temp[0]
                            ).run(
                                temp[1] || "main"
                            );
                        }
                    }
                    return builder;
                }
            );
        }
    );
};
