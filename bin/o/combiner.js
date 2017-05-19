module.exports = function(configurable)
{
    return function(scripts)
    {
        var s = `var scripts = {${scripts.join(",")}};Object.keys(scripts).forEach(function(key){scripts[key].callback = key;});`;
        if(!configurable) {
            return s += `return scripts[callbackName];`;
        } else {
            return s += `if(scripts[callbackName] != null) { return scripts[callbackName]; }`;
        }
    }

}
