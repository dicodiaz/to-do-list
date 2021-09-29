const getDragAfterElement = (container, y) => {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
};

const dragoverHandler = (e, tasks, container) => {
  e.preventDefault();
  const y = e.clientY || e.touches[0].clientY;
  const afterElement = getDragAfterElement(container, y);
  const draggable = document.querySelector('.dragging');
  const draggableIndex = tasks.findIndex((task) => task.node === draggable);
  let afterElementIndex;
  if (!afterElement) {
    container.appendChild(draggable);
    afterElementIndex = tasks.length - 1;
  } else {
    container.insertBefore(draggable, afterElement);
    afterElementIndex = tasks.findIndex((task) => task.node === afterElement) - 1;
  }
  if (draggableIndex > afterElementIndex) afterElementIndex += 1;
  tasks[draggableIndex].afterElementIndex = afterElementIndex;
};

export default dragoverHandler;
