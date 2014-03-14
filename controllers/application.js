var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');

var pretty_time = function(date_string){
	var temp = '';
	var date = new Date(date_string);
	console.log(date);
	if(date.getHours() > 12)
	{
		temp+=(date.getHours()-12)+":";
	}
	else
	{
		if(date.getHours() == 0)
		{
			temp+="12:";
		}
		else
		{
			temp+=date.getHours()+":";
		}
	}

	if(date.getMinutes() < 10)
	{
		temp+= "0" + date.getMinutes();
	}
	else
	{
		temp+= date.getMinutes();
	}
	if(date.getHours() > 11)
		temp+= "PM";
	else
		temp+= "AM";
	return temp;
}

exports.index = function(req, res){
	res.render('index', {login: req.session.login});
};

exports.info = function(req, res){
	var query = Activity.find()
							.sort({'start': -1})
							.limit(10)
	query.exec(function(err, acts){
		if(err) return res.send(500);
		acts.reverse();
		var current;
		if(acts.length > 0)
		{
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
		}
		for(var i = 0; i < acts.length; i ++)
		{
			acts[i].start = pretty_time(acts[i].start);
			acts[i].stop = pretty_time(acts[i].stop);
		}

		res.json({acts: acts, current: current});
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
			if(activity && !activity.stop)
			{
				activity.stop = Date.now();
				activity.save(function(err){
					var act = new Activity(req.body);
					act.save(function(err){
						if(err) {res.send(500);}
						return res.send(200);
					})
				})
			}
			else
			{
				var act = new Activity(req.body);
				act.save(function(err){
					if(err) {res.send(500);}
					return res.send(200);
				})
			}
		})

	}
	else
	{
		res.send(500);
	}

}

exports.stop = function(req, res){
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
						return res.send(200);
					})
			}
			else
			{
				res.send(200);
			}
		})
	}
	else
	{
		res.send(500);
	}
}