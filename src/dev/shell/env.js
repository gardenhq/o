module.exports = function(prefix, win)
{
    prefix = prefix || "o+env://";
    return function(key, defaultValue)
    {
        key = prefix + key;
        return typeof win.localStorage[key] !== "undefined" ? win.localStorage[key] : defaultValue;
    }
}

