var fs = require('fs');
var path = require('path');

var Route = module.exports = function(application) {
	var self = this;

	this.application = application;
	this.routes = {};

	// Get file list of specific path
	var files = fs.readdirSync(application.getApp().settings.route);

	// Load route files
	for (var index in files) {
		var routeTable = require(path.join(application.getApp().settings.route, files[index]));

		// Append route path
		for (var routePath in routeTable) {
			this.routes[routePath] = routeTable[routePath];
		}
	}

	// Apply on application
	for (var routePath in this.routes) {

		// Using Express API to register route path
		application.getApp().all(routePath, function(req, res, next) {

			// Add application to be first parameter
			var args = Array.prototype.slice.call(arguments);
			args.splice(0, 0, application);

			// Override request and response variable
			application.render.override.apply(application.render, args);

			self.routes[routePath].apply(application, args);
		});
	}
};