import './style.css';
import Task from './Task.js';
import { appendImg } from './images.js';
import Refresh from './refresh.png';
import Enter from './enter-arrow.png';

const toDoList = document.querySelector('#to-do-list');
const refreshContainer = document.querySelector('#refresh');
const enterContainer = document.querySelector('#enter');
const addTask = document.querySelector('#add-task');
const enter = document.querySelector('#enter');
const warning = document.querySelector('#warning');
const clearAll = document.querySelector('#clear-all');

window.onload = () => {
  Task.loadLocalTasks();
  Task.populateAll(toDoList);
  appendImg(Refresh, refreshContainer);
  appendImg(Enter, enterContainer);

  enter.addEventListener('click', () => {
    if (addTask.value) {
      const task = new Task({ description: addTask.value });
      task.add().populate(toDoList, task.index - 1);
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
    Task.clearAllCompleted();
  });
};
