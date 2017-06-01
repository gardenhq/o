module.exports = function(React, ReactDOM)
{
    return function()
    {
		var $root = document.createElement("div");
		document.body.appendChild($root);
		ReactDOM.render(
			React.DOM.h1(
				null,
				"Hello World!"
			),
			$root 
		)
    }
}
