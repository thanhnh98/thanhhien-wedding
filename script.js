const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const weddingDate = new Date('2025-06-15T08:00:00+07:00');

const progress = document.querySelector('.scroll-progress');
const timeline = document.querySelector('#storyTimeline');
const reveals = document.querySelectorAll('.reveal');
const countdownGrid = document.querySelector('#countdownGrid');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');
const onboardingMusic = document.querySelector('#onboardingMusic');
const weddingMusic = document.querySelector('#weddingMusic');
let music = onboardingMusic;
const musicToggle = document.querySelector('#musicToggle');
const rsvpForm = document.querySelector('#rsvpForm');
const rsvpSuccess = document.querySelector('#rsvpSuccess');
const heartLayer = document.querySelector('#heartLayer');

let currentImageIndex = 1;
const totalImages = 37;
const galleryImages = Array.from({ length: totalImages }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    index: i + 1,
    src: `/assets/gallery/gallery-${n}.jpg`,
    thumb: `/assets/gallery/gallery-${n}-thumb.jpg`,
    alt: `Ảnh cưới Hoài Thanh & Thanh Hiền ${n}`
  };
});

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(percent, 100)}%`;

  if (timeline) {
    const rect = timeline.getBoundingClientRect();
    const viewport = window.innerHeight;
    const progressValue = Math.min(Math.max((viewport - rect.top) / (rect.height + viewport * .35), 0), 1);
    timeline.style.setProperty('--timeline-progress', progressValue.toFixed(3));
  }
}

function updateCountdown() {
  if (!countdownGrid) return;
  const diff = Math.max(weddingDate.getTime() - Date.now(), 0);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;
  const values = {
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    minutes: Math.floor((diff % hour) / minute),
    seconds: Math.floor((diff % minute) / 1000)
  };

  Object.entries(values).forEach(([key, value]) => {
    const node = countdownGrid.querySelector(`[data-count="${key}"]`);
    if (!node) return;
    const next = key === 'days' ? String(value).padStart(3, '0') : String(value).padStart(2, '0');
    if (node.textContent !== next) {
      node.style.opacity = '.35';
      node.style.transform = 'translate3d(0, -4px, 0)';
      window.setTimeout(() => {
        node.textContent = next;
        node.style.opacity = '1';
        node.style.transform = 'translate3d(0, 0, 0)';
      }, 120);
    }
  });
}

function updateLightboxContent(index) {
  if (!lightboxImage || !lightbox) return;
  currentImageIndex = index;
  const imgData = galleryImages[currentImageIndex - 1];
  
  // Transition effect
  lightboxImage.style.opacity = '0.3';
  lightboxImage.style.transform = 'scale(0.97)';
  
  const tempImg = new Image();
  tempImg.src = imgData.src;
  tempImg.onload = () => {
    if (currentImageIndex === index) {
      lightboxImage.src = imgData.src;
      lightboxImage.alt = imgData.alt;
      lightboxImage.style.opacity = '1';
      lightboxImage.style.transform = 'scale(1)';
    }
  };
  
  window.setTimeout(() => {
    if (lightboxImage.src !== imgData.src) {
      lightboxImage.src = imgData.src;
      lightboxImage.alt = imgData.alt;
      lightboxImage.style.opacity = '1';
      lightboxImage.style.transform = 'scale(1)';
    }
  }, 300);
  
  const counter = lightbox.querySelector('.lightbox-counter');
  if (counter) {
    counter.textContent = `${currentImageIndex} / ${totalImages}`;
  }
}

function openLightboxIndex(index) {
  if (!lightbox) return;
  updateLightboxContent(index);
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  window.setTimeout(() => {
    if (!lightbox.classList.contains('is-open')) lightboxImage.src = '';
  }, 250);
}

function nextImage() {
  let nextIdx = currentImageIndex + 1;
  if (nextIdx > totalImages) nextIdx = 1;
  updateLightboxContent(nextIdx);
}

function prevImage() {
  let prevIdx = currentImageIndex - 1;
  if (prevIdx < 1) prevIdx = totalImages;
  updateLightboxContent(prevIdx);
}

function updateMusicState(state) {
  musicToggle?.setAttribute('data-state', state);
  const label = musicToggle?.querySelector('.music-state');
  if (label) label.textContent = state === 'playing' ? 'Đang phát' : state === 'muted' ? 'Tắt tiếng' : 'Nhạc';
}

async function playMusic({ muted = false, userChoice = false } = {}) {
  if (!music) return;
  try {
    music.muted = muted;
    await music.play();
    updateMusicState(muted ? 'muted' : 'playing');
    if (userChoice) localStorage.setItem('weddingMusicPreference', muted ? 'muted' : 'playing');
  } catch {
    updateMusicState('paused');
  }
}

function toggleMusic() {
  if (!music) return;
  if (music.paused) {
    playMusic({ muted: false, userChoice: true });
  } else if (music.muted) {
    music.muted = false;
    localStorage.setItem('weddingMusicPreference', 'playing');
    updateMusicState('playing');
  } else {
    music.pause();
    localStorage.setItem('weddingMusicPreference', 'paused');
    updateMusicState('paused');
  }
}

function primeMusic() {
  const preference = localStorage.getItem('weddingMusicPreference');
  if (preference === 'paused') {
    updateMusicState('paused');
    return;
  }
  playMusic({ muted: false }).then(() => {
    if (music?.paused) playMusic({ muted: true });
  });
}

function createHeart() {
  if (!heartLayer || prefersReducedMotion) return;
  const heart = document.createElement('span');
  const colors = ['#FF7AAE', '#FF9FCB', '#F8BBD0'];
  const size = Math.round(8 + Math.random() * 22);
  const speed = 6 + Math.random() * 8;
  heart.className = 'falling-heart';
  heart.textContent = '♥';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.opacity = String(.35 + Math.random() * .5);
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];
  heart.style.animationDuration = `${speed}s`;
  heart.style.setProperty('--swing', `${Math.round(-36 + Math.random() * 72)}px`);
  heart.style.setProperty('--rotate', `${Math.round(-180 + Math.random() * 360)}deg`);
  heartLayer.appendChild(heart);
  window.setTimeout(() => heart.remove(), speed * 1000 + 500);
}

function setupReveals() {
  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    reveals.forEach(node => node.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .16, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    observer.observe(node);
  });
}

function setupFallbackImages() {
  document.querySelectorAll('img').forEach(image => {
    const applyFallback = () => {
      if (image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      if (image.alt === '') {
        image.hidden = true;
        return;
      }
      image.removeAttribute('src');
      image.alt = '';
      image.classList.add('is-missing');
    };
    image.addEventListener('error', applyFallback, { once: true });
    if (!image.loading || image.loading !== 'lazy') {
      if (image.complete && image.naturalWidth === 0) {
        applyFallback();
      }
    }
  });
}

document.querySelector('.hero-cta')?.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#couple')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// Load all remaining images dynamically on click "Xem thêm"
const loadMoreBtn = document.querySelector('#loadMoreBtn');
const galleryGrid = document.querySelector('.gallery-grid');

function loadAllImages() {
  if (!galleryGrid) return;
  const fragment = document.createDocumentFragment();
  for (let i = 12; i < totalImages; i++) {
    const imgData = galleryImages[i];
    const button = document.createElement('button');
    button.className = 'gallery-item reveal';
    button.type = 'button';
    button.setAttribute('data-index', imgData.index);
    
    // Add dynamic delay for reveal animation
    const delayIndex = i % 6;
    button.style.transitionDelay = `${delayIndex * 70}ms`;
    
    const img = document.createElement('img');
    img.src = imgData.thumb;
    img.alt = imgData.alt;
    img.loading = 'lazy';
    
    button.appendChild(img);
    
    button.addEventListener('click', () => {
      openLightboxIndex(imgData.index);
    });
    
    fragment.appendChild(button);
  }
  
  galleryGrid.appendChild(fragment);
  
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const newReveals = galleryGrid.querySelectorAll('.gallery-item.reveal:not(.is-visible)');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .16, rootMargin: '0px 0px -8% 0px' });
    
    newReveals.forEach(node => observer.observe(node));
  } else {
    galleryGrid.querySelectorAll('.gallery-item').forEach(node => node.classList.add('is-visible'));
  }
  
  if (loadMoreBtn) {
    const parentContainer = loadMoreBtn.closest('.gallery-actions');
    if (parentContainer) {
      parentContainer.style.display = 'none';
    }
  }
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', loadAllImages);
}

// Initial gallery items click binding
document.querySelectorAll('.gallery-item').forEach(button => {
  button.addEventListener('click', () => {
    const idx = parseInt(button.getAttribute('data-index'), 10);
    if (!isNaN(idx)) {
      openLightboxIndex(idx);
    }
  });
});

lightbox?.addEventListener('click', event => {
  if (event.target === lightbox || event.target.closest('.lightbox-close')) closeLightbox();
});

// Lightbox Nav Buttons
lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', event => {
  event.stopPropagation();
  prevImage();
});

lightbox?.querySelector('.lightbox-next')?.addEventListener('click', event => {
  event.stopPropagation();
  nextImage();
});

// Keyboard Nav
document.addEventListener('keydown', event => {
  if (!lightbox || !lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'ArrowLeft') {
    prevImage();
  }
});

// Touch Navigation (Swipe gestures)
let touchStartX = 0;
let touchEndX = 0;

lightbox?.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

lightbox?.addEventListener('touchend', event => {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff < 0) {
      nextImage();
    } else {
      prevImage();
    }
  }
}

rsvpForm?.addEventListener('submit', event => {
  event.preventDefault();
  rsvpSuccess?.classList.add('is-visible');
  rsvpForm.reset();
  window.setTimeout(() => rsvpSuccess?.classList.remove('is-visible'), 5200);
});

musicToggle?.addEventListener('click', toggleMusic);
['pointerdown', 'keydown', 'touchstart'].forEach(type => {
  window.addEventListener(type, () => {
    if (localStorage.getItem('weddingMusicPreference') !== 'paused' && music?.paused) {
      playMusic({ muted: false });
    }
  }, { once: true, passive: true });
});

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);

setupReveals();
setupFallbackImages();
updateScrollProgress();
updateCountdown();
primeMusic();
window.setInterval(updateCountdown, 1000);

if (!prefersReducedMotion) {
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const interval = mobile ? 1250 : 820;
  window.setInterval(createHeart, interval);
  for (let i = 0; i < (mobile ? 5 : 9); i++) {
    window.setTimeout(createHeart, i * 240);
  }
}

// 3D Envelope Wax Seal & Personalization logic
function initPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || params.get('n');
  const prefix = params.get('prefix') || params.get('p') || 'Trân trọng kính mời';

  const envelopeGuestName = document.querySelector('#envelopeGuestName');
  const heroKicker = document.querySelector('.hero-kicker');
  const rsvpGuestInput = document.querySelector('input[name="guest"]');

  if (name) {
    const cleanName = decodeURIComponent(name.replace(/\+/g, ' ')).trim();
    const cleanPrefix = decodeURIComponent(prefix.replace(/\+/g, ' ')).trim();

    if (envelopeGuestName) {
      envelopeGuestName.textContent = `${cleanPrefix} ${cleanName}`;
    }
    if (heroKicker) {
      heroKicker.textContent = `${cleanPrefix} ${cleanName}`;
    }
    if (rsvpGuestInput) {
      rsvpGuestInput.value = cleanName;
    }
  } else {
    if (envelopeGuestName) {
      envelopeGuestName.textContent = 'Trân trọng kính mời Quý khách';
    }
    if (heroKicker) {
      heroKicker.textContent = 'Trân trọng kính mời Quý khách';
    }
  }
}

function initEnvelopeOpening() {
  const overlay = document.querySelector('#envelopeOverlay');
  const envelope = document.querySelector('#envelope');
  const card = envelope ? envelope.querySelector('.envelope-card') : null;
  const openBtn = document.querySelector('#openInvitationBtn');

  if (!overlay || !envelope || !openBtn || !card) return;

  document.body.classList.add('envelope-active');

  openBtn.addEventListener('click', () => {
    // Switch to wedding music
    if (music) {
      music.pause();
    }
    music = weddingMusic;

    // Play main music
    playMusic({ muted: false, userChoice: true });

    // Open top flap
    envelope.classList.add('open');

    // Slide up card (after top flap opened)
    window.setTimeout(() => {
      card.classList.add('slide-up');
    }, 1400);

    // Zoom card to fullscreen
    window.setTimeout(() => {
      overlay.classList.add('zoom-card');
      card.classList.add('fullscreen-card');
    }, 3000);

    // Fade in Hero page behind the zooming card
    window.setTimeout(() => {
      document.body.classList.add('invitation-active');
    }, 4000);

    // Fade overlay out
    window.setTimeout(() => {
      overlay.classList.add('is-hidden');
      document.body.classList.remove('envelope-active');
    }, 4800);

    // Remove from DOM completely after animation completes
    window.setTimeout(() => {
      overlay.style.display = 'none';
      overlay.remove();
    }, 6600);
  });
}

initPersonalization();
initEnvelopeOpening();
