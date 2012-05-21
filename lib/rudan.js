var fs = require('fs');
var path = require('path');
var vm = require('vm');

var Rudan = module.exports = function(application) {
	var self = this;

	this.application = application;
	this.scriptTable = {};
	this.apiTable = {};

	// Get file list of specific path
	var files = fs.readdirSync(application.app.settings.rudan);

	// Load script file
	for (var index in files) {
		var scriptName = path.basename(files[index], '.js');
		var scriptPath = path.join(application.app.settings.rudan, files[index]);
		var source = fs.readFileSync(scriptPath, 'utf8');

		this.scriptTable[scriptName] = source;
	}

	// Apply on application
	for (var scriptName in this.scriptTable) {
		var script = vm.createScript(this.scriptTable[scriptName], scriptName);
		var sandbox = {};

		// Prepare sandbox
		try {
			script.runInNewContext(sandbox);
		} catch(err) {
			console.log(err.stack);

			throw Error();
		}

		// Fetch all APIs from sandbox
		for (var varName in sandbox) {

			this.apiTable[varName] = sandbox[varName];
		}
	}
};
