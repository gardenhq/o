module.exports = function(babel, presets, plugins)
{
    return function(content)
    {
        return babel.transform(content, { presets: presets, plugins: plugins }).code;
    }
}
