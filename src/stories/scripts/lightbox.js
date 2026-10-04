// Storybook-only copy adapted from src/js/main.js. The production script is unchanged.
function initLightbox($, { trigger = null } = {}) {
  const dialog = document.querySelector('.c-lightbox');
  const gallery = document.querySelector('.c-gallery__list');
  if (!dialog || !gallery) return;

  // Slick은 버튼의 조상 슬라이드에 slick-cloned를 붙인다.
  const images = Array.from(
    gallery.querySelectorAll('.c-gallery__open img'),
  ).filter((image) => !image.closest('.slick-cloned'));
  const image = dialog.querySelector('.c-lightbox__image');
  const closeButton = dialog.querySelector('.c-lightbox__close');
  const thumbs = Array.from(dialog.querySelectorAll('.c-lightbox__thumb'));
  if (!images.length || !image || !closeButton) return;

  const desktop = window.matchMedia('(min-width: 1024px)');
  let index = 0;
  let opener = null;

  function focusGalleryControl() {
    gallery
      .closest('.c-gallery')
      .querySelector('.c-gallery__control--next')
      ?.focus({ preventScroll: true });
  }

  function syncImageControls() {
    if (trigger) trigger.disabled = !desktop.matches;
    gallery.querySelectorAll('.c-gallery__open').forEach((element) => {
      const hadFocus = document.activeElement === element;
      // 버튼 노드는 유지하고 모바일에서는 네이티브 disabled 상태로 비활성화한다.
      element.disabled = !desktop.matches;
      element.querySelector('.u-sr-only').hidden = !desktop.matches;
      if (desktop.matches) {
        element.setAttribute('type', 'button');
        element.setAttribute('aria-haspopup', 'dialog');
        element.setAttribute('aria-controls', dialog.id);
        const slide = element.closest('.slick-slide');
        element.tabIndex = slide
          ? slide.classList.contains('slick-active') &&
            !slide.classList.contains('slick-cloned')
            ? 0
            : -1
          : element.contains(images[0])
            ? 0
            : -1;
      } else {
        element.removeAttribute('tabindex');
        element.removeAttribute('aria-haspopup');
        element.removeAttribute('aria-controls');
        if (hadFocus) focusGalleryControl();
      }
    });
  }

  // 재초기화로 생성된 복제 슬라이드에도 현재 화면의 의미를 적용한다.
  $(gallery).on('reInit', syncImageControls);
  syncImageControls();

  function showImage(nextIndex) {
    index = (nextIndex + images.length) % images.length;
    image.src = images[index].src;
    image.alt = images[index].alt;
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-active', i === index);
      if (i === index) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    dialog.querySelector('.c-lightbox__status').textContent =
      `Image ${index + 1} of ${images.length}`;
  }

  $(gallery).on('click', '.c-gallery__open', (event) => {
    if (!desktop.matches || event.currentTarget.disabled || dialog.open) return;
    opener = event.currentTarget;
    const selected = opener.querySelector('img');
    showImage(
      Math.max(
        0,
        images.findIndex((item) => item.src === selected.src),
      ),
    );
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  });

  closeButton.addEventListener('click', () => dialog.close());
  trigger?.addEventListener('click', () => {
    if (!desktop.matches || dialog.open) return;
    opener = trigger;
    showImage(0);
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  });
  desktop.addEventListener('change', (event) => {
    if (!event.matches && dialog.open) dialog.close();
    syncImageControls();
  });
  dialog.addEventListener('close', () => {
    if (!desktop.matches) focusGalleryControl();
    else if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog
    .querySelector('.c-lightbox__control--prev')
    .addEventListener('click', () => showImage(index - 1));
  dialog
    .querySelector('.c-lightbox__control--next')
    .addEventListener('click', () => showImage(index + 1));
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () =>
      showImage(Number(thumb.dataset.index)),
    );
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showImage(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });
}
