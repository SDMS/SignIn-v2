function toggleMenus() {
  document.getElementById("out-menu").classList.toggle("active");
  document.getElementById("toggle-out").classList.toggle("active");
  document.getElementById("in-menu").classList.toggle("active");
  document.getElementById("toggle-in").classList.toggle("active");
  deselectStudent(document.getElementById(selectedStudent));
}

function clickStudent(){
  if(document.getElementById("toggle-out").classList.contains("active")){
    if(selectedStudent == this.id) {
     deselectStudent(this);
    } else {
      selectStudent(this);
    }
  } 
}

function selectStudent(element){
  if(selectedStudent != -1) {
    deselectStudent(document.getElementById(selectedStudent));
  }
  element.classList.toggle("selected");
  selectedStudent = element.id;
}

function deselectStudent(element){
  if(element){
    element.classList.toggle("selected");
  }
  selectedStudent = -1;
}