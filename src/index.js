// import _ from 'lodash';
import './style.css';
import { Task, appendImg } from './Task.js';
import Refresh from './refresh.png';
import Enter from './enter-arrow.png';

new Task({ description: 'Wash the dishes', completed: false, index: 1 }).add();
new Task({ description: 'Complete To Do List project', completed: false, index: 2 }).add();
new Task({ description: 'Attend standup meeting', completed: false, index: 3 }).add();
new Task({ description: 'Go to a barbershop', completed: false, index: 3 }).add();
const toDoList = document.querySelector('#to-do-list');
const refreshContainer = document.querySelector('#refresh');
const enterContainer = document.querySelector('#enter');

window.onload = () => {
  Task.loadLocalTasks();
  Task.populate(toDoList);
  appendImg(Refresh, refreshContainer, false);
  appendImg(Enter, enterContainer, false);
};
