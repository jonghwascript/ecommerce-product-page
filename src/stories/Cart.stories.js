import { renderFrame, scriptSource } from './helpers/frame';
import { purchaseMarkup } from './helpers/markup';
import navigation from './scripts/navigation.js?raw';
import cart from './scripts/cart.js?raw';

export default {
  title: 'Cart/Cart Panel',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: scriptSource(cart),
      description: {
        component:
          'The panel starts open. Remove a product, close with Checkout or Escape, and reopen with the header cart button. Checkout only closes the panel, as on the product page.',
      },
    },
  },
  args: { filled: false },
  argTypes: { filled: { control: 'boolean' } },
  render: ({ filled }) =>
    renderFrame({
      title: 'Interactive cart panel',
      markup: purchaseMarkup({ hideForm: true }),
      scripts: [navigation, cart],
      setup: `initNavigation(jQuery); initCart(jQuery, { initialItems: ${filled ? 3 : 0}, initialOpen: true });`,
    }),
};

export const Empty = { args: { filled: false } };
export const WithProduct = { args: { filled: true } };
