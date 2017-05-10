transport(
    function(scriptPath)
    {
        var throwError = function(cb, path, request)
        {
            return function(e)
            {
                cb(new Error("Unable to load " + path + " (" + request.status + ")"));
                return function(){};
            }
        }
        var load = function(path, ajax)
        {
            ajax = ajax || XMLHttpRequest;
            var request = new ajax();
            request.open('get', path, true);
            return new Promise(
                function(resolve, reject)
                {
                    request.onreadystatechange = function()
                    {
                        if(request.readyState === 4) {
                            if (request.status === 200) {
                                resolve(
                                    {
                                        headers: {
                                            "Content-Type": request.getResponseHeader("Content-Type") 
                                        },
                                        content: request.responseText
                                    }
                                );
                            } else {
                                if(path.indexOf(".js") === -1 && path.indexOf("package.json") === -1) {
                                    load(path + ".js", ajax).then(
                                        function(data)
                                        {
                                            data.path = path;
                                            resolve(data);
                                        }
                                    ).catch(
                                        throwError(reject, path, request)
                                    );
                                } else if(path.indexOf("index.js") === -1 && path.indexOf("package.json") === -1) {

                                    var temp = path.split(".");
                                    temp.pop();
                                    path = temp.join(".") + "/index.js";
                                    load(path, ajax).then(
                                        function(data)
                                        {
                                            data.path = path;
                                            resolve(data);
                                        }
                                    ).catch(
                                        throwError(reject, path, request)
                                    );
                                } else if(path.indexOf("package.json") === -1) {
                                    var temp = path.split("/");
                                    temp.pop();
                                    temp.push("package.json");
                                    path = temp.join("/");
                                    temp.pop();
                                    load(path, ajax).then(
                                        function(data)
                                        {
                                            var path = JSON.parse(data.content).main;
                                            temp.push(path);
                                            path = temp.join("/");
                                            load(path).then(
                                                function(data)
                                                {
                                                    data.path = path;
                                                    resolve(data);
                                                }
                                            );
                                        }
                                    ).catch(
                                        throwError(
                                            function(e)
                                            {
                                                console.error(e);
                                                resolve({headers: {"Content-Type": "application/javascript"}, content: "module.exports=null"})
                                            },
                                            path,
                                            request
                                        )
                                    );
                                } else {
                                    throwError(reject, path, request)();
                                }
                            }
                        }
                    }
                    request.send();
                }
            );
        }
        return load;
    }
);

