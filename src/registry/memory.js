registry(
    function(scriptPath)
    {
        var unique = "o"
        /* module */
        var Module = function(id, parent, module, filename)
        {
            this.id = id;
            this.filename = filename || id;
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
                    return modules[path.split("#")[0]]._load(_require)
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
                return keys[key.split("#")[0]] === true;
            }
            var set = function(key, module, filename)
            {
                // TODO: This can return null when you might expect the module
                // return the Module?
                // always return null ? **
                // Keep as both means I know whether its already set or not?
                key = key.split("#")[0];
                if(has(key)) {
                    return;
                }
                keys[key] = true;
                modules[key] = new Module(key, null, module, filename);
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
            registry.set = set;
            registry.has = has;
            registry.get = get;
            registry.delete = function(key)
            {
                key = key.split("#")[0]
                keys[key] = null;
                modules[key] = null;
            };
            return registry;
        }
    }
);

