"use strict";
const rectWidth = parseFloat(document.documentElement.style.getPropertyValue('--rect-width'));
const canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 20;

const ctx = canvas.getContext('2d');
ctx.font = '100 18px monospace';
ctx.textBaseline = 'top';
ctx.textAlign = 'center';
const ul = document.getElementById('ul');

function drawText(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(10, 0, canvas.width - 10, 0);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(1 / 6, 'orange');
  gradient.addColorStop(2 / 6, 'yellow');
  gradient.addColorStop(3 / 6, 'green');
  gradient.addColorStop(4 / 6, 'blue');
  gradient.addColorStop(5 / 6, 'indigo');
  gradient.addColorStop(1, 'violet');
  ctx.fillStyle = gradient;
  ctx.fillText(text, canvas.width / 2, 2);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let iLi = 0;
  for (let column = 0; column < imageData.width; column++) {
    for (let row = 0; row < imageData.height; row++) {
      const idx = ((row * imageData.width) + column) * 4;
      if (imageData.data[idx + 3] > 0) {
        const li = ul.children[iLi++];
        li.style.opacity = '1';
        li.style.transform = `translate(
          ${column * rectWidth}px,
          ${row * rectWidth}px)
          scale(1.5)`;
        li.style.background =
          `rgba(${imageData.data[idx]},${imageData.data[idx + 1]},${imageData.data[idx + 2]},${imageData.data[idx + 3] / 255})`;
      }
    }
  }
  while (iLi < 2000) {
    const li = ul.children[iLi++];
    li.style.opacity = '0';
  }
}

const timeout = t => new Promise(resolve => setTimeout(resolve, t));

void async function main() {
  const duration = 2500;
  {
    let i = 2000;
    const fragment = document.createDocumentFragment();
    while (i-- > 0) {
      fragment.appendChild(document.createElement('li'));
    }
    ul.appendChild(fragment);
  }

  await timeout(100);

  drawText('终极蛇皮');
  await timeout(duration);

  drawText('战术翻滚');
  await timeout(duration);

  ul.classList.add('slow');
  drawText('NMSL!');
}();
