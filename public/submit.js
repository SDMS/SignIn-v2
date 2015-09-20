var socket = io.connect(null, {'reconnection limit': 3000, 'max reconnection attempts': Number.MAX_VALUE, 'connect timeout':7000});

var selectedStudent = -1;

function addStudent(data){
  	var list = document.getElementById('students');
	var student = document.createElement('li');
	student.appendChild(document.createTextNode(data.firstName + " " + data.lastName + " " + data.grade + " " + data.team));
	student.id = data.sid;
	student.addEventListener("click", clickStudent);
	list.appendChild(student);
}

function removeStudent(data){
  var list = document.getElementById('students');
  var student = document.getElementById(data.sid); // maybe change.
  list.removeChild(student);
}

function clickStudent(){
  if(selectedStudent == this.id) {
  	deselectStudent(this);
  } else {
    selectStudent(this);
  }
}

function selectStudent(element){
  if(selectedStudent != -1) {
  	deselectStudent(document.getElementById(selectedStudent));
  }
  element.className = 'selected';
  selectedStudent = element.id;
}

function deselectStudent(element){
	element.className = '';
	selectedStudent = -1;
}

document.onkeydown = function(e) {
	if(typeof e == 'undefined' && window.event) {
		e = window.event;
	}
	if(e.keyCode == 13) {
      //either sign in or sign out.
	}
}

function signin() {

  var data = {room: document.body.id, sid: document.getElementById('sid').value}
  socket.emit('start query', data);
}

function signout(){
  if(selectedStudent != -1) {
    var student = {room: document.body.id, sid: selectedStudent};
    socket.emit('sign out', student);
    deselectStudent(document.getElementById(selectedStudent));
  } else {
  	alert("Please select your name in the list!");
  }
}

socket.on('do query', function(data){
  getStudent(data.sid, data.link);
});

socket.on('update map', function(student){
	if(student.action == "sign in") {
		addStudent(student);
	}
	else {
		removeStudent(student);
	}
		
});

window.onload = function() { socket.emit('update map', document.body.id); }

socket.on('sign in success', function(data){
  console.log('signing in.... ' + JSON.stringify(data));

  addStudent(data);

  document.getElementById('sid').value = '';

});

socket.on('sign in fail', function(err){
	alert('error: ' + err);
	document.getElementById('sid').value = '';
});

socket.on('sign out success', function(data){
  // send data to google form
  console.log(data);
  postToGoogle(data);
	// change computer to empty
	removeStudent(data);
});
    
socket.on('sign out fail', function(err){
	alert('error: ' + err);
	deselectStudent();
});

function postToGoogle(data){
  var formUrl = data.formData["form"];
  /* make this better please*/
  var object = {};
  object[data.formData.fields.sid] = data.sid;
  object[data.formData.fields.firstName] = data.firstName;
  object[data.formData.fields.lastName] = data.lastName;
  object[data.formData.fields.grade] = data.grade;
  object[data.formData.fields.timeIn] = data.timeIn;
  object[data.formData.fields.team] = data.team;
  object[data.formData.fields.computer] = data.computer;
  object[data.formData.fields.fields] = data.fields;

  $.ajax({
    url: formUrl,
    data: object,
    type: "POST",
    dataType: "xml",
    statusCode: {
      0: function() {
        alert("Thank you.");
      },
      200: function() {
        alert("Thank you.");
      }
    }

  });
}