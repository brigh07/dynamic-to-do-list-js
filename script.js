document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');

  // single source of truth in memory
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  // persist tasks array to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // create a task <li> and append to DOM (doesn't touch tasks[] by itself)
  function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = taskText;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';

    removeBtn.addEventListener('click', () => {
      // Find index of this li relative to the list's children to keep tasks[] in sync
      const index = Array.from(list.children).indexOf(li);
      if (index > -1) {
        tasks.splice(index, 1); // remove from memory array
        saveTasks();           // update localStorage
      }
      li.remove();             // remove from DOM
    });

    li.appendChild(textSpan);
    li.appendChild(removeBtn);
    list.appendChild(li);
  }

  // addTask signature required for automated checking:
  // addTask(taskText, save = true)
  function addTask(taskText, save = true) {
    if (!taskText || typeof taskText !== 'string') return;
    createTaskElement(taskText);

    if (save) {
      tasks.push(taskText);
      saveTasks();
    }
  }

  // load tasks from the tasks[] array (which was initialized from localStorage)
  function loadTasks() {
    tasks.forEach(task => addTask(task, false)); // false -> don't re-save while loading
  }

  // form submission -> add new task
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text, true);
    input.value = '';
    input.focus();
  });

  // init
  loadTasks();
});
