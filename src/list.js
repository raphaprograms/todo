import "./styles.css";

// ——— Factory functions —————————————————————————————
function createProject(name) {
  return { name, tasks: [] };
}

function createTask(title, description = "", dueDate = "", priority = "low", checklist = "", completed = false) {
  return { title, description, dueDate, priority, checklist, completed };
}

// ——— localStorage helpers ————————————————————————————
const STORAGE_KEY = "todo-projects";

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { 
    return JSON.parse(raw);
  } catch {
    console.warn("Could not parse projects-resetting storage.");
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

}
// ——— App state ————————————————————————————————————————
let projects = [];
let currentProject = null;

// ——— Utility ————————————————————————————————————————


// ——— Build static layout ————————————————————————————


  // Sidebar


  // Main area
 

// ——— Rendering and persistence ———————————————————————



// ——— UI event bindings —————————————————————————————


// ——— Bootstrapping ————————————————————————————————

