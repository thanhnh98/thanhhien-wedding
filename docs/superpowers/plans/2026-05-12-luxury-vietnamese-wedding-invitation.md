# Luxury Vietnamese Wedding Invitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium static Vietnamese wedding invitation website with romantic storybook styling, full section coverage, animation, music, lightbox, RSVP, and responsive behavior.

**Architecture:** The site will be a static three-file app: semantic markup in `index.html`, visual system and responsive motion in `styles.css`, and browser behavior in `script.js`. A Node verification script in `tests/verify-site.js` will assert the core contract from the design spec.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js for verification, local static server for browser QA.

---

## File Structure

- `index.html`: semantic page sections, exact asset references, preloads, audio/video elements, form, gallery, lightbox, and controls.
- `styles.css`: red/cream/gold/pink visual system, responsive layouts, reveal states, particles, hero animation, lightbox, form states, and reduced-motion rules.
- `script.js`: scroll progress, smooth CTA, Intersection Observer reveals, countdown, gallery lightbox, RSVP success, music autoplay fallback, and falling hearts.
- `tests/verify-site.js`: Node assertions for required files, sections, asset paths, scripts, styles, and interaction hooks.

### Task 1: Verification Script

**Files:**
- Create: `tests/verify-site.js`

- [ ] **Step 1: Write the failing test**

```js
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
  assert(html.includes(`/assets/gallery/gallery-${n}.jpg`), `Missing gallery image ${n}`);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-site.js`
Expected: FAIL with `index.html must exist`.

### Task 2: Static Site Implementation

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`

- [ ] **Step 1: Implement semantic HTML**

Create every required section, exact media paths, form hooks, lightbox, music button, and scroll progress bar.

- [ ] **Step 2: Implement visual system and motion CSS**

Add mobile-first luxury styling, section layouts, hero animation, reveal states, responsive breakpoints, particles, hover states, lightbox, and reduced-motion support.

- [ ] **Step 3: Implement browser behavior**

Add scroll progress, reveal observer, timeline progress, countdown, gallery lightbox, RSVP success state, music autoplay fallback with saved preference, and falling hearts.

- [ ] **Step 4: Run contract test**

Run: `node tests/verify-site.js`
Expected: PASS with `Site contract verified.`

### Task 3: Browser Verification

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`

- [ ] **Step 1: Start local server**

Run: `python3 -m http.server 4173`
Expected: server available at `http://localhost:4173`.

- [ ] **Step 2: Open the page in browser**

Open `http://localhost:4173` and verify hero, sections, mobile-friendly layout, lightbox, RSVP success state, and music button are usable.

- [ ] **Step 3: Fix visible issues**

Adjust CSS or JS for any overlap, broken layout, missing interaction, or unreadable text discovered in browser QA.
