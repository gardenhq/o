module.exports = function(load)
{
    // yey or nay?
    window.process = {
        env: {
            // NODE_ENV: "production"
        },
        argv: ""
    };
    return load.then(
        function(System)
        {
            var config = System.getConfig();
            var entry = config.hash;
            if(!config.basepath) {
                System.config(
                    {
                        baseURL: entry
                    }
                );
            }
            return System.import(entry);
        }
    ).catch(
        function(e)
        {
            throw e;
        }
    );
};
