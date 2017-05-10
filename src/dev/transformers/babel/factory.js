module.exports = function(babel, Plugin)
{
    return function(plugin)
    {
        plugin = typeof plugin === "function" ? plugin(babel) : plugin;
        var p = new Plugin(plugin);
        p.init("base", 0);
        return p;
    }
}
