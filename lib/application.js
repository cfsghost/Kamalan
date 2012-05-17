var Route = require('./route');
var Render = require('./render');
var Rudan = require('./rudan');
var Client = require('./client');

var Application = module.exports = function(kamalan) {
	var self = this;

	this.kamalan = kamalan;
	this.route = null;
	this.render = new Render;
	this.rudan = new Rudan(self);
	this.client = new Client(self);

	// Override server object of express
	this.app = kamalan.super.createServer.apply(kamalan, []);

	// Override set()
	var _set = this.app.set;
	this.app.set = function(setting, val) {

		// super
		var ret = _set.apply(self.app, Array.prototype.slice.call(arguments));

		// Handle Kamalan own settings
		if (setting == 'route') {
			self.route = new Route(self);
		}

		return ret;
	};
};

Application.prototype.getApp = function() {

	return this.app;
};
