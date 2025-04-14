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

// Phần được ấn vào trên thanh navbar sẽ đậm hơn và chuyển trang
let mission = document.getElementById("mission");
if (localStorage.getItem("missionClicked") === "true") {
    mission.classList.add("clicked");
}
mission.addEventListener("click", function() {
    mission.classList.add("clicked");
    localStorage.setItem("missionClicked", "true");
    window.location.href = 'category-manager.html#';
});

// Lấy ra index của dự án từ trang trước
const index = window.location.href.split("?task=")[1];

// Hiển thị nội dung dự án đã tạo từ trang trước
function inforProject() {
    const nameProject = document.querySelector(".box-1-cnt1");
    const describeProject = document.querySelector(".box-2-cnt1");
    nameProject.innerText = allProjectLocals[currentUser.id][index].name;
    describeProject.innerText = allProjectLocals[currentUser.id][index].describe;
}

// Thêm thành viên mới
let checkEmail = document.getElementById("checkEmail");
let inputEmail = document.querySelector('#email');
const accounts = JSON.parse(localStorage.getItem('acc')) || [];

const checkEmailMember = (email) => {
    if (email === "") {
        checkEmail.innerText = "Vui lòng nhập email!";
        checkEmail.style.color = "red";
        checkEmail.style.display = "block";
        inputEmail.style.borderColor = 'red';
        inputEmail.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return false;
    }
    if (!email.includes("@") || !email.endsWith(".com")) {
        checkEmail.innerText = "Email không hợp lệ! Vui lòng nhập đúng định dạng.";
        checkEmail.style.color = "red";
        checkEmail.style.display = "block";
        inputEmail.style.borderColor = 'red';
        inputEmail.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return false;
    }
    checkEmail.innerText = ""; 
    return true;
};

const btnAdd = document.querySelector(".btnAdd");
btnAdd.addEventListener("click", function() {
    const modal = document.querySelector('#exampleModalAdd');
    let email = document.getElementById("email").value.trim();
    let role = document.getElementById("role").value;

    let isEmailValid = checkEmailMember(email);
    if (!isEmailValid) {
        checkEmail.style.display = 'block';
        return;
    }

    const foundAccount = accounts.find(account => account.email === email);
    if (!foundAccount) {
        checkEmail.innerText = "Tài khoản không tồn tại!";
        checkEmail.style.color = "red";
        checkEmail.style.display = "block";
        inputEmail.style.borderColor = 'red';
        inputEmail.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }

    const accExist = memberList.find(member => member.userId === foundAccount.id);
    if (accExist) {
        checkEmail.innerText = "Thành viên đã tồn tại!";
        checkEmail.style.color = "red";
        checkEmail.style.display = "block";
        inputEmail.style.borderColor = 'red';
        inputEmail.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }

    let newMember = {
        userId: foundAccount.id,
        role: role,
        avatarColor: getRandomRGBColor(),
    };

    checkEmail.innerText = "";
    checkEmail.style.color = "";
    checkEmail.style.display = "none";
    inputEmail.value = '';
    inputEmail.style.borderColor = '';
    inputEmail.style.boxShadow = '';

    allProjectLocals[currentUser.id][index].member.push(newMember);
    localStorage.setItem("allProjects", JSON.stringify(allProjectLocals));

    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    renderMember(memberList);
});

