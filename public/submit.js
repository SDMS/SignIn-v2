var socket = io.connect(null, {'reconnection limit': 3000, 'max reconnection attempts': Number.MAX_VALUE, 'connect timeout':7000});

var selectedStudent = -1;

function addStudent(data){
  	var list = document.getElementById('students');
	var student = document.createElement('li');
	student.appendChild(document.createTextNode('information goes here'));
	student.onclick = 'selectStudent(this)';
	list.appendChild(student);
}

function removeStudent(data){
  var list = document.getElementById('students');
  var student = document.getElementById(data.id); // maybe change.
  list.removeChild(student);
}

function selectStudent(element){
  deselectStudent();
  element.className = 'selected';
  selectedStudent = element.id;
}

function deselectStudent(){
	var element = document.getElementById(selectedStudent);
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

  var data = {room: document.body.id, id: document.getElementById('sid').value}
  socket.emit('start query', data);
}

function signout(){
  var sid = document.getElementById(selectedStudent);
  var student = {"id": sid};
  socket.emit('sign out', student);
}

socket.on('do query', function(data){
  getStudent(data.id, data.link);
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