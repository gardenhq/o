module.exports = function(component, toolbar, exportEnv, doc)
{
    return function(commands)
    {
        try {
            component(toolbar, "toolbar");
            var $toolbar = doc.createElement("x-toolbar")
            doc.body.appendChild($toolbar);
            $toolbar.addEventListener("filewatcher", exportEnv("O_DEV_RELOADER_URL"));
            $toolbar.addEventListener("bundle", exportEnv("O_DEV_BUNDLER_FILENAME"));
            $toolbar.addEventListener("invalidate", exportEnv("O_DEV_INVALIDATOR_FILES"));
            $toolbar.addEventListener(
                "clear",
                function(e)
                {
                    commands.dirty();
                }
            );
            $toolbar.addEventListener(
                "build",
                function(e)
                {
                    commands.bundle();
                }
            );

        } catch(e) {
            console.error("Unable to load toolbar");
            // console.error(e);
        }
        
    }
}
