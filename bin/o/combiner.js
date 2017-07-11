module.exports = function(configurable)
{
    return function(services)
    {
        var s = `
            var isCDN = includePath.indexOf("://") !== -1;
            var version = function(path, version)
            {
                if(isCDN && version) {
                    var temp = path.split("/");
                    temp[4] += "@" + version;
                    return temp.join("/");
                } else {
                    return path;
                }
            }
            var scripts = {
                ${
                    services.map(
                        function(item, i, arr)
                        {

                            return `
                                "${item.callback}": (
                                    function()
                                    {
                                        var func = function(){ ${item.content} };
                                        func.callback = "${item.callback}";
                                        func.path = version(includePath + "/${item.path}", "${item.version}");
                                        return func;
                                    }
                                )()
                            `;
                        }
                    ).join(",")
                }
            };
        `;
        if(!configurable) {
            return s += `return scripts[callbackName];`;
        } else {
            return s += `if(scripts[callbackName] != null) { return scripts[callbackName]; }`;
        }
    }

}
