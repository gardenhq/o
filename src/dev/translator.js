module.exports = function(builder)
{
    return function(file, loader)
    {
        var temp = file.path.split(".");
        var actual = temp.pop();
        var type = actual;
        if(file.headers && file.headers['Content-Type']) {
            type = file.headers['Content-Type'].split("/").pop();
        }
        var loadable = {
            "js": ["javascript", "json"],
            "css": ["css"],
            "html": ["html"],
            "yaml": ["yaml", "yml"]
        };
        var extension = Object.keys(
            loadable
        ).find(
            function(key)
            {
                return loadable[key].indexOf(type) !== -1;
            }
        );
        if(extension != null) {
            var key = "system.loaders." + extension;
            if(builder.has(key)) {
                return builder.get(key).then(
                    function(transformer)
                    {
                        if(actual != extension) {
                            temp.push(extension);
                            file.path = temp.join(".");
                        }
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
                                return transformer(file.path, data).then(
                                    function(data)
                                    {
                                        return data;
                                    }
                                );

                            }
                        );
                    }
                );
            }
        }
        return loader(file.path);
    };

}
