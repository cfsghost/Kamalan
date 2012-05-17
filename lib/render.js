
var Render = module.exports = function() {
};

Render.prototype.override = function(application, req, res) {
	var self = this;
	var app = application.getApp();

	// Override render()
	var _render = res.render;
	res.render = function() {
		var args = Array.prototype.slice.call(arguments);
		var clientScript;

		if (args.length > 1) {
			// Second parameter is string for specifying client script
			if (args[1] instanceof String) {
				// Remove this item
				args.splice(1);
			} else {
				clientScript = args[0];
			}

			// Add our callback function, to send client script after page rendering was completed.
			var index = args.length - 1;
			if (args[index] instanceof Function) {

				// Last parameter is callback function, we wrap it
				var fn = args[index];
				args[index] = function(err, str) {
					// TODO: Append client Script

					fn(err, str);
				};
			} else {
				args.push(function(err, str) {
					// TODO: Append client Script
					res.send(str);
					res.end();
				});
			}

		} else {
			clientScript = args[0];
		}

		// Call render() of Express
		_render.apply(res, args);
	}
};