var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var fs = require('fs');

var db = require('./db.js');
var settings = require('./settings.json');

app.use(express.static('public'));

app.get('/', function (req, res){
  var page = "<li>";
  var rooms = settings.rooms;
  for(var key in rooms){
  	var rm = rooms[key];
  	page += "<ul><a href='/" + rm.name + "'>" + rm.name + "</a></ul>";
  }
  page += "</li>";
  res.send(page);
});

function searchForPage(pageName){
	var rooms = settings.rooms;
	for(var key in rooms){
    if(rooms[key].name == pageName) return true;
	}
	return false;
}

app.engine('html', function(filePath, opts, callback){
  fs.readFile(filePath, function(err, content) {
  	if(err) return callback(new Error(err));
  	var rendered = content.toString().replace('##TEMPLATE##', opts.url);
  	if(settings["rooms"][opts.url].mode == "check-in") {
  		rendered = rendered.replace('##MODE##', "./check-in.js");

  	}else if(settings["rooms"][opts.url].mode == "check-sheet"){
			rendered = rendered.replace('##MODE##', "./check-sheet.js");  		
  	}
  	else rendered = rendered.replace("##MODE##", "");
    return callback(null, rendered);

  });
});

app.get('/*', function (req, res) {
  console.log(req.url);
  var pageName = req.url.replace('/', '');
  if(!searchForPage(pageName)) res.sendStatus(404);
  else res.render(__dirname + '/template.html', {url: pageName});
});

io.on('connection', function(socket) {
	console.log('a user connected' + "\n");
  // update class map based on active user db

  socket.on('ping', function() {
  	socket.emit('ping-back');
  });

  socket.on('setup', function(room){
    socket.join(room, function(){updateMap(room, socket);});
    console.log("joined room " + room);
  });


  socket.on('update map', function(room){
    updateMap(room);
  });

	socket.on('disconnect', function() { console.log('disconnected'); });

	socket.on('start query', function(data){
		// determine link via JSON
		var room = data.room;
		room = room.slice(0,room.indexOf("_"));
		data['link'] = settings["links"][room];
		console.log('\nsending query info to ' + data.room + ' for ' + data.sid);
		socket.emit('do query', data);
	});

	socket.on('start ticket query', function(data){
		var room = data.room;
		room = room.slice(0,room.indexOf("_"));
		data["link"] = settings["links"][room];
		socket.emit('do ticket query', data);
	})
	
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
				socket.to(student.room).emit('update map', student);
				console.log('signed in: ' + JSON.stringify(student) + "\n");
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
					io.sockets.in(room).emit('update map', student);

				});
			}
		});
	});

});

function updateMap(room, socket){
  console.log('updating map... ' + room);
      db.getAllActive(room, function(err, row){
        if(row){
          for(var i = 0; i < row.length; i++){
            var student = {room: room, action: "sign in", sid: row[i].sid, device: row[i].device, firstName: row[i].firstName, lastName:row[i].lastName, team:row[i].team, grade:row[i].grade};
            socket.emit('update map', student);
          }
        }
      });
}

function postToGoogle(formData, student){
  var f = ["sid", "firstName", "lastName", "grade", "timeIn", "team", "device", "fields"];
  var url = formData["form"] + "/formResponse?ifq";

  for(var i = 0; i < f.length; i++) { 
  	url += "&" + formData.fields[f[i]] + "=" + student[f[i]];
  }
  url += "&submit=Submit";

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
