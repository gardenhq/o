module.exports = function(builder)
{
    // TODO: Refactor this out once the bugfix has gone up, too much repetition
    var loadable = {
        "js": ["javascript", "json", "js"], // why wasn't this here yonks ago?
        "css": ["css"],
        "html": ["html"],
        "yaml": ["yaml", "yml"]
    };
    return function(file, loader)
    {
        var temp = file.path.split(".");
        var actual = temp.pop();
        var type = actual;
        if(file.headers && file.headers['Content-Type']) {
            type = file.headers['Content-Type'].split("/").pop();
        }
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
                        if(extension && actual != extension) {
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
    };

}
