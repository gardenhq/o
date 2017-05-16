#! /usr/bin/env node

const fs = require("fs");

const pwd = process.cwd();

const scripts = {
    "transport": "/src/transport/xhrNodeResolver.js",
    "parser": "/src/parser/evalSync.js",
    "registry": "/src/registry/memory.js"
};
var configurable = false;
if(process.argv[2] == "--configurable") {
    configurable = true;
}
Promise.all(
    Object.keys(
        scripts
    ).map(
        function(key)
        {
            return new Promise(
                function(resolve)
                {
                    fs.readFile(
                        pwd + scripts[key],
                        function(err, content)
                        {
                            resolve(`"${key}": function(){ ${ content.toString() } }`)
                        }
                    )
                }
            );
        }
    )
).then(
    function(scripts)
    {
        var s = `var scripts = {${scripts.join(",")}};Object.keys(scripts).forEach(function(key){scripts[key].callback = key;});`;
        if(!configurable) {
            return s += `return scripts[callbackName];`;
        } else {
            return s += `if(scripts[callbackName] != null) { return scripts[callbackName]; }`;
        }
    }
).then(
    function(scripts)
    {
        return new Promise(
            function(resolve, reject)
            {
                fs.readFile(
                    pwd + "/src/o.js",
                    function(err, content)
                    {
                        const temp = content.toString().split("/* scripts */");
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
).then(
    function(o)
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
).then(
    function(o)
    {
        console.log(o);
    }
)
