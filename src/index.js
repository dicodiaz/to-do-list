import dragoverHandler from './drag&drop.js';
import './style.css';
import Task from './Task.js';
import TaskManager from './TaskManager.js';

const taskElementsContainer = document.querySelector('#to-do-list');
const refresh = document.querySelector('#refresh');
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const addTask = document.querySelector('#add-task');
const enter = document.querySelector('#enter');
const clearAll = document.querySelector('#clear-all');
const warning = document.querySelector('#warning');
const taskManager = new TaskManager();

window.onload = () => {
  taskManager.loadLocalTasks().populateAll(taskElementsContainer);

  refresh.addEventListener('click', () => {
    if (taskElementsContainer.innerHTML !== '') {
      if (refresh.classList.contains('pressed-once')) {
        refresh.classList.remove('pressed-once');
        alertPlaceholder.innerHTML = '';
        taskElementsContainer.innerHTML = '';
        localStorage.clear();
      } else {
        refresh.classList.add('pressed-once');
        const type = 'danger';
        const message = 'Click again to clear all tasks.';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${message}</div>`;
        alertPlaceholder.append(wrapper);
      }
    }
  });

  enter.addEventListener('click', () => {
    if (addTask.value) {
      const task = new Task({ description: addTask.value, index: taskManager.tasks.length + 1 });
      taskManager.add(task).populate(taskElementsContainer, task);
      addTask.value = '';
    } else {
      warning.classList.remove('d-none');
      setTimeout(() => warning.classList.remove('opacity-0'), 0);
      setTimeout(() => warning.classList.add('opacity-0'), 2000);
      setTimeout(() => warning.classList.add('d-none'), 3000);
    }
  });

  addTask.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) enter.click();
  });

  clearAll.addEventListener('click', () => {
    taskManager.clearAllCompleted();
  });

  taskElementsContainer.addEventListener('dragover', (e) => {
    dragoverHandler(e, taskManager.tasks, taskElementsContainer);
  });

  taskElementsContainer.addEventListener('touchmove', (e) => {
    dragoverHandler(e, taskManager.tasks, taskElementsContainer);
  });
};
