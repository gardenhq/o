module.exports = function(lib)
{
    var src = Object.keys(lib).map(
        function(key)
        {
            return lib[key];
        }
    ).reduce(
        function(prev, item)
        {
            return prev + "\n" + item;
        },
        ""
    );
    var UglifyJS = exports = {};
    eval(src);
    // new Function(
    //     "MOZ_SourceMap",
    //     "exports",
    //     src
    // )({}, UglifyJS);
    return UglifyJS;
}
