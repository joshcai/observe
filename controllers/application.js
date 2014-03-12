var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');

exports.index = function(req, res){
	var query = Activity.find()
							.sort({'start': -1})
							.limit(10)
	query.exec(function(err, acts){
		if(err) return res.json(500);
		acts.reverse();
		var current;
		if(acts[acts.length-1].stop)
		{
			current = null;
			if(acts.length == 10)
			{
				acts = acts.slice(1);
			}
		}
		else
		{
			current = acts[acts.length-1];
			acts = acts.slice(0, acts.length-1);
		}
		res.render('index', {acts: acts, login: req.session.login, current: current})
	})


};

//user functions

exports.logout = function(req, res){
	req.session.login = false;
	res.redirect('/')
}

exports.login = function(req, res){
  res.render('login');
};

exports.doLogin = function(req, res){
	if(req.body.password == 'testpass')
	{
		req.session.login = true;
	}
	res.redirect('/')
};



exports.newAct = function(req, res){
	if(req.session.login)
	{
		var query = Activity.findOne()
							.sort({'start': -1})
		query.exec(function(err, activity){
			if(err){res.send(500);}
			if(!activity.stop)
			{
				activity.stop = Date.now();
				activity.save(function(err){
					var act = new Activity(req.body);
					act.save(function(err){
						if(err) {res.send(500);}
						return res.redirect('/');
					})
				})
			}
			else
			{
				var act = new Activity(req.body);
				act.save(function(err){
					if(err) {res.send(500);}
					return res.redirect('/');
				})
			}
		})

	}
	else
	{
		res.redirect('/');
	}

}

exports.stop = function(req, res){
	var query = Activity.findOne()
							.sort({'start': -1})
		query.exec(function(err, activity){
			if(err){res.send(500);}
			if(!activity.stop)
			{
				activity.stop = Date.now();
				activity.save(function(err){
						return res.redirect('/');
					})
			}
			else
			{
				res.redirect('/');
			}
		})
}