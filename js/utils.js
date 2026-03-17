function generateId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    return `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString();
}

function getDaysLeft(dateString) {
    const today = new Date();
    const examDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);

    const diffTime = examDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getNearestExam(tasks) {
    const upcoming = tasks
        .filter(task => !task.completed && getDaysLeft(task.examDate) >= 0)
        .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

    return upcoming.length > 0 ? upcoming[0] : null;
}

function getPriorityValue(priority) {
    const priorityMap = { low: 1, medium: 2, high: 3 };
    return priorityMap[priority] || 0;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}