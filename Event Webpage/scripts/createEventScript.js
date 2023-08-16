let editId = JSON.parse(localStorage.getItem("editID"));
//delete event
const deleteEvent = (currentEventId) => {
  let i;
  let currentUserObj = JSON.parse(localStorage.getItem("currentUser"));
  let userList = JSON.parse(localStorage.getItem("users"))
  let currentUser = userList.find(e => e.email === currentUserObj.email);
  let tempEventList = currentUser.events;

  let eventsLst = [];
  for (i = 0; i < tempEventList.length; i++) {
    if (tempEventList[i] !== currentEventId) {
      eventsLst.push(tempEventList[i]);
    }
  }
  delete currentUser.events;
  currentUser.events = eventsLst;
  localStorage.setItem("users", JSON.stringify(userList));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  const tempeve = localStorage.getItem('event');
  var tempEvent = JSON.parse(tempeve);
  var finalList = [];
  for (i = 0; i < tempEvent.length; i++) {
    if (tempEvent[i].eventID != currentEventId) {
      finalList.push(tempEvent[i]);
    }
  }
  tempEvent = finalList;
  localStorage.setItem('event', JSON.stringify(tempEvent));
};
// on creating new event
function createNewEvent(create) {
  if (create === "Create") {
    localStorage.setItem("createID", JSON.stringify(true));
  }
  window.location = "../pages/createEvent.html";
}


//removing current user to logout
function delCurrentUser() {
  localStorage.removeItem("currentUser");
  window.location = "../index.html";
}

//checking the user is logged in or not
function pageOnLoad() {
  let currentUser = localStorage.getItem("currentUser");
  let createID = JSON.parse(localStorage.getItem("createID"));
  if (currentUser === null) {
    window.location = "../index.html.html";
    return false;
  }
  else if (createID === true) {
    localStorage.removeItem("editID");
    localStorage.removeItem("createID");
    return true;
  }
  else if (editId !== null) {
    editValues();
    return true;
  }
  else {
    return true;
  }
}


// weekdays details
function defaultVisibility() {
  let weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  weekdays.forEach((dayid) => {
    var checkBox = document.getElementById(dayid);
    var newid = dayid + 't'
    var text = document.getElementById(newid);
    if (checkBox.checked == true) {
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
  });
}

function dayVisibility(dayid) {
  var checkBox = document.getElementById(dayid);
  var newid = dayid + 't'
  var text = document.getElementById(newid);
  if (checkBox.checked == true) {
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}


//Event List Manipulation
let editing = false;
let oldStartDate="";
let form = document.getElementById("regForm");
let eventname = document.getElementById("eventname");
// let today = document.getElementById("stDate");
let today=new Date();
let dayCount = document.getElementById("dayCount");
let scheduleTime = document.getElementById("schTime");
let format = document.getElementById("format");
let desc = document.getElementById("description");
//random ID generation
const uid = () => String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '')
let eventID = uid();

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  // submit if the end is reached
  if (currentTab === 3) {
    document.getElementById("nextBtn").type = "submit";
  }
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("prevBtn").style.display = "none";
  }
  else if (n == (x.length - 2)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }

  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  showTab(currentTab);
}

function editValues() {
  //getting current user details
  var tempEvent = JSON.parse(localStorage.getItem("event") || '[]');
  var finalList = [];
  for (i = 0; i < tempEvent.length; i++) {
    if (tempEvent[i].eventID === editId) {
      finalList = tempEvent[i];
    }
  }
  document.getElementById('formHead').innerHTML = "Edit Event Details"
  eventname.value = finalList.eventName;
  today.value = finalList.startDate;
  dayCount.value = finalList.noOfDays;
  scheduleTime.value = finalList.scheduledTime;
  format.value = finalList.durFormat;
  desc.value = finalList.Description;
  let weekTiming = finalList.weekTiming;
  document.getElementById("mon").checked=false;
  document.getElementById("tue").checked=false;
  document.getElementById("wed").checked=false;
  document.getElementById("thu").checked=false;
  document.getElementById("fri").checked=false;
  weekTiming.forEach(element => {
    let tempday = element.day;
    let tempStart = element.start;
    let tempEnd = element.end;
    let start = tempday + 'StTime';
    let end = tempday + 'EnTime';
    document.getElementById(tempday).checked = true;
    document.getElementById(start).value = tempStart;
    document.getElementById(end).value = tempEnd;
  });
  editing = true;
  oldStartDate=finalList.startDate;
}
// Event manipulation
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm()) {
    //storing data in variables
    let cUser = JSON.parse(localStorage.getItem("currentUser"));
    let weekTime = JSON.parse(localStorage.getItem("WeekTiming") || '[]');
    var emailVal = cUser.email;
    let organizer = cUser.userName;
    let eventName = eventname.value.trim();
    let todayVal =  today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let dayCountVal = dayCount.value.trim();
    let schTimeVal = scheduleTime.value.trim();
    let descrip = desc.value.trim();
    let durFormat = format.value.trim();
    if (editId !== null) {
      eventID = editId;
    }
    const eventDetails = {
      usermail: emailVal,
      custs: [],
      organizer: organizer,
      eventName: eventName,
      eventID: eventID,
      startDate: todayVal,
      noOfDays: dayCountVal,
      scheduledTime: schTimeVal,
      weekTiming: weekTime,
      Description: descrip,
      durFormat: durFormat,
    };
    if (editId !== null) {
      deleteEvent(editId);
    }
    // retrive event details from localstorage
    let eventTemp = JSON.parse(localStorage.getItem("event") || '[]');

    eventTemp.push(eventDetails);
    localStorage.setItem("event", JSON.stringify(eventTemp));

    //retrive details from local storage
    let userList = JSON.parse(localStorage.getItem("users") || '[]');
    let currentUserList = userList.find((e) => e.email === cUser.email);
    let eventList = currentUserList.events;
    eventList.push(eventID);
    delete currentUserList.events;
    currentUserList.events = eventList;
    localStorage.setItem("users", JSON.stringify(userList));
    // setting current user
    localStorage.setItem("currentUser", JSON.stringify(currentUserList));

    //display success message
    let successMsg = document.getElementById("success-msg");
    if (editing) {
      successMsg.innerText = "Your event has been edited successfully";
      localStorage.removeItem("editID");
    }
    else {
      successMsg.innerText = "You've Successfully created an event";
    }
    setTimeout(() => {
      userPageReload()
    }, 1000);
  }
});

