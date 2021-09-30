/**
 * @jest-environment jsdom
 */

import Task from '../Task.js';
import TaskManager from '../TaskManager.js';

const editabletask = { description: 'This is not edited', completed: false, index: 1 };
const enterKey = new KeyboardEvent('keyup', { keyCode: 13 });
const taskManager = new TaskManager();
document.body.innerHTML = '<table><tbody id="to-do-list"></tbody></table><button type="button" id="clear-all" class="btn btn-light">Clear all completed</button>';
const container = document.getElementById('to-do-list');

describe('Testing the edition of tasks', () => {
  test('Testing the clickable image to trigger edition mode', () => {
    taskManager.add(editabletask);
    taskManager.populate(container, editabletask);
    editabletask.node.children[1].children[0].children[1].click();
    expect(editabletask.node.firstChild.children[1].tagName).toBe('INPUT');
    expect(editabletask.node.firstChild.children[1]).toBe(document.activeElement);
  });

  test('Testing the edition of the task description on DOM and localStorage', () => {
    document.activeElement.value = 'Hello world';
    document.activeElement.dispatchEvent(enterKey);
    expect(editabletask.node.firstChild.children[1].innerText).toBe('Hello world');
    expect(
      JSON.parse(localStorage.getItem('tasks'))[
        JSON.parse(localStorage.getItem('tasks')).length - 1
      ].description,
    ).toBe('Hello world');
  });
});

describe('Testing the completed status in DOM, local storage and tasks array', () => {
  test('Testing checking', () => {
    editabletask.node.firstChild.firstChild.click();
    expect(JSON.parse(localStorage.getItem('tasks'))[0].completed).toBe(
      editabletask.node.firstChild.firstChild.checked,
    );
    expect(taskManager.tasks[0].completed).toBe(true);
  });

  test('Testing unchecking', () => {
    editabletask.node.firstChild.firstChild.click();
    expect(JSON.parse(localStorage.getItem('tasks'))[0].completed).toBe(
      editabletask.node.firstChild.firstChild.checked,
    );
    expect(taskManager.tasks[0].completed).toBe(false);
  });
});

// Over engineered tests
describe('Testing Clear All Checked Items Function', () => {
  test('Checking all the items', () => {
    Array.from(Array(Math.floor(Math.random() * 100))).forEach((x, i) => {
      const temp = new Task({ description: '', index: i });
      taskManager.add(temp);
      taskManager.populate(container, temp);
    });
    container.querySelectorAll('tr').forEach((el) => {
      el.firstChild.firstChild.click();
    });
    taskManager.clearAllCompleted();
    expect(JSON.parse(localStorage.getItem('tasks')).length).toBe(0);
    expect(taskManager.tasks.length).toBe(0);
    expect(document.querySelectorAll('tr').length).toBe(0);
  });

  test('Checking random items', () => {
    let counter = 0;
    const total = Math.floor(Math.random() * 100);

    Array.from(Array(total)).forEach((x, i) => {
      const temp = new Task({ description: 'asdas', index: i });
      taskManager.add(temp);
      taskManager.populate(container, temp);
    });

    container.querySelectorAll('tr').forEach((el) => {
      if (Math.random() < 0.5) {
        counter += 1;
        el.firstChild.firstChild.click();
      }
    });
    taskManager.clearAllCompleted();

    expect(JSON.parse(localStorage.getItem('tasks')).length).toBe(total - counter);
    expect(taskManager.tasks.length).toBe(total - counter);
    expect(document.querySelectorAll('tr').length).toBe(total - counter);
  });
});
