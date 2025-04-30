import "./styles.css";

// ——— Factory functions —————————————————————————————
function createProject(name) {
  return { name, tasks: [] };
}

function createTask(title, description = "", dueDate = "", priority = "low", completed = false) {
  return { title, description, dueDate, priority, completed };
}

// ——— localStorage helpers ————————————————————————————
const STORAGE_KEY = "todo-projects";

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    console.warn("Could not parse projects—resetting storage.");
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// ——— App state ————————————————————————————————————————
let projects = [];
let currentProject = null;

// ——— Utility ————————————————————————————————————————
function clearElement(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

// ——— Build static layout ————————————————————————————
export function generateLayout() {
  const container = document.querySelector(".container");
  clearElement(container);

  // Sidebar
  const sidebar = document.createElement("aside");
  sidebar.classList.add("sidebar");

  const h2 = document.createElement("h2");
  h2.textContent = "Projects";
  sidebar.appendChild(h2);

  const ulProjects = document.createElement("ul");
  ulProjects.id = "project-list";
  sidebar.appendChild(ulProjects);

  const btnNewProj = document.createElement("button");
  btnNewProj.id = "add-project";
  btnNewProj.textContent = "+ New Project";
  sidebar.appendChild(btnNewProj);

  // Main area
  const main = document.createElement("main");
  main.classList.add("main-content-area");

  const title = document.createElement("h2");
  title.id = "project-title";
  main.appendChild(title);

  const ulTasks = document.createElement("ul");
  ulTasks.id = "task-list";
  main.appendChild(ulTasks);

  const btnNewTask = document.createElement("button");
  btnNewTask.id = "add-task";
  btnNewTask.textContent = "+ New Task";
  main.appendChild(btnNewTask);

  container.appendChild(sidebar);
  container.appendChild(main);
}

// ——— Rendering and persistence ———————————————————————
function renderProjects() {
  const ul = document.getElementById("project-list");
  clearElement(ul);
  projects.forEach((proj) => {
    const li = document.createElement("li");
    li.textContent = proj.name;
    if (proj === currentProject) li.classList.add("active");
    li.addEventListener("click", () => {
      currentProject = proj;
      saveAndRender();
    });
    ul.appendChild(li);
  });
}

function renderTasks() {
  document.getElementById("project-title").textContent = currentProject.name;
  const ul = document.getElementById("task-list");
  clearElement(ul);

  currentProject.tasks.forEach((task, i) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.classList.add("task-title");
    if (task.completed) span.classList.add("done");
    span.textContent = task.title + (task.dueDate ? ` (${task.dueDate})` : "");
    li.appendChild(span);

    const ctrls = document.createElement("div");
    ctrls.classList.add("task-controls");

    const toggle = document.createElement("button");
    toggle.textContent = task.completed ? "↺" : "✔︎";
    toggle.addEventListener("click", () => {
      task.completed = !task.completed;
      saveAndRender();
    });
    ctrls.appendChild(toggle);

    const del = document.createElement("button");
    del.textContent = "✕";
    del.addEventListener("click", () => {
      currentProject.tasks.splice(i, 1);
      saveAndRender();
    });
    ctrls.appendChild(del);

    li.appendChild(ctrls);
    ul.appendChild(li);
  });
}

function saveAndRender() {
  saveProjects(projects);
  renderProjects();
  renderTasks();
}

// ——— UI event bindings —————————————————————————————
function initEventListeners() {
  document.getElementById("add-project").addEventListener("click", () => {
    const name = prompt("Project name:");
    if (!name) return;
    const p = createProject(name);
    projects.push(p);
    currentProject = p;
    saveAndRender();
  });

  document.getElementById("add-task").addEventListener("click", () => {
    const title = prompt("Task title:");
    if (!title) return;
    const desc = prompt("Description (optional):");
    const date = prompt("Due date (YYYY-MM-DD, optional):");
    const prio = prompt("Priority (low/medium/high):", "low");
    currentProject.tasks.push(createTask(title, desc, date, prio));
    saveAndRender();
  });
}

// ——— Bootstrapping ————————————————————————————————
export function initApp() {
  generateLayout();

  const stored = loadProjects();
  if (stored && stored.length) {
    projects = stored;
    currentProject = projects[0];
  } else {
    const inbox = createProject("Inbox");
    projects = [inbox];
    currentProject = inbox;
    saveProjects(projects);
  }

  saveAndRender();
  initEventListeners();
}
