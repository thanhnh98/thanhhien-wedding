const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ngày cưới nhà gái: 25/07/2026 (Gia Lai)
const brideDate = new Date('2026-07-25T08:00:00+07:00');
// Ngày cưới nhà trai: 01/08/2026 (Đồng Nai)
const groomDate = new Date('2026-08-01T09:00:00+07:00');

const progress = document.querySelector('.scroll-progress');
const timeline = document.querySelector('#storyTimeline');
const reveals = document.querySelectorAll('.reveal');
const countdownGridBride = document.querySelector('#countdownGridBride');
const countdownGridGroom = document.querySelector('#countdownGridGroom');
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

function calcTimeLeft(targetDate) {
  const diff = Math.max(targetDate.getTime() - Date.now(), 0);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;
  return {
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    minutes: Math.floor((diff % hour) / minute),
    seconds: Math.floor((diff % minute) / 1000)
  };
}

function updateCountdownGrid(grid, values, prefix) {
  if (!grid) return;
  Object.entries(values).forEach(([key, value]) => {
    const node = grid.querySelector(`[data-count-${prefix}="${key}"]`);
    if (!node) return;
    const next = key === 'days' ? String(value).padStart(3, '0') : String(value).padStart(2, '0');
    if (node.textContent !== next) {
      node.textContent = next;
      node.classList.remove('tick-anim');
      void node.offsetWidth; // Force reflow
      node.classList.add('tick-anim');
    }
  });
}

function updateCountdown() {
  updateCountdownGrid(countdownGridBride, calcTimeLeft(brideDate), 'bride');
  updateCountdownGrid(countdownGridGroom, calcTimeLeft(groomDate), 'groom');
}

// Tab switching for countdown
function initCountdownTabs() {
  const tabs = document.querySelectorAll('.countdown-tab');
  const panels = document.querySelectorAll('.countdown-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.id === `countdown-${target}`) {
          panel.classList.remove('is-hidden');
          // re-trigger reveal if not yet visible
          panel.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
            el.classList.add('is-visible');
          });
        } else {
          panel.classList.add('is-hidden');
        }
      });
    });

    // Keyboard: arrow keys for tab navigation
    tab.addEventListener('keydown', e => {
      const all = [...tabs];
      const idx = all.indexOf(tab);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        all[(idx + 1) % all.length].click();
        all[(idx + 1) % all.length].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        all[(idx - 1 + all.length) % all.length].click();
        all[(idx - 1 + all.length) % all.length].focus();
      }
    });
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
  if (label) label.textContent = state === 'playing' ? 'Đang phát' : state === 'muted' ? 'Tắt tiếng' : 'Tạm dừng';
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

// Toggle gallery expand/collapse
const loadMoreBtn = document.querySelector('#loadMoreBtn');
const galleryExpandContainer = document.querySelector('#galleryExpandContainer');
const loadMoreText = document.querySelector('#loadMoreText');

function toggleGallery() {
  if (!galleryExpandContainer || !loadMoreBtn) return;
  
  const isExpanded = galleryExpandContainer.classList.contains('is-expanded');
  
  if (isExpanded) {
    // Collapse
    galleryExpandContainer.classList.remove('is-expanded');
    loadMoreBtn.setAttribute('aria-expanded', 'false');
    if (loadMoreText) {
      loadMoreText.textContent = 'Xem thêm ảnh (Còn 29 ảnh)';
    }
    
    // Smooth scroll back to the gallery section heading so the user isn't disoriented
    const gallerySection = document.querySelector('#gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  } else {
    // Expand
    galleryExpandContainer.classList.add('is-expanded');
    loadMoreBtn.setAttribute('aria-expanded', 'true');
    if (loadMoreText) {
      loadMoreText.textContent = 'Thu gọn ảnh';
    }
    
    // Trigger scroll reveals for the newly shown images
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const newReveals = galleryExpandContainer.querySelectorAll('.gallery-item.reveal:not(.is-visible)');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .1, rootMargin: '0px 0px -5% 0px' });
      
      newReveals.forEach(node => observer.observe(node));
    } else {
      galleryExpandContainer.querySelectorAll('.gallery-item.reveal').forEach(node => node.classList.add('is-visible'));
    }
  }
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', toggleGallery);
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

