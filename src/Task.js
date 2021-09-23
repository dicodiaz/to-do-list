import { appendImg, appendCrossFadingImgs } from './images.js';
import Menu from './menu.png';
import Trash from './trash.png';

export default class Task {
  static tasks = [];

  constructor({ description, completed = false, index = Task.tasks.length + 1 }) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }

  populate(element, i) {
    // Build tr element with 2 tds
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const checkBox = document.createElement('input');
    checkBox.classList.add('form-check-input');
    checkBox.type = 'checkbox';
    const span = document.createElement('span');
    span.classList.add('ps-2');
    span.innerText = this.description;
    td1.appendChild(checkBox);
    td1.appendChild(span);
    // Build second td
    const td2 = document.createElement('td');
    td2.id = `menu-${i + 1}`;
    td2.classList.add('align-middle');
    appendCrossFadingImgs(Menu, Trash, td2);
    // Append tds to tr and tr to element
    tr.appendChild(td1);
    tr.appendChild(td2);
    element.appendChild(tr);

    // Add element property to this
    this.element = tr;

    // Add interactivity to checkbox
    checkBox.addEventListener('change', () => {
      if (checkBox.checked) {
        this.completed = true;
        span.classList.add('td-line-through');
        td1.classList.add('opacity-50');
      } else {
        this.completed = false;
        span.classList.remove('td-line-through');
        td1.classList.remove('opacity-50');
      }
      Task.saveLocalTasks();
    });
    // Add same classes as before when checkbox is checked after loading page
    if (this.completed) {
      checkBox.checked = true;
      span.classList.add('td-line-through');
      td1.classList.add('opacity-50');
    }

    // Add interactivity to delete buttons and deleting functionality
    const imgBot = td2.firstElementChild.firstElementChild;
    const imgTop = td2.firstElementChild.lastElementChild;
    const editTask = document.createElement('input');
    editTask.type = 'text';
    editTask.classList.add('border-0', 'ps-2', 'bg-secondary', 'text-white');

    imgTop.addEventListener('click', () => {
      if (!imgTop.classList.contains('cursor-move')) {
        this.remove();
        this.element.remove();
      } else {
        imgBot.classList.toggle('opacity-0');
        imgTop.classList.toggle('opacity-0');
        imgTop.classList.toggle('cursor-move');
        tr.classList.add('bg-secondary');
        editTask.value = span.innerText;
        td1.replaceChild(editTask, span);
        editTask.focus();
      }
    });

    // Add editing functionality
    editTask.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        span.innerText = editTask.value;
        td1.replaceChild(span, editTask);
        imgBot.classList.toggle('opacity-0');
        imgTop.classList.toggle('opacity-0');
        imgTop.classList.toggle('cursor-move');
        tr.classList.remove('bg-secondary');
        this.description = editTask.value;
        Task.saveLocalTasks();
      }
    });

    // Set local storage
    Task.saveLocalTasks();
  }

  static populateAll(element) {
    this.sort();
    this.tasks.forEach((task, i) => {
      task.populate(element, i);
    });
  }

  static sort() {
    this.tasks.sort((a, b) => a.index - b.index);
  }

  static saveLocalTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  static loadLocalTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      tasks.forEach((task, i) => {
        Task.tasks[i] = new Task(task);
      });
    }
  }

  add() {
    Task.tasks.push(this);
    Task.saveLocalTasks();
    return this;
  }

  remove() {
    Task.tasks = Task.tasks.filter((task) => task !== this);
    Task.tasks.forEach((task, i) => {
      task.index = i + 1;
    });
    Task.saveLocalTasks();
    return this;
  }

  static clearAllCompleted() {
    this.tasks = this.tasks.filter((task) => {
      if (task.completed) task.element.remove();
      return !task.completed;
    });
    this.tasks.forEach((task, i) => {
      task.index = i + 1;
    });
    this.saveLocalTasks();
  }
}
