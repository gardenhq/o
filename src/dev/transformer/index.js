module.exports = function(builder, loadable)
{
    return function(file, loader)
    {
        var temp = file.path.split(".");
        var actual = temp.pop();
        var type = actual;
        if(file.headers && file.headers['Content-Type']) {
            type = file.headers['Content-Type'].split("/").pop();
        }
        //IE doesn't like find, use reduce for now
        var extension = Object.keys(loadable).reduce(
            function(prev, key)
            {
                if(loadable[key].indexOf(type) !== -1) {
                    return key;
                }
                return prev;
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
