
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

		// Add our callback function, to send client script after page rendering was completed.
		var index = args.length - 1;
		if (args[index] instanceof Function) {

			// Last parameter is callback function, we wrap it
			var fn = args[index];
			args[index] = function(err, str) {
				// TODO: Append client Script
//				res.send('<script type=\'text/javascript\' src=\'/rudan\'></script>');
				fn(err, str);

				res.write('<script>');
				res.write('</script>');
				res.end();
			};
		} else {
			args.push(function(err, str) {
				// TODO: Append client Script
				res.write(str);
				res.write('<script>');
				res.write('</script>');

				res.end();
			});
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

		// Call render() of Express
		_render.apply(res, args);
	}
};
