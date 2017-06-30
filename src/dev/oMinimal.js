(
    function(unique)
    {
        return function(cb)
        {
            var modules = {};
            // TODO: Decide whether to annoyingly add process
            // or pass it in as an extra arg
            // prefer extra arg for now
            // window.process = {
            //     env: {},
            //     argv: ""
            // }
            var process = {
                env: {},
                argv: ""
            };
            /* resolve */
            var normalizeName = function (child, parentBase)
            {
                var parts = child.split("/").filter(
                    function(item)
                    {
                        return item !== "";
                    }
                );
                if (child[0] === "/") {
                    parentBase = [parts.shift()];
                }
                if (child[0] !== ".") {
                    parts = ["."].concat(parts);
                } 
                return parentBase.concat(parts).reduce(
                    function(prev, item, i, arr)
                    {
                        if(item == "..") {
                            return prev.slice(0, -1);
                        }
                        if(item == ".") {
                            return prev;
                        }
                        return prev.concat(item);
                    },
                    []
                ).join("/")
            }

            var appendVersionToPackageNameRewriter = function(includePath, rewriter)
            {
                return function(path, headers)
                {
                    var hash = "";
                    // this is unpkg specific
                    if(headers["X-Content-Version"] != null) {
                        var parts = path.split("/");
                        var index = 0;
                        // check to make sure it doen't already have one
                        if(parts[index].indexOf("@") === 0) {
                            index = 1;
                        }
                        parts[index] += "@" + headers['X-Content-Version'];
                        path = parts.join("/");
                    }
                    return rewriter(path, headers);
                }
            }
            var getRewriter = function(includePath)
            {
                var rewriter = defaultRewriter(includePath);
                if(includePath.indexOf("://") !== -1) {
                    return appendVersionToPackageNameRewriter(includePath, rewriter);
                } else {
                    return rewriter;
                }
            }
            var defaultRewriter = function()
            {
                return function(path, headers)
                {
                    return {
                        path: path,
                        hash: Object.keys(headers).length > 0 ? "#" + JSON.stringify(headers) : ""
                    };
                }
            }
            var normalizeHash = function(path, rewriter)
            {
                var temp = path.split("#");
                path = temp[0];
                var hash = temp[1] || "";
                if(hash) {
                    var headers = {};
                    if(hash.indexOf("{") === 0) {
                        headers = JSON.parse(hash);
                    } else if(hash.indexOf("@") === 0) {
                        headers["X-Content-Version"] = hash.substr(1);
                        // TODO: rethink? 
                    } else if(hash.indexOf(".") !== 0 && hash.indexOf("/") > 0) {
                        headers['Content-Type'] = hash;
                    }
                    if(Object.keys(headers).length > 0) {
                        return rewriter(path, headers)
                    }
                    hash = "#" + hash;
                }
                return {
                    path: path,
                    hash: hash
                };
            }
            var getResolve = function(includePath, defaultBase)
            {
                includePath = includePath || "";
                var rewriter = getRewriter(includePath);
                return function(path, base)
                {
                    var obj = normalizeHash(path, rewriter);

                    path = obj.path;
                    base = base || defaultBase;
                    var first2Chars = path.substr(0, 2);
                    if(
                        first2Chars != ".." && first2Chars != "./" && first2Chars[0] != "/" && path.indexOf("://") === -1
                    ) {
                        if(path.indexOf("/") === -1) {
                            path += "/";
                        }
                        path = includePath + path;
                    }
                    // TODO: this should go?
                    if(path[path.length - 1] === "/") {
                        path += "index";
                    }
                    var temp = path.split("/");
                    // filename
                    if(temp[temp.length - 1].indexOf(".") === -1) {
                        temp[temp.length - 1] += ".js";
                    }
                    //
                    if(path.indexOf("://") !== -1) {
                        return temp.slice(0, 3).join("/") + normalizeName(temp.slice(3).join("/"), [""]) + obj.hash;
                    }
                    path = normalizeName(temp.join("/"), base.split("/").slice(0, -1));
                    // TODO: this should go, deal with it in the transport?
                    // firstChar
                    if(path[0] != "/" && path.indexOf("://") === -1) {
                        path = "/" + path;
                    }
                    return path + obj.hash;
                }
            }
            /* resolve */
            /* Module */
            var Module = function(id, parent, module)
            {
                this.id = id;
                this.filename = id;
                // this.parent = parent;
                this.exports = {};
                this[unique] = module;
            }
            var o = Module.prototype;
            o._load = function(_require)
            {
                if(typeof this[unique] !== "undefined") {
                    var temp = this.filename.split("/");
                    temp.pop();
                    var module = this[unique];
                    this[unique] = undefined;
                    // (exports, require, module, __filename, __dirname)
                    // module.bind(null)(this.exports, _require, this, this.filename, temp.join("/"));
                    module.bind(null)(this, this.exports, _require, this.filename, temp.join("/"), process);
                }
                return this.exports;
            }
            /* module */
            var _require = function(path)
            {
                path = _require.resolve(path.split("#")[0]);
                var relativeRequire = function(relativePath)
                {
                    return _require(relativePath.indexOf("/") === 0 ? relativePath : _require.resolve(relativePath, path));
                }
                // try {
                    return modules[path]._load(relativeRequire)
                // } catch(e) {
                    // console.error(path);
                    // e.message = "Unable to require '" + path + "'";
                    // throw e;
                // }
            }
            var o = function(path)
            {
                return Promise.resolve(_require(path));
            }
            o.registerDynamic = function(path, deps, bool, module)
            {
                modules[path] = new Module(path, null, module);
            };
            o.import = function(path)
            {
                return this.apply(null, arguments);
            };
            // var config = _bundleConfig || {};
            // o.getConfig = function()
            // {
            //     return Object.assign({}, config);
            // }
            // o.config = function(_config)
            // {
            //     config = Object.assign(
            //         {},
            //         config,
            //         _config
            //     );
            // }
            // o.resolve = _require.resolve = getResolve(config.includepath, config.baseURL);
            o.resolve = _require.resolve = getResolve(_bundleConfig.includepath, _bundleConfig.baseURL);
            return Promise.resolve(o);
        };
    }
)("o")

