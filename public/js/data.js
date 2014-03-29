
// displays hour and minute from Date object
var pretty_time = function(date_string){
	var temp = '';
	var date = new Date(date_string);
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

var pretty_date = function(date_string)
{
	var date = new Date(date_string);
	var temp = date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
	return temp;
}


//takes num of hours and converts to hours and min
function num_hours(time)
{
	var hour = Math.floor(time);
	var min = Math.round((time - hour)*60);

	return hour+"h "+min + "m";
}

//print times in a certain div
var list_act = function(data, div, include_date)
{
	var template = '<div class="row activity"><div class="col-xs-6 text-right">temp1</div><div class="col-xs-6 text-left"><a href="/a/temp3">temp2</a></div></div>';
	var t = '';
	var x;
	data.acts.forEach(function(act){
		x = template;
		if(include_date)
			x = x.replace("temp1", pretty_date(act.start) + "   temp1");
		x = x.replace("temp1", pretty_time(act.start) + " - " + pretty_time(act.stop));
		x = x.replace("temp2", act.desc);
		x = x.replace("temp3", act._id);
		t+=x;
	});
	if(data.total_time != null)
	{
		var temp = "<span>Total time " + data.acts[0].desc + ": " + num_hours(data.total_time) + "</span><br><br>";
		temp += "<span>Average time " + data.acts[0].desc + ": " + num_hours(data.average_time) + "</span><br><br>";
		temp += "<span>Time per day  " + data.acts[0].desc + ": " + num_hours(data.per_day_time) + "</span><br><br>";
		t = temp.concat(t);
	}
	$(div).html(t);
}


//prints list of acts, current activity, and title
var print_data = function(data){
	if(data.current)
	{
		document.title = data.current.desc;
	}
	else
	{
		document.title = "meow";
	}
	list_act(data, '#acts', false);
	var s = 'josh is ';
	console.log(data.current);
	if(data.current)
	{
		s+= "<strong>"+data.current.desc+"</strong> (since "+pretty_time(data.current.start)+")";
	}
	else
	{
		s += 'doing nothing';
	}
	$('#current').html(s);
}

// reload info main function (sends ajax get request for data then calls print_data)
var reload_info = function(){
	$.ajax({
		type: "GET",
		url: "/info",
		success: function(data){
			print_data(data);
		}
	})			
}


reload_info();

//init socket io connection
var socket = io.connect();
socket.on('changed', function(){
	reload_info();
})