var fs = require("fs");
var file = "./1516.db";
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);



db.serialize(function() {
        if(!exists){
                 console.log("Creating DB file");
            db.run("CREATE TABLE sdms_021 (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT)");
            db.run("CREATE TABLE sdms_lmc (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, timeIn TEXT, computer INTEGER, fields TEXT)");
             } else {
             console.log("DB already exists");
             }

});


//db.close();

module.exports.checkActive = function checkActive(sid, callback){
	db.get('SELECT * FROM active WHERE id=?', sid, callback);
}
module.exports.signInStudent = function signInStudent(row, computer){
	var date = new Date().toLocaleString();
	console.log(date);
	db.run('INSERT INTO active VALUES (?,?,?,?,?,?,?,?)', row.id, row.firstName, row.lastName, row.grade, row.team, row.date, row.computer, row.fields);
}
module.exports.checkActiveComputer = function checkActiveComputer(computer, callback){
	db.get('SELECT * FROM active WHERE computer=?', computer, callback);
}
module.exports.signOutStudent = function signOutStudent(row, callback) {
	db.run('DELETE FROM active WHERE id=?', row.id); 
    callback(); //?
}

module.exports.getAllActive = function getAllActive(callback){
	db.all('SELECT * FROM active', callback);
}