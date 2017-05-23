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
                    syncRequires.push(resolve(arr[1], data.url));
                }
                if(syncRequires.length == 0) {
                    return data;
                }
                syncRequires.push(null);
                var parent = data.url;
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
                    var relativeRequire = function(relativePath)
                    {
                        var from = data.url;
                        relativePath = relativePath.indexOf("/") === 0 ? relativePath : resolve(relativePath, from);
                        return _require(relativePath);
                    }
                    registry.set(
                        path,
                        function(module, exports, $require, __filename, __dirname)
                        {
                            switch(type) {
                                case "application":
                                    switch(true) {
                                        case format.indexOf("javascript") === 0:
                                            var map = "//# sourceURL=" + data.url;
                                            if(data.content.indexOf("//# sourceURL") === -1) {
                                                data.content += map; 
                                            }
                                            // (exports, require, module, __filename, __dirname)
                                            // evaluate(data.content)(exports, relativeRequire, module, __filename, __dirname);
                                            if(!isBundle) {
                                                evaluate(data.content)(module, exports, relativeRequire, __filename, __dirname);
                                            } else {
                                                evaluate(data.content)(module, exports, $require, __filename, __dirname);
                                            }
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
                    if(!isBundle) {
                        return loadSynchronousRequires(data);
                    }
                    return data;

                }
            );
        }
        return load;
    }
);

