var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require('./db.js');
var settings = require('./settings.json');


app.use(express.static('public'));

io.on('connection', function(socket) {
	console.log('a user connected' + "\n");
      // update class map based on active user db

    socket.on('update map', function(room){
    	console.log('updating map... ' + room);
      db.getAllActive(room, function(err, row){
      	if(row){
      	  for(var i = 0; i < row.length; i++){
      	    var student = {action: "sign in", id: row[i].id, computer: row[i].computer, info: row[i].firstName + " " + row[i].lastName + "<br>" + row[i].team + "/" + row[i].grade};
      	    socket.emit('update map', student);
      	  }
        }
      });
  });

	socket.on('disconnect', function() { console.log('disconnected'); });

	socket.on('start query', function(data){
		// determine link via JSON
		var room = data.room;
		room = room.slice(0,room.indexOf("-"));
		data['link'] = settings["links"][room];
		console.log(data);
		socket.emit('do query', data);
	});
	
	socket.on('sign in', function(student){
		console.log("received data:");
		console.log(student);
		db.checkActive(student.id, function(err, row){
			if(err != null){
				console.log(err);
				return;
			}
			if(row != undefined) { // student not in database 
				socket.emit('sign in fail', "You are already signed in.");
				console.log('check fail: Already signed in.' + "\n");
			} 
			else { 
				db.signInStudent(row, student.computer);
				student.info = row.firstName + " " + row.lastName + "<br>" + row.team + "/" + row.grade;
				socket.emit('sign in success', student);
				student.action = 'sign in';
				socket.broadcast.emit('update map', student);
				console.log('check success');
				console.log('submitted ' + JSON.stringify(student) + "\n");
			}		
		});
	});
	
	socket.on('sign out', function(student){
		// check to make sure student isn't already signed out
		db.checkActive(student.id, function(err, row){
			if(row == undefined) { // student not signed in
				console.log(err + " " + row);
				socket.emit('sign out fail', 'student not signed in');
				console.log('sign out fail: student not signed in' + "\n");
			}
			else {
				// copy data from lab table, record time and destination and remove from lab table
				db.signOutStudent(row, function(err, row){
					var name = row.firstName + " " + row.lastName;
					console.log('signed out: ' + name + ' at computer #' + student.computer);
    		    	console.log('destination: ' + student.destination + "\n");
					socket.emit('sign out success', student);
					student.action = 'sign out';
					socket.broadcast.emit('update map', student);
				});
			}
		});
	});

});

var server = http.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App listening at http://%s%s', host, port);
});
