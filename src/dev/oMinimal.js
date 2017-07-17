(
    function(unique)
    {
        return function()
        {
            var modules = {};

            ${ rewriter }

            /* resolve */
            var dirname = function(path)
            {
                path = path.split("/").slice(0, -1).join("/");
                return path === "" ? "." : path;
            }
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
            /* resolve */
            /* Module */
            var Module = function(id, module, filename)
            {
                var o = this;
                o.id = id;
                o.filename = filename || id;
                // this.parent = parent;
                o.exports = {};
                o[unique] = module;
            }
            var loadModule = function(module, _require, dirname)
            {
                if(typeof module[unique] !== "undefined") {
                    var src = module[unique];
                    module[unique] = undefined;
                    // (exports, require, module, __filename, __dirname)
                    // module.bind(null)(this.exports, _require, this, this.filename, temp.join("/"));
                    src.bind(null)(module, module.exports, _require, module.filename, dirname);
                }
                return module.exports;
            }
            /* module */
            var _require = function(path)
            {
                path = _require.resolve(path).split("#")[0];
                var module = modules[path];
                var from = dirname(module.filename);
                return loadModule(
                    module,
                    function(relativePath)
                    {
                        return _require(relativePath.indexOf("/") === 0 ? relativePath : _require.resolve(relativePath, from));
                    },
                    from
                );
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
            };
            o.registerDynamic = function(path, deps, bool, module, filename)
            {
                modules[path] = new Module(path, module, filename);
            };
            o.import = function(path)
            {
                return o(path);
            };
            ${ getRewriter }

            o.resolve = _require.resolve = function(path, base)
            {
                ${ hash }

                var first2Chars = path.substr(0, 2);
                if(
                    first2Chars != ".." && first2Chars != "./" && first2Chars[0] != "/" && path.indexOf("://") === -1
                ) {
                    path = "${includepath}/" + path;
                }
                var temp = path.split("/");
                if(~path.indexOf("://")) {
                    return "${includepath}" + normalizeName(temp.slice(3).join("/"), [""])${ addHash };
                }
                path = normalizeName(temp.join("/"), (base || "${basepath}").split("/"));
                if(path[0] != "/" && path.indexOf("://") === -1) {
                    path = "/" + path;
                }
                return path${ addHash };
            };
            return Promise.resolve(o);
        };
    }
)("o")

