var socket = io.connect(null, {'reconnection limit': 3000, 'max reconnection attempts': Number.MAX_VALUE, 'connect timeout':7000});

var selectedComputer = -1;
var destination = -1;

var active = true;
var timeoutID = window.setTimeout(sleep, 600000);

function sleep(){
        active = false;
        socket.disconnect();
        alert("idle");
}

window.addEventListener("click", checkActive, false);

function checkActive(){
        if(!active){
                socket.connect();
                alert("reconnected!");
                active = true;
                window.clearTimeout(timeoutID);
        }

}

socket.on('update map', function(student){
	if(student.action == "sign in") {
		document.getElementById(student.computer).innerHTML = student.info;
		document.getElementById(student.computer).className = "computer taken";
	} else {
		document.getElementById(student.computer).innerHTML = student.computer;
		document.getElementById(student.computer).className = "computer"; 
	}
		
});

document.onkeydown = function(e) {
	if(typeof e == 'undefined' && window.event) {
		e = window.event;
	}
	if(e.keyCode == 13) {
		if(document.getElementById('map').className == 'signin') { signin(); }
		else { signout(); }
	}
}

function signin() {
	if(selectedComputer == -1) {
		alert('Please select a computer');
		return;
	}
	var sid = document.getElementById('sid').value;
	if(sid.charAt(0) == 'P') sid = sid.substring(1);

	var student = {"id": sid, "computer": selectedComputer};
	console.log(JSON.stringify(student));
	
	socket.emit('sign in', student); 	// check if student exists, check if student is already signed in
}

function signout(){
    if(selectedComputer == -1 | destination == -1) {
        alert('Please click on your name and select your destination');
        return;
    }
    var student = {"computer": selectedComputer, "destination": destination};
    socket.emit('sign out', student);
}

socket.on('sign in success', function(student){
	console.log('signing in.... ' + JSON.stringify(student));

//	alert(student.info + ' at computer ' + selectedComputer);
	// display student's information
	document.getElementById(selectedComputer).innerHTML = student.info;
	document.getElementById(selectedComputer).className = "computer taken";
	
	document.getElementById('sid').value = '';
	selectedComputer = -1;
});

socket.on('sign in fail', function(err){
	alert('error: ' + err);
	document.getElementById('sid').value = '';
	deselectComputer();
	selectedComputer = -1;
});

socket.on('sign out success', function(name){
	// change computer to empty
	document.getElementById(selectedComputer).innerHTML = selectedComputer;
    document.getElementById(selectedComputer).className = "computer";
    document.getElementById(destination).className = "destination";
    destination = -1;
    });
    
socket.on('sign out fail', function(err){
	alert('error: ' + err);
	deselectComputer(); // this doesn't do what i think it should do
	destination = -1;
});