var Route = require('./route');
var Render = require('./render');
var Rudan = require('./rudan');
var Client = require('./client');

var Application = module.exports = function(kamalan) {
	var self = this;

	this.kamalan = kamalan;
	this.route = null;
	this.render = null;
	this.rudan = new Rudan(self);
	this.client = null;

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
		} else if (setting == 'render') {
			self.render = new Render(self);
		} else if (setting == 'client') {
			self.client = new Client(self);
		}

		return ret;
	};
};
