document.getElementById('addTaskBtn').addEventListener('click', addTask);

const today = new Date().toISOString().split('T')[0];
document.getElementById('taskDate').setAttribute('min', today);

// Load tasks from Local Storage when the page loads
window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load saved tasks or an empty array if no tasks are stored
  storedTasks.forEach(task => displayTask(task)); // Display saved tasks
};

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskTime = document.getElementById('taskTime');
  const ampm = document.getElementById('ampm').value;
  const taskPriority = document.getElementById('taskPriority').value;

  const taskText = taskInput.value.trim();
  const taskDueDate = taskDate.value;
  const taskDueTime = formatTime(taskTime.value, ampm);

  if (taskText && taskDueDate && taskDueTime) {
    const taskData = { task: taskText, date: taskDueDate, time: taskDueTime, priority: taskPriority };
    displayTask(taskData);

    // Save task to Local Storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear input fields
    taskInput.value = taskDate.value = taskTime.value = '';
    document.getElementById('ampm').value = 'AM';
  } else {
    alert('Please enter a task, date, and time.');
  }
}

function displayTask({ task, date, time, priority }) {
  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');
  li.className = `list-group-item ${getTimeOfDay(time)} ${priority.toLowerCase()}`;

  const taskContent = document.createElement('span');
  taskContent.innerHTML = `${task} <small class="text-muted">(${date} at ${time})</small>`;

  const priorityLabel = document.createElement('span');
  priorityLabel.className = `priority-label priority-${priority.toLowerCase()}`;
  priorityLabel.textContent = priority;

  const modifyBtn = createButton('Modify', 'btn-warning', () => modifyTask(li, taskContent));
  const deleteBtn = createButton('Delete', 'btn-danger', () => deleteTask(li, task));

  li.append(taskContent, priorityLabel, modifyBtn, deleteBtn);
  taskList.appendChild(li);
}

function createButton(text, className, onClick) {
  const btn = document.createElement('button');
  btn.className = `btn btn-sm ${className} me-2`;
  btn.textContent = text;
  btn.onclick = onClick;
  return btn;
}

function getTimeOfDay(time) {
  const [hour, ampm] = time.split(':');
  const hourInt = parseInt(hour) + (ampm === 'PM' && hour < 12 ? 12 : 0);
  return hourInt >= 6 && hourInt < 12 ? 'morning' : hourInt < 18 ? 'afternoon' : 'evening';
}

function modifyTask(listItem, taskContent) {
  const [taskText, timeText] = taskContent.textContent.split('(');
  const [date, time] = timeText.replace(')', '').split(' at ');

  document.getElementById('taskInput').value = taskText.trim();
  document.getElementById('taskDate').value = date.trim();

  const [timePart, ampm] = time.trim().split(' ');
  document.getElementById('taskTime').value = formatTime(timePart, ampm);
  document.getElementById('ampm').value = ampm;
  listItem.remove();

  // Update Local Storage after modification
  updateLocalStorage();
}

function deleteTask(listItem, task) {
  listItem.remove();

  // Remove the task from Local Storage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.filter(t => t.task !== task); // Remove task from the list
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function formatTime(time24, ampm) {
  let [hour, minute] = time24.split(':');
  if (ampm === 'PM' && hour < 12) hour = parseInt(hour) + 12;
  if (ampm === 'AM' && hour === '12') hour = '00';
  return `${hour}:${minute} ${ampm}`;
}

function updateLocalStorage() {
  const taskList = document.getElementById('taskList');
  const tasks = [];
  
  taskList.querySelectorAll('.list-group-item').forEach(item => {
    const taskContent = item.querySelector('span').textContent.trim();
    const task = taskContent.split('(')[0].trim();
    const date = taskContent.split('(')[1].split(' at ')[0].trim();
    const time = taskContent.split('at ')[1].replace(')', '').trim();
    const priority = item.querySelector('.priority-label').textContent.trim();
    
    tasks.push({ task, date, time, priority });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}
