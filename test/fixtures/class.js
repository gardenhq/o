var print = function(arg)
{
    if(typeof document !== "undefined") {
        var h1 = document.createElement("h1");
        h1.textContent = arg;
        document.body.appendChild(h1);
    }
    
}
var Klass = module.exports = function Klass(arg)
{
    console.log(arg);
    print(arg);
};
Klass.prototype.method = function()
{
    var txt = "This is klasses method";

    console.log(txt);
    print(txt);
}
