registry(
    function(scriptPath)
    {
        var unique = "___"
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
        return function(m)
        {
            var cache = m || {};
            var modules = cache.modules = {};
            var keys = cache.keys = [];
            var _require = function(path)
            {
                try {
                    return modules[path]._load(_require)
                } catch(e) {
                    // TODO: Would be good to have this just for dev
                    // People are catching errors for browserify see js-yaml
                    // console.error("Unable to require '" + path + "'");
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
                return keys[key] === true;
            }
            var set = function(path, module)
            {
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
            registry.set = set;
            registry.has = has;
            registry.get = get;
            registry.delete = function(key)
            {
                keys[key] = null;
                modules[key] = null;
            };
            return registry;
        }
    }
);

