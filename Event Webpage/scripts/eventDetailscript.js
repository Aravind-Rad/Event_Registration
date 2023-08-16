let currentUser=JSON.parse(localStorage.getItem("currentUser") || '[]');
let userList=JSON.parse(localStorage.getItem('users') || '[]');
let eventList=JSON.parse(localStorage.getItem('event') || '[]');
let editId=JSON.parse(localStorage.getItem("editID" || '[]'));

// getting events of the current user
let curevent;
for (let i = 0; i < eventList.length; i++) {
  if(eventList[i].eventID===editId){
    curevent=eventList[i];
  }
}
// on clicking logout
function delCurrentUser(){
  localStorage.removeItem("currentUser");
  window.location='../index.html';
}

//page on loading
function pageOnLoad(){
  if(currentUser===null){
      window.location='../index.html';
    return false;
  }
  else{
    return true;
  }
}
let allSlots=(curevent.allSlots || []),avail=0,total=0;
for (let i = 0; i < allSlots.length; i++) {
  tempSlot=allSlots[i]
  for (let j = 0; j < tempSlot.length; j++) {
    total++;
    if(tempSlot[j].availability==="Available"){
      avail++;
    }
  }
}
let weekTiming=curevent.weekTiming;
let monst=monen=tuest=tueen=wedst=weden=thust=thuen=frist=frien=satst=saten=sunst=sunen='-';
for (let i = 0; i < weekTiming.length; i++) {
  if(weekTiming[i].day==='mon'){
    monst=weekTiming[i].start;
    monen=weekTiming[i].end;
  }else if(weekTiming[i].day==='tue'){
    tuest=weekTiming[i].start;
    tueen=weekTiming[i].end;
  }else if(weekTiming[i].day==='wed'){
    wedst=weekTiming[i].start;
    weden=weekTiming[i].end;
  }else if(weekTiming[i].day==='thu'){
    thust=weekTiming[i].start;
    thuen=weekTiming[i].end;
  }else if(weekTiming[i].day==='fri'){
    frist=weekTiming[i].start;
    frien=weekTiming[i].end;
  }else if(weekTiming[i].day==='sat'){
    satst=weekTiming[i].start;
    saten=weekTiming[i].end;
  }else if(weekTiming[i].day==='sun'){
    sunst=weekTiming[i].start;
    sunen=weekTiming[i].end;
  }
  
}
let bookedSlots=[];
for (let i = 0; i < allSlots.length; i++) {
  tempSlot=allSlots[i]
  for (let j = 0; j < tempSlot.length; j++) {
    if(tempSlot[j].availability!=="Available"){
      bookedSlots.push(tempSlot[j]);
    }
  }
}
//setting user name and event name
document.getElementById("username").innerHTML=currentUser.userName;
document.getElementById("eventname").innerHTML=curevent.eventName;

// collecting the cust details for this event
let eventCust=[];
let custList=JSON.parse(localStorage.getItem("custs") ||'[]');
for (let ind = 0; ind < custList.length; ind++) {
  if(custList[ind].eventId===editId){
    eventCust.push(custList[ind]);
  }
}
// setting the common details of the event
document.getElementById("events").innerHTML=`
<div class="btnopts">
  <a class="editbtn" id="${curevent.eventID}" onclick=editEvent(this.id) ><i class="fa-solid fa-file-pen"></i> Edit</a>
  <a class="deletebtn" id="${curevent.eventID}" onclick=deleteEvent(this.id) ><i class="fa-solid fa-trash"></i> Delete</a></div>
  <table>
    <tr><th>Basic Details</th></tr>
    <tr><td>Initial Start Date</td><td>: ${curevent.eventCreated}</td></tr>
    <tr><td>Last Registered Date</td><td>: ${curevent.startDate}</td></tr>
    <tr><td>No Of Days</td><td>: ${curevent.noOfDays}</td></tr>
    <tr><td>Description</td><td>: ${curevent.Description}</td></tr>
    </table><br><table>
    <tr><th>Week Timing</th></tr>
    <tr><td>Monday</td><td>: ${timeFormatConvertor(monst)} - ${timeFormatConvertor(monen)}</td></tr>
    <tr><td>Tuesday</td><td>: ${timeFormatConvertor(tuest)} - ${timeFormatConvertor(tueen)}</td></tr>
    <tr><td>Wednesday</td><td>: ${timeFormatConvertor(wedst)} - ${timeFormatConvertor(weden)}</td></tr>
    <tr><td>Thursday</td><td>: ${timeFormatConvertor(thust)} - ${timeFormatConvertor(thuen)}</td></tr>
    <tr><td>Friday</td><td>: ${timeFormatConvertor(frist)} - ${timeFormatConvertor(frien)}</td></tr>
    <tr><td>Saturday</td><td>: ${timeFormatConvertor(satst)} - ${timeFormatConvertor(saten)}</td></tr>
    <tr><td>Sunday</td><td>: ${timeFormatConvertor(sunst)} - ${timeFormatConvertor(sunen)}</td></tr>
    </table><br><table>
    <tr><th>Booking Details</th></tr><td><br></td></table>`
    + eventCust.map((element) => {
      return `<table><tr><td>Date</td><td>: ${element.date}</td></tr>
      <tr><td>slot</td><td>: ${slotTimeFormatConvertor(element.slotId)}</td></tr>
      <tr><td>Name</td><td>: ${element.custName}</td></tr>
      <tr><td>Customer Mobile</td><td>: ${element.phoneNo}</td></tr>
      <tr><td>Customer Mail</td><td>: ${element.mailID}</td></tr><tr></tr><tr><td><br></td></tr>`
    }).join(" ")+`</table>`;

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
function timeFormatConvertor(curTime){
  if(curTime==="-"){
    return "-";
  }
var hours = Number(curTime.slice(0,2));
var AmOrPm = hours >= 12 ? 'PM' : 'AM';
hours = (hours % 12) || 12;
var minutes = Number(curTime.slice(3,5)) ;
var finalTime =('0'+hours).slice(-2)+':'+('0'+minutes).slice(-2)+ " " + AmOrPm;
return finalTime;
}

function slotTimeFormatConvertor(sTime){
  if(sTime.slice(2,3)!==':'){
    sTime='0'+sTime
  }
  let stTime=sTime.slice(0,11);
  let enTime=sTime.slice(12)
  enTime=('0'+enTime).slice(-11)
  return stTime.slice(0,5)+' '+stTime.slice(-2)+' - '+(enTime.slice(0,5)+' '+enTime.slice(-2));
}