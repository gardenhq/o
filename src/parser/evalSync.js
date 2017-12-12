module.exports = function(config)
{
    var url = function(path, base)
    {
        return new URL(path, location.origin + (base || "")).href.replace(location.origin, "");
    }
    var defaultEvaluate = function(source)
    {
        // (exports, require, module, __filename, __dirname)
        // return function(exports, require, module, __filename, __dirname)
        return function(module, exports, require, __filename, __dirname)
        {
            eval(source)
        }
    }
    var load = function(path, loader, _require, registry, evaluate)
    {
        var resolve = _require.resolve;
        evaluate = evaluate || defaultEvaluate;
        var loadSynchronousRequires = function(data, basedir)
        {
            var re = /(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g;
            var arr;
            var syncRequires = [];
            while((arr = re.exec(data.content)) !== null) {
                syncRequires.push(resolve(arr[1], basedir));
            }
            if(syncRequires.length == 0) {
                return data;
            }
            syncRequires.push(null);
            return syncRequires.reduce(
                function(prev, item, i, arr)
                {
                    return prev.then(
                        function(path)
                        {
                            if(registry.has(path)) {
                                return item;
                            }
                            return load(path, loader, _require, registry, evaluate).then(
                                function(data)
                                {
                                    return item;
                                }
                            );

                        }
                    );
                },
                Promise.resolve(syncRequires[0])
            ).then(
                function()
                {
                    // TODO: This should always return the main module
                    return data;
                }
            );

        }
        return loader(path).then(
            function(data)
            {
                var temp = data.headers["Content-Type"].split("/");
                var type = temp[0];
                var format = temp[1];
                var isBundle = format.indexOf("+bundle") !== -1;
                var from = url(data.url + "/..");
                from = from.substr(0, from.length - 1) || ".";
                var relativeResolve = function(relativePath)
                {
                    return relativePath[0] === "/" ? relativePath : resolve(relativePath, from)
                }
                var relativeRequire = function(relativePath)
                {
                    return _require(relativeResolve(relativePath));
                }
                relativeRequire.resolve = relativeResolve;
                registry.set(
                    path,
                    function(module, exports, $require, __filename, __dirname)
                    {
                        switch(type) {
                            case "application":
                                switch(true) {
                                    case format.indexOf("x-javascript") === 0:
                                    case format.indexOf("javascript") === 0:
                                        var map = "//# sourceURL=" + data.url;
                                        if(data.content.indexOf("//# source") === -1) {
                                            data.content += map; 
                                        }
                                        evaluate(data.content)(
                                            module,
                                            exports,
                                            relativeRequire,
                                            __filename,
                                            __dirname
                                        );
                                        break;
                                    case format.indexOf("json") === 0:
                                        module.exports = JSON.parse(data.content);
                                        break;
                                }
                                break;
                            default:
                                module.exports = data.content;
                                break;
                        }
                        return module.exports;
                    },
                    data.url
                );
                if(!isBundle) {
                    return loadSynchronousRequires(data, from);
                }
                return data;

            }
        );
    }
    return load;
}

