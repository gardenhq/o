var appendVersionToPackageNameRewriter = function(includePath, rewriter)
{
    return function(path, headers)
    {
        var hash = "";
        // this is unpkg specific
        if(headers["X-Content-Version"] != null) {
            var parts = path.split("/");
            var index = 0;
            // check to make sure it doen't already have one
            if(parts[index].indexOf("@") === 0) {
                index = 1;
            }
            parts[index] += "@" + headers['X-Content-Version'];
            path = parts.join("/");
        }
        return rewriter(path, headers);
    }
}
var getRewriter = function(includePath)
{
    var rewriter = defaultRewriter(includePath);
    if(includePath.indexOf("://") !== -1) {
        return appendVersionToPackageNameRewriter(includePath, rewriter);
    } else {
        return rewriter;
    }
}
var defaultRewriter = function()
{
    return function(path, headers)
    {
        return {
            path: path,
            hash: Object.keys(headers).length > 0 ? "#" + JSON.stringify(headers) : ""
        };
    }
}
var normalizeHash = function(path, rewriter)
{
    var temp = path.split("#");
    path = temp[0];
    var hash = temp[1] || "";
    if(hash) {
        var headers = {};
        if(hash.indexOf("{") === 0) {
            headers = JSON.parse(hash);
        } else if(hash.indexOf("@") === 0) {
            headers["X-Content-Version"] = hash.substr(1);
            // TODO: rethink? 
        } else if(hash.indexOf(".") !== 0 && hash.indexOf("/") > 0) {
            headers['Content-Type'] = hash;
        }
        if(Object.keys(headers).length > 0) {
            return rewriter(path, headers)
        }
        hash = "#" + hash;
    }
    return {
        path: path,
        hash: hash
    };
}