// Bento grid items click binding (indices 1–12)
document.querySelectorAll('.bento-item').forEach(button => {
  button.addEventListener('click', () => {
    const idx = parseInt(button.getAttribute('data-index'), 10);
    if (!isNaN(idx)) openLightboxIndex(idx);
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
initCountdownTabs();
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
  const invitationGuestName = document.querySelector('#invitationGuestName');
  const rsvpGuestInput = document.querySelector('input[name="guest"]');

  if (name) {
    const cleanName = decodeURIComponent(name.replace(/\+/g, ' ')).trim();
    const cleanPrefix = decodeURIComponent(prefix.replace(/\+/g, ' ')).trim();

    if (envelopeGuestName) {
      envelopeGuestName.textContent = `${cleanPrefix} ${cleanName}`;
    }
    if (invitationGuestName) {
      invitationGuestName.textContent = `${cleanPrefix} ${cleanName}`;
    }
    if (rsvpGuestInput) {
      rsvpGuestInput.value = cleanName;
    }
  } else {
    if (envelopeGuestName) {
      envelopeGuestName.textContent = 'Trân trọng kính mời Quý khách';
    }
    if (invitationGuestName) {
      invitationGuestName.textContent = 'Quý khách';
    }
  }

  // Set invitation sharing QR code dynamically pointing to the base website URL
  const qrInvitationImg = document.querySelector('#qr-invitation img');
  if (qrInvitationImg) {
    const baseUrl = window.location.origin + window.location.pathname;
    qrInvitationImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(baseUrl)}`;
  }
}

function initEnvelopeOpening() {
  const overlay = document.querySelector('#envelopeOverlay');
  const envelope = document.querySelector('#envelope');

  if (!overlay || !envelope) return;

  // Capture the initial URL hash before any scrolling or scrollspy replaces it
  const initialHash = window.location.hash;

  document.body.classList.add('envelope-active');
  document.documentElement.classList.add('envelope-active');

  envelope.addEventListener('click', () => {
    // Add opening class to trigger 3D flip animation
    overlay.classList.add('is-opening');

    // Disable clicks to prevent double trigger
    envelope.style.pointerEvents = 'none';
    envelope.removeAttribute('tabindex');

    // 1. Pull card out of envelope after the flap opens.
    window.setTimeout(() => {
      overlay.classList.add('card-pulled');
    }, 650);

    // 2. Slide card down, expand 10%, then hold it like a revealed invitation.
    window.setTimeout(() => {
      overlay.classList.add('card-front');
    }, 1750);

    // 3. Zoom card forward after a 3s hold to transition into the main page.
    window.setTimeout(() => {
      overlay.classList.add('card-zoomed');
    }, 4900);

    // Fade in Hero page behind the zooming card and transition music.
    window.setTimeout(() => {
      const wasMusicPaused = !music || music.paused;

      // Stop onboarding music (it kept playing during envelope animation)
      if (onboardingMusic) {
        onboardingMusic.pause();
      }

      // Switch to main wedding music
      music = weddingMusic;

      // Only play main music if onboarding music wasn't paused/muted by the user
      if (!wasMusicPaused) {
        playMusic({ muted: false, userChoice: true });
      } else {
        updateMusicState('paused');
      }

      document.body.classList.add('invitation-active');
    }, 4900);

    // Fade overlay out after the zoom starts.
    window.setTimeout(() => {
      overlay.classList.add('is-hidden');
      document.body.classList.remove('envelope-active');
      document.documentElement.classList.remove('envelope-active');
      
      // Smoothly scroll to the destination section (from original URL hash) or default invitation card
      window.setTimeout(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targetSection = initialHash ? document.querySelector(initialHash) : null;
        console.log('Scroll-to-hash debug:', { initialHash, hasTargetSection: !!targetSection });

        if (targetSection) {
          targetSection.scrollIntoView({ 
            behavior: prefersReducedMotion ? 'auto' : 'smooth' 
          });
        } else {
          document.querySelector('.invitation-card-wrap')?.scrollIntoView({ 
            block: 'center', 
            behavior: prefersReducedMotion ? 'auto' : 'smooth' 
          });
        }
      }, 100);
    }, 5500);

    // Remove from DOM completely after animation completes.
    window.setTimeout(() => {
      overlay.style.display = 'none';
      overlay.remove();
    }, 6800);
  });
}

// Map tabs initialization
function initMapTabs() {
  const tabs = document.querySelectorAll('.map-tab');
  const panels = document.querySelectorAll('.map-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.id === `map-panel-${target}`) {
          panel.classList.remove('is-hidden');
        } else {
          panel.classList.add('is-hidden');
        }
      });
    });
  });
}

// Floating Vertical Navigation logic
function initVerticalNav() {
  const hero = document.querySelector('#hero');
  const nav = document.querySelector('#verticalNav');
  if (!hero || !nav) return;

  // Use intersection observer to show/hide nav when hero is scrolled past
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        nav.classList.add('is-visible');
      } else {
        nav.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.05 });

  observer.observe(hero);

  // Active state highlighting on scroll and URL hash synchronization
  const sectionToNavMap = {
    'hero': 'hero',
    'couple': 'couple',
    'story': 'couple',
    'calendar': 'couple',
    'events': 'events',
    'countdown': 'events',
    'gallery': 'gallery',
    'rsvp': 'rsvp',
    'wishes': 'rsvp',
    'qr-invitation': 'rsvp',
    'video': 'rsvp'
  };

  const sections = Object.keys(sectionToNavMap);
  const sectionElements = sections.map(id => document.querySelector(`#${id}`)).filter(Boolean);
  const navLinks = document.querySelectorAll('.vertical-nav-link');
  let lastActiveSectionId = 'hero';

  window.addEventListener('scroll', () => {
    let currentSectionId = 'hero';
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sectionElements.forEach(el => {
      if (el.offsetTop <= scrollPos) {
        currentSectionId = el.id;
      }
    });

    const activeNavLinkId = sectionToNavMap[currentSectionId] || 'hero';

    navLinks.forEach(link => {
      if (link.dataset.section === activeNavLinkId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update URL hash without breaking the scroll behavior
    if (activeNavLinkId !== lastActiveSectionId) {
      lastActiveSectionId = activeNavLinkId;
      const newHash = activeNavLinkId === 'hero' ? '' : `#${activeNavLinkId}`;
      history.replaceState(null, null, window.location.pathname + window.location.search + newHash);
    }
  }, { passive: true });
}

initPersonalization();
initEnvelopeOpening();
initMapTabs();
initVerticalNav();

