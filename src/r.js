module.exports = function(load)
{
    return load.then(
        function(System)
        {
            return Promise.all(
                [
                    __dirname + "/b.js",
                    "@gardenhq/willow/util/destructure.js", //sieve
                    "@gardenhq/willow/util/runnerFactory.js"
                ].map(
                    function(item)
                    {
                        return System.import(item);
                    }
                )
            ).then(
                function(services)
                {
                    return (
                        function(b, destructure, getRunner)
                        {
                            return b(Promise.resolve(System)).then(
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
