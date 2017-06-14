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
                                src: "https://unpkg.com/@gardenhq/o@5.1.0/b.js",
includepath: "https://unpkg.com/",
hash: "/examples/b/yaml/services.yaml:main",
baseURL: "https://unpkg.com/@gardenhq/o@5.1.0/"
                            }
                        );
                        (
                    /* o */
    function(r)
    {
        return Promise.all(
            [

r(
    "/examples/b/yaml/main.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (helloWorld, print) {
    return function () {
        print(helloWorld);
    };
};//# sourceURL=/examples/b/yaml/main.js
    }
),

r(
    "/examples/b/yaml/print.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function () /* document */
{
    return function (str) {
        if (typeof document !== "undefined") {
            var h1 = document.createElement("h1");
            h1.textContent = str;
            document.body.appendChild(h1);
        }
        console.log(str);
    };
};//# sourceURL=/examples/b/yaml/print.js
    }
),

r(
    "/examples/b/yaml/services.yaml",
    function(module, exports, require, __filename, __dirname, process)
    {
        module.exports = {"app.print":{"callable":"./print"},"app.hello":{"object":"../../hello-world"},"main":{"callable":"./main","arguments":["@app.hello","@app.print"]}};
    }
),

r(
    "/examples/hello-world.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = "Hello World!";//# sourceURL=/examples/hello-world.js
    }
),

