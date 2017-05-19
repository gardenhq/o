module.exports = function(fs, pwd)
{

    return function(o)
    {
        return new Promise(
            function(resolve, reject)
            {
                fs.readFile(
                    pwd + "/src/_o.js",
                    function(err, content)
                    {
                        // TODO: We can't use includepath here as we don't know what it will be, lets just namaespace for now
                        const _o = `registerDynamic("/@gardenhq/o/_o.js", [], true, function(module, exports, require){ return ${content.toString()}})`;
                        o = o.replace("/src/_o.js", "/@gardenhq/o/_o.js")
                        resolve(
                            o.split("/*_o*/").join(_o)
                        );
                    }
                )
            }
        );
    }
}
