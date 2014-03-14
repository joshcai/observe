
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
	var template = '<div class="row activity"><div class="col-xs-6 text-right">temp1</div><div class="col-xs-6 text-left">temp2</div></div>';
	var t = '';
	var x;
	data.acts.forEach(function(act){
		x = template;
		x = x.replace("temp1", pretty_time(act.start) + " - " + pretty_time(act.stop));
		x = x.replace("temp2", act.desc);
		t+=x;
	});
	$('#acts').html(t);
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