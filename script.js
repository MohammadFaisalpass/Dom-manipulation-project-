const studentForm   = document.getElementById("studentForm");
const studentNameInput   = document.getElementById("studentName");
const studentStatusSelect = document.getElementById("studentStatus");
const studentList   = document.getElementById("studentList");
const emptyState    = document.getElementById("emptyState");
const searchInput   = document.getElementById("searchInput");
const filterButtons = document.getElementById("filterButtons");
const darkModeToggle = document.getElementById("darkModeToggle");

const totalCountEl    = document.getElementById("totalCount");
const activeCountEl   = document.getElementById("activeCount");
const inactiveCountEl = document.getElementById("inactiveCount");


let students = [];
let nextId = 1;

let currentFilter = "all";  
let currentSearch = "";


function renderStudents() {
 
  studentList.textContent = "";

  const term = currentSearch.trim().toLowerCase();

  const visibleStudents = students.filter((student) => {
    const matchesFilter =
      currentFilter === "all" || student.status === currentFilter;
    const matchesSearch = student.name.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });


  emptyState.classList.toggle("hidden", visibleStudents.length > 0);

  visibleStudents.forEach((student) => {
    studentList.appendChild(createStudentCard(student));
  });

  updateStats();
}


function createStudentCard(student) {
 
  const card = document.createElement("div");
  card.className = "student-card";

 
  card.setAttribute("data-id", student.id);
  card.setAttribute("data-status", student.status);

  const info = document.createElement("div");
  info.className = "student-info";

  const nameSpan = document.createElement("span");
  nameSpan.className = "student-name";
 
  nameSpan.textContent = student.name;

  const badge = document.createElement("span");
  badge.className = `status-badge ${student.status}`;
  badge.textContent = student.status === "active" ? "Active" : "Inactive";

  info.appendChild(nameSpan);
  info.appendChild(badge);

  const actions = document.createElement("div");
  actions.className = "student-actions";

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.textContent =
    student.status === "active" ? "Mark inactive" : "Mark active";
  
  toggleBtn.addEventListener("click", () => toggleStatus(student.id));

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => removeStudent(student.id));

  actions.appendChild(toggleBtn);
  actions.appendChild(removeBtn);

  card.appendChild(info);
  card.appendChild(actions);

  return card;
}


function addStudent(name, status) {
  students.push({ id: nextId++, name, status });
  renderStudents();
}

function toggleStatus(id) {
 
  students = students.map((student) =>
    student.id === id
      ? { ...student, status: student.status === "active" ? "inactive" : "active" }
      : student
  );
  renderStudents();
}

function removeStudent(id) {
 
  students = students.filter((student) => student.id !== id);
  renderStudents();
}


function updateStats() {
  const total = students.length;
  const active = students.filter((s) => s.status === "active").length;
  const inactive = total - active;


  totalCountEl.textContent = total;
  activeCountEl.textContent = active;
  inactiveCountEl.textContent = inactive;
}


studentForm.addEventListener("submit", (event) => {

  event.preventDefault();


  const name = studentNameInput.value.trim();
  const status = studentStatusSelect.value;

  if (!name) {
    studentNameInput.focus();
    return;
  }

  addStudent(name, status);


  studentForm.reset();
  studentNameInput.focus();
});


searchInput.addEventListener("input", (event) => {
  currentSearch = event.target.value;
  renderStudents();
});


const allFilterButtons = filterButtons.querySelectorAll(".filter-btn");

filterButtons.addEventListener("click", (event) => {

  const clickedButton = event.target.closest(".filter-btn");
  if (!clickedButton) return;

  currentFilter = clickedButton.getAttribute("data-filter");


  allFilterButtons.forEach((btn) => {
    
    btn.classList.remove("active");
  });
 
  clickedButton.classList.add("active");

  renderStudents();
});


darkModeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.body.removeAttribute("data-theme");
    darkModeToggle.textContent = "🌙 Dark mode";
  } else {
    document.body.setAttribute("data-theme", "dark");
    darkModeToggle.textContent = "☀️ Light mode";
  }


renderStudents();
