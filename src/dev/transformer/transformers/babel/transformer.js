module.exports = function(babel, presets, plugins)
{
    return function(content, path)
    {
        var options = {
            presets: presets,
            plugins: plugins,
            sourceMaps: "inline",
            sourceFileName: path        
        };
        // var SOURCEMAPPING_URL = 'sourceMa';
        // SOURCEMAPPING_URL += 'ppingURL';
        // var SOURCEMAPPING_URL_RE = new RegExp("#\\s+" + SOURCEMAPPING_URL + "=data:application\/json;charset=utf-8;base64,(.+)\\n?");
        // var match = content.match(
        //     SOURCEMAPPING_URL_RE
        // );
        // if(match) {
        //     options.inputSourceMap = JSON.parse(atob(match[1]));
        //     console.log(options.inputSourceMap);
        // }
        return babel.transform(
            content,
            options
        ).code;
    }
}
