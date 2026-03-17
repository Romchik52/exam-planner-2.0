document.addEventListener("DOMContentLoaded", init);

let currentFilter = "all";
let currentSearch = "";
let currentSort = "date-asc";

function init() {
    renderItems();
    setupFilters();
    setupSearch();
    setupSort();
    updateProgress();
}

function renderItems() {
    const taskList = document.getElementById("taskList");
    const tasks = getData();

    if (!taskList) return;

    taskList.innerHTML = "";

    const preparedTasks = sortTasks(applySearch(applyFilter(tasks)));

    if (preparedTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state panel">
                <h3>No tasks found</h3>
                <p>Add your first exam task or change the current filter.</p>
            </div>
        `;
        updateCounters(tasks);
        updateProgress();
        return;
    }

    preparedTasks.forEach(task => {
        const card = createTaskCard(task);
        taskList.appendChild(card);
    });

    updateCounters(tasks);
    updateProgress();
}

function createTaskCard(task) {
    const card = document.createElement("div");
    const daysLeft = getDaysLeft(task.examDate);
    const notes = task.notes ? `<p>Notes: ${escapeHtml(task.notes)}</p>` : "";

    card.className = "task-card";

    if (task.completed) {
        card.classList.add("completed-card");
    } else if (daysLeft < 0) {
        card.classList.add("expired-card");
    } else if (daysLeft <= 3) {
        card.classList.add("urgent-card");
    }

    card.innerHTML = `
        <div class="task-info">
            <h3>${escapeHtml(task.subject)}</h3>
            <p>${escapeHtml(task.topic)}</p>
            <p>Exam: ${formatDate(task.examDate)}</p>
            <p>Days left: ${daysLeft >= 0 ? daysLeft : "Expired"}</p>
            ${notes}
        </div>

        <div class="task-actions">
            <span class="priority ${task.priority}">${task.priority}</span>
            <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" aria-label="Toggle task completion">
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        </div>
    `;

    return card;
}

function updateCounters(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = pending;
}

function setupFilters() {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            currentFilter = this.dataset.filter;
            renderItems();
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function () {
        currentSearch = this.value.trim().toLowerCase();
        renderItems();
    });
}

function setupSort() {
    const sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) return;

    sortSelect.addEventListener("change", function () {
        currentSort = this.value;
        renderItems();
    });
}

function applyFilter(tasks) {
    if (currentFilter === "active") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    if (currentFilter === "urgent") {
        return tasks.filter(task => !task.completed && getDaysLeft(task.examDate) >= 0 && getDaysLeft(task.examDate) <= 3);
    }

    return tasks;
}

function applySearch(tasks) {
    if (!currentSearch) return tasks;

    return tasks.filter(task => {
        const haystack = [task.subject, task.topic, task.notes || ""]
            .join(" ")
            .toLowerCase();
        return haystack.includes(currentSearch);
    });
}

function sortTasks(tasks) {
    const copied = [...tasks];

    copied.sort((a, b) => {
        switch (currentSort) {
            case "date-desc":
                return new Date(b.examDate) - new Date(a.examDate);
            case "priority-desc":
                return getPriorityValue(b.priority) - getPriorityValue(a.priority);
            case "priority-asc":
                return getPriorityValue(a.priority) - getPriorityValue(b.priority);
            case "created-asc":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "created-desc":
                return new Date(b.createdAt) - new Date(a.createdAt);
            case "date-asc":
            default:
                return new Date(a.examDate) - new Date(b.examDate);
        }
    });

    return copied;
}

document.addEventListener("click", function (event) {
    if (event.target.matches('input[type="checkbox"]')) {
        handleToggle(event.target.dataset.id);
    }

    if (event.target.classList.contains("delete-btn")) {
        handleDelete(event.target.dataset.id);
    }
});

function handleToggle(id) {
    const tasks = getData();

    const updatedTasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveData(updatedTasks);
    renderItems();
}

function handleDelete(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const tasks = getData();
    const updatedTasks = tasks.filter(task => task.id !== id);

    saveData(updatedTasks);
    renderItems();
}

function updateProgress() {
    const tasks = getData();
    const done = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");

    if (!progressText || !progressFill) return;

    const percent = total ? Math.round((done / total) * 100) : 0;

    progressText.textContent = `${done} of ${total} exams completed`;
    progressFill.style.width = `${percent}%`;

    if (progressPercent) {
        progressPercent.textContent = `${percent}%`;
    }
}