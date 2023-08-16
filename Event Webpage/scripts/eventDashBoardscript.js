// on creating new event
function createNewEvent(create){
  if(create==="Create"){
    localStorage.setItem("createID",JSON.stringify(true));}
  window.location="../pages/createEvent.html";
}
// on clicking logout
function delCurrentUser(){
  if(confirm("Do you want to Logout?") == true){
    localStorage.removeItem("currentUser");
    window.location='../index.html';
  };
}
//page on loading
function pageOnLoad(){
  if(localStorage.getItem("createID"))
    localStorage.removeItem("createID")
    if(currentUser===null){
        window.location='../index.html';
        return false;
    }
    else{
        return true;
    }
}

//getting current user details
const currentUser=localStorage.getItem("currentUser");
var currentUserObj=JSON.parse(currentUser);

//getting user List
const tempUser=localStorage.getItem('users');
var userList=JSON.parse(tempUser);
//setting user name in dashboard
var username=document.getElementById("username");
username.innerText=currentUserObj.userName;

//getting events of the current user
var tempEventLst=JSON.parse(localStorage.getItem("event") || '[]');
const currentUserEvents=tempEventLst.filter((element)=> element.usermail===currentUserObj.email);

//getting user's event details
let tempEvents=currentUserObj.events;
if(tempEvents.length===0){
    let appointmentslst=document.getElementById("events");
    appointmentslst.innerHTML=`<p style="font-size:20px;">Sorry the list is currently empty..</p><br><center><button id="createEvent" onclick=createNewEvent("Create")>Create your 1st Event</button></center><br>`;
}
else{
  //console.log(currentUserEvents);
  var app = document.getElementById('events');
  app.innerHTML=`<div class="container">`+currentUserEvents.map((element) => {return `<div class="card">
  <div class="circle"><br><br><br><h1>${element.eventName}</h1></div>
  <div class="content"><p>
  <a class="infobtn" id="${element.eventID}" onclick=eventDetails(this.id) ><i class="fa-solid fa-circle-info"></i> Info</a><br>
    <b>No of Days : </b>${element.noOfDays} <br>
    <b>Event Duration : </b>${element.scheduledTime+" "+element.durFormat}<br></p><br>
    <a class="editbtn" id="${element.eventID}" onclick=editEvent(this.id) ><i class="fa-solid fa-file-pen"></i> Edit</a>
    <a class="deletebtn" id="${element.eventID}" onclick=deleteEvent(this.id) ><i class="fa-solid fa-trash"></i> Delete</a>
    </div></div>`;
}).join(" ")+ '</div>';
} 

//delete event
const deleteEvent=(currentEventId)=>{
  if(confirm("Do you want to delete this event?") == true){
  let i;
  let currentUser=userList.find(e=>e.email===currentUserObj.email);
  let tempEventList=currentUser.events;

  let eventsLst=[];
  for(i=0;i<tempEventList.length;i++){
      if(tempEventList[i]!==currentEventId){
          eventsLst.push(tempEventList[i]);
      }
  }
  delete currentUser.events;
  currentUser.events=eventsLst;
  localStorage.setItem("users",JSON.stringify(userList));
  localStorage.setItem("currentUser",JSON.stringify(currentUser));
  location.reload();
  const tempeve=localStorage.getItem('event');
  var tempEvent=JSON.parse(tempeve);

  var finalList=[];
  for(i=0;i<tempEvent.length;i++){
    if(tempEvent[i].eventID!=currentEventId){
      finalList.push(tempEvent[i]);
    }
  }
  tempEvent=finalList;
  localStorage.setItem('event',JSON.stringify(tempEvent));
};
}
// Editing available event
const editEvent=(currentEventId)=>{
  localStorage.setItem('editID',JSON.stringify(currentEventId));
  window.location="../pages/createEvent.html";
}

const eventDetails=(currentEventId)=>{
  localStorage.setItem('editID',JSON.stringify(currentEventId));
  window.location="../pages/eventDetails.html";
}

