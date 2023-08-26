const { readFile } = require("fs/promises");
const canvas = require("canvas");

async function loadImageFromDir(url) {
  return new Promise(async (resolve, reject) => {
    const bg = await readFile(`./images/${url}`);
    const img = new canvas.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = bg;
  });
}
async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new canvas.Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
}
module.exports = { loadImage, loadImageFromDir };
