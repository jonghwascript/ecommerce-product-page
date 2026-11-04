// Storybook-only copy adapted from src/js/main.js. The production script is unchanged.
function initGallery($) {
  // Slick CDN 로딩에 실패해도 메뉴는 독립적으로 작동한다.
  if (typeof $.fn.slick !== 'function') return;

  const $gallery = $('.c-gallery__list');
  if (!$gallery.length) return;

  // 한 장씩 보여 주고, 기본 화살표 대신 마크업의 이전·다음 버튼을 사용한다.
  $gallery.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    prevArrow: $('.c-gallery__control--prev'),
    nextArrow: $('.c-gallery__control--next'),
    dots: false,
    speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : 300,
  });

  const $thumbs = $('.c-gallery__thumb');
  const $status = $('.c-gallery__status');

  // 현재 슬라이드에 맞춰 썸네일 활성 표시와 스크린 리더 안내를 갱신한다.
  function syncThumbs(index) {
    $thumbs.each((i, thumb) => {
      const isCurrent = i === index;
      $(thumb).toggleClass('is-active', isCurrent);
      if (isCurrent) $(thumb).attr('aria-current', 'true');
      else $(thumb).removeAttr('aria-current');
    });
    $status.text(
      `Image ${index + 1} of ${$gallery.slick('getSlick').slideCount}`,
    );
  }

  // 화살표로 넘길 때도 갱신되도록 Slick 이벤트에서 동기화한다.
  $gallery.on('beforeChange', (_event, _slick, _currentSlide, nextSlide) =>
    syncThumbs(nextSlide),
  );

  // 썸네일을 클릭하면 data-index에 해당하는 슬라이드로 이동한다.
  $thumbs.on('click', (event) => {
    const index = Number($(event.currentTarget).attr('data-index'));
    if (Number.isNaN(index)) return;
    $gallery.slick('slickGoTo', index);
  });

  syncThumbs(0);

  // 리사이즈 중 다음 슬라이드가 보이지 않도록 프레임당 한 번 재배치한다.
  let resizeFrame = 0;
  $(window).on('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if ($gallery.hasClass('slick-initialized')) $gallery.slick('setPosition');
    });
  });
}
