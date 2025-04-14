let form = document.getElementById("myForm");
let checkName = document.getElementById("checkName");
let checkEmail = document.getElementById("checkEmail");
let checkPass = document.getElementById("checkPass");
let checkConfirmPass = document.getElementById("checkConfirmPass");
let buttonRegist = document.getElementById("submit");

const accounts = JSON.parse(localStorage.getItem('acc')) || [];

const checkNewName = (name) => {
    let nameRegex = /^[A-Za-zÀ-Ỹà-ỹĐđ\s]+$/;

    if (name === "") {
        checkName.innerText = "Vui lòng nhập Tên!";
        checkName.style.color = "red";
        return false;
    }

    if (!nameRegex.test(name)) {
        checkName.innerText = "Tên không được chứa số hoặc ký tự đặc biệt!";
        checkName.style.color = "red";
        return false;
    }

    checkName.innerText = "";
    return true;
};

const checkNewEmail = (email) => {
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
};

const checkNewPass = (pass) => {
    if (pass === "") {
        checkPass.innerText = "Vui lòng nhập mật khẩu!";
        checkPass.style.color = "red";
        return false;
    }

    if (pass.length < 8) {
        checkPass.innerText = "Mật khẩu quá ngắn! Vui lòng thử lại.";
        checkPass.style.color = "red";
        return false;
    }

    checkPass.innerText = "";
    return true;
};

const checkNewConfirmPass = (pass, confirmPass) => {
    if (confirmPass === "") {
        checkConfirmPass.innerText = "Vui lòng nhập mật khẩu!";
        checkConfirmPass.style.color = "red";
        return false;
    }

    if (pass !== confirmPass) {
        checkConfirmPass.innerText = "Mật khẩu sai! Vui lòng thử lại.";
        checkConfirmPass.style.color = "red";
        return false;
    }

    checkConfirmPass.innerText = "";
    return true;
};


form.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("pass").value.trim();
    let confirmPass = document.getElementById("confirmPass").value.trim();

    if (!checkNewName(name)) {
        checkName.style.display = 'block';
    }
    if (!checkNewEmail(email)) {
        checkEmail.style.display = 'block';
    }
    if (!checkNewPass(pass)) {
        checkPass.style.display = 'block';
    }
    if (!checkNewConfirmPass(confirmPass)) {
        checkConfirmPass.style.display = 'block';
    }
    if (checkNewEmail(email) && checkNewPass(pass) && checkNewConfirmPass(pass, confirmPass) && checkNewName(name)) {
        let existingAccount = accounts.find(account => account.email === email);

        if (existingAccount) {
            checkConfirmPass.innerText = "Email đã tồn tại! Vui lòng sử dụng email khác.";
            checkConfirmPass.style.color = "red";
            checkConfirmPass.style.display = "block"; 
            return;
        }

        const newAccount = {
            id: accounts.length + 1,
            fullName: name,
            email: email,
            password: pass,
        };

        accounts.push(newAccount);
        localStorage.setItem('acc', JSON.stringify(accounts));

        name = "";
        email = "";
        pass = "";
        confirmPass = "";
        
        setTimeout(() => {
            window.location.href = 'login.html';
        },1000)

    }
});




