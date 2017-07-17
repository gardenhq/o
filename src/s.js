module.exports = function(load, exports, module) // this can be window, but in actual usage will be undefined
{
    module = module || window;
    return load.then(
        function(require)
        {
            module.process = module.process || {
                env: {
                    // NODE_ENV: "production"
                },
                argv: ""
            };
            return require(exports.entry || exports.hash);
        }
    ).catch(
        function(e)
        {
            throw e;
        }
    );
};
