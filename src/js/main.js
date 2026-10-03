// ==========================================
// 모바일 내비게이션 메뉴
// 햄버거 버튼으로 열고, 닫기 버튼·배경·Esc로 닫는다.
// 열린 동안 본문은 inert로 막고 Tab 포커스를 메뉴 안에 가둔다.
// ==========================================
function initNavigation($) {
  const $menuToggle = $('.c-header__menu-toggle');
  const $nav = $('#primary-nav');
  const $overlay = $('.c-header__backdrop');
  const $mainContent = $('#main');
  const $closeButton = $nav.find('.c-nav__close');
  const $body = $('body');

  // 필수 요소가 없으면 다른 기능에 영향을 주지 않도록 초기화를 건너뛴다.
  if (!$menuToggle.length || !$nav.length || !$closeButton.length) return;

  let isOpen = false;

  // 메뉴의 열림 상태와 클래스·ARIA·inert·포커스를 한 곳에서 동기화한다.
  function setMenuOpen(open) {
    const wasOpen = isOpen;
    isOpen = open;
    $nav.toggleClass('is-active', open);
    $body.toggleClass('no-scroll', open);
    $menuToggle.attr('aria-expanded', String(open));
    $mainContent.prop('inert', open);

    // 포커스를 먼저 복원한 뒤 메뉴를 보조 기술과 키보드에서 숨긴다.
    if (!open && wasOpen) $menuToggle[0].focus({ preventScroll: true });
    $nav.prop('inert', !open).attr('aria-hidden', String(!open));
    if (open) $closeButton[0].focus({ preventScroll: true });
  }

  $menuToggle.on('click', () => setMenuOpen(!isOpen));
  $closeButton.add($overlay).on('click', () => setMenuOpen(false));

  $(document).on('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    // 포커스 트랩: 메뉴 안에서 실제로 포커스 가능한 요소만 모은다.
    const $focusable = $nav
      .find('a[href], button, input, select, textarea, [tabindex]')
      .filter(':visible:not(:disabled)')
      .filter((_, element) =>
        $(element).prop('tabIndex') >= 0 && !$(element).closest('[inert]').length,
      );
    const $first = $focusable.first();
    const $last = $focusable.last();
    const active = document.activeElement;

    if (!$first.length) {
      event.preventDefault();
      return;
    }

    // 포커스가 메뉴 밖에 있거나 양 끝에서 벗어나려 하면 반대쪽 끝으로 돌린다.
    if (!$nav.has(active).length || (event.shiftKey ? $first.is(active) : $last.is(active))) {
      event.preventDefault();
      (event.shiftKey ? $last : $first).trigger('focus');
    }
  });

  // 초기 상태: 닫힘(aria-hidden·inert 적용)
  setMenuOpen(false);
}

// ==========================================
// 상품 이미지 갤러리 (Slick 캐러셀)
// ==========================================
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
    speed: 300,
  });

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

// DOM 준비 후 각 기능을 독립적으로 초기화한다.
jQuery(($) => {
  initNavigation($);
  initGallery($);
});
