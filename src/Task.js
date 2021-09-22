import Menu from './menu.png';

const appendImg = (source, container, move) => {
  const div = document.createElement('div');
  div.classList.add('d-flex', 'justify-content-end', 'align-items-center');
  const img = document.createElement('img');
  img.src = source;
  img.alt = container.id;
  img.classList.add('img-fluid');
  if (move) {
    img.classList.add('cursor-move');
  }
  div.appendChild(img);
  container.appendChild(div);
};

class Task {
  static tasks = [];

  constructor({ description, completed, index }) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }

  static addTask(task) {
    this.tasks.push(task);
  }

  add() {
    Task.tasks.push(this);
    return this;
  }

  static populate(element) {
    this.sort();
    this.tasks.forEach((task, i) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      const span = document.createElement('span');
      span.classList.add('ps-2');
      span.innerText = task.description;
      td1.appendChild(checkBox);
      td1.appendChild(span);
      if (task.completed) {
        checkBox.checked = true;
        span.classList.add('td-line-through');
      }

      const td2 = document.createElement('td');
      td2.classList.add('align-middle');
      td2.id = `menu-${i + 1}`;
      appendImg(Menu, td2, true);

      tr.appendChild(td1);
      tr.appendChild(td2);
      element.appendChild(tr);

      checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
          task.setCompleted(true);
          span.classList.add('td-line-through');
        } else {
          task.setCompleted(false);
          span.classList.remove('td-line-through');
        }
        this.saveLocalTasks();
      });
    });
  }

  static sort() {
    this.tasks.sort((a, b) => a.index - b.index);
  }

  setCompleted(bool) {
    this.completed = bool;
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
}

export { Task, appendImg };
