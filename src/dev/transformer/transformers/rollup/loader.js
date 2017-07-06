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
        resolveId: resolve
    };
}
