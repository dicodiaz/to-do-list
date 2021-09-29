/**
 * @jest-environment jsdom
 */

import TaskManager from '../TaskManager.js';
import LocalStorage from '../__mocks__/LocalStorage.js';




global.localStorage = new LocalStorage();

// 

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


describe("Testing DOM Manipulation", () => {
  const task = { description: 'asdf', completed: false, index: 1 };
  const task2 = { description: 'Test', completed: false, index: 2 };
  document.body.innerHTML = `<table><tbody id="to-do-list"></tbody></table>`;
  const taskManager = new TaskManager();
  const container = document.getElementById("to-do-list")

  test("Checking DOM when adding an item", () => {
    taskManager.populate(container, task)
    const trs = container.querySelectorAll("tr")
    expect(trs).toHaveLength(1)
  })

  test("Checking DOM when adding two elements", () => {
    taskManager.populate(container, task2)
    expect(container.querySelectorAll("tr")).toHaveLength(2)
  })

  test("Deleting an element in DOM", () => {
    taskManager.remove(task)
    expect(container.querySelectorAll("tr")).toHaveLength(1)
  })
})
