const DEMO_USERNAME = "taskflow";
const DEMO_PASSWORD = "123456";

function isOnPage(pageName) {
  return window.location.pathname.endsWith(pageName);
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");
    const errorText = document.getElementById("loginError");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedInUser", username);
      window.location.href = "dashboard.html";
    } else {
      if (errorText) {
        errorText.classList.remove("d-none");
      }
    }
  });
}

// REGISTER (demo only)
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const successText = document.getElementById("registerSuccess");
    if (successText) {
      successText.classList.remove("d-none");
    }
  });
}

// PROTECT PAGES
if (
  isOnPage("dashboard.html") ||
  isOnPage("tasks.html") ||
  isOnPage("projects.html")
) {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  if (!isLoggedIn) {
    window.location.href = "index.html";
  }
}

// GREETING
function updateGreeting() {
  const greetingEl = document.getElementById("greetingText");
  if (!greetingEl) return;

  const username = localStorage.getItem("loggedInUser") || "Guest";

  const now = new Date();
  const hour = now.getHours();
  let timeText = "Good Morning";

  if (hour >= 12 && hour < 18) {
    timeText = "Good Afternoon";
  } else if (hour >= 18 || hour < 4) {
    timeText = "Good Evening";
  }

  greetingEl.textContent = `${timeText}, ${username}`;
}

// LOGOUT
const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });
}

// RUN AFTER PAGE LOAD
window.onload = function () {
  // restore theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    if (typeof setTheme === "function") {
      setTheme(savedTheme);
    }
    if (savedTheme === "dark") {
      const toggle = document.getElementById("darkModeToggle");
      if (toggle) toggle.checked = true;
    }
  }

  // show greeting
  updateGreeting();

  // create chart on dashboard
  const ctx = document.getElementById("taskStatusChart");
  if (ctx) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Completed", "In Progress", "Overdue"],
        datasets: [{
          label: "Number of Tasks",
          data: [12, 8, 4],
          backgroundColor: ["#9ddeb5ff", "#efdb8eff", "#f97373"],
          borderColor: ["#6cbe8aff", "#f8dc8aff", "#ed8383ff"],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 2 }
          }
        }
      }
    });
  }
};
