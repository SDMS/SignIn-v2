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
  var student = document.getElementById(data.id); // maybe change.
  list.removeChild(student);
}

function clickStudent(){
  alert('click!');
  if(selectedStudent == this.id) {
  	deselectStudent(this);
  } else {
    selectStudent(this);
  }
}

function selectStudent(element){
  if(selectedStudent != -1) deselectStudent(selectedStudent);
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
    var sid = selectedStudent;
    var student = {"sid": sid};
    socket.emit('sign out', student);
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
	// change computer to empty
	removeStudent(data);
});
    
socket.on('sign out fail', function(err){
	alert('error: ' + err);
	deselectStudent();
});