(
    function(win, doc, script, bundleConfig)
    {
        "use strict";
        var registryFactory;
        var registry;
        var parser;
        var transport;
        var proxy;
        var pathname = win.location.pathname;
        pathname = pathname == "/" ? "index.html" : pathname;
        var hasProtocol = function(path, first2Chars)
        {
            return first2Chars === "//" || path.indexOf("://") !== -1;
        }
        var isAbsolute = function(path, first2Chars)
        {
            return path[0] === "/" || hasProtocol(path, first2Chars || path.substr(0, 2));
        }
        // base should always be without a trailing /
        var url = function(path, base)
        {
            base = base && base !== "/"  ? base + "/" : "/";
            if(
                !hasProtocol(base, base.substr(0, 2))
            ) {
                base = win.location.origin + base;
            }
            path = new win.URL(path, base).href.replace(win.location.origin, "");
            // if it has a trailing slash i.e. a directory, remove the trailing slash
            var len = path.length - 1;
            return path[len] === "/" ? path.substr(0, len) : path;
        }
        var exportTo = function(where, what, path)
        {
            if(path == null) {
                return;
            }
            path.split(".").reduce(
                function(prev, item, i, arr)
                {
                    return prev[item] = prev[item] == null ? (i == arr.length - 1 ? what : {}) : prev[item];
                },
                where
            );
        };
        var runner = function(o, config, register, resolve)
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
                        function(_import)
                        {
                            exportTo(
                                win,
                                function()
                                {
                                    return Promise.resolve(_import);
                                },
                                config.export
                            );
                            return _import((config.src || config.module).split("#")[0]).then(
                                function(module)
                                {
                                    if(typeof module === "function") {
                                        return module(Promise.resolve(_import), config, register, resolve())
                                    } else {
                                        return Promise.resolve(_import);
                                    }
                                }
                            );
                        }
                    );
                }
                if(config.module) {
                    exportTo(win, _o, config.export);
                } else {
                    _o(doc);
                }
            } else {
                exportTo(win, o, config.export);
            }
            return o;
        }
        var configuration = function(script, resolve, _config)
        {
            if(Object.keys(bundleConfig).length === 0) {
                var __dirname = pathname === "/" ? pathname : url(pathname + "/..");
                // TODO: take some bits out? or namespace them with o?
                var attr = {};
                var config = Object.assign(
                    {},
                    [].slice.call(script.attributes).reduce(
                        function(prev, item, i, arr)
                        {
                            var key = item.nodeName;
                            var value = item.value;
                            if(key.indexOf("data-") === 0) {
                                key = key.substr(5);
                                switch(key) {
                                    case "basepath":
                                    case "includepath":
                                        if(value[value.length - 1] === "/") {
                                            value = value.substr(0, value.length - 1);
                                        }
                                        value = resolve(value, __dirname);
                                        break;
                                }
                                prev[key] = value;
                            } else {
                                attr[key] = value;
                            }
                            return prev;
                        },
                        _config || {}
                    )
                );
                config.includepath = config.includepath || resolve(
                    (
                        attr.src && attr.src.length > 3 ?
                            attr.src.split("/").slice(0, -3).join("/") : "./node_modules"
                        ),
                    __dirname
                );
                if(config.src) {
                    var temp;
                    temp = config.src.split("#");
                    config.src = temp[0];
                    if(temp[1]) {
                        config.hash = resolve(temp[1], __dirname);
                    }
                    config.src = resolve(config.src, __dirname);
                    config.basepath = config.basepath || url(config.src + "/..");
                } else if(attr.src) {
                    config.basepath = config.basepath || resolve(attr.src + "/..", __dirname);
                } else {
                    config.basepath = config.basepath || __dirname;
                }
                if(config.hash) {
                    config.basepath = url(config.hash + "/..");
                }
            } else {
                return bundleConfig;
            }
            return config;
        }
        var getCurrentScript = function(doc)
        {
            var scripts = doc.getElementsByTagName("script");
            return scripts[scripts.length - 1];
        }
        /* rewrite */
        var appendVersionToPackageNameRewriter = function(includePath, rewriter)
        {
            return function(path, headers)
            {
                var hash = "";
                // this is unpkg specific
                if(headers["X-Content-Version"] != null) {
                    var parts = path.split("/");
                    var index = 0;
                    // check to make sure it doen't already have one
                    if(parts[index].indexOf("@") === 0) {
                        index = 1;
                    }
                    parts[index] += "@" + headers['X-Content-Version'];
                    path = parts.join("/");
                }
                return rewriter(path, headers);
            }
        }
        var getRewriter = function(includePath)
        {
            var rewriter = defaultRewriter(includePath);
            if(includePath.indexOf("://") !== -1) {
                return appendVersionToPackageNameRewriter(includePath, rewriter);
            } else {
                return rewriter;
            }
        }
        var defaultRewriter = function()
        {
            return function(path, headers)
            {
                return {
                    path: path,
                    hash: Object.keys(headers).length > 0 ? "#" + JSON.stringify(headers) : ""
                };
            }
        }
        var normalizeHash = function(path, rewriter)
        {
            var temp = path.split("#");
            path = temp[0];
            var hash = temp[1] || "";
            if(hash) {
                var headers = {};
                if(hash.indexOf("{") === 0) {
                    headers = JSON.parse(hash);
                } else if(hash.indexOf("@") === 0) {
                    headers["X-Content-Version"] = hash.substr(1);
                    // TODO: rethink?
                } else if(hash.indexOf(".") !== 0 && hash.indexOf("/") > 0) {
                    headers['Content-Type'] = hash;
                }
                if(Object.keys(headers).length > 0) {
                    return rewriter(path, headers)
                }
                hash = "#" + hash;
            }
            return {
                path: path,
                hash: hash
            };
        }
        /* rewrite */
        /* resolve */
        var getResolve = function(includePath, defaultBase)
        {
            includePath = includePath || "";
            var rewriter = getRewriter(includePath);
            return function(path, base)
            {
                // base should always be a dirname with no trailing slash
                var obj = normalizeHash(path, rewriter);
                path = obj.path;
                var first2Chars = path.substr(0, 2);
                if(
                    first2Chars !== ".." && first2Chars !== "./" && first2Chars !== "//" && first2Chars[0] !== "/" && path.indexOf("://") === -1
                ) {
                    path = includePath + "/" + path;
                }
                return url(path, (base || defaultBase)) + obj.hash;
            }
        }
        /* resolve */
        /* test */
        if(window.test) {
            Object.assign(
                window,
                {
                    hasProtocol: hasProtocol,
                    isAbsolute: isAbsolute,
                    getResolve: getResolve,
                    appendVersionToPackageNameRewriter: appendVersionToPackageNameRewriter,
                    normalizeHash: normalizeHash,
                    getRewriter: getRewriter,
                    defaultRewriter: defaultRewriter,
                    exportTo: exportTo,
                    url: url,
                    runner: runner,
                    configuration: configuration
                }
            );
            return;
        }
        /* test */
        return (
            function(currentScript)
            {
                var base = "@gardenhq/o/src";
                var config = Object.assign(
                    {},
                    {
                        // runner
                        // resolver
                        // configure
                        registry: base + "/registry/memory.js",
                        parser: base + "/parser/evalSync.js",
                        transport: base + "/transport/xhrNodeResolver.js",
                        proxy: base + "/proxy/noop.js"
                    },
                    configuration(currentScript, url)
                );
                // node like resolve based on the o script tag
                var utils = [
                    "transport",
                    "parser",
                    "registry",
                    "proxy"
                ].reduce(
                    function(prev, item, i)
                    {
                        return prev.then(
                            function(modules)
                            {
                                return script(config, item, url, isAbsolute, win, currentScript).then(
                                    function(module)
                                    {
                                        if(typeof module !== "undefined") {
                                            modules.push(module);
                                        }
                                        return modules;
                                    }
                                );
                            }
                        );
                    },
                    Promise.resolve([])
                );
                var getPromisedLoader = function(resolve, config)
                {
                    var factory = function(doc, _proxy, register)
                    {
                        register = register || registry;
                        _proxy = _proxy || proxy;
                        return function(path)
                        {
                            return register(
                                resolve(path, config.basepath),
                                _proxy(
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
                var resolve = getResolve(config.includepath, config.basepath);
                var registerDynamic;
                var load = utils.then(
                    function(modules)
                    {
                        transport = modules[0];
                        parser = modules[1];
                        registryFactory = modules[2];
                        registry = registryFactory();
                        proxy = modules[3];
                        // TODO: make same simpler api
                        registerDynamic = function(path, deps, executingRequire, cb, filename)
                        {
                            // TODO: minimal should also return a promise
                            return Promise.resolve(registry.set(path, cb, filename));
                        };
                        if(Object.keys(bundleConfig).length > 0) {
                            module = function(path, module, filename)
                            {
                                return registerDynamic(path, [], true, module, filename);
                            }
                        }
                        /*_o*/
                        // TODO: could this get away with using url?
                        return getPromisedLoader(resolve, config)(doc)(base + "/_o.js");
                    }
                );
                return runner(
                    function(cb)
                    {
                        var currentConfig = configuration(
                            getCurrentScript(doc),
                            url,
                            Object.assign(
                                {},
                                config,
                                {
                                    src: null,
                                    basepath: null
                                },
                                bundleConfig
                            )
                        );

                        resolve = getResolve(
                            currentConfig.includepath,
                            currentConfig.basepath
                        );
                        return load.then(
                            function(_o)
                            {
                                var _import = _o(
                                    getPromisedLoader(
                                        resolve,
                                        currentConfig
                                    )
                                )(cb);
                                registerDynamic(
                                    "/" + currentConfig.includepath + "/@gardenhq/o/o.js",
                                    [],
                                    true,
                                    function(module)
                                    {
                                        module.exports = Promise.resolve(_import);
                                    }
                                );
                                return _import;
                            }
                        );
                    },
                    config,
                    registerDynamic,
                    function()
                    {
                        return resolve;
                    }
                );
            }
        )(
            getCurrentScript(doc)
        );
    }
)(
    window,
    document,
    (
        function()
        {
            /* scripts */
            return function(config, key, url, isAbsolute, win, script)
            {
                /* check */
                return new Promise(
                    function(resolve, reject)
                    {
                        var previous = win.module;
                        win.module = {
                            exports: {}
                        };
                        var path = config[key];
                        var newNode = script.ownerDocument.createElement("script");
                        newNode.onload = function()
                        {
                            var module = win.module;
                            delete win.module;
                            if(typeof previous !== "undefined") {
                                win.module = previous;
                            }
                            var previousFilename = win.__filename;
                            win.__filename = path;
                            var result = module.exports.apply(null, [config]);
                            delete win.__filename;
                            if(typeof previousFilename !== "undefined") {
                                win.__filename = previousFilename;
                            }
                            resolve(result);
                            script.parentNode.removeChild(newNode);
                        }
                        var first2Chars = path.substr(0, 2);
                        if(first2Chars !== ".." && first2Chars !== "./" && !isAbsolute(path, first2Chars)) {
                            path = config.includepath + "/" + path;
                        }
                        newNode.setAttribute("src", url(path, location.pathname));
                        script.parentNode.insertBefore(newNode, script);
                    }
                );
            }
            /* scripts */
        }
    )(),
    typeof arguments !== "undefined" ? arguments[0] : {} // protect
)
