const appendImg = (source, container) => {
  const div = document.createElement('div');
  div.classList.add('d-flex', 'justify-content-end', 'align-items-center');
  const img = document.createElement('img');
  img.classList.add('cursor-pointer');
  img.src = source;
  img.alt = container.id;
  img.classList.add('img-fluid');
  div.appendChild(img);
  container.appendChild(div);
};

const appendCrossFadingImgs = (botSource, topSource, container) => {
  const div = document.createElement('div');
  div.classList.add('d-flex', 'justify-content-end', 'align-items-center');
  const botImg = document.createElement('img');
  botImg.src = botSource;
  botImg.alt = `${container.id}-bot`;
  botImg.classList.add('img-fluid');
  const topImg = document.createElement('img');
  topImg.src = topSource;
  topImg.alt = `${container.id}-top`;
  topImg.classList.add('cursor-pointer', 'cursor-move', 'img-fluid', 'opacity-0', 'position-absolute');
  div.appendChild(botImg);
  div.appendChild(topImg);
  container.appendChild(div);
  container.classList.add('position-relative');
};

export { appendImg, appendCrossFadingImgs };
