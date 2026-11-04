import { renderFrame, scriptSource } from './helpers/frame';
import { fragment } from './helpers/markup';
import quantity from './scripts/quantity.js?raw';

export default {
  title: 'Product/Quantity Selector',
  parameters: {
    layout: 'fullscreen',
    docs: { source: scriptSource(quantity, 'initQuantity(jQuery);') },
  },
  render: () =>
    renderFrame({
      title: 'Interactive quantity selector',
      markup: `<div class="l-box" style="max-inline-size: 12rem; margin-inline:auto">${fragment('.c-quantity')}</div>`,
      scripts: [quantity],
      setup: 'initQuantity(jQuery);',
      height: 180,
    }),
};

export const Default = {};
