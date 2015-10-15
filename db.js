var fs = require("fs");
var file = "./active.db";
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);



db.serialize(function() {
        if(!exists){
                 console.log("Creating DB file");
            db.run("CREATE TABLE sdms_maclab (sid INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, device INTEGER, fields TEXT)");
            db.run("CREATE TABLE sdms_lmc (sid INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, device INTEGER, fields TEXT)");
            db.run("CREATE TABLE whs_lmc (sid INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, device INTEGER, fields TEXT)");
            db.run("CREATE TABLE sdms_dance (sid INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, device INTEGER, fields TEXT)");

             } else {
             console.log("DB already exists");
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
