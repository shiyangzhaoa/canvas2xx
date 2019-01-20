const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const canvas = createCanvas(80, 80)
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

async function transform(input: string, output: string) {
  const image: ImageBitmap = await loadImage(input);

  ctx.drawImage(image, 0, 0, 80, 80);

  const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { width, height, data } = imageData;
  let outStr = '';

  for (let col = 0; col < height; col++) {
    for (let row = 0; row < width; row++) {
      const index = ((col * height) + row) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      // 黑色
      if (r < 100 && g < 100 && b < 100 && a === 255) {
        outStr += '+';
      } else {
        outStr += ' ';
      }
    }

    outStr += '\n';
  }

  console.log(outStr);
  fs.writeFileSync(output, outStr);
}

transform(path.join(__dirname, '../img/tree.jpg'), path.join(__dirname, '../outputs/demo2.txt'));