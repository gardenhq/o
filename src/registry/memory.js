registry(
    function(scriptPath)
    {
        var unique = "o"
        /* module */
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
                module.bind(null)(this, this.exports, _require, this.filename, temp.join("/"));
            }
            return this.exports;
        }
        /* module */
        var version = function(path)
        {
            var temp = path.split("#");
            path = temp[0];
            var hash = temp[1] || "";
            if(hash) {
                var headers = {};
                if(hash.indexOf("{") === 0) {
                    headers = JSON.parse(hash);
                    hash = "";
                } else if(hash.indexOf("@") === 0) {
                    headers["X-Content-Version"] = hash.substr(1);
                    hash = "";
                } 
                if(headers["X-Content-Version"] != null && path.indexOf("://") !== -1) {
                    var parts = temp[0].split("/");
                    var index = 3;
                    if(parts[3].indexOf("@") === 0) {
                        index = 4;
                    }
                    parts[index] += "@" + headers['X-Content-Version'];
                    path = parts.join("/");
                }
                if(headers['Content-Type']) {
                    hash = headers['Content-Type'];
                }
                if(hash) {
                    hash = "#" + hash;
                }
            }
            return path + hash;
        }
        return function(m)
        {
            var cache = m || {};
            var modules = cache.modules = {};
            var keys = cache.keys = [];
            var _require = function(path)
            {
                path = version(path);
                try {
                    return modules[path]._load(_require)
                } catch(e) {

                    // TODO: Would be good to have this just for dev
                    // People are catching errors for browserify see js-yaml
                    // console.error(new Error("Unable to require '" + path + "'"));
                    // e.message = "Unable to require '" + path + "'";
                    throw e;
                }
            }
            var get = function(path)
            {
                return Promise.resolve(_require(path));
            }
            var has = function(key)
            {
                key = version(key);
                return keys[key] === true;
            }
            var set = function(path, module)
            {
                // TODO: This can return null when you might expect the module
                // return the Module?
                // always return null ? **
                // Keep as both means I know whether its already set or not?
                path = version(path);
                if(has(path)) {
                    return;
                }
                keys[path] = true;
                modules[path] = new Module(path, null, module);
                return module;
            }
            var registry = function(path, loader, parser, resolve)
            {
                if(typeof _require.resolve === "undefined") {
                    _require.resolve = resolve;
                }
                path = version(resolve(path));
                if(has(path)) {
                    return get(path);
                }
                return parser(
                    path,
                    loader,
                    _require,
                    {
                        set: set,
                        has: has
                    }
                ).then(
                    function(module)
                    {
                        // set(path, module);
                        return get(path);
                    }
                );
            };
            // TODO: node polyfills
            // set(
            //  "/node_modules/tty/index.js",
            //  function(module)
            //  {
            //      module.exports = {
            //          isatty: function()
            //          {
            //              return false;
            //          }
            //      };
            //  }
            // );
            // set(
            //  "/node_modules/fs/index.js",
            //  function(module)
            //  {
            //      module.exports = {
            //      };
            //  }
            // );
            // set(
            //  "/node_modules/path/index.js",
            //  function(module)
            //  {
            //      module.exports = {
            //      };
            //  }
            // );
            // set(
            //  "/node_modules/module/index.js",
            //  function(module)
            //  {
            //      module.exports = {
            //      };
            //  }
            // );
            // set(
            //  "/node_modules/net/index.js",
            //  function(module)
            //  {
            //      module.exports = {
            //      };
            //  }
            // );
            registry.set = set;
            registry.has = has;
            registry.get = get;
            registry.delete = function(key)
            {
                key = version(key);
                keys[key] = null;
                modules[key] = null;
            };
            return registry;
        }
    }
);

