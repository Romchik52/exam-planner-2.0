document.addEventListener("DOMContentLoaded", initStats);

let statusChart = null;

function initStats() {
    const tasks = getData();
    renderStats(tasks);
    renderChart(tasks);

    window.addEventListener("themeChanged", function () {
        renderChart(getData());
    });
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
    const textColor = document.body.classList.contains("light-theme") ? "#0f172a" : "#e2e8f0";

    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(canvas.getContext("2d"), {
        type: "polarArea",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["rgba(6, 182, 212, 0.75)", "rgba(79, 70, 229, 0.75)"],
                borderColor: ["#06b6d4", "#4f46e5"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateRotate: true,
                animateScale: true
            },
            scales: {
                r: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        color: "rgba(148, 163, 184, 0.22)"
                    }
                }
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: textColor,
                        padding: 18,
                        usePointStyle: true,
                        pointStyle: "circle"
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = completed + pending;
                            const value = context.raw;
                            const percent = total ? Math.round((value / total) * 100) : 0;
                            return `${context.label}: ${value} (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}
