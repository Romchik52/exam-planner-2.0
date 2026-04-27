document.addEventListener("DOMContentLoaded", initTheme);

function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("examPlannerTheme") || "dark";

    applyTheme(savedTheme);

    if (!themeToggle) return;

    themeToggle.addEventListener("click", function () {
        const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
        localStorage.setItem("examPlannerTheme", nextTheme);
        applyTheme(nextTheme);
        window.dispatchEvent(new CustomEvent("themeChanged"));
    });
}

function applyTheme(theme) {
    const themeToggle = document.getElementById("themeToggle");
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);

    if (themeToggle) {
        themeToggle.textContent = isLight ? "🌙 Dark" : "☀️ Light";
    }
}
