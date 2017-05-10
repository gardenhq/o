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
                    }
                };
                eval(source)
            }
        }
        return function(path, loader, _require, registry, evaluate)
        {
            evaluate = evaluate || defaultEvaluate;
            return loader(path).then(
                function(data)
                {
                    var contentType = data.headers["Content-Type"].split("/").pop();
                    return registry.set(
                        path,
                        function(module, exports, require, __filename, __dirname)
                        {
                            switch(contentType) {
                                case "javascript":
                                    var map = "//# sourceURL=" + path;
                                    if(data.content.indexOf(map) === -1) {
                                        data.content += map; 
                                    }
                                    // (exports, require, module, __filename, __dirname)
                                    // evaluate(data.content)(exports, require, module, __filename, __dirname);
                                    evaluate(data.content)(module, exports, require, __filename, __dirname);
                                    break;
                                case "json":
                                    module.exports = JSON.parse(data.content);
                                    break;
                                default:
                                    module.exports = data.content;
                                    break;
                            }
                            return module.exports;

                        }
                    );

                }
            );
        }
    }
);

