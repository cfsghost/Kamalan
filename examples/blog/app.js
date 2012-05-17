var kamalan = require('../../index');
var port = 57788;

var app = kamalan.createServer();

app.configure(function() {
	app.set('views', __dirname + '/render');
	app.set('route', __dirname + '/route');
	app.set('client', __dirname + '/client');
	app.set('rudan', __dirname + '/rudan');
	app.set('view engine', 'jade');
});

app.listen(port);
