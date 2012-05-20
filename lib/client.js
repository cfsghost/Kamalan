var fs = require('fs');
var path = require('path');

var Client = module.exports = function(application) {
	var self = this;

	this.application = application;
	this.scriptTable = {};

	// Get file list of specific path
	var files = fs.readdirSync(application.app.settings.client);

	// Load script file
	for (var index in files) {
		var scriptName = path.basename(files[index], '.js');
		var scriptPath = path.join(application.app.settings.client, files[index]);
		var source = fs.readFileSync(scriptPath, 'utf8');

		this.scriptTable[scriptName] = source;
	}

	// Apply on application
	for (var scriptName in this.scriptTable) {

		// Using Express API to register route path
		application.app.all('/client/' + scriptName, function(req, res, next) {

			// Send client script to browser
			res.header('Content-Type', 'application/x-javascript');
			res.send(self.scriptTable[scriptName]);
			res.end();
		});
	}
};

