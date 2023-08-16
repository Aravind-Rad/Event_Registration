//logging current user
function userLogin(){
    const cUser=JSON.parse(localStorage.getItem('currentUser') || '[]');
    if(cUser.length!==0){
        window.location='./pages/eventDashBoard.html';
    }
    else{
        window.location=`./pages/loginPage.html`;
    }
}

// form verification and storing
function userManipulation(){
  //User List Manipulation
  const form = document.getElementById('form');
  const usemail = document.getElementById('usemail');
  const uspassword = document.getElementById('uspass');
  form.addEventListener('submit', e => {
      e.preventDefault();
      if(validateInputs()){
          
          //setting current user for logged in page
          var currentUser=findUser(usemail.value);
          localStorage.setItem("currentUser",JSON.stringify(currentUser));
          let successMsg=document.getElementById('success-msg');
          successMsg.innerText="You've Successfully Logged In";
          const myTimeout = setTimeout(userPageReload, 2000);
      }
  });
  
  //seting time to reload page
  function userPageReload() {
      window.location='./pages/eventDashBoard.html';
  }
  
  //setting input box as error field and success field
  const setSuccess = element => {
      const inputControl = element.parentElement;
      const errorDisplay = inputControl.querySelector('.error');
      errorDisplay.innerText = '';
      inputControl.classList.add('success');
      inputControl.classList.remove('error');
  };
  const setError = (element, message) => {
      const inputControl = element.parentElement;
      const errorDisplay = inputControl.querySelector('.error');
      errorDisplay.innerText = message;
      inputControl.classList.add('error');
      inputControl.classList.remove('success');
  }
  
  //validating Inputs and checking mail authenticity
  const validateInputs = () => {
      const emailValue = usemail.value.trim();
      const passwordValue = uspassword.value.trim();
      let result=true;
      var checkUserExist=findUser(emailValue);
      if(checkUserExist===undefined){
          result=false;
          setError(usemail,"Email does not exists");
          setError(uspassword,"Verify your mail ID");
      } else if(checkUserExist.password!==passwordValue){
          result=false;
          setSuccess(usemail);
          setError(uspassword,"Password doesn't match");
      } else{
          setSuccess(usemail);
          setSuccess(uspassword);
      }
      return result;
  };
  
  //finding current user
  const findUser = email => {
      let tempUser=localStorage.getItem("users");
      if(tempUser===null)
          return undefined;
      let tempUserList=JSON.parse(tempUser);
      let foundUser=tempUserList.find(e=>e.email===email);
      return foundUser;
  
  }
  }


// Registration form link with details

function registerevent(curEvent){
    console.log(curEvent);

    // getting event details from localstorage
    let eventList=JSON.parse(localStorage.getItem('event') ||'[]')
    let curEventDetails='[]';
    for(let i=0;i<eventList.length;i++){
        if(eventList[i].eventID===curEvent){
            curEventDetails=eventList[i];
        }
    }
    if(curEventDetails.length!==0){
    console.log(curEventDetails);
    let eve = document.getElementById('eveDetails');
    eve.innerHTML = `<div class="container">`+curEventDetails.map((details) => {
        return `<div id="details"><b>Event Name:</b>${details.eventName}<br>
        <b>Start date:</b>${details.startDate}<br>
        <b>Stop date:</b><br>
        <b>Description:</b>${details.Description}
        </div>`;
    }).join(" ") + '</div>'; 
}
}