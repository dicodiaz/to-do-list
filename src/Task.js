import { appendCrossFadingImgs } from './images.js';
import Menu from './menu.png';
import Trash from './trash.png';

export default class Task {
  static tasks = [];

  constructor({ description, completed = false, index = Task.tasks.length + 1, afterElementIndex = -1 }) {
    this.description = description;
    this.completed = completed;
    this.index = index;
    this.afterElementIndex = afterElementIndex;
  }

  populate(container, i) {
    // Build tr element with 2 tds
    const tr = document.createElement('tr');
    tr.classList.add('draggable');
    tr.draggable = true;
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
    container.appendChild(tr);

    // Add element property to this
    this.node = tr;

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
        this.node.remove();
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

    // Add drag and drop functionality for desktop

    tr.addEventListener('dragstart', () => {
      tr.classList.add('dragging', 'bg-light');
    });

    tr.addEventListener('dragend', () => {
      tr.classList.remove('dragging', 'bg-light');
      const trIndex = Task.tasks.findIndex((task) => task.node === tr);
      console.log(trIndex);
      console.log(this.afterElementIndex);
      if (trIndex !== this.afterElementIndex) {
        Task.move(trIndex, this.afterElementIndex);
      }
      Task.tasks.forEach((task, i) => {
        task.index = i + 1;
      });
      Task.saveLocalTasks();
    });

    // Add drag and drop functionality for mobile

    tr.addEventListener('touchstart', () => {
      tr.classList.add('dragging', 'bg-light');
    });

    tr.addEventListener('touchend', () => {
      tr.classList.remove('dragging', 'bg-light');
      Task.saveLocalTasks();
    });

    // Set local storage
    Task.saveLocalTasks();
  }

  static populateAll(container) {
    this.sort();
    this.tasks.forEach((task, i) => {
      task.populate(container, i);
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
      if (task.completed) task.node.remove();
      return !task.completed;
    });
    this.tasks.forEach((task, i) => {
      task.index = i + 1;
    });
    this.saveLocalTasks();
  }

  static getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  static swap(i, j) {
    [this.tasks[i], this.tasks[j]] = [this.tasks[j], this.tasks[i]];
  }

  static move(from, to) {
    this.tasks.splice(to, 0, this.tasks.splice(from, 1)[0]);
  }
}
