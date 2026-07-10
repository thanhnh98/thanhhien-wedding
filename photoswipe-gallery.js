import PhotoSwipeLightbox from './vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const pswpModule = () => import('./vendor/photoswipe/photoswipe.esm.min.js');

function hanhtrinhSrc(file) {
  return `/assets/hanhtrinh/${encodeURIComponent(file)}`;
}

const galleryImages = Array.from({ length: 40 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  const isLandscape = number === '06' || number === '18';

  return {
    src: `/assets/gallery/gallery-${number}.jpg`,
    msrc: `/assets/gallery/gallery-${number}-thumb.jpg`,
    width: 1600,
    height: isLandscape ? 1066 : 2400,
    alt: `Ảnh cưới Hoài Thanh & Thanh Hiền ${number}`
  };
});

const storyAlbum = [
  { file: 'IMAGE 2026-06-27 12:29:03.jpg', width: 960, height: 1280, alt: 'Trải qua những hành trình' },
  { file: 'IMAGE 2026-06-27 12:28:54.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { file: 'IMAGE 2026-06-27 12:28:56.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { file: 'IMAGE 2026-06-27 12:28:52.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { file: 'IMAGE 2026-06-27 12:29:01.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-01.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-02.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-03.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-04.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-05.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-06.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-07.jpg', width: 867, height: 1280, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-08.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-09.jpg', width: 985, height: 1280, alt: 'Ảnh hành trình' },
  { file: 'hanhtrinh-10.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' }
].map(({ file, width, height, alt }) => ({
  src: hanhtrinhSrc(file),
  width,
  height,
  alt
}));

const singleImageSizes = new Map([
  ['/assets/hanhtrinh/congty.png', { width: 1086, height: 1448 }],
  ['/assets/hanhtrinh/totnghiep.jpg', { width: 1920, height: 2560 }],
  ['/assets/hanhtrinh/cauhon.jpg', { width: 1920, height: 2560 }],
  ['/assets/hanhtrinh/happy-ending.jpg', { width: 1600, height: 2400 }]
]);

let activeLightbox = null;
const naturalSizeCache = new Map();

function getImageSize(src) {
  const url = new URL(src, window.location.origin);
  return singleImageSizes.get(url.pathname) || { width: 1600, height: 2400 };
}

function getNaturalImageData(item) {
  if (!item.src) return Promise.resolve(item);

  if (naturalSizeCache.has(item.src)) {
    return Promise.resolve({ ...item, ...naturalSizeCache.get(item.src) });
  }

  return new Promise(resolve => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const size = {
        width: img.naturalWidth || item.width,
        height: img.naturalHeight || item.height
      };
      naturalSizeCache.set(item.src, size);
      resolve({ ...item, ...size });
    };
    img.onerror = () => resolve(item);
    img.src = item.src;
  });
}

function createLightbox(dataSource) {
  activeLightbox?.destroy();

  activeLightbox = new PhotoSwipeLightbox({
    dataSource,
    pswpModule,
    preload: [2, 3],
    showHideAnimationType: 'zoom',
    bgOpacity: 0.88,
    wheelToZoom: true,
    loop: dataSource.length > 1,
    paddingFn: viewportSize => {
      const horizontal = viewportSize.x < 768 ? 16 : 48;
      const top = viewportSize.y < 700 ? 44 : 64;
      const bottom = viewportSize.y < 700 ? 56 : 76;
      return { top, bottom, left: horizontal, right: horizontal };
    }
  });

  activeLightbox.on('uiRegister', () => {
    activeLightbox.pswp.ui.registerElement({
      name: 'counter',
      order: 9,
      isButton: false,
      appendTo: 'bar',
      html: '',
      onInit: element => {
        activeLightbox.pswp.on('change', () => {
          element.textContent = `${activeLightbox.pswp.currIndex + 1} / ${dataSource.length}`;
        });
      }
    });
  });

  activeLightbox.on('destroy', () => {
    activeLightbox = null;
  });

  activeLightbox.init();
  return activeLightbox;
}

function openImages(dataSource, index, options = {}) {
  const open = source => createLightbox(source).loadAndOpen(Math.max(index - 1, 0));

  if (!options.useNaturalDimensions) {
    open(dataSource);
    return;
  }

  Promise.all(dataSource.map(getNaturalImageData)).then(open);
}

function openGalleryIndex(index) {
  openImages(galleryImages, index);
}

function openStoryAlbumIndex(index) {
  openImages(storyAlbum, index, { useNaturalDimensions: true });
}

function openSingleImage(src, alt = 'Ảnh') {
  const { width, height } = getImageSize(src);
  openImages([{ src, width, height, alt }], 1);
}

function bindGalleryTriggers() {
  document.querySelectorAll('.gallery-item, .bento-item').forEach(button => {
    button.addEventListener('click', event => {
      const index = Number(button.dataset.index);
      if (!Number.isNaN(index)) {
        event.preventDefault();
        openGalleryIndex(index);
      }
    });
  });
}

window.weddingPhotoSwipe = {
  openGalleryIndex,
  openStoryAlbumIndex,
  openSingleImage,
  close() {
    activeLightbox?.pswp?.close();
  },
  next() {
    activeLightbox?.pswp?.next();
  },
  prev() {
    activeLightbox?.pswp?.prev();
  }
};

bindGalleryTriggers();
