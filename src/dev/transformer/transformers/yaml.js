module.exports = function(yaml, transformers)
{
    return function(path, data)
    {
        return new Promise(
            function(resolve, reject)
            {
                data.content = yaml.load(
                    data.content,
                    {
                        filename: path,
                        schema: yaml.CORE_SCHEMA
                    }
                );
                resolve(data);

            }
        );
    }
};
