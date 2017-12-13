(
    function()
    {
        var modules = {};
        ${ rewriter }
        var Module = function(id, module, filename)
        {
            var o = this;
            o.id = id;
            o.filename = filename || id;
            // this.parent = parent;
            o.exports = {};
            o[0] = module;
        }
        var hasProtocol = function(path, first2Chars)
        {
            return first2Chars === "//" || path.indexOf("://") !== -1;
        }
        // base should always be without a trailing /
        var url = function(path, base)
        {
            base = base ? base + "/" : "/";
            if(
                !hasProtocol(base, base.substr(0, 2))
            ) {
                base = location.origin + base;
            }
            var url = new URL(path, base);
            path = url.origin + url.pathname;
            path = path.replace(location.origin, "");
            // path = new URL(path, base).href.replace(location.origin, "");
            // if it has a trailing slash i.e. a directory, remove the trailing slash
            var len = path.length - 1;
            return path[len] === "/" ? path.substr(0, len) : path;
        }

        var loadModule = function(module, _require, dirname)
        {
            if(typeof module[0] !== "undefined") {
                var src = module[0];
                module[0] = undefined;
                // (exports, require, module, __filename, __dirname)
                // module.bind(null)(this.exports, _require, this, this.filename, temp.join("/"));
                src.bind(null)(module, module.exports, _require, module.filename, dirname);
            }
            return module.exports;
        };
        /* resolve */
        __filename = (
            function(rewriter)
            {
                ${ getRewriter }
                return function(path, base)
                {
                    ${ hash }
                    var first2Chars = path.substr(0, 2);
                    if(
                        first2Chars != ".." && first2Chars != "./" && first2Chars[0] != "/" && path.indexOf("://") === -1
                    ) {
                        path = "${includepath}/" + path;
                    }
                    return url(path, (base || "${basepath}"));
                };
            }
        )();
        /* register */
        module = function(path, module, filename)
        {
            modules[path] = new Module(path, module, filename);
        };
        /* require */
        require = function(path)
        {
            var module = modules[url(__filename(path))];
            var from = url(module.filename + "/..") || ".";
            return loadModule(
                module,
                function(relativePath)
                {
                    return require(relativePath[0] === "/" ? relativePath : __filename(relativePath, from));
                },
                from
            );
        };
        return function(cb)
        {
            return function(path)
            {
                return Promise.resolve(require(path));
            }
        }
    }
)()

