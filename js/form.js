document.addEventListener("DOMContentLoaded", initForm);

function initForm() {
    const form = document.getElementById("taskForm");
    if (!form) return;

    form.addEventListener("submit", handleSubmit);
    updateProgressPreview();
}

function handleSubmit(event) {
    event.preventDefault();

    const subject = document.getElementById("subject").value.trim();
    const topic = document.getElementById("topic").value.trim();
    const examDate = document.getElementById("examDate").value;
    const priority = document.getElementById("priority").value;
    const notes = document.getElementById("notes").value.trim();

    if (!validateForm(subject, topic, examDate, priority, notes)) {
        return;
    }

    const newTask = {
        id: generateId(),
        subject,
        topic,
        examDate,
        priority,
        notes,
        completed: false,
        createdAt: new Date().toISOString()
    };

    const tasks = getData();
    tasks.push(newTask);
    saveData(tasks);

    window.location.href = "index.html";
}

function validateForm(subject, topic, examDate, priority, notes) {
    if (!subject || !topic || !examDate || !priority) {
        alert("Please fill in all required fields.");
        return false;
    }

    if (subject.length > 100 || topic.length > 150 || notes.length > 300) {
        alert("One of the fields is too long.");
        return false;
    }

    const today = new Date();
    const selectedDate = new Date(examDate);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert("Exam date cannot be in the past.");
        return false;
    }

    return true;
}

function updateProgressPreview() {
    const tasks = getData();
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");

    if (progressText) progressText.textContent = `${completed} of ${total} exams completed`;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;
}