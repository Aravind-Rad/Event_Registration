// form verification and storing

function userManipulation() {
    //User List Manipulation
    const form = document.getElementById('form');
    const usemail = document.getElementById('usemail');
    const uspassword = document.getElementById('uspass');
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (validateInputs()) {

            //setting current user for logged in page
            var currentUser = findUser(usemail.value);
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            document.getElementById('success-msg').style.display="block";
            const myTimeout = setTimeout(userPageReload, 2000);
        }
    });

    //seting time to reload page
    function userPageReload() {
        window.location = '../pages/eventDashBoard.html';
    }



    //validating Inputs and checking mail authenticity
    const validateInputs = () => {
        const emailValue = usemail.value.trim();
        const passwordValue = uspassword.value.trim();
        let result = true;
        var checkUserExist = findUser(emailValue);
        if (emailValue === '') {
            if (passwordValue === '') {
                result=false;
                setError(usemail, "Please enter your mailID");
                setError(uspassword, "Enter your Password");
            }
            else {
                result=false;
                setError(usemail, "Please enter your mailID");
                setError(uspassword,"");
            }
        }
        else {
            if (checkUserExist === undefined) {
                result = false;
                setError(usemail, "");
                setError(uspassword, "Invalid username or password");
            } else if (checkUserExist.password !== passwordValue) {
                result = false;
                setSuccess(usemail);
                setError(uspassword, "Invalid username or password");
            } else {
                setSuccess(usemail);
                setSuccess(uspassword);
            }
        }
        return result;
    };

    //finding current user
    const findUser = email => {
        let tempUser = localStorage.getItem("users");
        if (tempUser === null)
            return undefined;
        let tempUserList = JSON.parse(tempUser);
        let foundUser = tempUserList.find(e => e.email === email);
        return foundUser;

    }
}