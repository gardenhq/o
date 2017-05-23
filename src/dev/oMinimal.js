(
    function(unique)
    {
        return function(cb)
        {
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

            var getResolve = function(includePath, defaultBase)
            {
                return function(path, base)
                {
                    base = base || defaultBase;
                    var temp = path.split("#");
                    var hash = temp.length === 2 ? "#" + temp[1] : "";
                    path = temp[0];
                    var first2Chars = path.substr(0, 2);
                    var firstChar = first2Chars[0];
                    if(
                        first2Chars != ".." && first2Chars != "./" && firstChar != "/" && path.indexOf("://") === -1
                    ) {
                        if(path.indexOf("/") === -1) {
                            path += "/";
                        }
                        path = (includePath || "") + path;
                    }
                    // TODO: this should go?
                    if(path[path.length - 1] === "/") {
                        path += "index";
                    }
                    temp = path.split("/");
                    var filename = temp[temp.length - 1];
                    if(filename.indexOf(".") === -1) {
                        temp[temp.length - 1] += ".js";
                    }
                    if(path.indexOf("://") !== -1) {
                        return temp.slice(0, 3).join("/") + normalizeName(temp.slice(3).join("/"), [""]) + hash;
                    }
                    path = normalizeName(temp.join("/"), base.split("/").slice(0, -1));
                    // TODO: this should go, deal with it in the transport?
                    firstChar = path[0];
                    if(firstChar != "/" && path.indexOf("://") === -1) {
                        path = "/" + path;
                    }
                    return path + hash;
                }
            }
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
            /* Module */
            var Module = function(id, parent, module)
            {
                this.id = id;
                this.filename = id;
                this.parent = parent;
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
                var temp = path.split("#");
                path = _require.resolve(temp[0]);
                if(path.indexOf("://") !== -1 && temp[1] && temp[1].indexOf("@") === 0) {
                    var parts = path.split("/");
                    var index = 3;
                    if(parts[3].indexOf("@") === 0) {
                        index = 4;
                    }
                    parts[index] += temp[1];
                    path = parts.join("/");
                }
                var relativeRequire = function(relativePath)
                {
                    return _require(relativePath.indexOf("/") === 0 ? relativePath : _require.resolve(relativePath, path));
                }
                try {
                    return modules[path]._load(relativeRequire)
                } catch(e) {
                    // console.error(path);
                    // e.message = "Unable to require '" + path + "'";
                    throw e;
                }
            }
            var config = {};
            var o = Object.assign(
                function(path)
                {
                    return Promise.resolve(_require(path));
                },
                {
                    registerDynamic: function(path, deps, bool, module)
                    {
                        modules[path] = new Module(path, null, module);
                    },
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
                        if(_config.baseURL !== config.baseURL) {
                            this.resolve = _require.resolve = getResolve(_config.includepath, _config.baseURL);
                        }
                        config = Object.assign(
                            {},
                            config,
                            _config
                        );
                    }

                }

            );
            return Promise.resolve(o);
        };
    }
)("__")

