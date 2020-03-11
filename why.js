const container = document.createElement('div');
container.style.width = '100vw';
container.style.height = '100vh';
container.style.overflow = 'hidden';
container.style.position = 'absolute';
container.style.top = '0';
container.style.left = '0';
container.style.pointerEvents = 'none';
const video = document.createElement('video');
video.setAttribute('autoplay', true);
video.setAttribute('crossorigin', 'anonymous');
video.setAttribute('src', 'https://why-you-do-this.now.sh/WHY_YOU_DO_THIS.mp4');
video.style.width = '100%';
video.style.height = '100%';
video.style.display = 'none';
const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.background = 'transparent';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '99999';
container.appendChild(video);
container.appendChild(canvas);
document.body.append(container);
video.play();
let played = false;
const updateCanvasSize = () => {
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
};
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);
video.addEventListener('play', () => {
  played = true;
  renderFrame();
});
document.addEventListener('mousedown', () => {
  if (!played) {
    video.play();
  }
});
const context = canvas.getContext('2d');
const ratio = 1920 / 1080;
const green = {
  r: 110,
  g: 245,
  b: 24,
};
function isClose(color, threshold = 100) {
  const rDist = Math.abs(color.r - green.r);
  const gDist = Math.abs(color.g - green.g);
  const bDist = Math.abs(color.b - green.b);
  return rDist + gDist + bDist < threshold;
}
function renderFrame() {
  const width = window.innerWidth / 2;
  const height = width / ratio;
  const left = window.innerWidth - width;
  const top = window.innerHeight - height;
  context.drawImage(video, left, top, width, height);
  const frame = context.getImageData(left, top, width, height);
  const l = frame.data.length / 4;
  for (let i = 0; i < l; i++) {
    const r = frame.data[i * 4 + 0];
    const g = frame.data[i * 4 + 1];
    const b = frame.data[i * 4 + 2];
    if (isClose({ r, g, b })) {
      frame.data[i * 4 + 3] = 0;
    }
  }
  context.putImageData(frame, left, top);
  if (!video.paused) {
    setTimeout(renderFrame, 0);
  } else {
    container.remove();
  }
}