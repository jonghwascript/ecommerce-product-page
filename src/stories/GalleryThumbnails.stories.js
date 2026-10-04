const images = [1, 2, 3, 4];

const meta = {
  title: 'UI Components/Gallery Thumbnails',
  parameters: {
    docs: {
      description: {
        component: 'Gallery thumbnail selection. Visible at the desktop breakpoint (1024px and above), matching the product page.',
      },
    },
  },
  args: { selectedImage: 1 },
  argTypes: {
    selectedImage: { control: 'select', options: images },
  },
  render: ({ selectedImage }) => {
    const root = document.createElement('div');
    root.className = 'c-gallery';
    root.style.inlineSize = 'min(28rem, 100%)';
    root.innerHTML = `
      <ul class="c-gallery__thumbs l-cluster" aria-label="Choose a product image">
        ${images
          .map(
            (image) => `
              <li class="c-gallery__thumb-item">
                <button class="c-gallery__thumb" type="button" aria-label="Select image ${image} of ${images.length}">
                  <span class="c-gallery__thumb-frame l-frame"><img src="/images/image-product-${image}-thumbnail.jpg" alt="" width="88" height="88" /></span>
                </button>
              </li>
            `,
          )
          .join('')}
      </ul>
    `;

    const thumbnails = [...root.querySelectorAll('.c-gallery__thumb')];
    const selectImage = (image) => {
      thumbnails.forEach((thumbnail, index) => {
        const active = images[index] === image;
        thumbnail.classList.toggle('is-active', active);
        thumbnail.setAttribute('aria-current', String(active));
      });
    };

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => selectImage(images[index]));
    });
    selectImage(selectedImage);

    return root;
  },
};

export default meta;

export const Default = {};

export const SecondSelected = { args: { selectedImage: 2 } };
