/**
 * @jest-environment jsdom
 */

import TaskManager from '../TaskManager.js';

const editabletask = { description: 'This is not edited', completed: false, index: 3 };
const enterKey = new KeyboardEvent('keyup', { keyCode: 13 });
const taskManager = new TaskManager();
document.body.innerHTML = '<table><tbody id="to-do-list"></tbody></table>';
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
