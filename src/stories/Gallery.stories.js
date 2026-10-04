const images = [1, 2, 3, 4];

const galleryTemplate = `
  <main class="c-page">
    <article class="c-product l-center">
      <div class="c-product__layout l-switcher">
        <section class="c-product__gallery c-gallery l-stack" aria-label="Product images">
          <div class="c-gallery__stage slider">
            <div class="c-gallery__list my-slider" id="gallery-slides">
              ${images
                .map(
                  (image) => `
                    <button class="c-gallery__open" type="button" aria-controls="gallery-slides" aria-label="Show product image ${image}">
                      <span class="c-gallery__frame l-frame">
                        <img class="c-gallery__image" src="/images/image-product-${image}.jpg" alt="A pair of white and beige sneakers, view ${image}" width="448" height="445" />
                      </span>
                    </button>
                  `,
                )
                .join('')}
            </div>
            <button class="c-gallery__control c-gallery__control--prev c-icon-button c-icon-button--round" type="button" aria-label="Previous image">
              <svg aria-hidden="true" focusable="false" width="12" height="18"><use href="/images/icon-previous.svg"></use></svg>
            </button>
            <button class="c-gallery__control c-gallery__control--next c-icon-button c-icon-button--round" type="button" aria-label="Next image">
              <svg aria-hidden="true" focusable="false" width="13" height="18"><use href="/images/icon-next.svg"></use></svg>
            </button>
          </div>
          <p class="c-gallery__status u-sr-only" role="status" aria-live="polite">Image 1 of 4</p>
        </section>
      </div>
    </article>
  </main>
`;

const meta = {
  title: 'UI Components/Gallery',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const root = document.createElement('div');
    root.innerHTML = galleryTemplate;

    const gallery = root.querySelector('.c-gallery');
    const slides = [...gallery.querySelectorAll('.c-gallery__open')];
    const status = gallery.querySelector('.c-gallery__status');
    const list = gallery.querySelector('.c-gallery__list');
    let currentIndex = 0;

    list.classList.add('slick-initialized');

    const showImage = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.style.display = slideIndex === currentIndex ? '' : 'none';
      });
      status.textContent = `Image ${currentIndex + 1} of ${slides.length}`;
    };

    showImage(0);
    gallery.querySelector('.c-gallery__control--prev').addEventListener('click', () => showImage(currentIndex - 1));
    gallery.querySelector('.c-gallery__control--next').addEventListener('click', () => showImage(currentIndex + 1));

    return root;
  },
};

export default meta;

export const Default = {};
