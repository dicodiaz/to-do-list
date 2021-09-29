import dragoverHandler from './drag&drop.js';
import Enter from './enter-arrow.png';
import { appendImg } from './images.js';
import Refresh from './refresh.png';
import './style.css';
import Task from './Task.js';
import TaskManager from './TaskManager.js';

const taskElementsContainer = document.querySelector('#to-do-list');
const refreshContainer = document.querySelector('#refresh');
const enterContainer = document.querySelector('#enter');
const addTask = document.querySelector('#add-task');
const enter = document.querySelector('#enter');
const warning = document.querySelector('#warning');
const clearAll = document.querySelector('#clear-all');
const taskManager = new TaskManager();

window.onload = () => {
  taskManager.loadLocalTasks().populateAll(taskElementsContainer);
  appendImg(Refresh, refreshContainer);
  appendImg(Enter, enterContainer);

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
