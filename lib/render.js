
var Render = module.exports = function(application) {
	var self = this;

	this.application = application;
};

Render.prototype.override = function(req, res) {

	// Override render()
	if (this.application.client) {
		var _render = res.render;
		res.render = function() {
			var args = Array.prototype.slice.call(arguments);
			var clientScript;

			// Add our callback function, to send client script after page rendering was completed.
			var index = args.length - 1;
			var fn = null;
			if (args[index] instanceof Function) {

				// Last parameter is callback function, we wrap it
				fn = args[index];
			} else {

				index++;
			}

			// Second parameter is string for specifying client script
			if (args[1] instanceof String) {
				clientScript = args[1];

				// Remove this item
				args.splice(1);

			} else {

				// Using first parameter to be client script name
				clientScript = args[0];
			}

			// Handler to send client script
			args[index] = function(err, str) {
				if (fn)
					fn(err, str);
				else
					res.write(str);

				// Append client Script
				res.write('<script type=\'text/javascript\' src=\'/client/' + clientScript + '\'></script>');
				res.end();
			};

			// Call render() of Express
			_render.apply(res, args);
		}
	}
};
