/**
 * @jest-environment jsdom
 */

import TaskManager from '../TaskManager.js';
import LocalStorage from '../__mocks__/LocalStorage.js';

global.localStorage = new LocalStorage();

const task = { description: 'asdf', completed: false, index: 1 };
const task2 = { description: 'asdf2', completed: false, index: 2 };
const editabletask = { description: 'This is not edited', completed: false, index: 3 };
const enterKey = new KeyboardEvent("keyup", {"keyCode":13})
const taskManager = new TaskManager();
document.body.innerHTML = '<table><tbody id="to-do-list"></tbody></table>';
const container = document.getElementById('to-do-list');

describe('Testing add items in the database and in local Storage', () => {
  test('Adding an item', () => {
    taskManager.add(task);
    expect(taskManager.tasks.length).toBe(1);
  });

  test('Adding two items', () => {
    taskManager.add(task2);
    expect(taskManager.tasks.length).toBe(2);
  });

  test('Check local storage length', () => {
    const local = JSON.parse(localStorage.getItem('tasks'));
    expect(local.length).toBe(2);
  });
});

describe('Testing DOM Manipulation', () => {
  test('Checking DOM when adding an item', () => {
    taskManager.populate(container, task);
    const trs = container.querySelectorAll('tr');
    expect(trs).toHaveLength(1);
  });

  test('Checking DOM when adding two elements', () => {
    taskManager.populate(container, task2);
    expect(container.querySelectorAll('tr')).toHaveLength(2);
  });

  test('Deleting an element from DOM', () => {
    taskManager.remove(task);
    expect(container.querySelectorAll('tr')).toHaveLength(1);
  });
});

describe('Testing remove in database and in local storage', () => {
  test('Adding and removing an element in tasks array and in local storage', () => {
    taskManager.add(task);
    expect(taskManager.tasks.length).toBe(2);
    expect(JSON.parse(localStorage.getItem('tasks')).length).toBe(2);
    taskManager.remove(task);
    expect(taskManager.tasks.length).toBe(1);
    expect(JSON.parse(localStorage.getItem('tasks')).length).toBe(1);
  });
});



describe("Testing the edition of tasks", () => {
  test("Testing the clickable image to trigger edition mode", () => {  
    taskManager.add(editabletask)
    taskManager.populate(container, editabletask)
    editabletask.node.children[1].children[0].children[1].click()
    expect(editabletask.node.firstChild.children[1].tagName).toBe("INPUT")
    expect(editabletask.node.firstChild.children[1]).toBe(document.activeElement); 
  })

  test("Testing the edition of the task description on DOM and localStorage", () => {
    document.activeElement.value = "Hello world"   
    document.activeElement.dispatchEvent(enterKey)
    expect(editabletask.node.firstChild.children[1].innerText).toBe("Hello world")
    expect(JSON.parse(localStorage.getItem("tasks"))[JSON.parse(localStorage.getItem("tasks")).length - 1].description).toBe("Hello world")
  })
})