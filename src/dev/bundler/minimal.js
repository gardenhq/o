module.exports = function(minimal, rewriterFunctions, rewriterHash)
{
    return function(config)
    {
        var needsRewrite = config.includepath.indexOf("://") !== -1;
        return minimal.render(
            {
                rewriter: needsRewrite ? rewriterFunctions : "",
                getRewriter: needsRewrite ? 'var rewriter = getRewriter(includePath);' : '',
                hash: needsRewrite ? rewriterHash : '',
                addHash: needsRewrite ? ' + hash' : ''
            }
        );
    }

}
