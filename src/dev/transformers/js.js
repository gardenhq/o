module.exports = function(transformers)
{
    return function(path, data)
    {
        return transformers.reduce(
            function(prev, item, i, arr)
            {
                return prev.then(
                    function(content)
                    {
                        return item(content, path)
                    }
                );
            },
            Promise.resolve(data.content)
        ).then(
            function(content)
            {
                data.content = content + "//# sourceURL=" + path;
                return data;
            }
        );
    }
};
