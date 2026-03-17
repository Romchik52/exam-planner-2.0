document.addEventListener("DOMContentLoaded", initStats);

function initStats() {
    const tasks = getData();
    renderStats(tasks);
    renderChart(tasks);
}

function renderStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const urgent = tasks.filter(task => !task.completed && getDaysLeft(task.examDate) >= 0 && getDaysLeft(task.examDate) <= 3).length;

    document.getElementById("statsTotal").textContent = total;
    document.getElementById("statsRate").textContent = `${rate}%`;
    document.getElementById("urgentCount").textContent = urgent;

    const nearest = getNearestExam(tasks);

    if (nearest) {
        document.getElementById("nearestExam").textContent = `${nearest.subject} (${formatDate(nearest.examDate)})`;
    } else {
        document.getElementById("nearestExam").textContent = "No upcoming exams";
    }
}

function renderChart(tasks) {
    const canvas = document.getElementById("statusChart");
    if (!canvas) return;

    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;

    new Chart(canvas.getContext("2d"), {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#06b6d4", "#4f46e5"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#e2e8f0"
                    }
                }
            }
        }
    });
}