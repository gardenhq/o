(
    function(unique)
    {
        return function(cb)
        {
            var modules = {};

            ${ rewriter }

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
            var getResolve = function(includePath, defaultBase)
            {
                includePath = includePath || "";

                ${ getRewriter }

                return function(path, base)
                {

                    ${ hash }

                    var first2Chars = path.substr(0, 2);
                    if(
                        first2Chars != ".." && first2Chars != "./" && first2Chars[0] != "/" && path.indexOf("://") === -1
                    ) {
                        path = includePath + "/" + path;
                    }
                    var temp = path.split("/");
                    if(path.indexOf("://") !== -1) {
                        return temp.slice(0, 3).join("/") + normalizeName(temp.slice(3).join("/"), [""])${ addHash };
                    }
                    base = base || defaultBase;
                    path = normalizeName(temp.join("/"), base.split("/"));
                    if(path[0] != "/" && path.indexOf("://") === -1) {
                        path = "/" + path;
                    }
                    return path${ addHash };
                }
            }
            /* resolve */
            /* Module */
            var Module = function(id, parent, module, filename)
            {
                this.id = id;
                this.filename = filename || id;
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
                    module.bind(null)(this, this.exports, _require, this.filename, temp.join("/"));
                }
                return this.exports;
            }
            /* module */
            var _require = function(path)
            {
                path = _require.resolve(path).split("#")[0];
                var module = modules[path];
                var from = module.filename.split("/").slice(0, -1).join("/");
                var relativeRequire = function(relativePath)
                {
                    return _require(relativePath.indexOf("/") === 0 ? relativePath : _require.resolve(relativePath, from));
                }
                return module._load(relativeRequire);
                // try {
                    // return modules[path]._load(relativeRequire)
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
            o.registerDynamic = function(path, deps, bool, module, filename)
            {
                modules[path] = new Module(path, null, module, filename);
            };
            o.import = function(path)
            {
                return this.apply(null, arguments);
            };
            // still need this for data-module stuff
            var config = _bundleConfig || {};
            o.getConfig = function()
            {
                return Object.assign({}, config);
            }
            o.config = function(_config)
            {
                // b.js will change baseURL post init
                if(_config.baseURL !== config.baseURL) {
                    this.resolve = _require.resolve = getResolve(_config.includepath || config.includepath, _config.basepath);
                }
                config = Object.assign(
                    {},
                    config,
                    _config
                );
            }
            o.resolve = _require.resolve = getResolve(_bundleConfig.includepath, _bundleConfig.basepath);
            return Promise.resolve(o);
        };
    }
)("o")

