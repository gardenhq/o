const o = require("./src/_o.js");
const createPromised = require("@gardenhq/willow/util/promised");
const promisedRequire = createPromised(require);
module.exports = function(cb)
{
    return Promise.all(
        [
            "@gardenhq/willow/util/promisedYaml",
            "js-yaml"
        ].map(
            function(item)
            {
                return promisedRequire(item);
            }
        )
    ).then(
        function(modules)
        {
            const createYamlableRequire = modules[0];
            const yaml = modules[1];
            return o(
                createYamlableRequire(
                    createPromised,
                    function(path, str)
                    {
                        return yaml.load(
                            str,
                            {
                                filename: path,
                                schema: yaml.CORE_SCHEMA
                            }
                        );
                    }

                )
            )(cb);
        }
    );
}

