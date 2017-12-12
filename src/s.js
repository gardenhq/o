module.exports = function(load, exports, register, resolve, module) // this can be window, but in actual usage will be undefined
{
    module = module || window;
    return load.then(
        function(_import)
        {
            module.process = module.process || {
                env: {
                    // NODE_ENV: "production"
                },
                argv: ""
            };
            module._import = _import;
            return _import(exports.entry || exports.hash);
        }
    ).catch(
        function(e)
        {
            throw e;
        }
    );
};
