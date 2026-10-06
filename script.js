// Student Task Manager - Script

const STORAGE_KEY = "studentTaskManager.tasks";

const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    if (!title || !description) return;

    tasks.unshift({ id: createId(), title, description, completed: false, createdAt: new Date().toISOString() });
    saveTasks();
    renderTasks();
    taskForm.reset();
});

searchInput.addEventListener("input", renderTasks);

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
}

// TODO: Checkmark button feature goes here.
// The complete/toggle button is rendered in renderTasks() below but is
// intentionally left unimplemented. To implement it:
//   1. Add a click listener to each ".complete-btn" element.
//   2. Find the task by its data-id and flip its `completed` boolean.
//   3. Call saveTasks() and renderTasks() to persist and refresh the list.
// Example:
//   btn.addEventListener("click", () => {
//       const task = tasks.find((t) => t.id === id);
//       if (task) { task.completed = !task.completed; saveTasks(); renderTasks(); }
//   });

function renderTasks() {
    const query = searchInput.value.trim().toLowerCase();

    const visible = tasks.filter((t) => {
        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "completed" && t.completed) ||
            (currentFilter === "pending" && !t.completed);
        const matchesSearch =
            !query ||
            t.title.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    });

    emptyState.hidden = visible.length !== 0;
    taskList.innerHTML = "";

    visible.forEach((task) => {
        const card = document.createElement("div");
        card.className = "task-card" + (task.completed ? " completed" : "");

        const title = document.createElement("h3");
        title.className = "task-title";
        title.textContent = task.title;

        const desc = document.createElement("p");
        desc.className = "task-desc";
        desc.textContent = task.description;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        // Placeholder checkmark button — functionality not implemented yet (see TODO above).
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.dataset.id = task.id;
        completeBtn.title = "Mark as complete";
        completeBtn.textContent = "✓";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = task.id;
        deleteBtn.title = "Delete task";
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(actions);
        taskList.appendChild(card);
    });
}

renderTasks();
