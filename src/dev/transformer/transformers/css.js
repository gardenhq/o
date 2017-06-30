module.exports = function()
{
    return function(path, data)
    {
        data.content += "/*# sourceURL=" + path + " */";
        return Promise.resolve(data);
    }
};
