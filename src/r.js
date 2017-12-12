module.exports = function(load, config, register, resolve)
{
    return load.then(
        function(_import)
        {
            return Promise.all(
                [
                    __dirname + "/b.js",
                    "@gardenhq/willow/util/destructure.js",
                    "@gardenhq/willow/util/runnerFactory.js"
                ].map(
                    function(item)
                    {
                        return _import(item);
                    }
                )
            ).then(
                function(services)
                {
                    return (
                        function(b, destructure, getRunner)
                        {
                            return b(Promise.resolve(_import)).then(
                                function(builder)
                                {
                                    return getRunner(builder, destructure);
                                }
                            );
                        }
                    ).apply(null, services)
                }
            )
        }
    );
};
