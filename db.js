var fs = require("fs");
var file = "./active.db";
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
var settings = require('./settings.json');


db.serialize(function() {
        if(!exists){
            console.log("Creating DB file");
             } else {
             console.log("DB already exists. Checking for updates...");
        }
        var rooms = settings.rooms;
            for(var key in rooms){
                var rm = rooms[key];
                db.run("CREATE TABLE IF NOT EXISTS " + rm.name + "(sid INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, device INTEGER, fields TEXT)");
                console.log(rm.name);
            }
});


//db.close();

module.exports.checkActive = function checkActive(room, sid, callback){
	db.get('SELECT * FROM ' + room + ' WHERE sid=?', sid, callback);
}
module.exports.signInStudent = function signInStudent(room, student){
	var date = new Date().toLocaleString();
	console.log(date);
	db.run('INSERT INTO ' + room + ' VALUES (?,?,?,?,?,?,?,?)', student.sid, student.firstName, student.lastName, student.grade, student.team, date, student.device, student.fields);
}
module.exports.checkActiveDevice = function checkActiveDevice(room, device, callback){
	db.get('SELECT * FROM ' + room + ' WHERE device=?', device, callback);
}
module.exports.signOutStudent = function signOutStudent(room, student, callback) {
	db.run('DELETE FROM ' + room + ' WHERE sid=?', student.sid); 
    callback(); //?
}

module.exports.getAllActive = function getAllActive(room, callback){
	db.all('SELECT * FROM ' + room, callback);
}