//seting time to reload page
function userPageReload() {
  window.location = "../pages/eventDashBoard.html";
}


function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  // getting values from form
  let eventnameValue = eventname.value.trim();
  let dayCountvalue = dayCount.value.trim();
  let formatValue = format.value.trim();
  let scheduleTimeValue = scheduleTime.value.trim();
  let presentDate = new Date();
  presentDate.setDate(presentDate.getDate()-1);

  // for Tab 0 
  if (currentTab === 0) {
    if (eventnameValue === "") {
      valid = false;
      setError(eventname, "Event Name is required");
    } else {
      setSuccess(eventname);
    }
    //start name
    
    if (dayCountvalue <= 0) {
      valid = false;
      setError(dayCount, "Please enter valid number of days");
    } else {
      setSuccess(dayCount);
    }
    if (formatValue === "hrs") {
      scheduleTimeValue = scheduleTimeValue * 60;
    }
    if (scheduleTimeValue <= 0) {
      valid = false;
      document.getElementById("schTime").style.borderColor = "#ff3860";
      let error = document.getElementById("error");
      error.innerHTML =
        '<p style="color:#ff3860">Please enter valid duration</p>';
    } else if (scheduleTimeValue > 1440) {
      valid = false;
      document.getElementById("schTime").style.borderColor = "#ff3860";
      let error = document.getElementById("error");
      error.innerHTML =
        '<p style="color:#ff3860 ">Please enter valid duration</p>';
    } else {
      document.getElementById("schTime").style.borderColor = "#09c372";
      let error = document.getElementById("error");
      error.innerHTML = "";
    }
  }
  // for tab 2
  if (currentTab === 1) {
    let checkboxes = document.querySelectorAll('input[name="weekdays"]:checked');
    let weekdays = [];
    checkboxes.forEach((checkbox) => {
      weekdays.push(checkbox.id);
    });

    if (weekdays.length === 0) {
      const errorDisplay = document.querySelector(".dayerror");
      errorDisplay.innerText = `Select atleast one day of the week`;
      valid = false;
    }
    else {
      const errorDisplay = document.querySelector(".dayerror");
      errorDisplay.innerText = ``;
      // localStorage.removeItem("WeekTiming");
      let weekTiming =JSON.parse(localStorage.getItem('WeekTiming') || '[]');
      weekdays.forEach((element) => {
        let tempstart = element + 'StTime';
        let tempend = element + 'EnTime';
        let startVal = document.getElementById(tempstart).value.trim();
        let endVal = document.getElementById(tempend).value.trim();
        if (startVal === '') {
          document.getElementById(tempstart).value = '09:00';
          valid = false;
        }
        if (endVal === '') {
          document.getElementById(tempend).value = '18:00';
          valid = false;
        }
        if (endVal <= startVal) {
          valid = false;
          let err = document.getElementById(tempend).parentElement.parentElement;
          let errcode = err.querySelector('.weekerror');
          errcode.innerHTML = `Enter valid time`;
        }
        else {
          let err = document.getElementById(tempend).parentElement.parentElement;
          let errcode = err.querySelector('.weekerror');
          errcode.innerHTML = ``;
        }

        const tempElement = {
          day: element,
          start: startVal,
          end: endVal
        };

        weekTiming.push(tempElement);
        localStorage.setItem("WeekTiming", JSON.stringify(weekTiming));
      });
    }
  }

  // for tab 3
  // if(currentTab===3){
  // if(descvalue === '') {
  //   valid=false;
  //   setError(desc,'Please give the description about the event');
  // }else {
  //   setSuccess(desc);
  // }
  // }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

function pageUnLoad() {
  localStorage.removeItem("WeekTiming");
}

//converting time from 12hrs format to 24 hrs format
function timeFormatConvertor(curTime){
  curTime=('0'+curTime).slice(-11);
  hours=Number(curTime.slice(0,2));
  amorpm = curTime.slice(-2);
  if(amorpm==='PM'){
      hours+=12;
  }
  if(hours===24){
      hours=12;
  }
  mins=curTime.slice(3,5);
  hours=('0'+hours).slice(-2);
  finalTime=hours+':'+mins;
  return finalTime;
  }
