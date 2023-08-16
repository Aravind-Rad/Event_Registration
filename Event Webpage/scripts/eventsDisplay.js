//Display Events
window.onload=function(){getEvents()};
function getEvents(){
let availableEventList=JSON.parse(localStorage.getItem('event') || '[]');
if(availableEventList.length===0){
    let eveList=document.getElementById("events");
    eveList.innerHTML='<br><p style="margin-left: 50px;font-size: 20px;">No Upcomming events to be displayed...</p>';
}
else{
    var eve = document.getElementById('eventList');
    eve.innerHTML = `<div class="container">`+availableEventList.map((element)=>{return `<div class="card">
          <div class="circle"><br><br><br><h1>${element.eventName}</h1></div>
          <div class="content"><b>Start Date :</b>${element.startDate}<br>
            <p><left><b>No of Days :</b>${element.noOfDays}<br>
            <b>Event Duration :</b>${element.scheduledTime+" "+element.durFormat}<br><br>
              <span><img src="../assets/organizer.png" alt="Organizer :"> <b>${element.organizer}</b></span></left>
            </p><br><a class="eventRegister" id="${element.eventID}" onclick="registerevent(this.id)">Register</a></div></div>`;
  }).join(" ")+ '</div>'; 
}
}
function registerevent(eventID){
  let events=JSON.parse(localStorage.getItem('event') || '[]')
  let curEvent='[]';
  for(let i=0;i<events.length;i++){
    if(events[i].eventID===eventID){
      curEvent=events[i];
      curEvent.length=1;
    }
  }
  localStorage.setItem('curEvent',JSON.stringify(curEvent));
  if(curEvent.length===1){
    window.location='../pages/registerEvent.html'
  }
}