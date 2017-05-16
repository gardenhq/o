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
                                proxy: "/node_modules/@gardenhq/o/dev/index.js",
export: "o",
src: "./external.js",
baseURL: "/examples/o/",
includepath: "node_modules/"
                            }
                        );
                        return (
                    /* o */
    function(r, o)
    {
        return Promise.all(
            [

r(
    "/examples/hello-world.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        module.exports = "Hello World!";

    }
),

r(
    "/examples/o/external.js",
    function(module, exports, require, __filename, __dirname, process)
    {
        (
    function(load)
    {
        var print = function(helloWorld)
        {
            if(typeof document !== "undefined") {
                var h1 = document.createElement("h1");
                h1.textContent = helloWorld;
                document.body.appendChild(h1);
            }
            console.log(helloWorld);
        }
        load.then(
            function(System)
            {
                // when data-basepath is not set then window.location.pathname is used
                System.import("../hello-world.js").then(
                    function(helloWorld)
                    {
                        print(helloWorld);
                    }
                );

            }
        ).catch(
            function(e)
            {
                console.error(e);
            }
        );
    }
)(o(function(promised){return promised(document)}))


    }
)
            ]
        );
    }
)(
    function(path, func){ return System.registerDynamic(path, [], true, func); },
        function()
        {
            return Promise.resolve(System);
        }
)
.then(
                            function()
                            {
                                System.import("./external.js").then(
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
            // TODO: Decide whethe rto annoyingly add process
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
                path = _require.resolve(path.split("#")[0]);
                var relativeRequire = function(relativePath)
                {
                    return _require(relativePath.indexOf("/") === 0 ? relativePath : _require.resolve(relativePath, path));
                }
                try {
                    return modules[path]._load(relativeRequire)
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
