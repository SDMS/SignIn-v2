var fs = require("fs");
var file = "./1516.db";
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);



db.serialize(function() {
        if(!exists){
                 console.log("Creating DB file");
            db.run("CREATE TABLE sdms-maclab (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT)");
            db.run("CREATE TABLE sdms-lmc (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT)");
            db.run("CREATE TABLE whs-lmc (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT");
             } else {
             console.log("DB already exists");
             }

});


//db.close();

module.exports.checkActive = function checkActive(room, sid, callback){
	db.get('SELECT * FROM ' + room + ' WHERE id=?', sid, callback);
}
module.exports.signInStudent = function signInStudent(room, row, computer){
	var date = new Date().toLocaleString();
	console.log(date);
	db.run('INSERT INTO ' + room + ' VALUES (?,?,?,?,?,?,?,?)', row.id, row.firstName, row.lastName, row.grade, row.team, row.date, row.computer, row.fields);
}
module.exports.checkActiveComputer = function checkActiveComputer(room, computer, callback){
	db.get('SELECT * FROM ' + room + ' WHERE computer=?', computer, callback);
}
module.exports.signOutStudent = function signOutStudent(room, row, callback) {
	db.run('DELETE FROM ' + room + ' WHERE id=?', row.id); 
    callback(); //?
}

module.exports.getAllActive = function getAllActive(room, callback){
	db.all('SELECT * FROM ' + room, callback);
}