import { renderFrame, scriptSource } from './helpers/frame';
import { fragment, pageDocument } from './helpers/markup';
import {
  galleryScripts,
  galleryStyles,
  galleryInitialization,
} from './helpers/gallery';

export default {
  title: 'UI Components/Gallery',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: scriptSource(
        ...galleryInitialization,
        'initGallery(jQuery); initLightbox(jQuery);',
      ),
      description: {
        component:
          'Slick gallery without thumbnails. On mobile, use the previous/next controls or swipe. On desktop, click the image to open the lightbox. Thumbnails have their own story.',
      },
    },
  },
  render: () => {
    const gallery = pageDocument().querySelector('.c-gallery');
    gallery.querySelector('.c-gallery__thumbs').remove();
    return renderFrame({
      title: 'Interactive product gallery',
      markup: `<main class="l-center l-box" style="max-inline-size: 34rem">${gallery.outerHTML}</main>${fragment('.c-lightbox')}`,
      scripts: galleryScripts,
      css: galleryStyles,
      setup: 'initGallery(jQuery); initLightbox(jQuery);',
    });
  },
};

export const Default = {};
