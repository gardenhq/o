module.exports = function(commands, env, File, bindings, flash)
{
    return function(bundle, clearCache)
    {
        flash();
        commands.dirty = function(file)
        {
            file = file == "*" ? null : file;
            clearCache(file).then(function(reload){reload()});  
        };
        commands.bundle = function(name)
        {
            bundle(null, null, true).then(
                function(bundle)
                {
                    var blob = new Blob(
                        [bundle],
                        {type: "text/javascript;charset=utf-8"}
                    );
                    File.saveAs(blob, name || env("O_DEV_BUNDLER_FILENAME"));
                }
            );   
        };
        console.info("Type `bundle()` to bundle. Type `dirty()` or 'command-r' to clear the entire cache.");
        bindings.bind(
            [
                'command+r',
                'ctrl+r'
            ],
            function()
            {
                commands.dirty(env("O_DEV_BUNDLER_FILENAME"));
            }
        );
        return commands;
    }

}
