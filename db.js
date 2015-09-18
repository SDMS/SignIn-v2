var fs = require("fs");
var file = "./active.db";
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);



db.serialize(function() {
        if(!exists){
                 console.log("Creating DB file");
            db.run("CREATE TABLE sdms_maclab (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT)");
            db.run("CREATE TABLE sdms_lmc (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT)");
            db.run("CREATE TABLE whs_lmc (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT)");
             } else {
             console.log("DB already exists");
             }

});


//db.close();

module.exports.checkActive = function checkActive(room, sid, callback){
	db.get('SELECT * FROM ' + room + ' WHERE id=?', sid, callback);
}
module.exports.signInStudent = function signInStudent(room, student){
	var date = new Date().toLocaleString();
	console.log(date);
	db.run('INSERT INTO ' + room + ' VALUES (?,?,?,?,?,?,?,?)', student.id, student.firstName, student.lastName, student.grade, student.team, date, student.computer, student.fields);
}
module.exports.checkActiveComputer = function checkActiveComputer(room, computer, callback){
	db.get('SELECT * FROM ' + room + ' WHERE computer=?', computer, callback);
}
module.exports.signOutStudent = function signOutStudent(room, student, callback) {
	db.run('DELETE FROM ' + room + ' WHERE id=?', student.id); 
    callback(); //?
}

module.exports.getAllActive = function getAllActive(room, callback){
	db.all('SELECT * FROM ' + room, callback);
}
