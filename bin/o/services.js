module.exports = function(transport, parser, registry)
{
    return {
        "transport": transport || "src/transport/xhrNodeResolver.js",
        "parser": parser || "src/parser/evalSync.js",
        "registry": registry || "src/registry/memory.js"
    };
}
