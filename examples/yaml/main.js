module.exports = function(helloWorld, print)
{
    return function()
    {
        print(helloWorld);
    }
}
