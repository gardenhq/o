module.exports = function(storage, reload, flash, prefix)
{
    var getFilter = function(id)
    {
        if(prefix == "*") {
            return function(key)
            {
                // flash.add(key + "=" + id)
                return key.indexOf(id) !== -1;
            }
        } else {
            return function(key)
            {
                return key.indexOf(id) === 0;
            }
        }
        
    }
    return function(id)
    {
        id = id || "";
        id = "file://" + id;
        // id = "file://";
        return Promise.all(
            Object.keys(storage).filter(
                getFilter(id)
            ).map(
                function(item, i, arr)
                {
                    storage.removeItem(item);
                    return item;
                }
            )
        ).then(
            function(items)
            {
                items.forEach(
                    function(item)
                    {
                        // flash.add("Cache cleared for " + item);
                    }
                );
                flash.add("Cleared entire cache.")
                return reload;
            }
        );
    }
}
