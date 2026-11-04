import { renderFrame, scriptSource } from './helpers/frame';
import { fragment } from './helpers/markup';
import lightbox from './scripts/lightbox.js?raw';

export default {
  title: 'UI Components/LightBox',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: scriptSource(
        lightbox,
        "initLightbox(jQuery, { trigger: document.querySelector('#open-lightbox-btn') });",
      ),
      description: {
        component:
          'Open the larger view on desktop (1024px and above). Use arrows, thumbnails, or Left/Right keys to change images. Escape or Close restores focus; resizing to mobile closes the dialog.',
      },
    },
  },
  render: () =>
    renderFrame({
      title: 'Interactive product lightbox',
      markup: `<div class="l-box">
      <button id="open-lightbox-btn" class="c-button c-button--primary" type="button" aria-haspopup="dialog" aria-controls="lightbox">Open larger view</button>
      <p>Available on desktop (1024px and above).</p>
    </div><div hidden>${fragment('.c-gallery')}</div>${fragment('.c-lightbox')}`,
      scripts: [lightbox],
      setup: `initLightbox(jQuery, { trigger: document.querySelector('#open-lightbox-btn') });`,
      height: 850,
    }),
};

export const Default = {};
