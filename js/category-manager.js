// Kiểm tra đăng nhập
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

let allProjects = JSON.parse(localStorage.getItem('allProjects')) || {};
if (!allProjects[currentUser.id]) {
    allProjects[currentUser.id] = [];
}

let projects = allProjects[currentUser.id];

// Đăng xuất
let out = document.getElementById("logOut");
out.addEventListener("click",function() {
    window.location.href = 'login.html';
    localStorage.removeItem('currentUser');
});

// Nhiệm vụ của tôi
let mission = document.getElementById("mission");
if (localStorage.getItem("missionClicked") === "true") {
    mission.classList.add("clicked");
}
mission.addEventListener("click",function() {
    myProject.classList.remove("clicked");
    localStorage.removeItem("myProjectClicked");
    mission.classList.add("clicked");
    localStorage.setItem("missionClicked", "true");
});

//Dự án cá nhân
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

// Phân trang
const tableBody = document.querySelector('.table tbody');
const pagination = document.querySelector('.pagination');
const rowsPerPage = 5;
let currentPage = 1;

function displayTable(page) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    rows.forEach((row, index) => {
        row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
    });
}

function updatePagination(totalPages) {
    pagination.innerHTML = '';
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    const prevLink = document.createElement('a');
    prevLink.classList.add('page-link');
    prevLink.textContent = 'Previous';
    prevLink.href = '#';
    prevLink.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayTable(currentPage);
            updatePagination(totalPages);
        }
    });
    prevLi.appendChild(prevLink);
    pagination.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.classList.add('page-item');
        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        pageLink.href = '#';
        if (i === currentPage) pageLi.classList.add('active');
        pageLink.addEventListener('click', () => {
            currentPage = i;
            displayTable(currentPage);
            updatePagination(totalPages);
        });
        pageLi.appendChild(pageLink);
        pagination.appendChild(pageLi);
    }

    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    const nextLink = document.createElement('a');
    nextLink.classList.add('page-link');
    nextLink.textContent = 'Next';
    nextLink.href = '#';
    nextLink.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayTable(currentPage);
            updatePagination(totalPages);
        }
    });
    nextLi.appendChild(nextLink);
    pagination.appendChild(nextLi);

    if (currentPage === 1) pagination.querySelector('.page-item:first-child').classList.add('disabled');
    if (currentPage === totalPages) pagination.querySelector('.page-item:last-child').classList.add('disabled');
}

function setupPagination() {
    const rows = tableBody.querySelectorAll('tr');
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    displayTable(currentPage);
    updatePagination(totalPages);
}

// Thêm dự án
const addButton = document.querySelector('.add-prj');
addButton.addEventListener('click', function() {
    const modal = document.querySelector('#exampleModal');
    const input = modal.querySelector('#name-prj-add');
    const inputDescribe = modal.querySelector('#describe-prj-add');
    const describeText = modal.querySelector('#describe-prj-add').value.trim();
    const newProject = input.value.trim();
    const checkName = document.querySelector(".check-name");
    const checkDescribe = document.querySelector(".check-describe");

    const existName = projects.some(p => p.name.toLowerCase() === newProject.toLowerCase())
    if (newProject === '' && describeText === '') {
        checkName.style.display = 'block';
        checkName.innerText = 'Không được để trống thông tin';
        checkName.style.color = 'red';
        input.style.borderColor = 'red';
        input.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }
    if (describeText === '') {
        checkDescribe.style.display = 'block';
        checkDescribe.innerText = 'Không được để trống thông tin';
        checkDescribe.style.color = 'red';
        inputDescribe.style.borderColor = 'red';
        inputDescribe.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }
    if (existName) {
        checkName.style.display = 'block';
        checkName.innerText = 'Dự án đã tồn tại';
        checkName.style.color = 'red';
        input.style.borderColor = 'red';
        input.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }

    let newTask = {
        id: projects.length + 1,
        name: newProject,
        describe: describeText,
        member : [
            {
                userId: currentUser.id,
                role: 'Project Owner',
            }
        ],
    };
    projects.push(newTask);
    allProjects[currentUser.id] = projects;
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
    input.value = '';
    input.style.borderColor = '';  
    input.style.boxShadow = ''; 
    inputDescribe.value = '';
    inputDescribe.style.borderColor = '';  
    inputDescribe.style.boxShadow = '';
    modal.querySelector('#describe-prj-add').value = '';
    renderProject(projects);
    setupPagination(projects);
    checkName.style.display = 'none';
    checkDescribe.style.display = 'none';

    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});

