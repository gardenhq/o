const o = require("./src/_o.js");
const createPromisedRequire = require("@gardenhq/willow/util/promised");
module.exports = function(cb)
{
    return new Promise(
        function(resolve, reject)
        {
            resolve(o(createPromisedRequire)(cb));
        }
    );
}

