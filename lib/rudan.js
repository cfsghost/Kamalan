var fs = require('fs');
var path = require('path');
var vm = require('vm');
var uglifyJS = require('uglify-js');

var Rudan = module.exports = function(application) {
	var self = this;

	this.application = application;
	this.apiTable = {};
	this.syntaxTree = {};

	// Get file list of specific path
	var files = fs.readdirSync(application.app.settings.rudan);

	// Load script files
	for (var index in files) {
		var scriptPath = path.join(application.app.settings.rudan, files[index]);

		this.loadScriptFileSync(scriptPath);
	}
};

Rudan.prototype.loadScriptFileSync = function(scriptPath) {
	var scriptName = path.basename(scriptPath, '.js');
	var source = fs.readFileSync(scriptPath, 'utf8');

	// Prepare sandbox
	var script = vm.createScript(source, scriptName);
	var sandbox = {};

	try {
		script.runInNewContext(sandbox);
	} catch(err) {
		console.log(err.stack);

		throw Error();
	}

	// Fetch all APIs from sandbox
	for (var varName in sandbox) {
		var object = sandbox[varName];

		this.apiTable[varName] = object;
	}

	// parse AST
	var ast = uglifyJS.parser.parse(source);
	var apiObject = ast[1];

	for (var index in apiObject) {
		var syntaxNode = this.getSyntaxNode(apiObject[index]);
		if (syntaxNode) {
			this.syntaxTree[syntaxNode.name] = syntaxNode.node;
		}
	}
};

Rudan.prototype.getSyntaxNode = function(astNode) {
	var self = this;
	var varNode = {};
	var varName = null;
	var varType = null;

	function TraverseFuncObject(astNodeList) {
		for (var index in astNodeList) {
			var node = astNodeList[index];
			var memberName = null;
			var memberNode = null;

			// Found 'this' keyword to assign member to this function, so we consider it is a class
			if (node[0] == 'stat') {
				if (node[1][0] == 'assign') {
					varNode.t = (varNode.t == 'i') ? 'i' : 'c';

					memberName = node[1][2][2];
					memberNode = self.getSyntaxNode(node);
					if (!memberNode)
						continue;

					if (!('s' in varNode))
						varNode.s = {};

					varNode.s[memberNode.name] = memberNode.node;
				}
			}
		}
	}

	function parseInstance() {
		// TODO: complete instance from real object
	}

	function parseObject(object) {

		if (varType == 'new') {
			// Function Object
			if (object[1][0] == 'name') {
				// Instance and it needs to get reference to complete
				varNode.t = 'i';

				parseInstance();
			} else {
				// Instance will be converted to object
				varNode.t = 'o';

				TraverseFuncObject(object[1][3]);
			}

		} else if (varType == 'function') {
			// Function, Class
			varNode.t = 'f';

			TraverseFuncObject(object[3]);

		} else if (varType == 'object') {
			// Object
			varNode.t = 'o';
		} else if (varType == 'array') {
			// Array
			varNode.t = 'a';
		} else {
			// Normal Variable
			varNode.t = 'v';
		}
	}

	if (astNode[0] == 'var') {
		varName = astNode[1][0][0];
		varType = astNode[1][0][1][0];

		parseObject(astNode[1][0][1]);
	} else if (astNode[0] == 'defun') {
		varName = astNode[1];
		varType = 'function';

		parseObject(astNode);

	} else if (astNode[0] == 'stat') {

		// Special case
		if (astNode[1][0] == 'assign') {
			if (astNode[1][2][0] == 'dot') {
				varName = astNode[1][2][2];
				varType = astNode[1][3][0];

				parseObject(astNode[1][3]);

				return {
					name: varName,
					node: varNode
				};
			}
		}

		return null

	} else {
		return null;
	}

	return {
		name: varName,
		node: varNode
	};
};
/*
Rudan.prototype.getSyntax = function(object) {

	if (typeof(object) == 'function') {
		// Function
		return 'f';
	} else if (object instanceof Array) {
		// Array
		return 'a';
	} else if (object instanceof Object) {
		// Object
		return 'o';
	} else {
		if (object.prototype === undefined) {
			// Instance
			return 'i';
		} else {
			// Normal variable
			return 'v';
		}
	}
};
*/
Rudan.prototype.traverseSyntax = function(syntaxNode, object) {

	syntaxNode.t = this.getSyntax(object);

	// Sub nodes
	if (syntaxNode.t != 'v') {

		syntaxNode.s = {};

		// We need to create an instance to check all members of it
		if (syntaxNode.t == 'f') {
			var dummyInstance = new object;

			for (var member in dummyInstance) {
				syntaxNode.s[member] = {}

				this.traverseSyntax(syntaxNode.s[member], dummyInstance[member]);

				console.log(member, syntaxNode.s[member]);
			}
		} else {

			for (var member in object) {
				syntaxNode.s[member] = {}

				this.traverseSyntax(syntaxNode.s[member], object[member]);

				console.log(member, syntaxNode.s[member]);
			}
		}
	}
};
