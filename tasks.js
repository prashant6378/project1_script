// Array to hold all tasks
let taskArray = [];

// Handle form submission
document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    // Prevent form from submitting

    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('task-priority').value;
    const date = document.getElementById('task-date').value;

    // Create a new task object
    const task = {
        title: title,
        priority: priority,
        date: date
    };

    // Add the task to the task list
    addTaskToList(task);

    // Clear the input fields
    document.getElementById('task-title').value = '';
    document.getElementById('task-priority').value = 'high'; // Reset to default
    document.getElementById('task-date').value = '';
});

// Function to add a task to the list and display it
function addTaskToList(task) {
    taskArray.push(task);
    renderTasks(taskArray);
    updateChart(); // Update the chart whenever a new task is added
}

// Function to render tasks in the "Recent Tasks" section
function renderTasks(tasks) {
    const recentTasks = document.getElementById('recent-tasks');
    recentTasks.innerHTML = ''; 
    // Clear the existing tasks

    if (tasks.length === 0) {
        recentTasks.innerHTML = '<p>No tasks assigned at this moment.</p>';
        return;
    }

    tasks.forEach(function (task, index) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            ${task.title} - ${task.priority} - ${task.date}
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        recentTasks.appendChild(li);
    });
}

// Delete a task from the list
function deleteTask(index) {
    taskArray.splice(index, 1);
    renderTasks(taskArray);
    updateChart();
}

// Sort tasks by priority and date
document.getElementById('sort-tasks-btn').addEventListener('click', function () {
    taskArray.sort((a, b) => {
        // Sort by priority first, then by date
        if (a.priority === b.priority) {
            return new Date(a.date) - new Date(b.date);
        }
        return a.priority.localeCompare(b.priority); 
    });
    renderTasks(taskArray);
});

// Initialize and update the Chart.js pie chart
const ctx = document.getElementById('taskChart').getContext('2d');
const taskChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['High Priority', 'Medium Priority', 'Low Priority'],
        datasets: [{
            label: 'Task Priority Distribution',
            data: [0, 0, 0], // Initial data
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
            hoverOffset: 4
        }]
    }
});

// Update the pie chart based on the tasks
function updateChart() {
    const high = taskArray.filter(task => task.priority === 'high').length;
    const medium = taskArray.filter(task => task.priority === 'medium').length;
    const low = taskArray.filter(task => task.priority === 'low').length;

    taskChart.data.datasets[0].data = [high, medium, low];
    taskChart.update();
}
