const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e => {
    e.preventDefault();
    if(validateInputs()){

        //storing data in variables
        var unameVal=username.value.trim();
        var emailVal=email.value.trim();
        var pwdVal=password.value.trim();

        
        //creating user object
        var tempdict={
            "userName":unameVal,
            "email":emailVal,
            "password":pwdVal,
            "events":[],
            "custs":[]
        }
        //retrive details from local storage
        var userList=JSON.parse(localStorage.getItem("users") || '[]');
        userList.push(tempdict);
        localStorage.setItem("users",JSON.stringify(userList));
        
        //registration complete message
        var currentUser=tempdict;
        localStorage.setItem("currentUser",JSON.stringify(currentUser));
        document.getElementById('success-msg').style.display="block";
        const myTimeout = setTimeout(pageReload, 2000);
    }
});

//seting time to reload page
function pageReload() {
    window.location='../pages/eventDashBoard.html';
}

//setting input box as error field
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

//setting input box as success field
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

//checking if the mail is valid or not
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//checking if the mail already exists or not
const isRepeatEmail= email => {
    var tempuser=localStorage.getItem("users");
    if(tempuser===null){
        return true;
    }
    var userList=JSON.parse(tempuser);
    var checkUserExist=userList.find(e=>e.email===email)
    if(checkUserExist===undefined){
        return true;
    }
    return false;
}

//validating inputs

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    let result=true;

    if(usernameValue === '') {
        result=false;
        setError(username, 'Username is required');
    }else {
        setSuccess(username);
    }

    if(emailValue === '') {
        result=false;
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        result=false;
        setError(email, 'Provide a valid email address');
    } else if(!isRepeatEmail(emailValue)){
        result=false;
        setError(email,'Email already exist');
    } else {
        setSuccess(email);
    }

    if(passwordValue === '') {
        result=false;
        setError(password, 'Password is required');
    } else if (passwordValue.length < 8 ) {
        result=false;
        setError(password, 'Password must be at least 8 character.')
    } else {
        setSuccess(password);
    }

    if(password2Value === '') {
        result=false;
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        result=false;
        setError(password2, "Passwords doesn't match");
    } else {
        setSuccess(password2);
    }
    return result;
};