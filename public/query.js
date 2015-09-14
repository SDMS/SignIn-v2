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
    
	for(var i = 0; i < data.getNumberOfColumns(); i++){
		console.log(data.getValue(0,i));
	}
	console.log(data.getNumberOfRows());
}

function getStudent(id, link){
  var opts = {sendMethod: 'auto'};
	var query = new google.visualization.Query(link, opts);
	query.setQuery('select * where A =' + id);
	query.send(handleQueryResponse);
}