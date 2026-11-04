import { renderFrame, scriptSource } from './helpers/frame';
import { fragment } from './helpers/markup';
import thumbnails from './scripts/thumbnails.js?raw';

export default {
  title: 'UI Components/Gallery Thumbnails',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: scriptSource(thumbnails, 'initThumbnails(jQuery);'),
      description: {
        component:
          'Standalone thumbnail selection, visible from 1024px like the product page. The complete gallery connection is available in Pages/Purchase Flow.',
      },
    },
  },
  args: { selectedImage: 1 },
  argTypes: { selectedImage: { control: 'select', options: [1, 2, 3, 4] } },
  render: ({ selectedImage }) =>
    renderFrame({
      title: 'Interactive gallery thumbnails',
      markup: `<div class="c-gallery l-box" style="max-inline-size:30rem;margin-inline:auto">${fragment('.c-gallery__thumbs')}</div>`,
      scripts: [thumbnails],
      setup: `initThumbnails(jQuery, { selectedImage: ${[1, 2, 3, 4].includes(selectedImage) ? selectedImage : 1} });`,
      height: 180,
    }),
};

export const Default = {};
export const SecondSelected = { args: { selectedImage: 2 } };
