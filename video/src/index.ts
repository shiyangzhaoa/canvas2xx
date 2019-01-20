const path = require('path');
const fs = require("fs");
const { execSync } = require('child_process');

const { createCanvas, loadImage } = require('canvas');
const ffmpeg = require('fluent-ffmpeg');

const canvas = createCanvas(80, 80)
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

async function transform(imsPath: string) {
  const image: ImageBitmap = await loadImage(imsPath);

  ctx.drawImage(image, 0, 0, 80, 80);

  const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { width, height, data } = imageData;
  let outStr = '';

  for (let col = 0; col < height; col += 1) {
    for (let row = 0; row < width; row += 1) {
      const index = ((col * height) + row) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      // 黑色
      if (r < 10 && g < 10 && b < 10 && a === 255) {
        outStr += '.';
      } else {
        outStr += ' ';
      }
    }

    outStr += "\n"
  }
  console.log(outStr);
  // fs.writeFileSync('../outputs/index.txt', outStr);
}

// ffmpeg 能根据数量来分割视频
// const screenShot = (video: string, duration: number) => {
//   return new Promise((resolve, reject) => {
//     ffmpeg(video)
//       .fps(29.7)
//       .on('error', function (err: Error) {
//         reject(err);
//       })
//       .on('end', function () {
//         resolve();
//       })
//       .screenshots({
//         count: duration,
//         filename: 'bad-%i.png',
//         folder: '../output',
//         size: '160x120'
//       });
//   });
// }

// ffmpeg.ffprobe('../mv/bad-apple.flv', function (err: Error, metadata: any) {
//   const videoDuration = metadata.format.duration;
//   const count = Math.floor(videoDuration) * 2;
//   let i = 1;

//   screenShot('../mv/bad-apple.flv', count).then(() => {
//     console.log('end');
//     const timer = setInterval(() => {
//       if (i === count) {
//         clearInterval(timer);
//       }

//       transform(`../output/bad-${i}.png`);
//       i += 1;
//     }, 500)
//   })
// });

const mvPath = path.join(__dirname, '../mv/bad-apple.flv');
const imgPath = path.join(__dirname, '../img');

const setTime = (t: number) => new Promise((resolve) => {
  setTimeout(() => resolve(), t);
});

try {
  void async function main() {
    let img = fs.readdirSync(imgPath);
    let len = img.length;
    if (len <= 1) {
      await execSync(`cd ${imgPath} && ffmpeg -i ${mvPath} -f image2 -vf fps=fps=30 bad-%d.png`);
      img = fs.readdirSync(imgPath);
      len = img.length;
    }
    let start = 1;
    let count = len;

    (async function inter(i: number) {
      if (i < count) {
        await transform(path.join(__dirname, `../img/bad-${i}.png`));
        await setTime(33.33);
        await inter(++i);
      }
    })(start);
  }()
} catch (err) {
  console.log(err);
}
