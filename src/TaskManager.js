import { appendCrossFadingImgs } from './images.js';
// import Menu from './menu.png';
// import Task from './Task.js';
// import Trash from './trash.png';

export default class TaskManager {
  constructor({ tasks = [] } = {}) {
    this.tasks = tasks;
  }

  saveLocalTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    return this;
  }

  loadLocalTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      tasks.forEach((task, i) => {
        this.tasks[i] = new Task(task);
      });
    }
    return this;
  }

  sortByIndex() {
    this.tasks.sort((a, b) => a.index - b.index);
    return this;
  }

  adjustIndexes() {
    this.tasks.forEach((task, i) => {
      task.index = i + 1;
    });
    return this;
  }

  add(task) {
    this.tasks.push(task);
    return this.saveLocalTasks();
  }

  remove(removeTask) {
    this.tasks = this.tasks.filter((task) => task !== removeTask);
    removeTask.node.remove();
    return this.adjustIndexes().saveLocalTasks();
  }

  clearAllCompleted() {
    this.tasks = this.tasks.filter((task) => {
      if (task.completed) task.node.remove();
      return !task.completed;
    });
    return this.adjustIndexes().saveLocalTasks();
  }

  move(from, to) {
    this.tasks.splice(to, 0, this.tasks.splice(from, 1)[0]);
    return this;
  }

  populateAll(container) {
    this.sortByIndex().tasks.forEach((task) => {
      this.populate(container, task);
    });
    return this;
  }

  populate(container, task) {
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
    span.innerText = task.description;
    td1.appendChild(checkBox);
    td1.appendChild(span);
    // Build second td
    const td2 = document.createElement('td');
    td2.classList.add('align-middle');
    appendCrossFadingImgs(Menu, Trash, td2);
    // Append tds to tr and tr to element
    tr.appendChild(td1);
    tr.appendChild(td2);
    container.appendChild(tr);

    // Add element property to this task
    task.node = tr;

    // Add interactivity to checkbox
    checkBox.addEventListener('change', () => {
      if (checkBox.checked) {
        task.completed = true;
        span.classList.add('td-line-through');
        td1.classList.add('opacity-50');
      } else {
        task.completed = false;
        span.classList.remove('td-line-through');
        td1.classList.remove('opacity-50');
      }
      this.saveLocalTasks();
    });
    // Add same classes as before when checkbox is checked after loading page
    if (task.completed) {
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
        this.remove(task);
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
        task.description = editTask.value;
        this.saveLocalTasks();
      }
    });

    // Add drag and drop functionality for desktop
    tr.addEventListener('dragstart', () => {
      tr.classList.add('dragging', 'bg-light');
    });

    tr.addEventListener('dragend', () => {
      tr.classList.remove('dragging', 'bg-light');
      const trIndex = this.tasks.findIndex((task) => task.node === tr);
      if (trIndex !== task.afterElementIndex) {
        this.move(trIndex, task.afterElementIndex);
      }
      this.adjustIndexes().saveLocalTasks();
    });

    // Add drag and drop functionality for mobile
    tr.addEventListener('touchstart', () => {
      tr.classList.add('dragging', 'bg-light');
    });

    tr.addEventListener('touchend', () => {
      tr.classList.remove('dragging', 'bg-light');
      const trIndex = this.tasks.findIndex((task) => task.node === tr);
      if (trIndex !== task.afterElementIndex) {
        this.move(trIndex, task.afterElementIndex);
      }
      this.adjustIndexes().saveLocalTasks();
    });

    return this.saveLocalTasks();
  }
}
