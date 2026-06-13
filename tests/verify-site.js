const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const requiredFiles = ['index.html', 'styles.css', 'script.js'];
for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `${file} must exist`);
}

const html = read('index.html');
const css = read('styles.css');
const js = read('script.js');

for (const id of ['hero', 'couple', 'story', 'events', 'countdown', 'gallery', 'rsvp', 'wishes', 'qr-invitation', 'video', 'footer']) {
  assert(html.includes(`id="${id}"`), `Missing section #${id}`);
}

for (const asset of [
  '/assets/hero/hero-main.jpg',
  '/assets/hero/hero-bg.jpg',
  '/assets/logo/monogram.png',
  '/assets/logo/signature.png',
  '/assets/music/wedding-music.mp3',
  '/assets/video/wedding-highlight.mp4',
  '/assets/qr/qr-location.png',
  '/assets/qr/qr-invitation.png'
]) {
  assert(html.includes(asset) || css.includes(asset), `Missing asset path ${asset}`);
}

for (let i = 1; i <= 6; i++) {
  assert(html.includes(`/assets/story/story-${i}.jpg`), `Missing story image ${i}`);
}

for (let i = 1; i <= 12; i++) {
  const n = String(i).padStart(2, '0');
  assert(html.includes(`/assets/gallery/gallery-${n}-thumb.jpg`), `Missing gallery image ${n}`);
}

for (const token of ['musicToggle', 'lightbox', 'rsvpForm', 'countdownGrid']) {
  assert(html.includes(token), `Missing interaction hook ${token}`);
}

for (const token of ['prefers-reduced-motion', '@media (min-width: 768px)', '@media (min-width: 1024px)', 'falling-heart']) {
  assert(css.includes(token), `Missing CSS marker ${token}`);
}

for (const token of ['IntersectionObserver', 'localStorage', 'createHeart', 'openLightbox', 'updateCountdown']) {
  assert(js.includes(token), `Missing JS behavior ${token}`);
}

console.log('Site contract verified.');
