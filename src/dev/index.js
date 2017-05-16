(
    function(win, storage)
    {
        var doc = document;
        var getStore = function(key)
        {
            return function(data)
            {
                storage.setItem(key, JSON.stringify(data));
                return data;
            }
        }
        var getPathAndHeadersFromPath = function(path)
        {
            var temp = path.split("#");
            var headers;
            if(temp[1]) {
                if(temp[1][0] === "{") {
                    headers = JSON.parse(temp[1]);
                } else {
                    headers = {
                        "Content-Type": temp[1]
                    };
                }
            }
            return {
                path: temp[0],
                headers: headers
            };
        }
        var _translator = function(file, loader)
        {
            return loader(file.path).then(
                function(data)
                {
                    if(file.headers) {
                        data.headers = Object.assign(
                            {},
                            data.headers,
                            file.headers
                        );
                    }
                    return data;
                }
            );
        }
        var translate = function(file, loader, translator, store)
        {
            return translator(file, loader).then(
                function(data)
                {
                    return store(data);
                }
            );
        }
        var getPromisedRequire = function(factory, cache, registry)
        {
            return factory(
                doc,
                cache,
                registry            
            )   
        }
        var discoverMain = function(str)
        {
            var id;
            var container;
            var args = str.split(":");
            if(str.indexOf("://") !== -1) {
                container = args[0] + ":" + args[1];
                id = args[2];
            } else {
                container = args[0];
                id = args[1];
            }
            return {
                container: container,
                id: id || "main"
            };
        }
        var getCache = function(cachePrefix)
        {
            return function(__filename, findServices)
            {
                var registry;
                var loadTranslator;
                var services;

                if(findServices !== false) {
                    var temp = __filename.split("/");
                    temp.pop();
                    temp.push("container.js:main");
                    services = temp.join("/");
                    temp = __filename.indexOf("#") !== -1  && __filename.split("#");
                    if(temp.length > 1) {
                        __filename = temp[0];
                        services = temp[1];
                    }
                }
                return function(loader, factory, registryFactory, config)
                {
                    return function(path)
                    {
                        var file = getPathAndHeadersFromPath(path);
                        var cachePath = cachePrefix + file.path;
                        var store = getStore(cachePath);
                        if(services) {
                            if(!loadTranslator) {
                                registry = registryFactory();
                                var require = getPromisedRequire(
                                    factory,
                                    getCache("o-dev+file://")(__filename, false),
                                    registry
                                ).bind(
                                    {
                                        getConfig: function()
                                        {
                                            return config;
                                        }
                                    }
                                );
                                var willow = "@gardenhq/willow";
                                var VersionableRequire = require;
                                if(__filename.indexOf("://") !== -1) {
                                    var version = "@^4.1.0";
                                    var temp = __filename.split("/");
                                    var domain = temp.slice(0, 3).join("/");
                                    willow = domain + "/" + willow + version;
                                    VersionableRequire = function(path, version)
                                    {
                                        if(version) {
                                            var root = __filename.split("/").slice(0, 3).join("/") + "/";
                                            if(path[0] !== "/" && path[0] != "." && path.indexOf("://") === -1) {
                                                var temp = path.split("/");
                                                var index;
                                                if(path[0] == "@") {
                                                    index = 1;
                                                } else {
                                                    index = 0;
                                                }
                                                temp[index] = temp[index] + "@" + version;
                                                path = root + temp.join("/");
                                            }

                                        }
                                        return require(path);
                                    }
                                }
                                loadTranslator = require(willow + "/index.js").then(
                                    function(builder)
                                    {
                                        // return;
                                        // console.log(builder);
                                        var registerDynamic = function(path, deps, executingRequire, cb)
                                        {
                                            return registry.set(path, cb);
                                        }
                                        return builder(
                                            VersionableRequire,
                                            registerDynamic
                                        ).then(
                                            function(builder)
                                            {
                                                var main = discoverMain(services);
                                                // TODO: if builder always gets Promises, should it always set promises?
                                                builder.set(
                                                    "o.dev.delete",
                                                    Promise.resolve(function(key){return Promise.resolve(registry.delete(key))})
                                                );
                                                return builder.build(main.container).get(main.id).then(
                                                    function(devtools)
                                                    {
                                                        builder.set(
                                                            "o.dev.import",
                                                            Promise.resolve(
                                                                function(path)
                                                                {
                                                                    return translate(file, loader, translator, store).then(
                                                                        function(data)
                                                                        {
                                                                            return data.content;
                                                                        }
                                                                    );
                                                                }
                                                            )
                                                        );
                                                        return devtools(config);
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );

                            }
                        } else {
                            loadTranslator = Promise.resolve(_translator);
                        }
                        var item = storage.getItem(cachePath);
                        if(item !== null) {
                            return Promise.resolve(JSON.parse(item));
                        }
                        return loadTranslator.then(
                            function(translator)
                            {
                                return translate(file, loader, translator, store);
                            }
                        );
                    };
                }
            }
        }
        proxy(
            getCache("o+file://")
        );
    }
)(window, window.localStorage);
