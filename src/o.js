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
        var runner = function(o, config)
        {
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

        }
        runner.config = function(script, resolve)
        {
            var temp;
            // take some bits out? or namespace them with o?
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
            // data-src is set
            if(config.src) {
                temp = config.src.split("#");
                config.src = temp[0];
                if(temp[1]) {
                    // if I have a hash resolve it to the page url and save it
                    config.hash = resolve(temp[1], config.basepath || pathname);
                }
                // baseURL should be the resolved data-src path unless basepath is set
                config.baseURL = config.basepath || resolve(config.src, pathname);
            } else if(script.hasAttribute("src")) {
                // config.src = script.getAttribute("src") 
                // data-src isn't set, but src is, surely this is only for bundles?
                config.baseURL = config.basepath || resolve(script.getAttribute("src"), pathname);
            }
            config.baseURL = config.baseURL || config.basepath || pathname;
            temp = config.baseURL.split("/");
            temp.pop();
            temp.push("");
            config.baseURL = temp.join("/");
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
            function(includePath)
            {
                var current = getCurrentScript(doc);
                var resolve = getResolve(includePath, basepath(doc));
                var config = Object.assign(
                    {},
                    {
                        export: "module.exports",
                        registry: "o/src/registry/memory.js",
                        parser: "o/src/parser/evalSync.js",
                        transport: "o/src/transport/xhrNodeResolver.js",
                        includepath: includePath
                    },
                    runner.config(getCurrentScript(doc), resolve)
                );
                var utils = [
                    {
                        path: config.transport,
                        key: "transport"
                    },
                    {
                        path: config.parser,
                        key: "parser"
                    },
                    {
                        path: config.registry,
                        key: "registry"
                    }
                ].concat(
                    (
                        config.proxy ? {
                            path: config.proxy,
                            key: "proxy"
                        } : []
                    )
                ).map(
                    function(item)
                    {
                        return script(resolve(item.path, config.baseURL), item.key, current)
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
                            var _config = this ? this.getConfig() : config;
                            return register(
                                resolve(path, _config.baseURL),
                                proxy(
                                    transport,
                                    factory,
                                    registryFactory,
                                    config
                                ),
                                parser,
                                resolve
                            );
                        }
                    }
                    return factory;
                };
                var o = function(cb)
                {
                    var resolve = getResolve(includePath, basepath(doc));
                    var config = runner.config(getCurrentScript(doc), resolve);
                    config.includepath = config.includepath || includePath;
                    var registerDynamic;
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
                            return getPromisedLoader(resolve, config)(doc)("o/src/_o.js");
                        }
                    ).then(
                        function(_o)
                        {
                            var System = Object.assign(
                                _o(
                                    getPromisedLoader(resolve, config)
                                )(cb),
                                {
                                    registry: registry,
                                    // register: registry,
                                    registerDynamic: registerDynamic,
                                    resolve: resolve
                                }
                            );
                            System.config(config);
                            registerDynamic("/" + config.includepath + "o/o.js", [], true, function(module){module.exports = System});
                            return System;
                        }
                    );
                };
                runner(o, config);
                return o;
            }
        )(
            getConfig("includepath", "node_modules/")
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
