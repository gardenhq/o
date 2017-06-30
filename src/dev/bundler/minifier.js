module.exports = function(minifier, options)
{
    return function(code)
    {
        return minifier.minify(
            code,
            options
        ).code;
    }

}
