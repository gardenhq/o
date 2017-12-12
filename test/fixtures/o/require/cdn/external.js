(
	function(load)
	{
        window.process = {
            env: {
                // NODE_ENV: "production"
            },
            argv: ""
        };
		load.then(
			function(_import)
			{
				Promise.all(
					[
					    "react/react.js#@15.5.4",
					    "react-dom/index.js#@15.5.4"
					].map(
					    function(item)
					    {
                            return _import(item);
					    }
					)
				).then(
					function(modules)
					{
						var $root = document.createElement("div");
						document.body.appendChild($root);
						var React = modules[0];
						var ReactDOM = modules[1];
						ReactDOM.render(
							React.DOM.h1(
							    null,
							    "Hello World!"
							),
							$root 
						)
					}
				);

			}
		).catch(
			function(e)
			{
				throw e;
			}
		);
	}
)(o(function(o){return o(document)}))

