const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
let events = JSON.parse(localStorage.getItem('event') || '[]');
let cEvent = JSON.parse(localStorage.getItem("curEvent"));
let startDate = cEvent.startDate;
let noOfDays = cEvent.noOfDays;
let weekdays = cEvent.weekTiming;
let days = [];
let curSlot;
for (let i = 0; i < weekdays.length; i++) {
    temp = weekdays[i].day;
    if (temp === 'sun') {
        val = 0;
    }
    else if (temp === 'mon') {
        val = 1;
    }
    else if (temp === 'tue') {
        val = 2;
    }
    else if (temp === 'wed') {
        val = 3;
    }
    else if (temp === 'thu') {
        val = 4;
    }
    else if (temp === 'fri') {
        val = 5;
    }
    else if (temp === 'sat') {
        val = 6;
    }
    days.push(val);
}
startDate = new Date(startDate);
startDate.setDate(startDate.getDate() - 1);
start = new Date(startDate);
let endDate = start;
for (let i = 1; i <= noOfDays; i++) {
    tempDate = endDate.getDay();
    if (!days.includes(tempDate)) {
        i = i - 1;
    }
    endDate.setDate(endDate.getDate() + 1);
}
let formStepsNum = 0;
nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (validateEventInputs(formStepsNum)) {
            formStepsNum++;
            updateFormSteps();
            updateProgressbar();
        }
    });
});
prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});
function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
            formStep.classList.remove("form-step-active");
    });
    formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
    progressSteps.forEach((progressStep, index) => {
        if (index <= formStepsNum) {
            progressStep.classList.add('progress-step-active');
        } else {
            progressStep.classList.remove('progress-step-active');
        }
    });
    const progressActive = document.querySelectorAll(".progress-step-active");
    progress.style.width = ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + '%';
}

