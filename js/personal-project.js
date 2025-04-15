let currentUser = JSON.parse(localStorage.getItem('currentUser')); 
const allProjectLocals = JSON.parse(localStorage.getItem("allProjects")) || [];
let allTasks = JSON.parse(localStorage.getItem('Tasks')) || [];

// Kiểm tra đăng nhập
if (!currentUser) {
    window.location.href = 'login.html'; 
}

// Đăng xuất
let out = document.getElementById("logOut");
out.addEventListener("click", function() {
    window.location.href = 'login.html';
    localStorage.removeItem('currentUser');
});

// Nhiệm vụ của tôi
let mission = document.getElementById("mission");
if (localStorage.getItem("missionClicked") === "true") {
    mission.classList.add("clicked");
}
mission.addEventListener("click", function() {
    myProject.classList.remove("clicked");
    localStorage.removeItem("myProjectClicked");
    mission.classList.add("clicked");
    localStorage.setItem("missionClicked", "true");
    window.location.href = 'category-manager.html#';
});

// Phần được ấn vào trên thanh navbar sẽ đậm hơn và chuyển trang
let myProject = document.getElementById("myProject");
if (localStorage.getItem("myProjectClicked") === "true") {
    myProject.classList.add("clicked");
}
myProject.addEventListener("click", function() {
    mission.classList.remove("clicked");
    localStorage.removeItem("missionClicked");
    myProject.classList.add("clicked");
    localStorage.setItem("myProjectClicked", "true");
    window.location.href = 'personal-project.html';
});

