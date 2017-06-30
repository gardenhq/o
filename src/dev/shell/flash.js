module.exports = function(storage, prefix)
{
    prefix = prefix || "o+flash://";
    var flash = function()
    {
        Object.keys(storage).forEach(
            function(key)
            {
                if(key.indexOf(prefix) === 0) {
                    var item = JSON.parse(storage.getItem(key));
                    console.debug(item.content);
                    storage.removeItem(key);
                }
            }
        );

    }
    flash.add = function(message)
    {
        var item = {
            content: message
        };
        var unique = Date.now() + Math.random();
        storage.setItem(prefix + unique, JSON.stringify(item));
    }
    return flash;
}
