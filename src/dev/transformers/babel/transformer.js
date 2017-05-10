module.exports = function(pipeline, plugins)
{
    if(plugins.length == 0) {
        return function(content)
        {
            return content;
        }
    }
    return function(content)
    {
        var code = pipeline.transform(
            content,
            {
                plugins: plugins
            }
        ).code;
        return code;
    }
}