r(
    "https://unpkg.com/@gardenhq/o@5.1.0/b.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (t) {
  return t.then(function (t) {
    var e;return null != t.registerDynamic && (e = t.registerDynamic.bind(t)), t.import("@gardenhq/willow/index.js#@5.0.1").then(function (n) {
      return n(t.import.bind(t), e, "@gardenhq/willow/conf/javascript.js#@5.0.1");
    }).then(function (e) {
      var n = t.getConfig(),
          r = n.hash;if (!r && "undefined" != typeof document) {
        var i = document.getElementsByTagName("script"),
            a = i[i.length - 1];if (a.hasAttribute("src")) {
          var o = a.getAttribute("src");(s = o.split("#")).length > 1 ? r = t.resolve(s[1], location.pathname) : a.hasAttribute("data-container") && (s = (o = a.getAttribute("data-container")).split("#")).length > 1 && (r = t.resolve(s[0], location.pathname) + ":" + s[1]);
        }
      }if (r) {
        var s = r.split(":");return n.basepath || t.config({ baseURL: s[0] }), e.build(s[0]).run(s[1] || "main");
      }return e;
    });
  });
};//# sourceURL=https://unpkg.com/@gardenhq/o@5.1.0/b.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/Builder.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Builder = function Builder(container, promisedRequire) {
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
};
Object.assign(Builder.prototype, {
    use: function use(filters) {
        if (typeof filters === "function") {
            filters = [filters];
        }
        // console.log(this.filters);
        this.filters = this.filters.concat(filters);
        return this;
    },
    clear: function clear() {
        this.filters = [];
        return this;
    },
    get: function get(key) {
        var container = this.container;
        var service;
        if (this.loading != null) {
            service = this.loading.then(function () {
                // this.loading = null;
                return container.get(key);
            }.bind(this));
        } else {
            service = container.get(key);
        }
        // TODO: Should always be a promise? Unless within a service definition argument?
        if (service instanceof Promise) {
            service.catch(function (e) {
                // TODO: is there a better way to do this?
                e.message = e.message + "\n @" + key + "";
            });
        }
        return service;
    },
    set: function set(key, value) {
        this.container.set.apply(this.container, arguments);
        return this;
    },
    has: function has(key) {
        return this.container.has.apply(this.container, arguments);
    },
    tag: function tag() {
        this.container.tag.apply(this.container, arguments);
        return this;
    },
    getTagged: function getTagged(key) {
        return this.container.getTagged(key);
    },
    run: function run(key, args) {
        return this.get(key).then(function (service) {
            if (typeof service === "function") {
                return service.apply(null, args);
            }
        });
    },
    // TODO: if I can run stuff I should be able to instantiate also?
    // instantiate: function()
    // {
    //  this.get(key).then(function(service){ service.apply(null, args) });
    //  return this;
    // },
    build: function build(config) {
        // TODO: I think this should push onto loading for multiple .build calls?
        this.loading = this.load.apply(this, arguments).catch(function (e) {
            throw e;
        });
        return this;
    },
    applyFilters: function applyFilters(service, id, services) {
        var container = this;
        var type = typeof service === "undefined" ? "undefined" : _typeof(service);
        if (service == null || type !== "object" || service.constructor != Object && id != "imports" //TODO: We shouldn't know about imports
        ) {
            this.container.set(id, function () {
                return Promise.resolve(service);
            });
            return Promise.resolve(services);
        }
        if (this.filters.length == 0) {
            return Promise.resolve(services);
        }
        var first = this.filters[0](container, service, id, services);
        return this.filters.reduce(function (prev, filter, i, arr) {
            return prev.then(function (definitions) {
                services = definitions || services;
                var result = filter(container, services[id], id, services);
                if (result == null) {
                    return services;
                }
                return result;
            });
        }, first instanceof Promise ? first : Promise.resolve(first));
    },
    processKey: function processKey(index, key, services) {
        return this.applyFilters(services[key], key, services).then(function (services) {
            var keys = Object.keys(services);
            var next = index + 1;
            if (next < keys.length) {
                return this.processKey(next, keys[next], services);
            }
            return services;
        }.bind(this));
    },
    _load: function _load(services) {
        //callable?
        if (typeof services === "function") {
            services = services(this);
        }
        // TODO: You should be able to use promises resolving to objects
        var process = function process(services) {
            if (services == null || (typeof services === "undefined" ? "undefined" : _typeof(services)) !== "object") {
                throw new Error("Service definitions should be an object, a function returning an object (or a !!promise resolving to an object!!)");
            }
            var index = 0;
            var next = Object.keys(services)[index];
            return this.processKey(index, next, services).then(function () {
                return this;
            }.bind(this));
        };
        if (services instanceof Promise) {
            return services.then(process.bind(this));
        }
        return process.bind(this)(services);
    },
    load: function load(services) {
        if (typeof services == "string") {
            // const systems = this.getTagged("dom.system.import");
            // if(!systems || systems.length < 1) {
            //  throw new Error("A System.import implementation is not defined, tag a callable dom.system.import service that implements `import` to use load")
            // }
            // const System_import = systems[systems.length - 1];
            // if(typeof System_import !== "function") {
            //  throw new Error("A System.import implementation is not defined but is not callable, tag a callable dom.system.import service that implements `import` to use load")
            // }
            if (typeof this.import !== "function") {
                throw new Error("This builder doesn't know how to load");
                // throw new Error("A System.import implementation is not defined but is not callable, tag a callable dom.system.import service that implements `import` to use load")
            }
            return this.import(services).then(function (services) {
                return this._load(services);
            }.bind(this));
        } else {
            return this._load(services);
        }
    },
    getContainer: function getContainer() {
        return this.container;
    }

});
module.exports = Builder;//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/Builder.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/Container.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

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
    isDefined: function isDefined(obj) {
        return typeof obj !== "undefined";
    },
    isCallable: function isCallable(obj) {
        return typeof obj === "function";
    }
};
var Container = function Container(services) {
    this._keys = {};
    this._values = {};
    this._factories = [];
    this._definitions = {};
    this._tags = {};
    if (services) {
        Object.keys(services).forEach(function (service) {
            this.set(service, services[service]);
        }, this);
    }
};
Object.assign(Container.prototype, {
    set: function set(id, value, tags) {
        if (utils.isDefined(this._values[id])) {
            throw new Error('Cannot set "' + id + '", it is already set and has been instantiated');
        }
        if (utils.isDefined(this._definitions[id]) && this._definitions[id] !== null) {
            this.removeTags(id);
        }
        this._definitions[id] = value;
        this._keys[id] = true;
        if (tags != null) {
            tags.forEach(function (item, i, arr) {
                if (typeof item === 'string') {
                    this.tag(id, item);
                } else {
                    this.tag(id, item.name, item);
                }
            }, this);
        }
        return this;
    },
    tag: function tag(id, _tag, attributes) {
        if (!utils.isDefined(this._keys[id])) {
            this.set(id, null);
            // throw new Error('Cannot tag "' + id + '", identifier is not defined');
        }
        if (!utils.isDefined(this._tags[_tag])) {
            this._tags[_tag] = {};
        }
        if (!utils.isDefined(this._tags[_tag][id])) {
            this._tags[_tag][id] = [];
        }
        this._tags[_tag][id].push(attributes || {});
        return this;
    },
    get: function get(id) {
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
    has: function has(id) {
        return utils.isDefined(this._keys[id]);
    },
    factory: function factory(id, value) {
        if (!utils.isCallable(value)) {
            throw new Error('Cannot set "' + id + '", service factories must be callable');
        }
        this._factories[id] = value;
        this._keys[id] = true;

        return this;
    },
    removeTags: function removeTags(id) {
        if (this.has(id)) {
            Object.keys(this._tags).forEach(function (item, i, arr) {
                if (this._tags[item][id] != null) {
                    delete this._tags[item][id];
                }
            }, this);
        }
    },
    findTaggedIds: function findTaggedIds(tag) {
        if (!utils.isDefined(this._tags[tag])) {
            return {};
        }
        return this._tags[tag];
    },
    getTagged: function getTagged(tag) {
        var tags = this.findTaggedIds(tag);
        var services = [];
        Object.keys(tags).forEach(function (item, i, arr) {
            var service = this.get(item);
            // this needs woking in somemore
            // so instead of using 0 it should look for the tagname
            // equalling what I'm looking for
            var key = tags[item].reduce(function (prev, item, i, arr) {
                if (item.name != null && item.name == tag) {
                    return item.key;
                }
                return prev;
            }, i);
            services[key] = service;
            // if(tags[item][0].key != null) {
            //  services[tags[item][0].key] = service;
            // } else if(tags[item][1] != null && tags[item][1].key != null) {
            //  services[tags[item][1].key] = service;

            // } else {
            //  services[i] = service;
            // }
        }, this);
        return services;
    }

});
module.exports = Container;//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/Container.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/conf/index.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function () {
    var root = __dirname + "/..";
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
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/conf/index.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/conf/javascript.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function () {
    var root = __dirname + "/..";
    var id = "willow";
    return {
        "willow.filter.class": {
            "filter": root + "/filters/class",
            "arguments": ["@" + id + ".loadAndEval", "@" + id + ".resolve.arguments", "@" + id + ".resolveIdentifier", "@" + id + ".traverse"],
            "tags": [id + ".filter"]
        },
        "willow.filter.object": {
            "filter": root + "/filters/object",
            "arguments": ["@" + id + ".loadAndEval"],
            "tags": [id + ".filter"]
        },
        "willow.filter.share": {
            "filter": root + "/filters/shared"
        },
        "willow.filter.resolve": {
            "filter": root + "/filters/resolve",
            "arguments": ["@" + id + ".resolve.resolve"],
            "tags": [id + ".filter"]
        },
        "willow.filter.iterator": {
            "filter": root + "/filters/iterator",
            "arguments": ["@" + id + ".resolve.arguments"],
            "tags": [id + ".filter"]
        }
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/conf/javascript.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/callable.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (loader, resolveArguments) {
    return loader("callable", function (resolve, reject, module, object, container, definition) {
        return resolveArguments(container, definition).then(function (args) {
            try {
                var result = module.apply(object, args);
            } catch (e) {
                reject(e);
                // reject(new TypeError("'" + definition.callable + "' is not callable/a function"));
            }
            resolve(result);
        });
    });
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/callable.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/class.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (loader, resolveArguments, resolveIdentifier, traverse) {
    var callsKey = "calls";
    return loader("class", function (resolve, reject, module, object, container, definition) {
        return resolveArguments(container, definition).then(function (args) {
            var promises = [];
            (definition[callsKey] || []).forEach(function (item, i, arr) {
                var args = item[1] || [];
                traverse(args, function (item, i, obj) {
                    promises.push(resolveIdentifier(item, container));
                    return promises.length - 1;
                });
            });

            Promise.all(promises).then(function (results) {
                var instance = new (Function.prototype.bind.apply(module, [module].concat(args)))();
                (definition[callsKey] || []).forEach(function (item, i, arr) {
                    var method = item[0];
                    var args = item[1] || [];
                    traverse(args, function (item, i, obj) {
                        return results[item];
                    });
                    instance[method].apply(instance, args);
                });
                resolve(instance);
            }).catch(function (e) {
                reject(e);
            });
        });
    });
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/class.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/factory.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (key) {
    key = key || "factory";
    return function factory(container, definition, id, definitions) {
        if (typeof definition[key] !== "undefined") {
            container.factory(id, definition[key]);
        }
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/factory.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/filter.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (loader, resolveArguments, key) {
    key = key || "filter";
    return function (container, definition, id, definitions) {
        loader("filter", function (resolve, reject, module, object, builder, definition) {
            return resolveArguments(builder, definition).then(function (args) {
                var result = module.apply(object, args);
                builder.use(result);
                resolve(result);
            });
        })(container, definition, id, definitions);
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/filter.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/imports.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function ($require, key) {
    key = key || "imports";
    var resourceKey = "resource";
    var versionKey = "version";
    return function importer(container, definition, id, definitions) {
        if (id == key) {
            return Promise.all(definition.map(function (item) {
                var path = item;
                if (typeof path != "string") {
                    path = item[resourceKey];
                }
                if (item[versionKey] != null) {
                    path += "#@" + item[versionKey];
                }
                return $require(path);
            })).then(function (imports) {
                var promises = imports.map(function (config) {
                    // is callable?
                    if (typeof config === "function") {
                        config = config(container);
                    }
                    if ((typeof config === "undefined" ? "undefined" : _typeof(config)) !== "object") {
                        throw new Error("That import doesn't return/resolve to an object");
                    }
                    Object.keys(config).forEach(function (id) {
                        if (id != key) {
                            if (typeof definitions[id] === "undefined" || definitions[id].constructor == Object) {
                                if (config[id] == null || config[id].constructor !== Object) {
                                    definitions[id] = config[id];
                                } else {
                                    definitions[id] = Object.assign(config[id], definitions[id]);
                                }
                            }
                        }
                    });
                    if (typeof config[key] !== "undefined") {
                        return importer(container, config[key], key, definitions);
                    } else {
                        return definitions;
                    }
                });
                return Promise.all(promises).then(function (d) {
                    return d[0];
                });
            });
        } else {
            return Promise.resolve(definitions);
        }
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/imports.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/index.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (container) {
    var root = "willow";
    var servicePrefix = "@";
    var tagPrefix = "#";
    var identifierSplitter = ":";

    var System_import = container.get(root + ".system.import");
    var System_registerDynamic = container.get(root + ".system.registerDynamic");
    return Promise.all(["/util/loader.js", "/util/walkPath.js", "/util/resolveIdentifier.js", "/util/traverse.js", "/util/resolver.js", "/util/splitIdentifier.js", "/util/findIdentifier.js", "/util/weblikeJavascriptlessImport.js", "/imports.js", "/callable.js", "/filter.js"].map(function (item) {
        return __dirname + item;
    }).map(function (item) {
        return System_import(item);
    })).then(function (modules) {

        var loader = modules[0];
        var walkPath = modules[1];
        var createResolveIdentifier = modules[2];
        var traverse = modules[3];
        var createResolver = modules[4];
        var splitIdentifier = modules[5](identifierSplitter);
        var findIdentifier = modules[6](servicePrefix);
        var weblikeJavascriptlessImport = modules[7](System_import);

        var importer = modules[8];
        var callabled = modules[9];
        var filtered = modules[10];

        var loadAndEval = loader(weblikeJavascriptlessImport, System_registerDynamic, walkPath, splitIdentifier, findIdentifier);
        var resolveIdentifier = createResolveIdentifier(walkPath, servicePrefix, tagPrefix, splitIdentifier);
        var resolver = createResolver(resolveIdentifier, traverse);
        var resolveArguments = resolver("arguments");

        var importable = importer(weblikeJavascriptlessImport);
        var callable = callabled(loadAndEval, resolveArguments);
        var filterable = filtered(loadAndEval, resolveArguments);

        container.set(root + ".loadAndEval", function () {
            return loadAndEval;
        });
        container.set(root + ".require", function () {
            return System_import;
        });
        container.set(root + ".walkPath", function () {
            return walkPath;
        });
        container.set(root + ".resolveIdentifier", function () {
            return resolveIdentifier;
        });
        container.set(root + ".resolver", function () {
            return resolver;
        });
        container.set(root + ".traverse", function () {
            return traverse;
        });
        container.set(root + ".resolve.arguments", function () {
            return resolveArguments;
        });
        container.set(root + ".filter.callable", function () {
            return callable;
        });

        return function (container, definition, id, definitions) {
            var args = arguments;
            return importable.apply(null, arguments).then(function (defs) {
                definitions = defs || definitions;
                callable(container, definitions[id], id, definitions);
                filterable(container, definitions[id], id, definitions);
                return definitions;
            });
        };
    });
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/index.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/iterator.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (resolveArguments, key) {
    key = key || "iterator";
    return function iterator(container, definition, id, definitions) {
        if (typeof definition[key] !== "undefined") {
            container.set(id, function () {
                return resolveArguments(container, definition).then(function (args) {
                    return container.get(definition[key].substr(1)).then(function (iterator) {
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
                        var res = Object.keys(iterable).map(function (key, i, arr) {
                            return iterator(iterable[key], key);
                        });
                        //the function is returned and therefore can be called and called etc etc
                        // why?
                        return res;
                        return function () {
                            return res;
                        };
                    });
                });
            });
        }
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/iterator.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/object.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (loader) {
    return loader("object", function (resolve, reject, module, object, container, definition) {
        resolve(module);
    });
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/object.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/resolve.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (resolveResolve, key, serviceKey, servicePrefix) {
    key = key || "resolve";
    serviceKey = serviceKey || "service";
    servicePrefix = servicePrefix || "@";

    return function (container, definition, id, definitions) {
        if (definition[key] == null) {
            return;
        }
        var service = definition[serviceKey];
        var newService = function newService() {
            var container = this;
            var keys = definition[key].filter(function (item, i, arr) {
                return item.indexOf(servicePrefix) === 0;
            });
            return resolveResolve(container, definition).then(function (result) {
                var get = container.get.bind(container);
                // const getTagged = container.getTagged.bind(container);
                keys = keys.map(function (item, i, arr) {
                    if (!container.has(item)) {
                        container.set(item, function (container) {
                            return result[i];
                        });
                    }
                    return item.substr(servicePrefix.length);
                });

                // hackity hack, look at a better proxy?
                // and use Symbols instead of servicePrefix?
                // also needs to work for getTagged
                container.get = function (key) {
                    if (keys.indexOf(key) !== -1) {
                        key = servicePrefix + key;
                    }
                    return get(key);
                };
                return new Promise(function (resolve, reject) {
                    //if(typeof service == "function") {
                    try {
                        resolve(service.apply(container, keys.map(function (item) {
                            return container.get(item);
                        })));
                    } catch (e) {
                        reject(e);
                    }
                    //} else {
                    //  resolve();
                    //}
                });
            });
        };
        definition[serviceKey] = null;
        container.set(id, newService);
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/resolve.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/service.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (key) {
    key = key || "service";
    return function service(container, definition, id, definitions) {
        if (typeof definition[key] !== "undefined") {
            container.set(id, definition[key]);
        }
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/service.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/tags.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (key) {
    key = key || "tags";
    return function tags(builder, definition, id, definitions) {
        (definition[key] || []).forEach(function (item, i, arr) {
            var tag = item;
            var meta = {};
            if (typeof tag !== "string") {
                tag = item.name;
                meta = item;
            }
            builder.tag(id, tag, meta);
        });
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/tags.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/findIdentifier.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (servicePrefix) {
    servicePrefix = servicePrefix || "@";
    return function (identifier) {
        // npm has introduced '@orgs' with an at sign
        // Assume orgs will always have at least 1 folder in them as an @org on its own
        // wouldn't make sense
        var isIdentifier = identifier.file.indexOf("/") == -1 && identifier.file.indexOf(servicePrefix) === 0;
        if (isIdentifier) {
            return identifier.file.substr(1);
        }
        return false;
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/findIdentifier.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/loader.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (require, register, walkPath, splitIdentifier, findIdentifier) {
    var requiresKey = "requires";
    var bundleKey = "bundle";
    var versionKey = "version";
    var ignoreRequireKey = "ignore-require"; // getting too much split out, "headers" again
    return function (key, cb) {
        if (require == null) {
            return function () {};
        }
        return function (builder, definition, id, definitions) {
            // i have the builder here, so do I need to pass in
            // require and register??
            //console.log(builder.get("*.system.import"));
            if (definition[key] == null) {
                return;
            }
            var service = function service() {
                var container = this;
                return new Promise(function (resolve, reject) {
                    // don't ever do this twice
                    var loaded;
                    var identifier = splitIdentifier(definition[key]);
                    var serviceIdentifier = findIdentifier(identifier);
                    if (serviceIdentifier) {
                        loaded = container.get(serviceIdentifier);
                        if (!(loaded instanceof Promise)) {
                            loaded = Promise.resolve(loaded);
                        }
                    } else {
                        var headers = {};
                        var temp = identifier.file.split("#");
                        if (temp[1]) {
                            headers["Content-Type"] = temp[1];
                        }
                        if (definition[bundleKey] === false) {
                            headers['Cache-Control'] = "private";
                        }
                        if (definition[ignoreRequireKey] === true) {
                            headers["Content-Type"] = "application/javascript+bundle";
                        }
                        if (definition[versionKey] != null) {
                            headers["X-Content-Version"] = definition[versionKey];
                        }
                        if (Object.keys(headers).length > 0) {
                            identifier.file = temp[0] + "#" + JSON.stringify(headers);
                        }
                        var requires = definition[requiresKey] || [];
                        // TODO: deprecate this
                        if (Array.isArray(requires)) {
                            var obj = {};
                            requires.map(function () {
                                obj[item] = "@require." + item;
                            });
                            requires = obj;
                        }
                        var keys = Object.keys(requires);
                        loaded = Promise.all(keys.map(function (item) {
                            // TODO: check for other things not just @service.id
                            return container.get(requires[item].substr(1));
                        })).then(function (modules) {
                            keys.forEach(function (item, i, arr) {
                                register(item, [], true, function (module, exports, require, __filename, __dirname) {
                                    module.exports = modules[i];
                                });
                            });
                            return modules;
                        }).then(function (modules) {
                            return require(identifier.file);
                        });
                    }
                    //
                    loaded.then(function (module) {
                        var object;
                        if (identifier.path != null) {
                            object = module;
                            module = walkPath(identifier.path, module);
                        }
                        return cb(resolve, reject, module, object, builder, definition);
                    }).catch(function (e) {
                        reject(e);
                    });
                });
            };
            builder.set(id, service);
        };
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/loader.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/resolveIdentifier.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        'use strict';

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
        if (s[1][0] == '+') {
            // Substitute replacement, but only if variable is defined and nonempty. Otherwise, substitute nothing
            value = value ? s[1].substring(1) : '';
        } else if (s[1][0] == '-') {
            // Substitute the value of variable, but if that is empty or undefined, use default instead
            value = value || s[1].substring(1);
        } else if (s[1][0] == '#') {
            // Substitute with the length of the value of the variable
            value = value !== undefined ? String(value).length : 0;
        } else if (s[1][0] == '=') {
            // Substitute the value of variable, but if that is empty or undefined, use default instead and set the variable to default
            if (!value) {
                value = s[1].substring(1);
                options.env[s[0]] = value;
            }
        } else if (s[1][0] == '?') {
            // If variable is defined and not empty, substitute its value. Otherwise, print message as an error message.
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

        if (index == -1) {
            // no $
            result += str.substring(position);
            position = -1;
            return result;
        } else {
            // $ found
            var variable;
            var endIndex;
            result += str.substring(position, index);

            if (str.charAt(index + 1) == '{') {
                // ${VAR}
                endIndex = str.indexOf('}', index);
                if (endIndex == -1) {
                    // '}' not found
                    if (options.ignoreErrors) {
                        variable = str.substring(index + 2);
                    } else {
                        throw new Error();
                    }
                } else {
                    // '}' found
                    variable = str.substring(index + 2, endIndex);
                    endIndex++;
                }
                if (!variable) {
                    result += '${}';
                }
            } else {
                // $VAR
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
                        if (!(code > 47 && code < 58) && // numeric
                        !(code > 64 && code < 91) && // upper alpha
                        code !== 95 && // underscore
                        !(code > 96 && code < 123)) {
                            // lower alpha
                            endIndex = i;
                            break;
                        }
                    }

                    if (endIndex == -1) {
                        // delimeter not found
                        variable = str.substring(index);
                    } else {
                        // delimeted found
                        variable = str.substring(index, endIndex);
                    }
                }
                if (!variable) {
                    result += '$';
                }
            }
            position = endIndex;
            if (!variable) {
                return substiteVariablesInternal(str, position, result, options, cb);
            } else {
                return substiteVariable(variable, options, function callback(err, value) {
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
module.exports = function (walkPath, servicePrefix, tagPrefix, splitIdentifier) {
    var varPrefix = "$";
    var argPrefix = "--";
    return function (item, container) {
        if (typeof item !== "string") {
            return item;
        }
        if (item.indexOf(servicePrefix) === 0) {
            var service = container.get(item.substr(servicePrefix.length));
            var identifier = splitIdentifier(item);
            if (identifier.path) {
                return walkPath(identifier.path, service);
            }
            return service;
        } else if (item.indexOf(tagPrefix) === 0) {
            var tagged = container.getTagged(item.substr(tagPrefix.length));
            if (tagged.length === 0) {
                return Promise.resolve([]);
            }
            var promises = [];
            var keys = Object.keys(tagged);
            keys.forEach(function (item, i, arr) {
                promises.push(tagged[item]);
            });
            return Promise.all(promises).then(function (services) {
                var obj = {};
                // TODO: do this better, maybe after with Array.toArray()
                if (keys[0] == 0) {
                    obj = [];
                }
                services.forEach(function (item, i, arr) {
                    obj[keys[i]] = item;
                });
                return obj;
            });
        } else if (item.indexOf(varPrefix) === 0) {
            return substiteVariablesInternal(item, "", 0, process);
        } else if (item.indexOf(argPrefix) === 0) {
            var value;
            // TODO: This should only be done once not everytime I encounter a --
            // TODO: equivalent of args for the web are request vars, or hash, probably hash ?
            process.argv.forEach(function (arg, i, arr) {
                var temp = arg.split("=");
                if (temp[0] === item) {
                    var next = arr[i + 1] || "-";
                    if (temp.length === 1 && next.indexOf("-") !== 0) {
                        value = next;
                    } else {
                        value = temp[1] || true;
                    }
                }
            });
            return value;
        } else {
            return item;
        }
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/resolveIdentifier.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/resolver.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (resolveIdentifier, traverse) {
    return function (key) {
        key = key || "arguments";
        return function (container, definition) {
            if (definition[key] == null) {
                return Promise.resolve();
            }
            var promises = [];
            traverse(definition[key], function (item, i, obj) {
                promises.push(resolveIdentifier(item, container));
                return promises.length - 1;
            });
            return Promise.all(promises).then(function (results) {
                traverse(definition[key], function (item, i, obj) {
                    return results[item];
                });
                return definition[key];
            });
        };
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/resolver.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/splitIdentifier.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (separator) {
    separator = separator || ":";
    return function (identifier) {
        var pos = identifier.lastIndexOf(separator);
        var protocol = identifier.indexOf("://");
        if (pos !== -1) {
            var temp = identifier.split(separator);
            if (protocol !== -1) {
                return {
                    file: temp[0] + ":" + temp[1],
                    path: temp[2]
                };
            }
            return {
                file: temp[0],
                path: temp[1]
            };
        } else {
            return {
                file: identifier,
                path: null
            };
        }
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/splitIdentifier.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/traverse.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function traverse(obj, callback, trail) {
    trail = trail || [];

    Object.keys(obj).forEach(function (key) {
        var value = obj[key];

        if (value != null && Object.getPrototypeOf(value) === Object.prototype) {
            traverse(value, callback, trail.concat(key));
        } else {
            obj[key] = callback.call(obj, value, key, trail);
        }
    });
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/traverse.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/walkPath.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (key, value) {
    return key.split(".").reduce(function (previous, item, i, arr) {
        return previous[item];
    }, value);
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/walkPath.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/weblikeJavascriptlessImport.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function ($require) {
    return function (path) {
        // ends in a slash, just force index.js
        var temp = path.split("#");
        path = temp[0];
        var hash = temp[1] == null ? "" : "#" + temp[1];
        if (path[path.length - 1] === "/") {
            path = path + "index.js";
        } else {
            var temp = path.split("/");
            // length is 1 so its a simple nodejs module "something"
            var len = 1;
            if (path.indexOf("@") === 0) {
                // starts with a @ and length is 2 its an org nodejs module "@somewhere/something"
                len = 2;
            }
            if (temp.length > len) {
                var last = temp.pop();
                if (last.indexOf(".") === -1) {
                    path = path + ".js";
                }
            }
        }
        var args = [].slice.call(arguments);
        args[0] = path + hash;
        return $require.apply(null, args);
    };
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/filters/util/weblikeJavascriptlessImport.js
    }
),

r(
    "https://unpkg.com/@gardenhq/willow@5.0.1/index.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        "use strict";

module.exports = function (promisedRequire, register, config, containerlike) {
    var name = __dirname;
    // this should be in test
    var id = "willow.";
    config = name + "/conf/javascript.js";
    if (promisedRequire == null) {
        //probably testing
        var $require = require;
        var promised = $require("./util/promised");
        // TODO: This can go for now?
        promisedRequire = promised(function (path) {
            return require(path.replace(name, "./"));
        });
    }
    var modules = ["Builder.js", "filters/index.js", "conf/index.js"];
    if (containerlike == null) {
        modules.push("Container.js");
    }
    return Promise.all(modules.map(function (item) {
        return promisedRequire(name + "/" + item);
    })).then(function (modules) {
        var container = containerlike == null ? new modules[3]() : containerlike;
        var builder = new modules[0](container, promisedRequire // for importing
        );
        builder.set(id + "system.import", function () {
            return promisedRequire;
        }, ["dom.system.import"]);
        builder.set(id + "system.registerDynamic", function () {
            return register;
        });
        return modules[1](builder).then(function (filters) {
            return builder.use(filters).set(id + "resolve.resolve", function () {
                return builder.get(id + "resolver")("resolve");
            });
        }).then(function (builder) {
            var filters = modules[2]();
            return builder.load(filters).then(function () {
                return Promise.all(Object.keys(filters).map(function (key, i, arr) {
                    return builder.get(key);
                })).then(function (filters) {
                    return builder;
                });
            });
        }).then(function (builder) {
            return builder.load(config);
        }).then(function (builder) {
            return Promise.all(builder.getTagged(id + "filter")).then(function () {
                return builder;
            });
        });
    });
};//# sourceURL=https://unpkg.com/@gardenhq/willow@5.0.1/index.js
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
                                System.import("https://unpkg.com/@gardenhq/o@5.1.0/b.js").then(
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

)