//Xóa dữ liệu khi ấn x hoặc Hủy
function deleteData() {
    // Xóa dữ liệu trong modal thêm
    const addModal = document.querySelector('#exampleModal');
    if (addModal) {
        const input = addModal.querySelector('#name-prj-add');
        const inputDescribe = addModal.querySelector('#describe-prj-add');
        const checkName = addModal.querySelector(".check-name");
        const checkDescribe = addModal.querySelector(".check-describe");
        
        input.value = '';
        inputDescribe.value = '';
        input.style.borderColor = '';  
        input.style.boxShadow = ''; 
        inputDescribe.style.borderColor = '';  
        inputDescribe.style.boxShadow = ''; 
        checkName.style.display = 'none';
        checkDescribe.style.display = 'none';
    }

    // Xóa dữ liệu trong modal sửa
    const fixModal = document.querySelector('#modalFix');
    if (fixModal) {
        const nameInput = fixModal.querySelector('#name-prj-fix');
        const describeInput = fixModal.querySelector('#describe-prj-fix');
        const checkNameFix = fixModal.querySelector(".check-name-fix");
        const checkDescribeFix = fixModal.querySelector(".check-describe-fix");

        nameInput.value = '';
        describeInput.value = '';
        nameInput.style.borderColor = '';
        nameInput.style.boxShadow = '';
        describeInput.style.borderColor = '';
        describeInput.style.boxShadow = '';
        checkNameFix.style.display = 'none';
        checkDescribeFix.style.display = 'none';
    }
}


// Render dữ liệu
function renderProject(projects) {
    tableBody.innerHTML = projects.map((newTask, index) => {
        return `<tr>
                    <td class="text-center">${newTask.id}</td>
                    <td>${newTask.name}</td>
                    <td>
                        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalFix" onclick="fixProject(${newTask.id})">
                            Sửa
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelete" onclick="document.querySelector('#modalDelete').dataset.projectId = ${newTask.id}">
                            Xóa
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn-detail btn-primary" onclick="moveDetail(${index})">
                            Chi tiết
                        </button>
                    </td>
                </tr>`;
    }).join('');
}

// Sửa dự án

let idFix = null;

function fixProject(id) {
    let projectFix = projects.find(p => p.id === id);
    if (!projectFix) return;

    const modal = document.querySelector('#modalFix');
    const nameInput = modal.querySelector('#name-prj-fix');
    const describeInput = modal.querySelector('#describe-prj-fix');

    nameInput.value = projectFix.name;
    describeInput.value = projectFix.describe;
    modal.dataset.projectId = id;
    idFix = id;
}

const fixSaveButton = document.querySelector('#modalFix .addFix');
fixSaveButton.addEventListener('click', () => {
    const modal = document.querySelector('#modalFix');
    const nameInput = modal.querySelector('#name-prj-fix');
    const describeInput = modal.querySelector('#describe-prj-fix');
    const projectId = parseInt(modal.dataset.projectId);

    let newName = nameInput.value.trim();
    let newDescribe = describeInput.value.trim();
    const checkNameFix = document.querySelector(".check-name-fix");
    const checkDescribeFix = document.querySelector(".check-describe-fix");

    const existName = projects.filter(e => e.id !== idFix).some(p => p.name.toLowerCase() === newName.toLowerCase())
    if (newName === '') {
        checkNameFix.style.display = 'block';
        checkNameFix.innerText = 'Không được để trống thông tin';
        checkNameFix.style.color = 'red';
        nameInput.style.borderColor = 'red';
        nameInput.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }
    if (newDescribe === '') {
        checkDescribeFix.style.display = 'block';
        checkDescribeFix.innerText = 'Không được để trống thông tin';
        checkDescribeFix.style.color = 'red';
        describeInput.style.borderColor = 'red';
        describeInput.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }
    if (existName) {
        checkNameFix.style.display = 'block';
        checkNameFix.innerText = 'Dự án đã tồn tại';
        checkNameFix.style.color = 'red';
        nameInput.style.borderColor = 'red';
        nameInput.style.boxShadow = '0px 0px 5px rgba(255, 0, 0, 0.68)';
        return;
    }
    
    let projectFix = projects.find(p => p.id === projectId);
    if (projectFix) {
        projectFix.name = newName;
        projectFix.describe = newDescribe;
        allProjects[currentUser.id] = projects;
        nameInput.style.borderColor = '';  
        nameInput.style.boxShadow = '';
        checkNameFix.style.display = 'none';
        localStorage.setItem('allProjects', JSON.stringify(allProjects));
        renderProject(projects);
        setupPagination(projects);
    }
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});

// Xóa dự án
const deleteConfirmButton = document.querySelector('#modalDelete .btn-danger');
deleteConfirmButton.addEventListener('click', () => {
    const modal = document.querySelector('#modalDelete');
    const projectId = parseInt(modal.dataset.projectId);
    projects = projects.filter(p => p.id !== projectId);
    projects.forEach((p, index) => p.id = index + 1);
    allProjects[currentUser.id] = projects;
    localStorage.setItem('allProjects', JSON.stringify(allProjects));
    renderProject(projects);
    setupPagination(projects);
});

//Tìm kiếm
const search = document.getElementById("search");
search.addEventListener('input', function (event){
    const searchItem = search.value.trim().toLowerCase();
    const filterProject = projects.filter(project => project.name.toLowerCase().includes(event.target.value));
    currentPage = 1;
    renderProject(filterProject);
    setupPagination(filterProject);
})


renderProject(projects);
setupPagination(projects);

function moveDetail(index) {
    window.location.href = `product-manager.html?task=${index}`;
}

