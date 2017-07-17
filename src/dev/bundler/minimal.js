module.exports = function(minimal, rewriterFunctions, rewriterHash)
{
    return function(config)
    {
        var needsRewrite = config.includepath.indexOf("://") !== -1;
        return minimal.render(
            {
                rewriter: needsRewrite ? rewriterFunctions : "",
                getRewriter: needsRewrite ? 'var rewriter = getRewriter("' + config.includepath + '");' : '',
                hash: needsRewrite ? rewriterHash : '',
                addHash: needsRewrite ? ' + hash' : '',
                includepath: config.includepath,
                basepath: config.basepath
            }
        );
    }

}
