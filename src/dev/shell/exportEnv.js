module.exports = function(prefix, win)
{
    prefix = prefix || "o+env://";
    return function(key)
    {
        //TODO: this isn't stricly cli
        return function(e)
        {
            var value = e.detail.callback.bind(e.target);
            var val = value(e.detail.event);
            win.localStorage.setItem(prefix + key, val);
        }
    }

}
