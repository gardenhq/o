parser(
    function(config)
    {
        var defaultEvaluate = function(source)
        {
            // (exports, require, module, __filename, __dirname)
            return function(module)
            {
                var _module = window.module;
                window.module = module;
                var $script = document.createElement("script");
                $script.textContent = source;
                document.body.appendChild($script);
                document.body.removeChild($script);
                window.module = _module || undefined;
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
                        function(module, exports, __require, __filename, __dirname)
                        {
                            switch(contentType) {
                                case "javascript":
                                    // path = data.path;
                                    var map = "//# sourceURL=" + path;
                                    if(data.content.indexOf("//# sourceURL") === -1) {
                                        data.content += map; 
                                    }
                                    // (exports, require, module, __filename, __dirname)
                                    // evaluate(data.content)(exports, relativeRequire, module, __filename, __dirname);
                                    evaluate(data.content)(module, exports, relativeRequire, __filename, __dirname);
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
