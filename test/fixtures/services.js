module.exports = function()
{
    return {
        "main": {
            "resolve": [
                "@klass",
                "@vue.core",
                "@template"
            ],
            "service": function(container, klass, vue, template)
            {
                return function()
                {
                    klass.method();
                    // document.write("<p>" + vue.version + "</p>");
                    var h1 = document.createElement("h1");
                    h1.textContent = vue.version;
                    document.body.appendChild(h1);
                    console.log(vue.version);
                    console.log(template);
                };
            }
        },
        "template": {
            "object": "./template.js#text/javascript+html"
        },
        "klass": {
            "class": "./class.js",
            "arguments": [
                "This is klass"
            ]
        },
        "vue.core": {
            "object": "https://unpkg.com/vuex@2.1.1/dist/vuex.min.js"
        }
    };
}
