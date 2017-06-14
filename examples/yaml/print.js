module.exports = function()/* document */
{
    return function(str)
    {
        if(typeof document !== "undefined") {
            var h1 = document.createElement("h1");
            h1.textContent = str;
            document.body.appendChild(h1);
        }
        console.log(str);
    }
}
