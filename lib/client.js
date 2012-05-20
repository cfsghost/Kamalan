var fs = require('fs');
var path = require('path');

var Client = module.exports = function(application) {
	var self = this;

	this.application = application;
	this.runtimeSource = null;
	this.scriptTable = {};

	function runtimeInit() {
		var runtimeStack = [];
		var runtimePath = path.join(__dirname, 'runtime');

		/* Scan directories */
		var files = fs.readdirSync(runtimePath);

		/* Load files */
		for (var index in files) {
			var filePath = path.join(runtimePath, files[index]);

			runtimeStack.push(fs.readFileSync(filePath, 'utf8'));
		}

		self.runtimeSource = runtimeStack.join('');

		// Client can get runtime engine from URL path
		self.application.app.all('/client', function(req, res, next) {

			// Send client script to browser
			res.header('Content-Type', 'application/x-javascript');
			res.send(self.runtimeSource);
			res.end();
		});
	}

	// Initializing runtime script
	runtimeInit();

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

