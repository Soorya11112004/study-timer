document.addEventListener("DOMContentLoaded", function () {
    // Get the currently logged-in user's email from localStorage (passed from the login page)
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    if (!loggedInUserEmail) {
        alert("No user logged in. Redirecting to login page.");
        window.location.href = "index.html"; // Redirect to login if no user is logged in
        return;
    }

    // Fetch user data from localStorage (including tasks)
    const userData = JSON.parse(localStorage.getItem(loggedInUserEmail));
    if (!userData) {
        alert("No user data found. Redirecting to login page.");
        window.location.href = "index.html"; // Redirect to login if no user data
        return;
    }

    // Initialize tasks from the user data
    let userTasks = userData.tasks || [];

    // DOM Elements for Task Management
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");

    // DOM Elements for Timer
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Timer variables
    let studyTime = 0;
    let breakTime = 0;
    let timerInterval = null;

    // Dark mode toggle
    darkModeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", this.checked);
    });

    // Render tasks from localStorage
    function renderTasks() {
        taskList.innerHTML = ""; // Clear the task list
        userTasks.forEach((task, index) => {
            const taskItem = document.createElement("li");
            taskItem.textContent = task;

            // Add a delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";
            deleteBtn.onclick = function () {
                removeTask(index);
            };

            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });
    }

    // Add a new task
    function addTask() {
        const task = taskInput.value.trim();
        if (task === "") {
            alert("Task cannot be empty!");
            return;
        }
        userTasks.push(task); // Add task to the array
        saveTasks(); // Save to localStorage
        renderTasks(); // Re-render the task list
        taskInput.value = ""; // Clear the input field
    }

    // Remove a task by index
    function removeTask(index) {
        userTasks.splice(index, 1); // Remove task from the array
        saveTasks(); // Save to localStorage
        renderTasks(); // Re-render the task list
    }

    // Save tasks to localStorage
    function saveTasks() {
        // Update the userData object to include the updated tasks
        const updatedUserData = { ...userData, tasks: userTasks };
        localStorage.setItem(loggedInUserEmail, JSON.stringify(updatedUserData)); // Save the updated user data
    }

    // Timer-related functionality
    function startTimer() {
        studyTime = parseInt(document.getElementById('study-time').value) * 60;
        breakTime = parseInt(document.getElementById('break-time').value) * 60;

        if (isNaN(studyTime) || isNaN(breakTime)) {
            alert('Please enter valid study and break times.');
            return;
        }

        timerInterval = setInterval(updateTimer, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerDisplay.innerText = '00:00';
    }

    function updateTimer() {
        if (studyTime > 0) {
            studyTime--;
            timerDisplay.innerText = formatTime(studyTime);
        } else if (breakTime > 0) {
            breakTime--;
            timerDisplay.innerText = `Break: ${formatTime(breakTime)}`;
        } else {
            clearInterval(timerInterval);
            alert('Study session and break are complete!');
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // Event listeners for task management
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });

    // Event listeners for timer functionality
    startButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);

    // Event listener for dark mode toggle
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Initial render of tasks
    renderTasks();
});
