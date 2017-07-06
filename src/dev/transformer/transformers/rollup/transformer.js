module.exports = function(rollup, file, plugins)
{
    // yet another hat tip to Andrea Giammarchi
    // https://github.com/WebReflection/import.js
    // to what extent should you include Copyrights for RegEx's?
    // Copyright 2017 Andrea Giammarchi - @WebReflection
    // https://github.com/WebReflection/import.js/blob/master/LICENSE.txt
    var re = /([`"'])(?:(?=(\\?))\2.)*?\1/g;
    var place = function ($0, $1) { return $1 + '$' + $1; };
    var hasImportExport = /^(?:export|import)\s/m;
    //
    return function(content, path)
    {
        // only rollup if we have import/export,
        // otherwise rollup will add __esModule to everything it seems?
        if(hasImportExport.test(content.replace(re, place))) {
            return rollup.rollup(
                {
                    entry: path,
                    plugins: [
                        file(
                            {
                                "path": path,
                                "contents": content
                            }
                        )
                    ].concat(plugins)
                }
            ).then(
                function(bundle)
                {
                    var res = bundle.generate(
                        {
                            format: "cjs",
                            sourceMapFile: path,
                            sourceMap: true,
                            exports: "named"
                        }
                    );
                    var data = "//# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(res.map); 
                    return res.code + data;
                }
            );

        } else {
            return content;
        }
    }
}
