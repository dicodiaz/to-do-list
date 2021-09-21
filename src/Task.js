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

      const td2 = document.createElement('td');
      td2.classList.add('align-middle');
      td2.id = `menu-${i + 1}`;
      appendImg(Menu, td2, true);

      tr.appendChild(td1);
      tr.appendChild(td2);
      element.appendChild(tr);
    });
  }

  static sort() {
    this.tasks.sort((a, b) => a.index - b.index);
  }
}

export { Task, appendImg };
