transport(
    function(scriptPath)
    {
        var extension = ".js";
        var index = "index" + extension;
        var createCheck = function(str)
        {
            return function(filename)
            {
                return filename.indexOf(str) === Math.max(0, filename.length - str.length);
            }
        }
        var hasJsExtension = createCheck(extension);
        var isIndex = createCheck(index);
        var getFetchLike = function(originalPath, request)
        {
            return function(path)
            {
                request.open('get', path, true);
                return new Promise(
                    function(resolve, reject)
                    {
                        // TODO: Consider making this more fetch-like and potentially move into evalSync which would become a node parser
                        // TODO: Aliases?
                        request.onreadystatechange = function()
                        {
                            if(request.readyState === 4) {
                                if(request.status === 200) {
                                    return resolve(
                                        {
                                            headers: {
                                                "Content-Type": request.getResponseHeader("Content-Type") 
                                            },
                                            path: originalPath,
                                            content: request.responseText,
                                            status: request.status
                                        }
                                    );
                                } else {
                                    reject(
                                        {
                                            path: originalPath,
                                            status: request.status
                                        }
                                    );
                                }
                            }
                        }
                        request.send();

                    }
                );
            }
        }
        var attempts = [
            {
                test: function(filename)
                {
                    return !hasJsExtension(filename);
                },
                try: function(path, fetch)
                {
                    return fetch(path + extension);
                }
            },
            {
                test: function(filename)
                {
                    return !isIndex(filename);
                },
                try: function(path, fetch)
                {
                    return fetch(path + "/" + index);
                }
            },
            {
                test: function(filename)
                {
                    // right now everything will come in with '/index.js' unless its a real 404
                    return isIndex(filename);
                },
                try: function(path, fetch)
                {
                    var temp = path.split("/");
                    temp.pop();
                    return fetch(temp.join("/") + "/package.json").then(
                        function(data)
                        {
                            temp.push(JSON.parse(data.content).main);
                            return fetch(temp.join("/"));
                        }
                    );
                }
            }
        ];
        return function(path, Ajax)
        {
            Ajax = Ajax || XMLHttpRequest;
            // path = version(path);
            var filename = path.split("/").pop().split("@")[0];
            var fetchlike = getFetchLike(path, new Ajax());
            return Object.keys(attempts).reduce(
                function(prev, item, i)
                {
                    var attempt = attempts[item];
                    return prev.catch(
                        function(data)
                        {
                            if(attempt.test(filename)) {
                                return attempt.try(
                                    path,
                                    fetchlike
                                );
                            } else {
                                return Promise.reject(data);
                            }
                        }
                    );
                },
                fetchlike(path)
            ).catch(
                function(data)
                {
                    if(data instanceof Error) {
                        throw data;
                    } else {
                        console.error(new Error("Unable to load " + data.path + " (" + data.status + ")"));
                        return Promise.resolve(
                            {
                                path: data.path,
                                headers: {"Content-Type": "application/javascript"},
                                content: "module.exports=null"
                            }
                        );
                    }
                }
            );
        };
    }
);

