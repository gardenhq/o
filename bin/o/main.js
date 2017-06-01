module.exports = function(services, combine, inject, register_o)
{
    return function()
    {
        return Promise.all(
            Object.values(services)
        ).then(
            combine
        ).then(
            inject
        ).then(
            register_o
        );
    }

}
