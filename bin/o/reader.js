module.exports = function(fs, pwd)
{
    return function(path, key)
    {
        return new Promise(
            function(resolve)
            {
                return fs.readFile(
                    pwd + "/" + path,
                    function(err, content)
                    {
                        resolve(`"${key}": function(){ ${ content.toString() } }`)
                    }
                )
            }
        );

    }
    
}
