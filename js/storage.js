const STORAGE_KEY = "examPlannerTasks";

function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveData(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        saveData([]);
    }
}

document.addEventListener("DOMContentLoaded", initStorage);