socket.on('sign in success', function(data){
  setTimeout(function(){ socket.emit('sign out', {room: document.body.id, sid:data.sid}); }, 1000);
});
document.addEventListener("DOMContentLoaded", function(event) { 
  //do work
  document.getElementById('in-instructions').innerHTML = "Scan or type your Student ID to sign in.";
});
