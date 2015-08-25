var fs = require("fs");
var file = "./2015.db";
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);



db.serialize(function() {
        if(!exists){
                 console.log("Creating DB file");
            db.run("CREATE TABLE students (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT)");
            
                 var stmt = db.prepare("INSERT INTO students VALUES (?,?,?,?,?)");
                 
                 stmt.run(1,"student", "one",7,"team");
                 stmt.run(2,"student", "two",7,"team");
                 stmt.run(3,"student", "three",7,"team");
                 
                 
                 stmt.finalize();
            db.run("CREATE TABLE active (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, computer INTEGER, timeIn TEXT)");
            db.run("CREATE TABLE log (id INTEGER, firstName TEXT, lastName TEXT, grade INTEGER, team TEXT, computer INTEGER, timeIn TEXT, timeOut TEXT, destination TEXT)");
             } else {
             console.log("DB already exists");
             }

});


//db.close();

module.exports.findStudent = function findStudent(sid, callback){
	db.get('SELECT * FROM students WHERE id=?', sid, callback);
}
module.exports.checkActive = function checkActive(sid, callback){
	db.get('SELECT * FROM active WHERE id=?', sid, callback);
}
module.exports.signInStudent = function signInStudent(row, computer){
	var date = new Date().toLocaleString();
	console.log(date);
	db.run('INSERT INTO active VALUES (?,?,?,?,?,?,?)', row.id, row.firstName, row.lastName, row.grade, row.team, computer, date);
}
module.exports.checkActiveComputer = function checkActiveComputer(computer, callback){
	db.get('SELECT * FROM active WHERE computer=?', computer, callback);
}
module.exports.signOutStudent = function signOutStudent(row, destination, callback) {
	var date = new Date().toLocaleString();
	db.run('INSERT INTO log VALUES(?,?,?,?,?,?,?,?,?)', row.id, row.firstName, row.lastName, row.grade, row.team, row.computer, row.timeIn, date, destination);
	db.run('DELETE FROM active WHERE id=?', row.id); 
	db.get('SELECT * FROM log WHERE id=?', row.id, callback);
}

module.exports.getAllActive = function getAllActive(callback){
	db.all('SELECT * FROM active', callback);
}

module.exports.importStudents = function importStudents(arr){
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO students VALUES (?,?,?,?,?)");
        
        for(var i = 0; i < arr.length; i++){
        	var student = arr[i];
	        stmt.run(student.id, student.firstName, student.lastName, student.grade, student.team);

    	}
    	
        stmt.finalize();
    });
}

module.exports.addStudent = function addStudent(student){
	
	db.run("INSERT INTO students VALUES (?,?,?,?,?)", student.id, student.firstName, student.lastName, student.grade, student.team);

}
