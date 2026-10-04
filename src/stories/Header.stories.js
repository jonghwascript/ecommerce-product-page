import { renderFrame, scriptSource } from './helpers/frame';
import { purchaseMarkup } from './helpers/markup';
import navigation from './scripts/navigation.js?raw';
import cart from './scripts/cart.js?raw';

export default {
  title: 'Layout/Header',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: scriptSource(
        navigation,
        cart,
        'initNavigation(jQuery); initCart(jQuery);',
      ),
      description: {
        component:
          'Responsive navigation and cart controls. Below 1024px, open the menu and try Tab, Shift+Tab, Escape, or the backdrop. Resizing restores desktop navigation.',
      },
    },
  },
  render: () =>
    renderFrame({
      title: 'Interactive header',
      markup: purchaseMarkup({ hideForm: true }),
      scripts: [navigation, cart],
      setup: 'initNavigation(jQuery); initCart(jQuery);',
    }),
};

export const Default = {};
