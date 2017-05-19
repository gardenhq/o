(
    function(win, doc, script)
    {
        "use strict";
        var registryFactory;
        var registry;
        var parser;
        var transport;
        var pathname = win.location.pathname;
        var defaultProxy = function(transport)
        {
            return transport;   
        };  
        var dirname = function(path)
        {
            return path.split("/").slice(0, -1).concat("").join("/")
        }
        var exportTo = function(where, what, path)
        {
            path.split(".").reduce(
                function(prev, item, i, arr)
                {
                    return prev[item] = prev[item] == null ? (i == arr.length - 1 ? what : {}) : prev[item];
                },
                where
            );
        };
        var runner = function(o, config)
        {
            if(config.src || config.module) {
                var _o = function(doc)
                {
                    return o(
                        function(promised)
                        {
                            return promised(doc)
                        }
                    ).then(
                        function(System)
                        {
                            exportTo(
                                win,
                                function()
                                {
                                    return Promise.resolve(System);
                                },
                                config.export
                            );
                            return System.import((config.src || config.module).split("#")[0]).then(
                                function(module)
                                {
                                    if(typeof module === "function") {
                                        return module(Promise.resolve(System))
                                    } else {
                                        return Promise.resolve(System);
                                    }

                                }
                            );
                        }
                    );
                }
                if(config.module) {
                    exportTo(win, _o, config.export);
                } else {
                    _o();
                }
            } else {
                exportTo(win, o, config.export);
            }
            return o;
        }
        runner.config = function(script, resolve)
        {
            var temp;
            // TODO: take some bits out? or namespace them with o?
            var config = [].slice.call(script.attributes).reduce(
                function(prev, item, i, arr)
                {
                    var key = item.nodeName;
                    if(key.indexOf("data-") === 0) {
                        prev[key.substr(5)] = item.value;
                    }
                    return prev;
                },
                {}
            );
            // get a default includepath from the src
            var src = getAttribute(doc, "src", "").split("/");
            config.includepath = config.includepath || (src.length > 3 ? src.slice(0, -3).concat("").join("/") : "./node_modules/");
            // resolve anything pathlike
            if(config.basepath) {
                config.basepath = resolve(config.basepath, pathname);
            }
            // append / to includepath
            if(config.includepath.lastIndexOf("/") !== config.includepath.length -1) {
                config.includepath += "/";
            }
            var basepath = config.basepath || pathname;
            [
                "includepath",
                "src"
            ].forEach(
                function(item)
                {
                    if(config[item] != null) {
                        config[item] = resolve(config[item], basepath);
                    }
                }
            );
            // pop off the index.js for now
            config.includepath = dirname(config.includepath);
            // data-src is set
            if(config.src) {
                temp = config.src.split("#");
                config.src = temp[0];
                if(temp[1]) {
                    // if I have a hash resolve it to the page url and save it
                    config.hash = resolve(temp[1], basepath);
                }
                // baseURL should be the resolved data-src path unless basepath is set
                config.baseURL = config.basepath || config.src;
            } else if(script.hasAttribute("src")) {
                // config.src = script.getAttribute("src") 
                // data-src isn't set, but src is, surely this is only for bundles?
                config.baseURL = config.basepath || resolve(script.getAttribute("src"), pathname);
            }
            config.baseURL = dirname(config.baseURL || basepath);
            return config;
        }
        var getCurrentScript = function(doc)
        {
            var scripts = doc.getElementsByTagName("script");
            return scripts[scripts.length - 1];
        }
        var getAttribute = function(doc, attr, value)
        {
            var script = getCurrentScript(doc);
            return script.hasAttribute(attr) ? script.getAttribute(attr) : value;
        };
        var getConfig = function(key, value)
        {
            // TODO: should doc be an arg?
            return getAttribute(doc, "data-" + key, value)
        }
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
                if(path.indexOf("://") !== -1) {
                    return path;
                }
                base = base || defaultBase;
                var first2Chars = path.substr(0, 2);
                var firstChar = first2Chars[0];
                var temp = path.split("#");
                var hash = temp.length === 2 ? "#" + temp[1] : "";
                path = temp[0];
                if(
                    first2Chars != ".." && first2Chars != "./" && firstChar != "/"
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
                path = normalizeName(path, base.split("/").slice(0, -1));
                // TODO: this should go, be more specific
                if(path.indexOf(".") === -1) {
                    path += ".js";
                }
                firstChar = path.charAt(0);
                if(firstChar != "/" && path.indexOf("://") === -1) {
                    path = "/" + path;
                }
                return path + hash;
            }
        }
        var basepath = function(doc, src)
        {
            src = getAttribute(doc, src || "src", "");
            var parts = pathname.split("/");
            if(src[0] !== "/") {
                parts[parts.length - 1] = src;
            }
            return getConfig(
                "basepath",
                parts.join("/")
            );
        };
        return (
            function(includePath, currentScript, currentBase)
            {
                var config = Object.assign(
                    {},
                    {
                        registry: "/src/registry/memory.js",
                        parser: "/src/parser/evalSync.js",
                        transport: "/src/transport/xhrNodeResolver.js"
                    },
                    runner.config(currentScript, getResolve(includePath, currentBase))
                );
                var resolve = getResolve(config.includepath, currentBase);
                var utils = [
                    "transport",
                    "parser",
                    "registry"
                ].map(
                    function(item)
                    {
                        return {
                            path: config[item],
                            key: item
                        };
                    }
                ).concat(
                    (
                        config.proxy ? {
                            path: config.proxy,
                            key: "proxy"
                        } : []
                    )
                ).map(
                    function(item)
                    {
                        return script(resolve(item.path, config.baseURL), item.key, currentScript)
                    }
                ).map(
                    function(injectScript, i)
                    {
                        if(injectScript) {
                            return new Promise(
                                function(resolve, reject)
                                {
                                    var previous = win[injectScript.callback];
                                    win[injectScript.callback] = function(func)
                                    {
                                        delete win[injectScript.callback];
                                        if(typeof previous !== "undefined") {
                                            win[injectScript.callback] = previous;
                                        }
                                        var result = func(injectScript.path, config);
                                        if(i == 2) {
                                            registryFactory = result;
                                            result = result();
                                        }
                                        resolve(
                                            result
                                        );
                                    }
                                    injectScript();
                                }
                            );
                        }
                    }
                );
                var getPromisedLoader = function(resolve, config)
                {
                    var factory = function(doc, proxy, register)
                    {
                        proxy = proxy || defaultProxy;
                        register = register || registry;
                        return function(path)
                        {
                            return register(
                                resolve(path, (this ? this.getConfig() : config).baseURL),
                                proxy(
                                    transport,
                                    factory,
                                    registryFactory,
                                    config,
                                    resolve
                                ),
                                parser,
                                resolve
                            );
                        }
                    }
                    return factory;
                };
                return runner(
                    function(cb)
                    {
                        var registerDynamic;
                        // TODO: resolve will change here, is that ok?
                        var localConfig = runner.config(getCurrentScript(doc), resolve);
                        if(!getConfig("includepath")) {
                            localConfig.includepath = config.includepath;
                        }

                        resolve = getResolve(localConfig.includepath, basepath(doc));
                        return Promise.all(
                            utils
                        ).then(
                            function(modules)
                            {
                                transport = modules[0];
                                parser = modules[1];
                                registry = modules[2];
                                defaultProxy = modules[3] ? modules[3] : defaultProxy;
                                registerDynamic = function(path, deps, executingRequire, cb)
                                {
                                    return Promise.resolve(registry.set(path, cb));
                                }
/*_o*/
                                return getPromisedLoader(resolve, localConfig)(doc)("/src/_o.js");
                            }
                        ).then(
                            function(_o)
                            {
                                var System = Object.assign(
                                    _o(
                                        getPromisedLoader(resolve, localConfig)
                                    )(cb),
                                    {
                                        registry: registry,
                                        registerDynamic: registerDynamic,
                                        resolve: resolve
                                    }
                                );
                                System.config(localConfig);
                                registerDynamic("/" + localConfig.includepath + "/@gardenhq/o/o.js", [], true, function(module){module.exports = Promise.resolve(System);});
                                return System;
                            }
                        );
                    },
                    config
                );
            }
        )(
            getConfig("includepath"),
            getCurrentScript(doc),
            basepath(doc)
        );
    }
)(
    window,
    document,
    function(path, callbackName, script)
    {
        /* scripts */
        var temp = path.split("?");
        var inject = function()
        {
            var newNode = script.ownerDocument.createElement("script");
            newNode.setAttribute("type", "text/javascript");
            newNode.setAttribute("src", path);
            script.parentNode.insertBefore(newNode, script);
        }
        inject.callback = temp.length === 2 ? temp[1] : callbackName
        inject.path = path;
        return inject;
        /* scripts */
    }
)
