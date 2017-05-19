            var React = require("react");
            var ReactDOM = require("react-dom");
(
    function(require)
    {
        try {

            var $root = document.createElement("div");
            document.body.appendChild($root);
            ReactDOM.render(
                React.DOM.h1(
                    null,
                    "Hello World!"
                ),
                $root 
            )
        } catch(e) {
            console.error(e);
        }
    }
)(require);
