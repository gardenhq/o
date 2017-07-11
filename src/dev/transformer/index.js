module.exports = function(builder, loadable)
{
    return function(file, loader)
    {
                // var temp = data.url.split(".");
                // var actual = temp.pop();
                // var type = actual;
                //                 if(extension && actual != extension) {
                //                     temp.push(extension);
                //                     file.path = temp.join(".");
                //                 }
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
                var type = data.headers['Content-Type'].split("/").pop().split(";")[0];
                if(type === "plain") {
                    var temp = data.url.split(".");
                    type = temp.pop();

                }
                
                //IE doesn't like find, use reduce for now
                var extension = Object.keys(loadable).reduce(
                    function(prev, key)
                    {
                        if(loadable[key].indexOf(type) !== -1) {
                            return key;
                        }
                        return prev;
                    },
                    null
                );
                if(extension != null) {
                    var key = "system.loaders." + extension;
                    if(builder.has(key)) {
                        return builder.get(key).then(
                            function(transformer)
                            {
                                return transformer(data.url, data).then(
                                    function(data)
                                    {
                                        return data;
                                    }
                                );
                            }
                        );
                    }
                }
                return data;
            }
        );
    };

}
