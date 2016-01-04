var socket = io.connect();

var selectedStudent = -1;

function addStudent(data){
  var list = document.getElementById('students');
	var student = document.createElement('li');
	student.appendChild(document.createTextNode(data.firstName + " " + data.lastName + " | " + data.grade + "th " + data.team));
	student.id = data.sid;
	student.addEventListener("click", clickStudent);
	list.insertBefore(student, list.childNodes[0]);
}

function removeStudent(data){
  var list = document.getElementById('students');
  var student = document.getElementById(data.sid); // maybe change.
  list.removeChild(student);
}

document.onkeydown = function(e) {
	if(typeof e == 'undefined' && window.event) {
		e = window.event;
	}
	if(e.keyCode == 13) {
      if(document.getElementById("sid").value != "")  document.getElementById('submit-in').click();
      else { signout(); selectedStudent = -1; }
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
    console.log("trying to deselect...");
    // btw when you click on the sign out button
    // it also clicks on the parent element
    // which calls "clickStudent" and deselects it for you.
    // deselectStudent(document.getElementById(selectedStudent));
  } else {
  	alert("Please select your name in the list!");
  }
}

socket.on('ping-back', function() {
  alert('ping');
});

socket.on('reconnect_failed', function(){
  alert('reconnect failed. please refresh the page.');
});

socket.on('reconnect_error', function(err){
  alert('there was a connection error. Please refresh the page.\n' + err);
});

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
var time = new Date().getTime();
function setLastMovement(e) {
  time = new Date().getTime();
}
function refresh() {
  if(new Date().getTime() - time >= 15*60000) 
     window.location.reload(true);
  else 
     setTimeout(refresh, 5*60000);
}
window.onload = function() { 
  socket.emit('setup', document.body.id); 
  document.body.addEventListener("mousemove", setLastMovement);
  document.body.addEventListener("keydown", setLastMovement);
  setTimeout(refresh, 5*60000);
}

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
  console.log(data);
	removeStudent(data);
});
    
socket.on('sign out fail', function(err){
	alert('error: ' + err);
	deselectStudent();
});
