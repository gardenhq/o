module.exports = function(transport, parser, registry, proxy)
{
    return {
        "transport": transport || "@gardenhq/o/src/transport/xhrNodeResolver.js",
        "parser": parser || "@gardenhq/o/src/parser/evalSync.js",
        "registry": registry || "@gardenhq/o/src/registry/memory.js",
        "proxy": proxy || "@gardenhq/o/src/proxy/noop.js"
    };
}
