document.getElementById('addTaskBtn').addEventListener('click', addTask);

const today = new Date().toISOString().split('T')[0];
document.getElementById('taskDate').setAttribute('min', today);

window.onload = () => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  storedTasks.forEach(task => displayTask(task));
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

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = taskDate.value = taskTime.value = '';
    document.getElementById('ampm').value = 'AM';
  } else {
    alert('Please enter a task, date, and time.');
  }
}

function displayTask({ task, date, time, priority }) {
  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');

  // Determine the time of day based on the task time
  const taskHour = parseInt(time.split(':')[0]);
  let timeClass = '';

  if (taskHour >= 6 && taskHour < 12) {
    timeClass = 'morning';
  } else if (taskHour >= 12 && taskHour < 18) {
    timeClass = 'afternoon';
  } else {
    timeClass = 'evening';
  }

  li.className = `list-group-item ${priority.toLowerCase()} ${timeClass}`;

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

function modifyTask(listItem, taskContent) {
  const [taskText, timeText] = taskContent.textContent.split('(');
  const [date, time] = timeText.replace(')', '').split(' at ');

  document.getElementById('taskInput').value = taskText.trim();
  document.getElementById('taskDate').value = date.trim();
  listItem.remove();

  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const updatedTasks = tasks.filter(task => task.task !== taskText.trim());
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function deleteTask(listItem, taskText) {
  listItem.remove();
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const updatedTasks = tasks.filter(task => task.task !== taskText);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function formatTime(time, ampm) {
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return `${hours}:${minutes}`;
}