// Đổi màu avatar
function getRandomRGBColor() {
    let r = Math.floor(Math.random() * 256); 
    let g = Math.floor(Math.random() * 256); 
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Render thành viên
let memberList = allProjectLocals[currentUser.id][index].member;
const outMember = document.querySelector(".outMember");

function renderMember(memberList) {
    outMember.innerHTML = memberList.slice(0, 2).map((aMember) => {
        let foundAccount = accounts.find(account => account.id === aMember.userId);
        let avatarColor = getRandomRGBColor();
        return `<div class="member">
                    <div class="avatar-member" style="background-color: ${avatarColor}; color: white; font-weight: bold; text-transform: uppercase;">
                        <p>${foundAccount.fullName.charAt(0)}${foundAccount.fullName.charAt(1)}</p>
                    </div>
                    <div class="infor-member">
                        <p class="name-member">${foundAccount.fullName}</p>
                        <p class="position-member">${aMember.role}</p>
                    </div>
                </div>`;
    }).join('');
}

// Render toàn bộ thành viên
const allMember = document.querySelector('.member-body');
function renderAllMember(allMemberList) {
    allMember.innerHTML = allMemberList.map((mem, index) => {
        let foundAccount = accounts.find(account => account.id === mem.userId);        
        let isFirstMember = index === 0;
        let avatarColor = getRandomRGBColor();
        return `<div class="member">
                    <div class="avatar" style="background-color: ${avatarColor}; color: white; font-weight: bold; text-transform: uppercase;">${foundAccount.fullName.charAt(0)}${foundAccount.fullName.charAt(1)}</div>
                    <div class="member-infor">
                        <strong>${foundAccount.fullName}</strong>
                        <span>${foundAccount.email}</span>
                    </div>
                    <select name="role" id="roleAll" ${isFirstMember ? "disabled" : ""}>
                        <option value="${mem.role}">${mem.role}</option>
                        ${!isFirstMember ? `
                            <option value="Developer">Developer</option>
                            <option value="Tester">Tester</option>
                        ` : ""}
                    </select>
                    ${!isFirstMember ? `<button onclick="binDelete(event)" class="delete-btn"><i class="bi bi-trash"></i></button>` : "<div>       </div>"}                                          
                </div>`;
    }).join('');
}

const btnAll = document.querySelector('.btn-all');
btnAll.addEventListener('click', function() {
    renderAllMember(memberList);
});

// Sự kiện xóa thành viên
let updatedMemberList = [];
function binDelete(event) {
    const memberDiv = event.target.closest('.member'); 
    const userEmail = memberDiv.querySelector('.member-infor span').textContent; 
    updatedMemberList = memberList.filter(mem => {
        let foundAccount = accounts.find(account => account.id === mem.userId);
        return foundAccount.email !== userEmail;
    });
    renderAllMember(updatedMemberList);
}

// Lưu danh sách thành viên sau khi xóa
const allMemSave = document.querySelector('.allMem-save');
allMemSave.addEventListener('click', function() {
    const modal = document.querySelector('#allMember');
    allProjectLocals[currentUser.id][index].member = updatedMemberList;
    localStorage.setItem("allProjects", JSON.stringify(allProjectLocals));
    memberList = allProjectLocals[currentUser.id][index].member;

    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    renderAllMember(updatedMemberList);
    renderMember(updatedMemberList);
});

// Render người phụ trách khi thêm nhiệm vụ
const personCharge = document.querySelector("#person-in-charge-input");
const addTaskBtn = document.querySelector("#addTask");
addTaskBtn.addEventListener('click', function() {
    let accountExist = [];
    let htmls = `<option value="">Chọn người phụ trách</option>`;
    accountExist = memberList.map(mem => {
        let foundAcc = accounts.find(account => account.id === mem.userId);
        return `<option value="${foundAcc.fullName}">${foundAcc.fullName}</option>`;
    }).join('');
    htmls += accountExist;
    personCharge.innerHTML = htmls;
});

// Thêm nhiệm vụ mới
const nameTask = document.querySelector("#name-task-input");
const startDate = document.querySelector("#on-date-input");
const endDate = document.querySelector("#late-date");
const priority = document.querySelector("#priority-input");
const progress = document.querySelector("#progress-input");
const statusNow = document.querySelector("#status-input");

//Check thông tin phần nhiệm vụ
let checkTask = document.querySelector(".checkTask");
let checkPerson = document.querySelector(".checkPerson");
let checkStatus = document.querySelector(".checkStatus");
let checkStartDate = document.querySelector(".checkStartDate");
let checkEndDate = document.querySelector(".checkEndDate");
let checkPriority = document.querySelector(".checkPriority");
let checkProgress = document.querySelector(".checkProgress");
let count = true;



const btnAddTask = document.querySelector(".btnSave");
btnAddTask.addEventListener('click', function() {
    count = true;
    const modal = document.querySelector('#exampleModalChange');
    if (nameTask.value == '') {
        checkTask.style.display = 'block';
        checkTask.innerText = "Vui lòng nhập nhiệm vụ!";
        checkTask.style.color = "red";
        nameTask.style.borderColor = 'red';
        nameTask.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }
    if (isDuplicateTaskName(nameTask.value, allTasks)) {
        checkTask.style.display = 'block';
        checkTask.innerText = "Tên nhiệm vụ đã tồn tại!";
        checkTask.style.color = "red";
        nameTask.style.borderColor = 'red';
        nameTask.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }
    if (personCharge.value == '') {
        checkPerson.style.display = 'block';
        checkPerson.innerText = "Vui lòng chọn người phụ trách!";
        checkPerson.style.color = "red";
        personCharge.style.borderColor = 'red';
        personCharge.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }
    if (startDate.value == '') {
        checkStartDate.style.display = 'block';
        checkStartDate.innerText = "Vui lòng chọn ngày bắt đầu!";
        checkStartDate.style.color = "red";
        startDate.style.borderColor = 'red';
        startDate.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }
    if (endDate.value == '') {
        checkEndDate.style.display = 'block';
        checkEndDate.innerText = "Vui lòng chọn hạn cuối!";
        checkEndDate.style.color = "red";
        endDate.style.borderColor = 'red';
        endDate.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }

    if (startDate.value && endDate.value) {
        const today = new Date();
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
    
        if (start <= today) {
            checkStartDate.style.display = 'block';
            checkStartDate.innerText = "Ngày bắt đầu phải lớn hơn ngày hiện tại!";
            checkStartDate.style.color = "red";
            startDate.style.borderColor = 'red';
            startDate.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
            count = false;
        }
    
        if (end <= start) {
            checkEndDate.style.display = 'block';
            checkEndDate.innerText = "Hạn chót phải lớn hơn ngày bắt đầu!";
            checkEndDate.style.color = "red";
            endDate.style.borderColor = 'red';
            endDate.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
            count = false;
        }
    }

    if (priority.value == '') {
        checkPriority.style.display = 'block';
        checkPriority.innerText = "Vui lòng chọn độ ưu tiên!";
        checkPriority.style.color = "red";
        priority.style.borderColor = 'red';
        priority.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }
    if (progress.value == '') {
        checkProgress.style.display = 'block';
        checkProgress.innerText = "Vui lòng chọn tiến độ!";
        checkProgress.style.color = "red";
        progress.style.borderColor = 'red';
        progress.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }
    if (statusNow.value == '') {
        checkStatus.style.display = 'block';
        checkStatus.innerText = "Vui lòng chọn trạng thái!";
        checkStatus.style.color = "red";
        statusNow.style.borderColor = 'red';
        statusNow.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        count = false;
    }
    if (count) {
        if (idFixTask !== null) {
            // Chế độ sửa
            const taskIndex = allTasks.findIndex(task => task.id === idFixTask);
            if (taskIndex !== -1) {
                allTasks[taskIndex] = {
                    ...allTasks[taskIndex],
                    taskName: nameTask.value,
                    assignee: personCharge.value,
                    projectId: allProjectLocals[currentUser.id][index].id,
                    asignDate: startDate.value,
                    dueDate: endDate.value,
                    priority: priority.value,
                    progress: progress.value,
                    status: statusNow.value,
                };
            }
            idFixTask = null; // Reset sau khi sửa
        } else {
            // Chế độ thêm mới
            let newTask = {
                id: allTasks.length > 0 ? allTasks[allTasks.length - 1].id + 1 : 1,
                taskName: nameTask.value,
                assignee: personCharge.value,
                projectId: allProjectLocals[currentUser.id][index].id,
                asignDate: startDate.value,
                dueDate: endDate.value,
                priority: priority.value,
                progress: progress.value,
                status: statusNow.value,
            };
            allTasks.push(newTask);
        }
    
        // Cập nhật localStorage và render lại giao diện
        localStorage.setItem("Tasks", JSON.stringify(allTasks));
        renderTask();
        renderMember(memberList);
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    }
});

//Khi ấn nút thêm nhiệm vụ thì reset lại tất cả
addTaskBtn.addEventListener('click', function (){
    nameTask.value = '';
    startDate.value = '';
    endDate.value = '';
    priority.value = '';
    progress.value = '';
    statusNow.value = '';
    resetAllTask();
})

//Chỉ in ngày và tháng
function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${day} - ${month}`;
}

//Tìm kiếm
const search = document.getElementById("search");
search.addEventListener('input', function (){
    renderTask();
})

//Sắp xếp
const sortOption = document.getElementById("sortOption");
sortOption.addEventListener("change", renderTask);


// Render nhiệm vụ theo trạng thái
function renderTask() {
    const taskContainer = document.querySelector("#task-table-body");
    if (!taskContainer) return;

    let projectTasks = allTasks.filter(task => task.projectId === allProjectLocals[currentUser.id][index].id);

    //Tìm kiếm
    const searchItem = search.value.trim().toLowerCase();
    if (searchItem !== '') {
        projectTasks = projectTasks.filter(task => task.taskName.toLowerCase().includes(searchItem));
    }

    //Sắp xếp
    const selectedSort = sortOption.value;
    if (selectedSort === "Hạn chót") {
        projectTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (selectedSort === "Độ ưu tiên") {
        const priorityMap = {
            "Thấp": 1,
            "Trung bình": 2,
            "Cao": 3
        };
        projectTasks.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
    };
    

    // Nhóm nhiệm vụ theo trạng thái
    const statusGroups = {
        "To Do": projectTasks.filter(task => task.status === "To Do"),
        "In Progress": projectTasks.filter(task => task.status === "In Progress"),
        "Pending": projectTasks.filter(task => task.status === "Pending"),
        "Done": projectTasks.filter(task => task.status === "Done"),
    };

    let taskHTML = '';

    // Render từng trạng thái
    for (const [status, tasks] of Object.entries(statusGroups)) {
        taskHTML += `
            <tr class="detail" data-status="${status}">
                <td class="detail">
                    <ion-icon name="caret-down"></ion-icon>
                    <p class="name">${status}</p>
                </td>
                <td colspan="6"></td>
            </tr>
        `;
        taskHTML += tasks.map(task => `
            <tr class="list" data-status="${status}">
                <td class="name-task border">${task.taskName}</td>
                <td class="person-in-charge border">${task.assignee}</td>
                <td class="border text-center"><p class="${task.priority === 'Cao' ? 'high' : task.priority === 'Trung bình' ? 'medium' : 'low'}">${task.priority}</p></td>
                <td class="date border">${formatDate(task.asignDate)}</td>
                <td class="date border">${formatDate(task.dueDate)}</td>
                <td class="border text-center"><p class="${task.progress === 'Đúng tiến độ' ? 'on-schedule' : task.progress === 'Rủi ro cao' ? 'high-risk' : 'delayed'}">${task.progress}</p></td>
                <td class="border text-center">
                    <button id="fixTaskBtn" onclick = "resetAllTask() ;fixTask(${task.id})"type="button" class="btn btn-warning btn-edit" data-task-id="${task.id}" data-bs-toggle="modal" data-bs-target="#exampleModalChange">
                        Sửa
                    </button>
                    <button type="button" class="btn btn-danger btn-delete" data-task-id="${task.id}" data-bs-toggle="modal" data-bs-target="#exampleModalDelete">
                        Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    }

    taskContainer.innerHTML = taskHTML;

    // Gắn sự kiện đóng/mở cho từng tiêu đề trạng thái
    const statusHeaders = taskContainer.querySelectorAll(".detail");
    statusHeaders.forEach(header => {
        const status = header.getAttribute("data-status");
        let isCollapsed = false;

        header.addEventListener("click", function () {
            isCollapsed = !isCollapsed;
            const taskRows = taskContainer.querySelectorAll(`.list[data-status="${status}"]`);
            taskRows.forEach(row => {
                row.style.display = isCollapsed ? "none" : "table-row";
            });
            const icon = header.querySelector("ion-icon");
            icon.setAttribute("name", isCollapsed ? "caret-forward" : "caret-down");
        });
    });
}

