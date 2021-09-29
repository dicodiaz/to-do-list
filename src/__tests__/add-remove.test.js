import TaskManager from '../TaskManager.js';
import LocalStorage from '../__mocks__/localStorage.js';

global.localStorage = new LocalStorage();

// document.body.innerHTML = `<table><tbody id="to-do-list"></tbody></table>`;

describe('Adding and removing items', () => {
  const task = { description: 'asdf', completed: false, index: 1 };
  const task2 = { description: 'asdf2', completed: false, index: 2 };
  test('Adding an item', () => {
    const taskManager = new TaskManager();
    taskManager.add(task);
    expect(taskManager.tasks.length).toBeGreaterThan(0);
  });

  test('Adding two items', () => {
    const taskManager = new TaskManager();
    taskManager.add(task);
    taskManager.add(task2);
    expect(taskManager.tasks.length).toBe(2);
  });

  test('Check local storage length', () => {
    const local = JSON.parse(localStorage.getItem('tasks'));
    expect(local.length).toBe(2);
  });
});
