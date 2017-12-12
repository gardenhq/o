transport(
    function(config)
    {
        return function(path, ajax)
        {
            var request = new (ajax || XMLHttpRequest)();
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
                                reject(new Error("Unable to load " + path + " (" + request.status + ")"));
                            }
                        }
                    }
                    request.send();
                }
            );
        }
    }
);

