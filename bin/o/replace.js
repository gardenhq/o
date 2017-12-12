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
                        const _o = `registerDynamic(resolve(base + "/_o.js"), [], true, function(module){ return ${content.toString()}})`;
                        resolve(
                            o.split("/*_o*/").join(_o)
                        );
                    }
                )
            }
        );
    }
}
