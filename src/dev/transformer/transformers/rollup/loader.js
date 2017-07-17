module.exports = function(load, resolve, babel)
{
    return {
        name: "o.dev",
        load: function(path)
        {
            return load(path).then(
                function(data)
                {
                    // return data.content;
                    return babel(data.content, path);
                }
            );
        },
        resolveId: function(importee, importer)
        {
            return resolve(importee, importer.split("/").slice(0, -1).join("/") || ".")
        }
    };
}
