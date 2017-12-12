(
    function(win, storage)
    {
        var getProxy = function(id)
        {
            return function(config)
            {
                return function(loader, factory, registry, config)
                {
                    return function(path)
                    {
                        var temp = path.split("#");
                        path = temp[0];
                        var qualifiedPath = id + path;
                        var item = storage.getItem(qualifiedPath);
                        if(item !== null) {
                            return Promise.resolve(JSON.parse(item));
                        }
                        var store = function(data)
                        {
                            storage.setItem(qualifiedPath, JSON.stringify(data));
                            return data;
                        }
                        return loader(path).then(
                            function(data)
                            {
                                // TODO: Mimetypes don't work like this anymore
                                var type = path.split(".").pop();
                                var mimetype = temp[1];
                                if(mimetype) {
                                    data.mimetype = mimetype;
                                    type = mimetype.split("/").pop();
                                    temp = type.split("+");
                                    if(temp[1]) {
                                        type = temp[1];
                                    }
                                } else {
                                    data.mimetype = "text/" + (type == "js" ? "javascript" : type);
                                }
                                return store(data);
                            }
                        );

                    };
                }
            }
        }
        proxy(
            getProxy("o+file://")
        );
    }
)(window, window.localStorage);