// Sửa nhiệm vụ
let idFixTask = null;

function fixTask(id) {
    let taskFix = allTasks.find(task => task.id === id);
    if (!taskFix) return;

    // Hiển thị thông tin nhiệm vụ
    nameTask.value = taskFix.taskName;
    startDate.value = taskFix.asignDate;
    endDate.value = taskFix.dueDate;
    priority.value = taskFix.priority;
    progress.value = taskFix.progress;
    statusNow.value = taskFix.status;
    personCharge.value = taskFix.assignee;

    // Tạo dropdown người phụ trách
    let htmls = `<option value="">Chọn người phụ trách</option>`;
    htmls += memberList.map(mem => {
        let acc = accounts.find(account => account.id === mem.userId);
        return `<option value="${acc.fullName}">${acc.fullName}</option>`;
    }).join('');
    personCharge.innerHTML = htmls;
    personCharge.value = taskFix.assignee;

    idFixTask = id;
}

// Check trùng nhiệm vụ
function isDuplicateTaskName(newTaskName, allTasks) {
    const normalizedNewName = newTaskName.trim().toLowerCase();
    
    // Nếu đang sửa, và tên không thay đổi so với nhiệm vụ cũ, thì không trùng
    if (idFixTask !== null) {
        const currentTask = allTasks.find(task => task.id === idFixTask);
        if (currentTask && currentTask.taskName.trim().toLowerCase() === normalizedNewName) {
            return false; // Không trùng vì không thay đổi tên
        }
    }

    // Nếu là thêm mới hoặc đổi sang tên mới
    return allTasks
        .filter(task => task.id !== idFixTask)
        .some(task => task.taskName.trim().toLowerCase() === normalizedNewName);
}

