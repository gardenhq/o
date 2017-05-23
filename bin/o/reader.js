module.exports = function(fs, pwd)
{
    return function(path, key)
    {
        return new Promise(
            function(resolve)
            {
                var version = "";
                var local = path.split("/").map(
                    function(part)
                    {
                        var pos = part.indexOf("@");
                        if(pos !== -1 && pos !== 0) {
                            var temp = part.split("@");
                            part = temp[0];
                            version = temp[1];
                        }
                        return part;
                    }
                ).join("/")
                return fs.readFile(
                    require.resolve(local),
                    function(err, content)
                    {
                        resolve(
                            {
                                callback: key,
                                path: local,
                                version: version,
                                content: content.toString()
                            }
                        )
                    }
                )
            }
        );

    }
    
}
