import { renderFrame, scriptSource } from './helpers/frame';
import { pageDocument } from './helpers/markup';
import {
  galleryScripts,
  galleryStyles,
  galleryInitialization,
} from './helpers/gallery';
import navigation from './scripts/navigation.js?raw';
import cart from './scripts/cart.js?raw';

export default {
  title: 'Pages/Purchase Flow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: scriptSource(
        navigation,
        ...galleryInitialization,
        cart,
        'initNavigation(jQuery); initGallery(jQuery); initLightbox(jQuery); initCart(jQuery);',
      ),
      description: {
        component:
          'Complete product page: select a quantity, add to cart, inspect the total, add again, and remove the product. Includes responsive navigation, Slick gallery, and desktop lightbox. Checkout closes the panel; no payment or network request is made.',
      },
    },
  },
  render: () =>
    renderFrame({
      title: 'Complete product purchase flow',
      markup: pageDocument().body.innerHTML,
      scripts: [navigation, ...galleryScripts, cart],
      css: galleryStyles,
      setup:
        'initNavigation(jQuery); initGallery(jQuery); initLightbox(jQuery); initCart(jQuery);',
      height: 1000,
    }),
};

export const Default = {};
