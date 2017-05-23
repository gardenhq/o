module.exports = function(babel)
{
    return function(content)
    {
        var code = babel.transform(content, { presets: ['es2015'] }).code;
        // console.log(code);
        return code;
    }
}
