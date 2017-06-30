const getRunner = require("@gardenhq/willow/util/runnerFactory.js");
// don't need this in node but makes for a better api for < ES6, consider with
const destructure = require("@gardenhq/willow/util/destructure.js");
module.exports = function(cb)
{
    return require("./builder.js")(cb).then(
        function(builder)
        {
            return getRunner(
                builder,
                destructure      
            );
        }
    )
}
