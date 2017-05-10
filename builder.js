const b = require("./src/b");
const o = require("./index.js");
module.exports = function(cb)
{
    return b(o(cb));
}
// module.exports = require("./src/b");
