(
    function()
    {
        var tickControl = require("@gardenhq/tick-control");
        var TemplateLiteral = tickControl();
        var template = new TemplateLiteral("Hello World");
        console.log(template.render());
    }
)();
