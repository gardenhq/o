module.exports = function(babel, presets, plugins)
{
    return function(content)
    {
        content = "module.exports = function(React){ return function(" + argNames.join(",") + "){ return " + content + ";}}";
        return babel.transform(content, { presets: presets, plugins: plugins }).code;
    }
}