btnAddTask.addEventListener("click", () => {
    if (idFixTask === null) return;

    // Lấy nhiệm vụ cần sửa
    let task = allTasks.find(task => task.id === idFixTask);
    if (!task) return;

    // Cập nhật thông tin từ form
    task.taskName = nameTask.value;
    task.asignDate = startDate.value;
    task.dueDate = endDate.value;
    task.priority = priority.value;
    task.progress = progress.value;
    task.status = statusNow.value;
    task.assignee = personCharge.value;

    // Gọi lại renderTask để cập nhật UI
    renderTask();

    // Reset id sửa sau khi lưu
    idFixTask = null;
});


// Xóa nhiệm vụ
let taskToDelete = null;

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-delete")) {
        taskToDelete = Number(e.target.getAttribute("data-task-id"));
    }
});

document.querySelector("#btnDelete").addEventListener("click", function() {
    if (taskToDelete !== null) {
        deleteTask(taskToDelete);
        taskToDelete = null;
    }
});

function deleteTask(taskId){
    allTasks = allTasks.filter((task) => task.id !== taskId);
    allTasks.forEach((task, indexTask) => {task.id = indexTask + 1});
    localStorage.setItem('Tasks', JSON.stringify(allTasks));
    renderTask();
    const modal = document.querySelector('#exampleModalDelete');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
}

