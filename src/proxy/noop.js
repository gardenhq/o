proxy(
    function(scriptPath)
    {
        return function(transport)
        {
            return transport;
        }
    }
);
