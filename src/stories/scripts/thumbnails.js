// Standalone selection follows initGallery's active class and aria-current rules.
function initThumbnails($, { selectedImage = 1 } = {}) {
  const $thumbs = $('.c-gallery__thumb');
  function select(index) {
    $thumbs.each((i, thumb) => {
      $(thumb).toggleClass('is-active', i === index);
      if (i === index) $(thumb).attr('aria-current', 'true');
      else $(thumb).removeAttr('aria-current');
    });
  }
  $thumbs.removeAttr('aria-controls').on('click', (event) => {
    select(Number(event.currentTarget.dataset.index));
  });
  select(selectedImage - 1);
}
