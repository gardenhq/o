module.exports = function(promised)
{
    var _require;
    var config = {};
    var o = Object.assign(
        function(obj)
        {
            if(typeof _require === "undefined" && typeof obj == "function") {
                _require = obj(promised).bind(o);
                return o;
            } else {
                return _require(obj);
            }
        },
        {
            import: function(path)
            {
                return this.apply(null, arguments);
            },
            getConfig: function()
            {
                return Object.assign({}, config);
            },
            config: function(_config)
            {
                config = Object.assign(
                    {},
                    config,
                    _config
                );
            }
        }
    );
    return o;

}

