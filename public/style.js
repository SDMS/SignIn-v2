function toggleMenus() {
  document.getElementById("out-menu").classList.toggle("active");
  document.getElementById("toggle-out").classList.toggle("active");
  document.getElementById("in-menu").classList.toggle("active");
  document.getElementById("toggle-in").classList.toggle("active");
  deselectStudent(document.getElementById(selectedStudent));
}

function showInstructions(){
  showPopup("instructions");
}

function showPopup(name){
  alert('show' + name);
}

function clickStudent(){
  if(selectedStudent == this.id) {
    deselectStudent(this);
  } else {
    selectStudent(this);
  }
}

function selectStudent(element){
  console.log("selecting student");
  if(selectedStudent != -1) {
    deselectStudent(document.getElementById(selectedStudent));
  }
  element.classList.toggle("selected");

  var button = document.createElement('button');
  button.id = 'submit-out';
  button.classList.add('button', 'out');
  button.innerHTML = 'Sign Out';
  button.onclick = signout;
  element.appendChild(button);
//  element.parentNode.insertBefore(button, element);

  selectedStudent = element.id;
}

function deselectStudent(element){
  console.log(selectedStudent);
  if(selectedStudent != -1){
    element.classList.toggle("selected");
  }
  document.getElementById('submit-out').remove();
  selectedStudent = -1;
  console.log("deselected student " + selectedStudent);
}