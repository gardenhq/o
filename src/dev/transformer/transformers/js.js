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
                if(content.indexOf("//# source") === -1) {
                    content += "//# sourceURL=" + path; 
                }
                // data.source = data.content;
                data.content = content;
                data.headers['Content-Type'] = "application/javascript";
                return data;
            }
        );
    }
};
