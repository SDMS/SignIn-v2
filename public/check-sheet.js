document.addEventListener("DOMContentLoaded", function(event) { 
  //do work
  document.getElementById('in-instructions').innerHTML = "Scan or type Student ID to confirm registration.";
  document.getElementById('submit-in').onclick = function(){
      var data = {room: document.body.id, sid: document.getElementById('sid').value}
      socket.emit('start ticket query', data);
  };
});

socket.on('do ticket query', function(data){
  var id = data.sid;
  var link = data.link;
    if(typeof id == 'string') {
    if(id.charAt(0) == 'P') id = id.substring(1);
  }
    var opts = {sendMethod: 'auto'};
  var query = new google.visualization.Query(link, opts);
  query.setQuery('select * where C =' + id);
  query.send(showTicketStatus);

}); 

function showTicketStatus(response){
  console.log('lkdsjflksjf');
  if(response.isError()){
    console.log('Error: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  var data = response.getDataTable();
  if(data.getNumberOfRows() >= 1) {
    alert("Student has ticket.");
    return;
  }else if(data.getNumberOfRows() < 1){
    alert("Student does not have ticket.");
    return;
  }

    var student = {
      room: document.body.id,
      sid: data.getValue(0,0),
      firstName: data.getValue(0,1),
      lastName: data.getValue(0,2),
      grade: data.getValue(0,3),
      team: data.getValue(0,4)

    }
    console.log(student);
}