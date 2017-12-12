var ${exports} = function(cb)
{
    return cb(
        function()
        {
            return Promise.resolve(
                function(path)
                {
                    return Promise.resolve(require(path));
                }
            );
        }
    );
};

