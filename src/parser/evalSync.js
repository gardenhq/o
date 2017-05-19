parser(
    function(scriptPath)
    {
        var defaultEvaluate = function(source)
        {
            // (exports, require, module, __filename, __dirname)
            // return function(exports, require, module, __filename, __dirname)
            return function(module, exports, require, __filename, __dirname)
            {
                var process = {
                    env: {
                        // NODE_ENV: "production"
                    },
                    argv: ""
                };
                eval(source)
            }
        }
        var load = function(path, loader, _require, registry, evaluate)
        {
            var resolve = _require.resolve;
            evaluate = evaluate || defaultEvaluate;
            var loadSynchronousRequires = function(data)
            {
                var re = /(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g;
                var arr;
                var syncRequires = [];
                while((arr = re.exec(data.content)) !== null) {
                    syncRequires.push(resolve(arr[1], data.path || path));
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
                                    function(loaded)
                                    {
                                        // TODO: Decide on aliases
                                        if(!registry.has(loaded.path || path)) {
                                            registry.set(loaded.path || path, loaded)
                                        }
                                        if(!registry.has(path)) {
                                            registry.set(path, loaded)
                                        }
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
                    var relativeRequire = function(relativePath)
                    {
                        var from = data.path || path;
                        relativePath = relativePath.indexOf("/") === 0 ? relativePath : resolve(relativePath, from);
                        return _require(relativePath);
                    }
                    var temp = data.headers["Content-Type"].split("/");
                    var type = temp[0];
                    var format = temp[1];
                    registry.set(
                        path,
                        function(module, exports, __require, __filename, __dirname)
                        {
                            switch(type) {
                                case "application":
                                    switch(true) {
                                        case format.indexOf("javascript") === 0:
                                            // path = data.path;
                                            var map = "//# sourceURL=" + path;
                                            if(data.content.indexOf("//# sourceURL") === -1) {
                                                data.content += map; 
                                            }
                                            // (exports, require, module, __filename, __dirname)
                                            // evaluate(data.content)(exports, relativeRequire, module, __filename, __dirname);
                                            evaluate(data.content)(module, exports, relativeRequire, __filename, __dirname);
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
                        }
                    );
                    // (exports, require, module, __filename, __dirname)
                    // return function(exports, __require, module, __filename, __dirname)
                    if(format.indexOf("+bundle") === -1) {
                        return loadSynchronousRequires(data);
                    }
                    return data;

                }
            );
        }
        return load;
    }
);

