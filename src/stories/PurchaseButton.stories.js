import { renderFrame, scriptSource } from './helpers/frame';
import { purchaseMarkup } from './helpers/markup';
import navigation from './scripts/navigation.js?raw';
import cart from './scripts/cart.js?raw';

export default {
  title: 'Product/Purchase Button',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: scriptSource(cart, 'initCart(jQuery);'),
      description: {
        component:
          'Select a quantity and submit Add to cart, then open the header cart. A zero quantity displays an error. Repeated purchases accumulate and reset the quantity to zero.',
      },
    },
  },
  render: () =>
    renderFrame({
      title: 'Interactive purchase form',
      markup: purchaseMarkup(),
      scripts: [navigation, cart],
      setup: 'initNavigation(jQuery); initCart(jQuery);',
    }),
};

export const Default = {};
