module.exports = function(fs, pwd, configurable)
{
    return function(scripts)
    {
        return new Promise(
            function(resolve, reject)
            {
                fs.readFile(
                    pwd + "/src/o.js",
                    function(err, content)
                    {
                        var temp = content.toString().split("/* test */");
                        temp.splice(1, 1)
                        content = temp.join("");
                        temp = content.split("/* scripts */");
                        if(!configurable) {
                            // if I'm not configurable, then get rid of the script function entirely
                            temp[1] = scripts;
                        } else {
                            // if I am configurable, keep the ability to get options of the data- vars
                            temp.splice(1, 0, scripts);
                        }
                        resolve(temp.join("/* scripts */"));
                    }
                )

            }
        );
    }
}
