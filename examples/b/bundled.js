(
    function(o)
    {
        (
            function(load)
            {
                load.then(
                    function(System)
                    {
                        load = o = undefined;
                        System.config(
                            {
                                bundled: true,
                                src: "/node_modules/o/src/b.js",
proxy: "/node_modules/o/src/dev/index.js",
hash: "/examples/b/services.js:main",
baseURL: "/node_modules/o/src/",
includepath: "node_modules/"
                            }
                        );
                        return (
                    /* o */
    function(r)
    {
        return Promise.all(
            [

r(
    "/examples/b/services.js",
    function(module, exports, require)
    {
        module.exports = function()
{
    return {
        "app.print": {
            "service": function()
            {
                return function(helloWorld)
                {
                    if(typeof document !== "undefined") {
                        var h1 = document.createElement("h1");
                        h1.textContent = helloWorld;
                        document.body.appendChild(h1);
                    }
                    console.log(helloWorld);
                }
            }
        },
        "app.hello": {
            "object": "../hello-world.js",
            "bundle": false
        },
        "main": {
            "resolve": [
                "@app.hello",
                "@app.print"
            ],
            "service": function(helloWorld, print)
            {
                return function()
                {
                    print(helloWorld);
                }
            }
        }
    };
}

    }
),

r(
    "/examples/hello-world.js",
    function(module, exports, require)
    {
        module.exports = "Hello World!";

    }
),

r(
    "/node_modules/@gardenhq/willow/Builder.js",
    function(module, exports, require)
    {
        var Builder = function Builder(container, promisedRequire)
{
    this.container = container;
    this.loading = null;
    this.import = promisedRequire;
    this.clear();
    // this.container.set(
    //  "this",
    //  function()
    //  {
    //      return this;
    //  }
    // );
}
Object.assign(
    Builder.prototype,
    {
        use: function(filters)
        {
            if(typeof filters === "function") {
                filters = [filters];
            }
            // console.log(this.filters);
            this.filters = this.filters.concat(filters);
            return this;
        },
        clear: function()
        {
            this.filters = [];
            return this;
        },
        get: function(key)
        {
            const container = this.container;
            var service;
            if(this.loading != null) {
                service = this.loading.then(
                    function()
                    {
                        // this.loading = null;
                        return container.get(key);
                    }.bind(this)
                );
            } else {
                service = container.get(key);
            }
            // TODO: Should always be a promise? Unless within a service definition argument?
            if(service instanceof Promise) {
                service.catch(
                    function(e)
                    {
                        // TODO: is there a better way to do this?
                        e.message = e.message + "\n @" + key + "";
                    }
                );
            }   
            return service;
        },
        set: function(key, value)
        {
            this.container.set.apply(this.container, arguments);
            return this;
        },
        has: function(key)
        {
            return this.container.has.apply(this.container, arguments);
        },
        tag: function()
        {
            this.container.tag.apply(this.container, arguments);
            return this;
        },
        getTagged: function(key)
        {
            return this.container.getTagged(key);
        },
        run: function(key, args)
        {
            return this.get(key).then(
                function(service)
                {
                    if(typeof service === "function") {
                        return service.apply(null, args)
                    }
                }
            );
        },
        // TODO: if I can run stuff I should be able to instantiate also?
        // instantiate: function()
        // {
        //  this.get(key).then(function(service){ service.apply(null, args) });
        //  return this;
        // },
        build: function(config)
        {
            // TODO: I think this should push onto loading for multiple .build calls?
            this.loading = this.load.apply(this, arguments).catch(
                function(e)
                {
                    throw e;
                }
            )
            return this;
        },
        applyFilters: function(service, id, services)
        {
            const container = this;
            const type = typeof service;
            if(
                service == null ||
                type !== "object" ||
                (
                    (
                        service.constructor != Object && id != "imports" //TODO: We shouldn't know about imports
                    )
                )
            ) {
                this.container.set(
                    id,
                    function()
                    {
                        return Promise.resolve(service)
                    }
                );
                return Promise.resolve(services);
            }
            if(this.filters.length == 0) {
                return Promise.resolve(services);
            }
            const first = this.filters[0](container, service, id, services);
            return this.filters.reduce(
                function(prev, filter, i, arr)
                {
                    return prev.then(
                        function(definitions)
                        {
                            services = definitions || services;
                            const result = filter(container, services[id], id, services);
                            if(result == null) {
                                return services;
                            }
                            return result;
                        }
                    )
                },
                first instanceof Promise ? first : Promise.resolve(first)
            );
        },
        processKey: function(index, key, services)
        {
            return this.applyFilters(services[key], key, services).then(
                function(services)
                {
                    const keys = Object.keys(services);
                    const next = index + 1;
                    if(next < keys.length) {
                        return this.processKey(next, keys[next], services);
                    }
                    return services;
                }.bind(this)
            )
        },
        _load: function(services)
        {
            //callable?
            if(typeof services === "function") {
                services = services(this);
            }
            // TODO: You should be able to use promises resolving to objects
            var process = function(services)
            {
                if(services == null || typeof services !== "object") {
                    throw new Error("Service definitions should be an object, a function returning an object (or a !!promise resolving to an object!!)")
                }
                var index = 0;
                const next = Object.keys(services)[index];
                return this.processKey(index, next, services).then(
                    function()
                    {
                        return this;
                    }.bind(this)
                )
            }
            if(services instanceof Promise) {
                return services.then(
                    process.bind(this)
                );
            }
            return process.bind(this)(services)
        },
        load: function(services)
        {
            if(typeof services == "string") {
                // const systems = this.getTagged("dom.system.import");
                // if(!systems || systems.length < 1) {
                //  throw new Error("A System.import implementation is not defined, tag a callable dom.system.import service that implements `import` to use load")
                // }
                // const System_import = systems[systems.length - 1];
                // if(typeof System_import !== "function") {
                //  throw new Error("A System.import implementation is not defined but is not callable, tag a callable dom.system.import service that implements `import` to use load")
                // }
                if(typeof this.import !== "function") {
                    throw new Error("This builder doesn't know how to load");
                    // throw new Error("A System.import implementation is not defined but is not callable, tag a callable dom.system.import service that implements `import` to use load")
                }
                return this.import(
                    services
                ).then(
                    function(services)
                    {
                        return this._load(services);
                    }.bind(this)
                );
            } else {
                return this._load(services);
            }
        },
        getContainer: function()
        {
            return this.container;
        }
    
    }
);
module.exports = Builder;

    }
),

r(
    "/node_modules/@gardenhq/willow/Container.js",
    function(module, exports, require)
    {
        /**
 * Default/Reference Container - modified version of pimple js, used under
 * the below license.
 *
 * Copyright (c) 2016, Milos Tomic
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
var utils = {
    isDefined: function(obj)
    {
        return (typeof obj !== "undefined");
    },
    isCallable: function(obj)
    {
        return (typeof obj === "function");
    }
};
var Container = function Container(services)
{
    this._keys = {};
    this._values = {};
    this._factories = [];
    this._definitions = {};
    this._tags = {};
    if (services) {
        Object.keys(
            services
        ).forEach(
            function(service)
            {
                this.set(service, services[service])
            },
            this
        )
    }
    
}
Object.assign(
    Container.prototype,
    {
        set: function(id, value, tags)
        {
            if (utils.isDefined(this._values[id])) {
                throw new Error('Cannot set "' + id + '", it is already set and has been instantiated')
            }
            if(utils.isDefined( this._definitions[id]) && this._definitions[id] !== null) {
                this.removeTags(id);
            }
            this._definitions[id] = value;
            this._keys[id] = true;
            if(tags != null) {
                tags.forEach(
                    function(item, i, arr)
                    {
                        if(typeof item === 'string') {
                            this.tag(id, item);
                        } else {
                            this.tag(id, item.name, item)
                        }
                    },
                    this
                );

            }
            return this;
        },
        tag: function(id, tag, attributes)
        {
            if (!utils.isDefined(this._keys[id])) {
                this.set(id, null);
                // throw new Error('Cannot tag "' + id + '", identifier is not defined');
            }
            if (!utils.isDefined(this._tags[tag])) {
                this._tags[tag] = {};
            }
            if (!utils.isDefined(this._tags[tag][id])) {
                this._tags[tag][id] = [];
            }
            this._tags[tag][id].push(attributes || {});
            return this;
        },
        get: function(id)
        {
            if (!this.has(id)) {
                throw new Error('Cannot get "' + id + '", identifier is not defined');
            }

            if (utils.isDefined(this._values[id])) {
                return this._values[id];
            }
            if (utils.isDefined(this._factories[id])) {
                return this._factories[id](this, []);
            }
            if (utils.isCallable(this._definitions[id])) {
                this._values[id] = this._definitions[id].apply(this, []);
            } else {
                this._values[id] = this._definitions[id];
            }
            return this._values[id];
        },
        has: function(id)
        {
            return utils.isDefined(this._keys[id]);
        },
        factory: function(id, value)
        {
            if (!utils.isCallable(value)) {
                throw new Error('Cannot set "' + id + '", service factories must be callable')
            }
            this._factories[id] = value;
            this._keys[id] = true;

            return this;
        },
        removeTags: function(id)
        {
            if(this.has(id)) {
                Object.keys(
                    this._tags
                ).forEach(
                    function(item, i, arr)
                    {
                        if(this._tags[item][id] != null) {
                            delete this._tags[item][id];
                        }
                    },
                    this
                );
            }
        },
        findTaggedIds: function(tag)
        {
            if (!utils.isDefined(this._tags[tag])) {
                return {};
            }
            return this._tags[tag];
        },
        getTagged: function(tag)
        {
            var tags = this.findTaggedIds(tag);
            var services = [];
            Object.keys(
                tags
            ).forEach(
                function(item, i, arr)
                {
                    var service = this.get(item);
                    // this needs woking in somemore
                    // so instead of using 0 it should look for the tagname
                    // equalling what I'm looking for
                    var key = tags[item].reduce(
                        function(prev, item, i, arr)
                        {
                            if(item.name != null && item.name == tag) {
                                return item.key;
                            }
                            return prev;
                        },
                        i
                    )
                    services[key] = service;
                    // if(tags[item][0].key != null) {
                    //  services[tags[item][0].key] = service;
                    // } else if(tags[item][1] != null && tags[item][1].key != null) {
                    //  services[tags[item][1].key] = service;

                    // } else {
                    //  services[i] = service;
                    // }
                },
                this
            );
            return services;
        }
    
    }
);
module.exports = Container;

    }
),

r(
    "/node_modules/@gardenhq/willow/conf/index.js",
    function(module, exports, require)
    {
        module.exports = function()
{
    var root = "@gardenhq/willow";
    return {
        "willow.filter.service": {
            "filter": root + "/filters/service"
        },
        "willow.filter.factory": {
            "filter": root + "/filters/factory"
        },
        "willow.filter.tags": {
            "filter": root + "/filters/tags"
        }
    };
        
}

    }
),

r(
    "/node_modules/@gardenhq/willow/conf/javascript.js",
    function(module, exports, require)
    {
        module.exports = function()
{
    var root = "@gardenhq/willow";
    var id = "willow";
    return {
        "willow.filter.class": {
            "filter": root + "/filters/class",
            "arguments": [
                "@" + id + ".loadAndEval",
                "@" + id + ".resolve.arguments",
                "@" + id+ ".resolveIdentifier",
                "@" + id + ".traverse"
            ],
            "tags": [
                id + ".filter"
            ]
        },
        "willow.filter.object": {
            "filter": root + "/filters/object",
            "arguments": [
                "@" + id + ".loadAndEval"
            ],
            "tags": [
                id + ".filter"
            ]
        },
        "willow.filter.share": {
            "filter": root + "/filters/shared"
        },
        "willow.filter.resolve": {
            "filter": root + "/filters/resolve",
            "arguments": [
                "@" + id + ".resolve.resolve"
            ],
            "tags": [
                id + ".filter"
            ]
        },
        "willow.filter.iterator": {
            "filter": root + "/filters/iterator",
            "arguments": [
                "@" + id + ".resolve.arguments"
            ],
            "tags": [
                id + ".filter"
            ]
        }
    };
        
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/callable.js",
    function(module, exports, require)
    {
        module.exports = function(loader, resolveArguments)
{
    return loader(
        "callable",
        function(resolve, reject, module, object, container, definition)
        {
            return resolveArguments(container, definition).then(
                function(args)
                {
                    try {
                        var result = module.apply(object, args);
                    } catch(e) {
                        reject(e);
                        // reject(new TypeError("'" + definition.callable + "' is not callable/a function"));
                    }
                    resolve(
                        result
                    );
                }
            );
        }
    );
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/class.js",
    function(module, exports, require)
    {
        module.exports = function(loader, resolveArguments, resolveIdentifier, traverse)
{
    const callsKey = "calls";
    return loader(
        "class",
        function(resolve, reject, module, object, container, definition)
        {
            return resolveArguments(container, definition).then(
                function(args)
                {
                    const promises = [];
                    (definition[callsKey] || []).forEach(
                        function(item, i, arr)
                        {
                            const args = item[1] || [];
                            traverse(
                                args,
                                function(item, i, obj)
                                {
                                    promises.push(resolveIdentifier(item, container));
                                    return promises.length - 1;
                                }
                            );
                        }
                    );

                    Promise.all(
                        promises
                    ).then(
                        function(results)
                        {
                            const instance = new (
                                Function.prototype.bind.apply(
                                    module,
                                    [module].concat(args)
                                )
                            );
                            (definition[callsKey] || []).forEach(
                                function(item, i, arr)
                                {
                                    const method = item[0];
                                    const args = item[1] || [];
                                    traverse(
                                        args,
                                        function(item, i, obj)
                                        {
                                            return results[item];
                                        }
                                    );
                                    instance[method].apply(instance, args);
                                }
                            );
                            resolve(
                                instance
                            );

                        }
                    ).catch(
                        function(e)
                        {
                            reject(e);
                        }
                    );


                }
            );
        }
    );
    
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/factory.js",
    function(module, exports, require)
    {
        module.exports = function(key)
{
    key = key || "factory";
    return function factory(container, definition, id, definitions)
    {
        if(typeof definition[key] !== "undefined") {
            container.factory(id, definition[key]);
        }
    }
}



    }
),

r(
    "/node_modules/@gardenhq/willow/filters/filter.js",
    function(module, exports, require)
    {
        module.exports = function(loader, resolveArguments, key)
{
    key = key || "filter";
    return function(container, definition, id, definitions)
    {
            loader(
                "filter",
                function(resolve, reject, module, object, builder, definition)
                {
                    // console.log(id);
                    return resolveArguments(builder, definition).then(
                        function(args)
                        {
                            var result = module.apply(object, args);
                            // console.log(result);
                            builder.use(result);
                            resolve(
                                result
                            );
                        }
                    ).then(
                        function(obj)
                        {
                            // console.log(id);
                            return obj;
                        }

                    );
                }
            )(container, definition, id, definitions);
        // if(!container.has(id)) {
        //  return container.get(id);

        // }
    }
}


    }
),

r(
    "/node_modules/@gardenhq/willow/filters/imports.js",
    function(module, exports, require)
    {
        module.exports = function(require, key)
{
    key = key || "imports";
    const resourceKey = "resource";
    return function importer(container, definition, id, definitions)
    {
        if(id == key) {
            return Promise.all(
                definition.map(
                    function(item)
                    {
                        var path = item;
                        if(typeof path != "string") {
                            path = item[resourceKey]
                        }
                        return require(path)
                    }
                )
            ).then(
                function(imports)
                {
                    const promises = imports.map(
                        function(config)
                        {
                            // is callable?
                            if(typeof config === "function") {
                                config = config(container);
                            }
                            if(typeof config !== "object") {
                                throw new Error("That import doesn't return/resolve to an object");
                            }
                            Object.keys(config).forEach(
                                function(id)
                                {
                                    if(id != key) {
                                        if(typeof definitions[id] === "undefined" || definitions[id].constructor == Object) {
                                            definitions[id] = Object.assign(
                                                config[id],
                                                definitions[id]
                                            );
                                        }   
                                    }
                                }
                            );
                            if(typeof config[key] !== "undefined" ) {
                                return importer(container, config[key], key, definitions);
                            } else {
                                return definitions;
                            }
                        }
                    );
                    return Promise.all(
                        promises
                    ).then(
                        function(d)
                        {
                            return d[0];
                        }
                    )
                }
            );
        } else {
            return Promise.resolve(definitions);
        }
    }
        
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/index.js",
    function(module, exports, require)
    {
        module.exports = function(container)
{ 
    var root = "willow";
    var servicePrefix = "@";
    var tagPrefix = "#";
    var identifierSplitter = ":";

    var System_import = container.get(root + ".system.import");
    var System_registerDynamic = container.get(root + ".system.registerDynamic");
    return Promise.all(
        [
            "/filters/util/loader",
            "/filters/util/walkPath",
            "/filters/util/resolveIdentifier",
            "/filters/util/traverse",
            "/filters/util/resolver",
            "/filters/util/splitIdentifier",
            "/filters/util/findIdentifier",

            "/filters/imports",
            "/filters/callable",
            "/filters/filter"
        ].map(
            function(item)
            {
                return "@gardenhq/" + root + item;
            }
        ).map(function(item){ return System_import(item) })
    ).then(
        function(modules)
        {

            var loader = modules[0];
            var walkPath = modules[1];
            var createResolveIdentifier = modules[2];
            var traverse = modules[3];
            var createResolver = modules[4];
            var splitIdentifier = modules[5](identifierSplitter);
            var findIdentifier = modules[6](servicePrefix);

            var importer = modules[7];
            var callabled = modules[8];
            var filtered = modules[9];

            var loadAndEval = loader(
                System_import,
                System_registerDynamic,
                walkPath,
                splitIdentifier,
                findIdentifier
            );
            var resolveIdentifier = createResolveIdentifier(
                walkPath,
                servicePrefix,
                tagPrefix,
                splitIdentifier
            );
            var resolver = createResolver(resolveIdentifier, traverse);
            var resolveArguments = resolver("arguments");

            var importable = importer(System_import);
            var callable = callabled(loadAndEval, resolveArguments);
            var filterable = filtered(loadAndEval, resolveArguments);

            container.set(
                root + ".loadAndEval",
                function()
                {
                    return loadAndEval;
                }
            );
            container.set(
                root + ".require",
                function()
                {
                    return System_import;
                }
            );
            container.set(
                root + ".walkPath",
                function()
                {
                    return walkPath;
                }
            );
            container.set(
                root + ".resolveIdentifier",
                function()
                {
                    return resolveIdentifier
                }
            );
            container.set(
                root + ".resolver",
                function()
                {
                    return resolver;
                }
            );
            container.set(
                root + ".traverse",
                function()
                {
                    return traverse;
                }
            );
            container.set(
                root + ".resolve.arguments",
                function()
                {
                    return resolveArguments;
                }
            );
            container.set(
                root + ".filter.callable",
                function()
                {
                    return callable;
                }
            );
            
            return function(container, definition, id, definitions)
            {
                var args = arguments;
                return importable.apply(null, arguments).then(
                    function(defs)
                    {
                        definitions = defs || definitions;
                        callable(container, definitions[id], id, definitions);
                        filterable(container, definitions[id], id, definitions);
                        return definitions;
                    }
                );
            }
        }
    );
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/iterator.js",
    function(module, exports, require)
    {
        module.exports = function(resolveArguments, key)
{
    key = key || "iterator";
    return function iterator(container, definition, id, definitions)
    {
        if(typeof definition[key] !== "undefined") {
            container.set(
                id,
                function()
                {
                    return resolveArguments(container, definition).then(
                        function(args)
                        {
                            return container.get(definition[key].substr(1)).then(
                                function(iterator)
                                {
                                    var iterable = args[0];
                                    // var res = args[0].map(
                                    //  function(items, i, arr)
                                    //  {
                                    //      return Object.keys(items).map(
                                    //          function(key, i, arr)
                                    //          {
                                    //              return iterator(items[key], key);
                                    //          }
                                    //      );
                                    //  }
                                    // )
                                    var res = Object.keys(iterable).map(
                                        function(key, i, arr)
                                        {
                                            return iterator(iterable[key], key);
                                        }
                                    );
                                    //the function is returned and therefore can be called and called etc etc
                                    // why?
                                    return res;
                                    return function()
                                    {
                                        return res;
                                    };
                                }
                            );

                        }
                    );

                }
            );
        }
    }
}


    }
),

r(
    "/node_modules/@gardenhq/willow/filters/object.js",
    function(module, exports, require)
    {
        module.exports = function(loader)
{
    return loader(
        "object",
        function(resolve, reject, module, object, container, definition)
        {
            resolve(module);
        }
    );
        
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/resolve.js",
    function(module, exports, require)
    {
        module.exports = function(resolveResolve, key, serviceKey, servicePrefix)
{
    key = key || "resolve";
    serviceKey = serviceKey || "service";
    servicePrefix = servicePrefix || "@";

    return function(container, definition, id, definitions)
    {
        if(definition[key] == null) {
            return;
        }
        const service = definition[serviceKey];
        const newService = function()
        {
            var container = this;
            let keys = definition[key].filter(
                function(item, i, arr)
                {
                    return (item.indexOf(servicePrefix) === 0);
                }
            );
            return resolveResolve(container, definition).then(
                function(result)
                {
                    const get = container.get.bind(container);
                    // const getTagged = container.getTagged.bind(container);
                    keys = keys.map(
                        function(item, i, arr)
                        {
                            if(!container.has(item)) {
                                container.set(
                                    item,
                                    function(container){return result[i]}
                                );
                            }
                            return item.substr(servicePrefix.length);
                        }
                    );

                    // hackity hack, look at a better proxy?
                    // and use Symbols instead of servicePrefix?
                    // also needs to work for getTagged
                    container.get = function(key)
                    {
                        if(keys.indexOf(key) !== -1) {
                            key = servicePrefix + key;
                        }
                        return get(key);
                    };
                    return new Promise(
                        function(resolve, reject)
                        {
                            //if(typeof service == "function") {
                                try {
                                    resolve(
                                        service.apply(
                                            container,
                                            keys.map(
                                                function(item)
                                                {
                                                    return container.get(item);
                                                }
                                            )
                                        )
                                    )
                                } catch (e) {
                                    reject(e);
                                }
                            //} else {
                            //  resolve();
                            //}
                        }
                    );
                }
            );  
        };
        definition[serviceKey] = null;
        container.set(
            id,
            newService
        );
    }
}



    }
),

r(
    "/node_modules/@gardenhq/willow/filters/service.js",
    function(module, exports, require)
    {
        module.exports = function(key)
{
    key = key || "service";
    return function service(container, definition, id, definitions)
    {
        if(typeof definition[key] !== "undefined") {
            container.set(id, definition[key]);
        }
    }
}


    }
),

r(
    "/node_modules/@gardenhq/willow/filters/tags.js",
    function(module, exports, require)
    {
        module.exports = function(key)
{
    key = key || "tags";
    return function tags(builder, definition, id, definitions)
    {
        (definition[key] || []).forEach(
            function(item, i, arr)
            {
                var tag = item;
                var meta = {};
                if(typeof tag !== "string") {
                    tag = item.name;
                    meta = item;
                }
                builder.tag(id, tag, meta);
            }
        );
    }
};

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/util/findIdentifier.js",
    function(module, exports, require)
    {
        module.exports = function(servicePrefix)
{
    servicePrefix = servicePrefix || "@";
    return function(identifier)
    {
        // npm has introduced '@orgs' with an at sign
        // Assume orgs will always have at least 1 folder in them as an @org on its own
        // wouldn't make sense
        var isIdentifier = identifier.file.indexOf("/") == -1 && identifier.file.indexOf(servicePrefix) === 0;
        if(isIdentifier) {
            return identifier.file.substr(1);
        }
        return false;
    }
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/util/loader.js",
    function(module, exports, require)
    {
        module.exports = function(require, register, walkPath, splitIdentifier, findIdentifier)
{
    var requiresKey = "requires";
    var bundleKey = "bundle";
    return function(key, cb)
    {
        if(require == null) {
            return function(){}
        }
        return function(builder, definition, id, definitions)
        {
            // i have the builder here, so do I need to pass in
            // require and register??
            //console.log(builder.get("*.system.import"));
            if(definition[key] == null) {
                return;
            }
            const service = function()
            {
                var container = this;
                return new Promise(
                    function(resolve, reject)
                    {
                        // don't ever do this twice
                        var loaded;
                        var identifier = splitIdentifier(definition[key]);
                        var serviceIdentifier = findIdentifier(identifier);
                        if(serviceIdentifier) {
                            loaded = container.get(serviceIdentifier);
                            if(!(loaded instanceof Promise)) {
                                loaded = Promise.resolve(loaded);   
                            }
                        } else {
                            if(definition[bundleKey] === false) {
                                var temp = identifier.file.split("#");
                                var headers = {
                                    "Cache-Control": "private"
                                };
                                if(temp[1]) {
                                    headers["Content-Type"] = temp[1];
                                }
                                identifier.file = temp[0] + "#" + JSON.stringify({"Cache-Control": "private"});

                            }
                            // inject something here?
                            // "requires": [{"hyper": @overwrite:./overwrite.js}]
                            const requires = definition[requiresKey] || [];
                            loaded = Promise.all(
                                requires.map(
                                    function(item)
                                    {
                                        return container.get("require." + item)
                                    }
                                )
                            ).then(
                                function(modules)
                                {
                                    requires.forEach(
                                        function(item, i, arr)
                                        {
                                            register(
                                                item,
                                                [],
                                                true,
                                                function(module)
                                                {
                                                    return modules[i]
                                                }
                                            );
                                        }
                                    );
                                    return require(
                                        identifier.file
                                    )
                                }
                            );
                        }
                        //
                        loaded.then(
                            function(module)
                            {
                                var object;
                                if(identifier.path != null) {
                                    object = module;
                                    module = walkPath(identifier.path, module);
                                }
                                return cb(resolve, reject, module, object, builder, definition);
                            }
                        ).catch(
                            function(e)
                            {
                                reject(e);
                            }
                        );
                    }
                );
            }
            builder.set(id, service);
        }
    }
};

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/util/resolveIdentifier.js",
    function(module, exports, require)
    {
        /**
 * Shell variable substitution code taken from 'somewhere'?
 *
 * Not sure who :(
 * This will be cleaned up at some point anyway
 *
 */

function substiteVariable(variable, options, cb) {
        var value;
        var err = null;
        var s = variable.split(':', 2);
        if (s.length == 2) {
            value = options.env[s[0]];
            if (typeof value == 'function') {
                value = value();
            }
            if (s[1][0] == '+') { // Substitute replacement, but only if variable is defined and nonempty. Otherwise, substitute nothing
                value = value ? s[1].substring(1) : '';
            } else if (s[1][0] == '-') { // Substitute the value of variable, but if that is empty or undefined, use default instead
                value = value || s[1].substring(1);
            } else if (s[1][0] == '#') { // Substitute with the length of the value of the variable
                value = value !== undefined ? String(value).length : 0;
            } else if (s[1][0] == '=') { // Substitute the value of variable, but if that is empty or undefined, use default instead and set the variable to default
                if (!value) {
                    value = s[1].substring(1);
                    options.env[s[0]] = value;
                }
            } else if (s[1][0] == '?') { // If variable is defined and not empty, substitute its value. Otherwise, print message as an error message.
                if (!value) {
                    if (s[1].length > 1) {
                        throw new Error();
                        // return cb(s[0] + ': ' + s[1].substring(1));
                    } else {
                        throw new Error();
                        // return cb(s[0] + ': parameter null or not set');
                    }
                }
            }
        } else {
            value = options.env[variable];
            if (typeof value == 'function') {
                value = value();
            }
        }
    return value;
    }
function substiteVariablesInternal(str, position, result, options, cb) {
        if (position == -1 || !str) {
            return result;

        } else {
            var index = str.indexOf('$', position);

            if (index == -1) { // no $
                result += str.substring(position);
                position = -1;
                return result;

            } else { // $ found
                var variable;
                var endIndex;
                result += str.substring(position, index);

                if (str.charAt(index+1) == '{') { // ${VAR}
                    endIndex = str.indexOf('}', index);
                    if (endIndex == -1) { // '}' not found
                        if (options.ignoreErrors) {
                            variable = str.substring(index+2);
                        } else {
                            throw new Error();
                        }
                    } else { // '}' found
                        variable = str.substring(index+2, endIndex);
                        endIndex++;
                    }
                    if (!variable) {
                        result += '${}';
                    }
                } else { // $VAR
                    index++; // skip $
                    endIndex = -1;
                    // special single char vars
                    if (options.specialVars && options.specialVars.indexOf(str[index]) != -1) {
                        variable = str[index];
                        endIndex = index + 1;
                    } else {
                        // search for var end
                        for (var i = index, len = str.length; i < len; i++) {
                            var code = str.charCodeAt(i);
                            if (!(code > 47 && code < 58) &&  // numeric
                                !(code > 64 && code < 91) &&  // upper alpha
                                (code !== 95) &&              // underscore
                                !(code > 96 && code < 123)) { // lower alpha
                                endIndex = i;
                                break;
                            }
                        }

                        if (endIndex == -1) { // delimeter not found
                            variable = str.substring(index);
                        } else { // delimeted found
                            variable = str.substring(index, endIndex);
                        }
                    }
                    if (!variable) {
                        result += '$';
                    }
                }
                position = endIndex;
                if (! variable) {
                    return substiteVariablesInternal(str, position, result, options, cb);
                } else {
                    return substiteVariable(variable, options,  function callback(err, value) {
                        if (err && !options.ignoreErrors) {
                            return cb(err);
                        }
                        if (value !== null && value !== undefined) {
                            result += String(value);
                        }
                        substiteVariablesInternal(str, position, result, options, cb);
                    });
                }
            }
        }
    }
module.exports = function(walkPath, servicePrefix, tagPrefix, splitIdentifier)
{
    const varPrefix = "$";
    return function(item, container)
    {
        if(typeof item !== "string") {
            return item;
        }
        if(item.indexOf(servicePrefix) === 0) {
            const service = container.get(item.substr(servicePrefix.length));
            const identifier = splitIdentifier(item);
            if(identifier.path) {
                return walkPath(identifier.path, service);
            }
            return service;
        } else if(item.indexOf(tagPrefix) === 0) {
            const tagged = container.getTagged(item.substr(tagPrefix.length));
            if(tagged.length === 0) {
                return Promise.resolve([]);
            }
            const promises = [];
            const keys = Object.keys(
                tagged
            );
            keys.forEach(
                function(item, i, arr)
                {
                    promises.push(tagged[item]);
                }
            );
            return Promise.all(
                promises
            ).then(
                function(services)
                {
                    var obj = {};
                    // do this better, maybe after with Array.toArray()
                    if(keys[0] == 0) {
                        obj = [];
                    }
                    services.forEach(
                        function(item, i, arr)
                        {
                            obj[keys[i]] = item;
                        }
                    );
                    return obj;
                }
            );
        } else if(item.indexOf(varPrefix) === 0) {
            return substiteVariablesInternal(item, "", 0, process);
        } else {
            return item;
        }
    }
};

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/util/resolver.js",
    function(module, exports, require)
    {
        module.exports = function(resolveIdentifier, traverse)
{
    return function(key)
    {
        key = key || "arguments";
        return function(container, definition)
        {
            if(definition[key] == null) {
                return Promise.resolve();
            }
            const promises = [];
            traverse(
                definition[key],
                function(item, i, obj)
                {
                    promises.push(resolveIdentifier(item, container));
                    return promises.length - 1;
                }
            );
            return Promise.all(
                promises
            ).then(
                function(results)
                {
                    traverse(
                        definition[key],
                        function(item, i, obj)
                        {
                            return results[item];
                        }
                    );
                    return definition[key];
                }
            );
        }
    };
};

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/util/splitIdentifier.js",
    function(module, exports, require)
    {
        module.exports = function(separator)
{
    separator = separator || ":";
    return function(identifier)
    {
        var pos = identifier.lastIndexOf(separator);
        var protocol = identifier.indexOf("://");
        if(pos !== -1) {
            var temp = identifier.split(separator);
            if(protocol !== -1) {
                return {
                    file: temp[0] + ":" + temp[1],
                    path: temp[2]
                };
            }
            return {
                file: temp[0],
                path: temp[1]
            };
        } else  {
            return {
                file: identifier,
                path: null
            }
        }
    }
}

    }
),

r(
    "/node_modules/@gardenhq/willow/filters/util/traverse.js",
    function(module, exports, require)
    {
        module.exports = function traverse(obj, callback, trail)
{
    trail = trail || []

    Object.keys(obj).forEach(
        function (key)
        {
            var value = obj[key]

            if (value != null && Object.getPrototypeOf(value) === Object.prototype) {
                traverse(value, callback, trail.concat(key))
            } else {
                obj[key] = callback.call(obj, value, key, trail)
            }
        }
    )
}


    }
),

r(
    "/node_modules/@gardenhq/willow/filters/util/walkPath.js",
    function(module, exports, require)
    {
        module.exports = function(key, value)
{
    return key.split(".").reduce(
        function(previous, item, i, arr)
        {
            return previous[item];
        },
        value
    );
}


    }
),

r(
    "/node_modules/@gardenhq/willow/index.js",
    function(module, exports, require)
    {
        module.exports = function(promisedRequire, register, config, containerlike)
{
    const name = "@gardenhq/willow";
    // this should be in test
    const id = "willow.";
    config = name + "/conf/javascript";

    if(promisedRequire == null) {
        //probably testing
        var promised = require("./util/promised");
        promisedRequire = promised(
            function(path)
            {
                return require(path.replace(name, "./"));
            }
        );
    }
    const modules = [
        "Builder",
        "filters/",
        "conf/"
    ];
    if(containerlike == null) {
        modules.push("Container");
    }
    return Promise.all(
        modules.map(
            function(item)
            {
                return promisedRequire(name + "/" + item);
            }
        )
    ).then(
        function(modules)
        {
            const container = containerlike == null ? new modules[3]() : containerlike;
            const builder = new modules[0](
                container,
                promisedRequire // for importing
            );
            builder.set(
                id + "system.import",
                function()
                {
                    return promisedRequire;
                },
                [
                    "dom.system.import"
                ]
            );
            builder.set(
                id + "system.registerDynamic",
                function()
                {
                    return register;
                }
            );
            return modules[1](builder).then(
                function(filters)
                {
                    return builder.use(
                        filters
                    ).set(
                        id + "resolve.resolve",
                        function()
                        {
                            return builder.get(id + "resolver")("resolve");
                        }
                    );
                }
            ).then(
                function(builder)
                {
                    var filters = modules[2]();
                    return builder.load(filters).then(
                        function()
                        {
                            return Promise.all(
                                Object.keys(filters).map(
                                    function(key, i, arr)
                                    {
                                        return builder.get(key);
                                    }
                                )
                            ).then(
                                function(filters)
                                {
                                    return builder;
                                }
                            );
                        }
                    );
                }
            ).then(
                function(builder)
                {
                    return builder.load(config);
                }
            ).then(
                function(builder)
                {
                    return Promise.all(builder.getTagged(id + "filter")).then(
                        function()
                        {
                            return builder;
                        }
                    );
                }
            );
        }
    
    );



};

    }
),

r(
    "/node_modules/@gardenhq/willow/util/promised.js",
    function(module, exports, require)
    {
        module.exports = function(callable)
{
    return function()
    {
        try {
            var module = callable.apply(null, arguments);
            return Promise.resolve(module);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}


    }
),

r(
    "/node_modules/o/src/b.js",
    function(module, exports, require)
    {
        module.exports = function(load)
{
    return load.then(
        function(System)
        {
            var register;
            if(System.registerDynamic != null) {
                register = System.registerDynamic.bind(System);
            }
            return System.import(
                "@gardenhq/willow/index.js"
            ).then(
                function(builder)
                {
                    return builder(
                        System,
                        register,
                        "@gardenhq/willow/conf/javascript"
                    );
                }
            ).then(
                function(builder)
                {
                    var config = System.getConfig();
                    var services = config.hash;
                    if(!services && typeof document !== "undefined") {
                        var scripts = document.getElementsByTagName("script");
                        var script = scripts[scripts.length - 1];
                        if(script.hasAttribute("src")) {
                            var src = script.getAttribute("src");
                            var temp  = src.split("#");
                            if(temp.length > 1) {
                                services = System.resolve(temp[1], location.pathname);
                            }
                        }
                    }
                    if(services) {
                        var temp = services.split(":");
                        if(!config.basepath) {
                            System.config(
                                {
                                    baseURL: temp[0]
                                }
                            );
                        }
                        return builder.build(
                            temp[0]
                        ).run(temp[1] || "main");
                    } else {
                        return builder;
                    }
                }
            );
        }
    );
};

    }
)
            ]
        );
    }
)(
    function(path, func){ return System.registerDynamic(path, [], true, func); }
)
.then(
                            function()
                            {
                                System.import("/node_modules/o/src/b.js").then(
                                    function(module)
                                    {
                                        if(typeof module === "function") {
                                            module(Promise.resolve(System));
                                        }
                                    }
                                );
                            }
                        );
                    }
                );
            }
        )(
            o(
                function(promised)
                {
                    return promised(document);
                }
            )
        );
    }
)((
    function(unique)
    {
        return function(cb)
        {
            var normalizeName = function (child, parentBase) {
                if (child[0] === "/") {
                    child = child.slice(1);
                }
                if (child[0] !== ".") {
                    return child;
                }
                parentBase = parentBase.filter(function(item){return item != "."});
                var parts = child.split("/");
                while (parts[0] === "." || parts[0] === "..") {
                    if (parts.shift() === "..") {
                        parentBase.pop();
                    }
                }
                return parentBase.concat(parts).join("/");
            }
            var getResolve = function(includePath, defaultBase)
            {
                return function(path, base)
                {
                    if(path.indexOf("//") !== -1) {
                        return path;
                    }
                    base = base || defaultBase;
                    var first2Chars = path.substr(0, 2);
                    var firstChar = first2Chars[0];
                    var temp = path.split("#");
                    var hash = temp.length == 2 ? "#" + temp[1] : "";
                    path = temp[0];
                    if(
                        first2Chars != ".." && first2Chars != "./" && firstChar != "/"
                    ) {
                        if(path.indexOf("/") === -1) {
                            path +=  "/"
                        }
                        path = includePath + path;
                    }
                    if(path[path.length - 1] === "/") {
                        path += "index";
                    }
                    path = normalizeName(path, base.split("/").slice(0, -1));
                    //this should go!!
                    if(path.indexOf(".") === -1) {
                        path += ".js";
                    }
                    firstChar = path.charAt(0);
                    if(firstChar != "/") {
                        path = "/" + path;
                    }
                    return path + hash;
                }
            }
            var modules = {};
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
                    module.bind(null)(this, this.exports, _require, this.filename, temp.join("/"));
                }
                return this.exports;
            }
            /* module */
            var _require = function(path)
            {
                try {
                    return modules[_require.resolve(path.split("#")[0])]._load(_require)
                } catch(e) {
                    console.error(path);
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
                            _require.resolve = getResolve(_config.includepath, _config.baseURL);
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

)
