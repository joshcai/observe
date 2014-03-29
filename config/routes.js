var routes = require('../controllers/application');

module.exports = function(app, passport){

	// app.param('', user.user)

	app.get('/', routes.index);
	app.get('/info', routes.info);
	app.get('/login', routes.login);
	app.get('/logout', routes.logout);
	app.post('/login', routes.doLogin);


	//gets activity specific page
	app.get('/a/:id', routes.getAct);
	app.post('/a/:id', routes.postAct);

	//find activity based on desc
	app.get('/search/d/:desc', routes.searchDesc);

	//find activity based on date
	app.get('/search/t/:time', routes.searchTime);

	app.post('/new', routes.newAct);
	app.get('/stop', routes.stop);
}