//Reset lại tất cả thông tin nhiệm vụ
function resetAllTask(){
    checkTask.innerText = "";
    checkTask.style.color = "";
    nameTask.style.borderColor = '';
    nameTask.style.boxShadow = '';

    checkPerson.innerText = "";
    checkPerson.style.color = "";
    personCharge.style.borderColor = '';
    personCharge.style.boxShadow = '';

    checkStartDate.innerText = "";
    checkStartDate.style.color = "";
    startDate.style.borderColor = '';
    startDate.style.boxShadow = '';

    checkEndDate.innerText = "";
    checkEndDate.style.color = "";
    endDate.style.borderColor = '';
    endDate.style.boxShadow = '';

    checkPriority.innerText = "";
    checkPriority.style.color = "";
    priority.style.borderColor = '';
    priority.style.boxShadow = '';

    checkProgress.innerText = "";
    checkProgress.style.color = "";
    progress.style.borderColor = '';
    progress.style.boxShadow = '';   

    checkStatus.innerText = "";
    checkStatus.style.color = "";
    statusNow.style.borderColor = '';
    statusNow.style.boxShadow = ''; 
}

// Xóa dữ liệu khi hủy hoặc đóng modal
function deleteData() {
    const modal = document.querySelector('#exampleModalAdd');
    let checkEmail = document.getElementById("checkEmail");
    let inputEmail = document.querySelector('#email');
    let email = document.getElementById("email");
    let role = document.getElementById("role");

    checkEmail.innerText = "";
    checkEmail.style.color = "";
    checkEmail.style.display = "";
    inputEmail.style.borderColor = '';
    inputEmail.style.boxShadow = '';
    email.value = '';
    role.value = 'Developer';
}

// Khởi tạo
inforProject();
renderMember(memberList);
renderTask();