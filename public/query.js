google.load('visualization', 1.0);

function test() {
	var opts = {sendMethod: 'auto'};
	var query = new google.visualization.Query('https://docs.google.com/a/wethersfield.me/spreadsheets/d/1c5Tvi0hvSbrYQhZGgQN9nJAsdQZtM7R-dnVS4gVuuTM/edit#gid=801796888', opts);
	query.setQuery('select * where A = 6512');
	query.send(handleQueryResponse);
}
function handleQueryResponse(response){
	if(response.isError()){
		console.log('Error: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}
	var data = response.getDataTable();
	if(data.getNumberOfRows() > 1) {
		alert("Please ask a teacher for help.");
    document.getElementById("sid").value = "";
		return;
	}else if(data.getNumberOfRows() < 1){
		alert("Did you type your ID in correctly?");
    document.getElementById("sid").value = "";
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
    socket.emit('sign in', student);
}

function getStudent(id, link){
	if(typeof id == 'string') {
		if(id.charAt(0) == 'P') id = id.substring(1);
	}
    var opts = {sendMethod: 'auto'};
	var query = new google.visualization.Query(link, opts);
	query.setQuery('select * where A =' + id);
	query.send(handleQueryResponse);
}