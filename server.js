var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

var db = require('./db.js');
var settings = require('./settings.json');


app.use(express.static('public'));

app.get('/', function (req, res){
  var page = "<li>";
  var rooms = settings.rooms;
  for(var key in rooms){
  	var rm = rooms[key];
  	page += "<ul><a href='/" + rm.name + ".html'>" + rm.name + "</a></ul>";
  }
  page += "</li>";
  res.send(page);
});

io.on('connection', function(socket) {
	console.log('a user connected' + "\n");
      // update class map based on active user db

    socket.on('update map', function(room){
    	console.log('updating map... ' + room);
      db.getAllActive(room, function(err, row){
      	if(row){
      	  for(var i = 0; i < row.length; i++){
      	    var student = {action: "sign in", sid: row[i].sid, device: row[i].device, firstName: row[i].firstName, lastName:row[i].lastName, team:row[i].team, grade:row[i].grade};
      	    socket.emit('update map', student);
      	  }
        }
      });
  });

	socket.on('disconnect', function() { console.log('disconnected'); });

	socket.on('start query', function(data){
		// determine link via JSON
		var room = data.room;
		room = room.slice(0,room.indexOf("_"));
		data['link'] = settings["links"][room];
		console.log(data);
		socket.emit('do query', data);
	});
	
	socket.on('sign in', function(student){
		console.log("received data:");
		console.log(student);
		db.checkActive(student.room, student.sid, function(err, row){
			if(err != null){
				console.log(err);
				return;
			}
			if(row != undefined) { // student not in database 
				socket.emit('sign in fail', "You are already signed in.");
				console.log('check fail: Already signed in.' + "\n");
			} else { 
				db.signInStudent(student.room, student);
				student.action = 'sign in';
				socket.emit('sign in success', student);
				socket.broadcast.emit('update map', student);
				console.log('check success');
				console.log('submitted ' + JSON.stringify(student) + "\n");
			}
		});
	});
	
	socket.on('sign out', function(student){
		// check to make sure student isn't already signed out
		var room = student.room;
		db.checkActive(room, student.sid, function(err, row){
			if(row == undefined) { // student not signed in
				console.log(err + " " + row);
				socket.emit('sign out fail', 'student not signed in');
				console.log('sign out fail: student not signed in' + "\n");
			}
			else {
				student = row;
				console.log(room);
				var formData = settings["rooms"][room];
				postToGoogle(formData, student);
				db.signOutStudent(room, student, function(err, row){
					console.log('signed out: ' + JSON.stringify(student));
					socket.emit('sign out success', student);
					student.action = 'sign out';
					socket.broadcast.emit('update map', student);

				});
			}
		});
	});

});

function postToGoogle(formData, student){
  var f = ["sid", "firstName", "lastName", "grade", "timeIn", "team", "device", "fields"];
  var url = formData["form"] + "/formResponse?ifq";

  for(var i = 0; i < f.length; i++) { 
  	url += "&" + formData.fields[f[i]] + "=" + student[f[i]];
  }
  url += "&submit=Submit";

  console.log(url);

  request({
    uri: url,
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10
  }, function(error, response, body) {
    console.log("posted to Google.");
  });
}

var server = http.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App listening at http://%s%s', host, port);
});
