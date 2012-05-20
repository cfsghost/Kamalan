var Application = require('./application');

var Kamalan = function() {
	var self = this;

	// Kamalan Objects
	this.applications = [];

	// Wrapper of express
	this.super = require('express');

	// Clone prototype
	for (var key in self.super.prototype) {
		if (key in Kamalan.prototype)
			continue;

		self.prototype[key] = self.super.prototype[key];
	}

	// Clone and override normal member
	for (var key in self.super) {

		// Using prototype by kamalan first
		if (key in Kamalan.prototype) {

			self[key] = Kamalan.prototype[key];

			continue;
		}

		// Member has Getter/Setter
		var desc = Object.getOwnPropertyDescriptor(self.super, key);

		if (desc.get || desc.set) {

			// It has getter
			if (desc.get) {
				self.__defineGetter__(key, self.super.__lookupGetter__(key));
			}

			// It has setter
			if (desc.set) {
				self.__defineSetter__(key, self.super.__lookupSetter__(key));
			}

			continue;
		}

		// Member is a function
		if (self.super[key] instanceof Function) {

			self[key] = function() {
				return self.super[key].apply(this.super, Array.prototype.slice.call(arguments));
			};

			continue;
		}

		// Normal Member
		self[key] = self.super[key];
	}

};

Kamalan.prototype.createServer = function() {
	// Create a new application
	var application = new Application(this);

	this.applications.push(application);

	return application.app;
};

Kamalan.prototype.version = "0.0.1";

// return kamalan module.
module.exports = Kamalan;