function splitTimeIntoSlots(startTime, endTime, slotDuration) {
    const slots = [];
    let currentTime = new Date(startTime);

    while (currentTime <= endTime) {
        slots.push(new Date(currentTime));
        currentTime.setTime(currentTime.getTime() + slotDuration * 60000); // Convert minutes to milliseconds
    }

    return slots;
}
let curDate;
// calender functionalities
let calendar = document.querySelector(".calendar");
const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
isLeapYear = (year) => {
    return (
        (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
        (year % 100 === 0 && year % 400 === 0)
    );
};
getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
};
let eventDays = [];
generateCalendar = (month, year) => {
    let calendar_days = calendar.querySelector(".calendar-days");
    let calendar_header_year = calendar.querySelector("#year");

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,];

    calendar_days.innerHTML = "";

    let currDate = new Date();
    if (month > 11 || month < 0) month = currDate.getMonth();
    if (!year) year = currDate.getFullYear();

    let curr_month = `${month_names[month]}`;
    month_picker.innerHTML = curr_month;
    calendar_header_year.innerHTML = year;
    // get first day of month
    let first_day = new Date(year, month, 1);
    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement("div");
        if (i >= first_day.getDay()) {
            let datetemp = i - first_day.getDay() + 1;
            let tempDate = year + "-" + (month + 1) + "-" + datetemp;
            let temp = new Date(tempDate);
            let present = new Date()
            present = new Date(present.setDate(present.getDate() - 1));
            if (temp >= startDate && temp <= endDate && temp > present) {
                if (days.includes(temp.getDay())) {
                    eventDays.push(tempDate);
                    day.classList.add("calendar-day-hover");
                    day.innerHTML = `<a class="normalDay" id=${tempDate} onclick=displayEvents(this.id)>${datetemp}</a>`;
                    day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`;
                }
                else {
                    day.classList.add("calendar-otherdays");
                    day.innerHTML = `<a>${datetemp}</a>`
                }
            }
            else {
                day.classList.add("calendar-otherdays");
                day.innerHTML = `<a>${datetemp}</a>`
            }
        }
        calendar_days.appendChild(day);   // This is where the days are appended to the calender
    }
    let allSlots = (cEvent.allSlots || []);

    let slotDur = cEvent.scheduledTime;
    if (cEvent.durFormat === 'hrs') {
        slotDur = slotDur * 60;
    }
    if (allSlots.length < eventDays.length) {
        for (let i = allSlots.length; i < eventDays.length; i++) {
            singleDaySlot = []
            insdate = eventDays[i];
            let day = new Date(insdate).getDay();
            if (day === 0) {
                day = 'sun'
            } else if (day === 1) {
                day = 'mon';
            } else if (day === 2) {
                day = 'tue';
            } else if (day === 3) {
                day = 'wed';
            } else if (day === 4) {
                day = 'thu';
            } else if (day === 5) {
                day = 'fri';
            } else if (day === 6) {
                day = 'sat';
            }
            let insStart, insEnd;
            for (let t = 0; t < weekdays.length; t++) {
                if (day === weekdays[t].day) {
                    insStart = '2023-08-04T' + weekdays[t].start;
                    insEnd = '2023-08-04T' + weekdays[t].end;
                }
            }
            const startTime = new Date(insStart);
            const endTime = new Date(insEnd);
            const timeSlots = splitTimeIntoSlots(startTime, endTime, slotDur);
            let todaySlots = []
            // Print the time slots
            timeSlots.forEach((slot) => {
                todaySlots.push(slot.toLocaleTimeString('en-US'));
            });
            if (todaySlots.length > 0) {
                for (let index = 0; index < todaySlots.length - 1; index++) {
                    slotStart = todaySlots[index];
                    slotEnd = todaySlots[index + 1];
                    let slotDetail = {
                        date: insdate,
                        slotStart: slotStart,
                        slotEnd: slotEnd,
                        availability: "Available"
                    }
                    singleDaySlot.push(slotDetail);
                }
            }
            allSlots.push(singleDaySlot);
            let events = JSON.parse(localStorage.getItem("event") || '[]');
            let curEvent = JSON.parse(localStorage.getItem("curEvent" || '[]'));
            let bookedEvent = JSON.parse(localStorage.getItem("bookedSlots" || '[]'));
            if (bookedEvent !== null) {
                let oldregister = bookedEvent.filter((element) => element.eventId === curEvent.eventID);
                let editSlots = allSlots;
                for (let index = 0; index < oldregister.length; index++) {
                    let registeredEvent = editSlots.filter((element) => element[0].date === oldregister[index].date);
                    for (let indSlot = 0; indSlot < registeredEvent.length; indSlot++) {
                        let curSlot = registeredEvent[indSlot];
                        oldStart = oldregister[index].start;
                        oldEnd = oldregister[index].end;
                        for (let slot = 0; slot < curSlot.length; slot++) {
                            newStart = timeFormatConvertor(curSlot[slot].slotStart);
                            newEnd = timeFormatConvertor(curSlot[slot].slotEnd);
                            if ((newStart >= oldStart && newStart < oldEnd) || (newEnd > oldStart && newEnd <= oldEnd)) {
                                curSlot[slot].availability = "Booked";
                            }
                        }
                    }
                }
                let thisEvent = [];
                for (let ed = 0; ed < events.length; ed++) {
                    if (events[ed].eventID !== curEvent.eventID) {
                        thisEvent.push(events[ed]);
                    }
                }
                thisEvent.push(curEvent)
                localStorage.setItem("event", JSON.stringify(thisEvent));
                localStorage.setItem("curEvent", JSON.stringify(curEvent));
            }
        }
    }
    for (let i = 0; i < events.length; i++) {
        if (events[i].eventID === cEvent.eventID) {
            events[i].allSlots = allSlots;
            cEvent.allSlots = allSlots;
        }
    }
    localStorage.setItem("curEvent", JSON.stringify(cEvent));
    localStorage.setItem("event", JSON.stringify(events));
    curDate = eventDays[0];
    displayEvents(curDate);
};

let month_list = calendar.querySelector(".month-list");

month_names.forEach((e, index) => {
    let month = document.createElement("div");
    month.innerHTML = `<div data-month="${index}">${e}</div>`;
    month.querySelector("div").onclick = () => {
        month_list.classList.remove("show");
        curr_month.value = index;
        generateCalendar(index, curr_year.value);
    };
    month_list.appendChild(month);
});

let month_picker = calendar.querySelector("#month-picker");

let currDate = startDate;

let curr_month = { value: currDate.getMonth() };
let curr_year = { value: currDate.getFullYear() };

generateCalendar(curr_month.value, curr_year.value);

document.querySelector("#prev-month").onclick = () => {
    --curr_month.value;
    if (curr_month.value == -1) {
        curr_month.value = 11;
        curr_year -= 1;
    }
    generateCalendar(curr_month.value, curr_year.value);
};

document.querySelector("#next-month").onclick = () => {
    ++curr_month.value;
    if (curr_month.value == 12) {
        curr_month.value = 0;
        curr_year += 1;
    }
    generateCalendar(curr_month.value, curr_year.value);
};
// function to display the event slots for a selected day

function displayEvents(evedate) {
    elem = document.getElementsByClassName("normalDay");
    for (let index = 0; index < elem.length; index++) {
        if (elem[index].parentElement.classList.contains("curr-date")) {
            elem[index].parentElement.classList.remove("curr-date");
        }
        if (elem[index].id === evedate) {
            elem[index].style.color = "white";
            elem[index].parentElement.classList.add("curr-date");

        }
        else {
            elem[index].style.color = "black"
        }
    }
    curDate = evedate;
    curSlot = undefined;
    let allSlots = cEvent.allSlots, finalSlot;
    for (let index = 0; index < allSlots.length; index++) {
        if (allSlots[index][0].date === evedate) {
            finalSlot = allSlots[index];
        }
    }
    let avail = 0
    let presentTime = new Date();
    var slots = document.getElementById('availableSlots');
    slots.innerHTML = `<div class="slotList">` + finalSlot.map((element) => {
        var today = new Date(element.date);
        var date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        final = date + 'T' + timeFormatConvertor(element.slotStart);
        eveSlotStart = new Date(final);
        if (presentTime.getTime() <= eveSlotStart.getTime()) {
            if (element.availability === "Available") {
                avail++;
                return `<label class="slotRadio" for="${element.slotStart + '-' + element.slotEnd}"  id="${element.slotStart + '-' + element.slotEnd}" onclick=checkSlot(this.id)>${element.slotStart + ' - ' + element.slotEnd}</label>
            <input id="${element.slotStart + '-' + element.slotEnd}" class="radioBtn"  type="radio" name="${element.date}"><br></input>`;
            }
        }
    }).join(" ") + EmptySlots(avail) + '</div>';
}
function EmptySlots(avail) {
    if (avail === 0) {
        return `<br><center><h4  style="color: rgb(194, 55, 55);">No Available Slots for Today</h4></center>`;
    }
    else {
        return ``;
    }
}
function checkSlot(slotId) {
    curSlot = slotId;
    let st = document.querySelectorAll(".slotRadio");
    for (let i = 0; i < st.length; i++) {
        st[i].style.color = "black";
        st[i].style.backgroundColor = "#f5f5f5";
    }
    document.getElementById(slotId).style.color = "white";
    document.getElementById(slotId).style.backgroundColor = "black";
}

function validateEventInputs(stepnum) {
    let uName = document.getElementById("username");
    let mailId = document.getElementById("email");
    let phoneNo = document.getElementById("phone");
    let usernameValue = uName.value.trim();
    let emailValue = mailId.value.trim();
    let phone = phoneNo.value.trim();
    let result = true;
    if (stepnum === 0) {
        if (curSlot === undefined) {
            result = false;
            document.getElementById("errormsg").innerHTML = `<p class="errmsg">Please select an slot to proceed</p>`;
        }
        else {
            document.getElementById("errormsg").innerHTML = ``;
        }
    }
    else if (stepnum === 1) {
        var phoneNoPattern = /^\d{10}$/;
        if (usernameValue === '') {
            result = false;
            setError(username, 'Username is required');
        } else {
            setSuccess(username);
        }
        if (emailValue === '') {
            result = false;
            setError(mailId, 'Email is required');
        }else if (!isValidEmail(emailValue)) {
            result=false;
            setError(email, 'Provide a valid email address');
        }
        else {
            setSuccess(email);
        }
        if (phone === '') {
            result = false;
            setError(phoneNo, 'Phone number is required');
        }
        else if (phoneNo.value.match(phoneNoPattern)) {
            setSuccess(phoneNo);
        }
        else {
            setError(phoneNo, 'Enter valid mobile number');
            result = false;
        }
        document.getElementById("eventDetails").innerHTML = `<table><tr><th><h1>Event Details</h1></th></tr>
            <tr><td><b>Event Name</b></td><td>: ${cEvent.eventName}</td></tr>
            <tr><td><b>Date </b></td><td>: ${curDate}</td></tr>
            <tr><td><b>Slot </b></td><td>: ${curSlot}</td></tr>
            <tr><td><b>Description </b></td><td>: ${cEvent.Description}</td></tr>
            <tr><td><b>Name </b></td><td>: ${uName.value}</td></tr>
            <tr><td><b>Mobile No </b></td><td>: ${phoneNo.value}</td></tr>
            <tr><td><b>Email </b></td><td>: ${mailId.value}</td></tr></table>`;
    }
    else {
        console.log("done");
    }
    if (result === true) {
        localStorage.setItem("curEvent", JSON.stringify(cEvent))
    }
    return result;
}



let form = document.getElementById("form");
// form submition
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let events = JSON.parse(localStorage.getItem('event') || '[]');
    if (validateEventInputs()) {
        //storing data in variables
        //random ID generation
        const uid = () => String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '')
        let custID = uid();
        let custName = document.getElementById("username").value;
        let phone = document.getElementById("phone").value;
        let mail = document.getElementById("email").value;
        let eventId = cEvent.eventID;
        const custDetails = {
            eventId: eventId,
            date: curDate,
            slotId: curSlot,
            custName: custName,
            phoneNo: phone,
            mailID: mail,
            custId: custID
        };
        //booking the slot for the cust

        let bookedSlots = JSON.parse(localStorage.getItem("bookedSlots") || '[]');
        let allSlots = cEvent.allSlots, finalSlot;
        for (let index = 0; index < allSlots.length; index++) {
            if (allSlots[index][0].date === curDate) {
                finalSlot = allSlots[index];
            }
        }
        for (let i = 0; i < finalSlot.length; i++) {
            tempId = finalSlot[i].slotStart + '-' + finalSlot[i].slotEnd;
            if (tempId === curSlot) {
                slotStart = timeFormatConvertor(finalSlot[i].slotStart);
                slotEnd = timeFormatConvertor(finalSlot[i].slotEnd);
                finalSlot[i].availability = custID;
                let regSlot = {
                    eventId: cEvent.eventID,
                    custId: custID,
                    date: finalSlot[i].date,
                    start: slotStart,
                    end: slotEnd
                };
                bookedSlots.push(regSlot);
                localStorage.setItem("bookedSlots", JSON.stringify(bookedSlots));
            }
        }
        for (let i = 0; i < events.length; i++) {
            if (events[i].eventID === cEvent.eventID) {
                events[i] = cEvent;
            }
        }

        // saving customer details from localstorage
        let eventTemp = JSON.parse(localStorage.getItem("custs") || '[]');
        eventTemp.push(custDetails);
        localStorage.setItem("custs", JSON.stringify(eventTemp));

        //retrive details from local storage and add custId to the users 
        var userList = JSON.parse(localStorage.getItem("users") || '[]');
        let currentUserList = userList.find((e) => e.email === cEvent.usermail);
        let custList = currentUserList.custs;
        custList.push(custID);
        delete currentUserList.custs;
        currentUserList.custs = custList;
        localStorage.setItem("users", JSON.stringify(userList));

        // add custId to event
        let curEventList = events.find((e) => e.eventID === cEvent.eventID);
        let customList = curEventList.custs;
        customList.push(custID);
        delete curEventList.custs;
        curEventList.custs = customList;
        localStorage.setItem('event', JSON.stringify(events));
        localStorage.setItem("curEvent", JSON.stringify(cEvent));
        //display success message
        document.getElementById('success-msg').style.display = "block";
        setTimeout(() => {
            userPageReload()
        }, 1000);
    }
    //seting time to reload page
    function userPageReload() {
        window.location = "../pages/eventsDisplay.html";
    }
});


// converting time format from 12hrs to 24 hrs
function timeFormatConvertor(curTime) {
    curTime = ('0' + curTime).slice(-11);
    hours = Number(curTime.slice(0, 2));
    amorpm = curTime.slice(-2);
    if (amorpm === 'PM') {
        hours += 12;
    }
    if (hours === 24) {
        hours = 12;
    }
    mins = curTime.slice(3, 5);
    hours = ('0' + hours).slice(-2);
    finalTime = hours + ':' + mins;
    return finalTime;
}
