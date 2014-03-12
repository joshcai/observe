var routes = require('../controllers/application');

module.exports = function(app, passport){

	// app.param('', user.user)

	app.get('/', routes.index);
	app.get('/login', routes.login);
	app.get('/logout', routes.logout);
	app.post('/login', routes.doLogin);

	app.post('/new', routes.newAct);
	app.get('/stop', routes.stop);
}
