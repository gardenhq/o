module.exports = function(babel, presets, plugins)
{
    return function(content, path)
    {
        var res = babel.transform(content, { presets: presets, plugins: plugins, sourceMaps: "inline", sourceFileName: path });//.code;
        // console.log(res);
        return res.code;
    }
}
