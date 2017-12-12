module.exports = function(configurable)
{
    return function(services)
    {
        var s = `
            var scripts = {
                ${
                    services.map(
                        function(item, i, arr)
                        {
                            return `
                                "${item.callback}": {
                                    m: function(module, __filename)
                                    {
                                        ${item.content}
                                        return module;
                                    },
                                    _: "${item.path}",
                                    v: "${item.version}"
                                }
                            `;
                        }
                    ).join(",")
                }
            };
            ${ !configurable ? "return": "var module ="} function(config, key, url, isAbsolute, win, script)
            {
                var module = {
                    exports: {}
                };
                var m = scripts[key];
                var path = m._;
                var first2Chars = path.substr(0, 2);
                if(first2Chars !== ".." && first2Chars !== "./" && first2Chars !== "//" && first2Chars[0] !== "/" && path.indexOf("://") === -1) {
                    path = config.includepath + "/" + path;
                }
                if(m.v && config.includepath.indexOf("://") !== -1) {
                    var temp = path.split("/")
                    temp[4] += "@" + m.v;
                    path = temp.join("/");
                }
                m.m.apply(null, [module, url(path)]);
                return Promise.resolve(
                    module.exports.apply(null, [config])
                );
            }
        `;
        return s;
    }

}
