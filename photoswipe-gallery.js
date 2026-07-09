import PhotoSwipeLightbox from './vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const pswpModule = () => import('./vendor/photoswipe/photoswipe.esm.min.js');

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
  { src: '/assets/hanhtrinh/IMAGE%202026-06-27%2012:29:03.jpg', width: 960, height: 1280, alt: 'Trải qua những hành trình' },
  { src: '/assets/hanhtrinh/IMAGE%202026-06-27%2012:28:54.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/IMAGE%202026-06-27%2012:28:56.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/IMAGE%202026-06-27%2012:28:52.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/IMAGE%202026-06-27%2012:29:01.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-01.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-02.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-03.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-04.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-05.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-06.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-07.jpg', width: 867, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-08.jpg', width: 960, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-09.jpg', width: 985, height: 1280, alt: 'Ảnh hành trình' },
  { src: '/assets/hanhtrinh/hanhtrinh-10.jpg', width: 1280, height: 960, alt: 'Ảnh hành trình' }
];

const singleImageSizes = new Map([
  ['/assets/hanhtrinh/congty.png', { width: 1086, height: 1448 }],
  ['/assets/hanhtrinh/totnghiep.jpg', { width: 1920, height: 2560 }],
  ['/assets/hanhtrinh/cauhon.jpg', { width: 1920, height: 2560 }],
  ['/assets/hanhtrinh/happy-ending.jpg', { width: 1600, height: 2400 }]
]);

let activeLightbox = null;

function getImageSize(src) {
  const url = new URL(src, window.location.origin);
  return singleImageSizes.get(url.pathname) || { width: 1600, height: 2400 };
}

function enableNaturalImageDimensions(lightbox) {
  lightbox.on('contentLoad', (e) => {
    const { content } = e;
    if (content.type !== 'image' || !content.data?.src) return;

    e.preventDefault();
    const img = document.createElement('img');
    img.decoding = 'async';
    img.onload = () => {
      content.width = img.naturalWidth;
      content.height = img.naturalHeight;
      content.element = img;
      content.onLoaded();
    };
    img.onerror = () => content.onError();
    img.src = content.data.src;
    img.alt = content.data.alt || '';
  });
}

function createLightbox(dataSource, { useNaturalDimensions = false } = {}) {
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

  if (useNaturalDimensions) {
    enableNaturalImageDimensions(activeLightbox);
  }

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
  createLightbox(dataSource, options).loadAndOpen(Math.max(index - 1, 0));
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

  document.querySelectorAll('.collage-main, .thumb-item').forEach(button => {
    button.addEventListener('click', event => {
      const index = Number(button.dataset.albumIndex);
      if (!Number.isNaN(index)) {
        event.preventDefault();
        openStoryAlbumIndex(index);
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
