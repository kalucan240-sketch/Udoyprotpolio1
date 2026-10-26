const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const dateInput = document.getElementById("taskDate");
const titleInput = document.getElementById("taskTitle");
const detailsInput = document.getElementById("taskDetails");
const statusInput = document.getElementById("taskStatus");
let tasks = [];
// Load saved tasks
try {
    const savedTasks = JSON.parse(
        localStorage.getItem("networkingTasks") || "[]"
    );
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks;
    }
} catch (error) {
    tasks = [];
}
// Set today's date using local time
const now = new Date();
const localToday = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
].join("-");
dateInput.value = localToday;
// Save tasks
function saveTasks() {
    localStorage.setItem(
        "networkingTasks",
        JSON.stringify(tasks)
    );
}
// Create text elements safely
function makeElement(tag, text, className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) {
        element.className = className;
    }
    return element;
}
// Display tasks
function renderTasks() {
    taskList.replaceChildren();
    emptyMessage.hidden = tasks.length > 0;
    tasks.forEach(function (task) {
        const card = document.createElement("article");
        card.className = "task";
        const heading = makeElement("h3", task.title);
        const date = makeElement(
            "small",
            "Work Date: " + task.date
        );
        const details = makeElement("p", task.details);
        const status = makeElement(
            "p",
            "Status: " + task.status
        );
        const deleteButton = makeElement(
            "button",
            "Delete Task",
            "delete-btn"
        );
        deleteButton.type = "button";
        deleteButton.addEventListener("click", function () {
            if (!confirm("Do you want to delete this task?")) {
                return;
            }
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });
            saveTasks();
            renderTasks();
        });
        card.append(
            heading,
            date,
            details,
            status,
            deleteButton
        );
        taskList.appendChild(card);
    });
}
// Add a new task
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const task = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        date: dateInput.value,
        title: titleInput.value.trim(),
        details: detailsInput.value.trim(),
        status: statusInput.value
    };
    if (!task.date || !task.title || !task.details) {
        alert("Please fill in all required fields.");
        return;
    }
    tasks.unshift(task);
    try {
        saveTasks();
    } catch (error) {
        tasks.shift();
        alert("Could not save the task in this browser.");
        return;
    }
    renderTasks();
    form.reset();
    dateInput.value = localToday;
    alert("Daily work added successfully!");
});
// Show saved tasks when the page opens
renderTasks();