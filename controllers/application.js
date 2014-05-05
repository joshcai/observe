var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');
var config = require('../config/config');


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
	console.log(config.password);
	if(req.body.password == config.password)
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

exports.getAct = function(req, res){
	Activity.findOne({'_id': req.params.id}, function(err, act){
		if(err){res.send(500);}
		res.render('act', {act: act, login: req.session.login});
	})
}

function get_new_date(old, hour, min)
{
	var d = new Date(old.getFullYear(), old.getMonth(), old.getDate(), hour, min);
	return d;
}

exports.postAct = function(req, res){
	Activity.findOne({'_id': req.params.id}, function(err, act){
		if(err){res.send(500);}
		act.desc = req.body.desc;
		act.start = get_new_date(act.start, req.body.start_hour, req.body.start_min);
		act.stop = get_new_date(act.stop, req.body.stop_hour, req.body.stop_min);
		act.save();
		res.redirect('/');
	})
}

exports.searchDesc = function(req, res){
	var query = Activity.find({'desc': new RegExp(req.params.desc, "i")})
							.sort({'start': -1})
	query.exec(function(err, acts){
		if(err) return res.send(500);
		var total = 0;
		for(var i = 0; i < acts.length; i++)
		{
			total += acts[i].stop - acts[i].start;
		}
		var hour = Math.floor(total/3600000);
		var min = Math.round((total/3600000 - hour)*60);
		console.log(total/3600000);
		console.log(min);
		var total_time = total/3600000;
		var average_time = total_time / acts.length;
		var orig = new Date(2014,2,12);
		var days_since = Math.floor((new Date().getTime() - orig.getTime())/(1000*60*60*24));
		console.log(days_since);
		var per_day_time = total_time / days_since;
		res.json({query: req.params.desc, acts: acts, total_time: total_time, average_time: average_time, per_day_time: per_day_time });
	})
}

exports.searchTime = function(req, res){

	console.log(req.params.time);
	var time = req.params.time.split(" ");
	for(var i = 0; i < time.length; i++)
	{
		time[i] = parseInt(time[i]);
	}
	switch(time.length)
	{
		case 2:
				time.push(new Date().getFullYear());
		case 3:
				time.push(time[0]);
				time.push(time[1] + 1);
				time.push(time[2]);
				break;
		case 4:
				time.splice(2, 0, new Date().getFullYear());
				time.push(time[2]);
				break;
	}

	// time array: start 0 - month, 1 - day, 2 - year, stop 3 - month, 4 - day, 5 - year 
	var query = Activity.find().or([{'start': {"$gte": new Date(time[2], time[0] - 1, time[1]), "$lt": new Date(time[5], time[3] - 1, time[4])}},
									{'stop': {"$gte": new Date(time[2], time[0] - 1, time[1]), "$lt": new Date(time[5], time[3] - 1, time[4])}}])
							.sort({'start': 1})
	query.exec(function(err, acts){
		if(err) return res.send(500);
		res.json({acts: acts});
	})
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