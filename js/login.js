let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) {
    window.history.back();
}
let form = document.getElementById("myForm");
let checkEmail = document.getElementById("checkEmail");
let checkPass = document.getElementById("checkPass");

const accounts = JSON.parse(localStorage.getItem('acc')) || [];

const checkEmailAcc = (email) => {
    if (email === "") {
        checkEmail.innerText = "Vui lòng nhập email!";
        checkEmail.style.color = "red";
        return false;
    }

    if (!email.includes("@") || !email.endsWith(".com")) {
        checkEmail.innerText = "Email không hợp lệ! Vui lòng nhập đúng định dạng.";
        checkEmail.style.color = "red";
        return false;
    }

    checkEmail.innerText = ""; 
    return true;
}

const checkPassAcc = (pass) => {
    if (pass.length == 0) {
        checkPass.innerText = "Vui lòng nhập mật khẩu!";
        checkPass.style.color = "red";
        return false;
    }

    checkPass.innerText = ""; 
    return true;
}

const passwordElement = document.querySelector('#pass');
const iconElement = document.querySelector('.icon');

iconElement.addEventListener('click', function(){
    if(passwordElement.type === 'password' && passwordElement.value !== ''){
        passwordElement.type = 'text'
        iconElement.name = 'eye-off-outline'
    }
    else{
        passwordElement.type = 'password';
        iconElement.name = 'eye-outline'
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("pass").value.trim();

    
    
    let isEmailValid = checkEmailAcc(email);
    let isPassValid = checkPassAcc(pass);

    if (!isEmailValid) {
        checkEmail.style.display = 'block';
    }
    if (!isPassValid) {
        checkPass.style.display = 'block';
    }

    if (isEmailValid && isPassValid) {
        let foundAccount = accounts.find(account => account.email === email);

        if (!foundAccount || accounts == '') {
            checkPass.innerText = "Tài khoản không tồn tại!";
            checkPass.style.color = "red";
            checkPass.style.display = "block";
            return;
        }

        if (foundAccount.password !== pass) {
            checkPass.innerText = "Mật khẩu không đúng!";
            checkPass.style.color = "red";
            checkPass.style.display = "block";
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(foundAccount));

        window.location.href = 'category-manager.html';
        
    }
});


