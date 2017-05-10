parser(
    function(scriptPath)
    {
        var defaultEvaluate = function(source)
        {
            // (exports, require, module, __filename, __dirname)
            // return Function("exports", "require", "module", "__filename", "__dirname", source)
            return Function("module", "exports", "require", "__filename", "__dirname", source)
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
                        function(module, exports, _require, __filename, __dirname)
                        {
                            switch(contentType) {
                                case "javascript":
                                    // path = data.path;
                                    var map = "//# sourceURL=" + path;
                                    if(data.content.indexOf("//# sourceURL") === -1) {
                                        data.content += map; 
                                    }
                                    // (exports, require, module, __filename, __dirname)
                                    // evaluate(data.content)(exports, _require, module, __filename, __dirname);
                                    evaluate(data.content)(module, exports, _require, __filename, __dirname);
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
