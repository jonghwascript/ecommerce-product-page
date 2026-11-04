// Storybook-only copy adapted from src/js/main.js. The production script is unchanged.
function initNavigation($) {
  const $menuToggle = $('.c-header__menu-toggle');
  const $nav = $('#primary-nav');
  const $overlay = $('.c-header__backdrop');
  const $mainContent = $('#main');
  const $closeButton = $nav.find('.c-nav__close');
  const $body = $('body');

  // 필수 요소가 없으면 다른 기능에 영향을 주지 않도록 초기화를 건너뛴다.
  if (!$menuToggle.length || !$nav.length || !$closeButton.length) return;

  const desktop = window.matchMedia('(min-width: 1024px)');
  let isOpen = false;
  let hideNavTimer = 0;

  // 메뉴의 열림 상태와 클래스·ARIA·inert·포커스를 한 곳에서 동기화한다.
  function setMenuOpen(open, { restoreFocus = true } = {}) {
    const wasOpen = isOpen;
    open = open && !desktop.matches;
    isOpen = open;
    if (open) {
      clearTimeout(hideNavTimer);
      $nav.prop('hidden', false);
      // 숨김 해제 직후 오프스크린 시작 위치를 확정해 열림 전환을 유지한다.
      $nav[0].offsetWidth;
    }
    $nav.toggleClass('is-active', open);
    $body.toggleClass('no-scroll', open);
    $menuToggle.attr('aria-expanded', String(open));
    $mainContent.prop('inert', open);

    // 포커스를 먼저 복원한 뒤 메뉴를 보조 기술과 키보드에서 숨긴다.
    if (!open && wasOpen && restoreFocus && !desktop.matches) {
      $menuToggle[0].focus({ preventScroll: true });
    }
    if (desktop.matches) {
      clearTimeout(hideNavTimer);
      $nav.prop('hidden', false);
      $nav.prop('inert', false).attr('aria-hidden', 'false');
    } else {
      $nav.prop('inert', !open).attr('aria-hidden', String(!open));
      if (!open && wasOpen) {
        // 시각적 닫힘 전환 동안에도 inert와 aria-hidden으로 탐색을 막는다.
        hideNavTimer = setTimeout(() => {
          if (!isOpen && !desktop.matches) $nav.prop('hidden', true);
        }, 300);
      } else if (!open) {
        $nav.prop('hidden', true);
      }
    }
    if (open) $closeButton[0].focus({ preventScroll: true });
  }

  function syncNavigationMode() {
    const active = document.activeElement;
    // CSS가 닫기 버튼을 숨기면서 포커스가 body로 먼저 이동할 수도 있다.
    const needsDesktopFocus =
      desktop.matches &&
      (active === $menuToggle[0] ||
        active === $closeButton[0] ||
        (isOpen && active === document.body));
    // 모바일 전환 시 메뉴를 숨기기 전에 포커스를 바깥으로 옮긴다.
    if (!desktop.matches && $nav[0].contains(active)) {
      $menuToggle[0].focus({ preventScroll: true });
    }
    setMenuOpen(false, { restoreFocus: false });
    // 데스크톱에서 사라지는 열기·닫기 버튼에 포커스를 남기지 않는다.
    if (needsDesktopFocus) {
      $nav.find('a[href]').first()[0]?.focus({ preventScroll: true });
    }
  }

  desktop.addEventListener('change', syncNavigationMode);

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
      .filter(
        (_, element) =>
          $(element).prop('tabIndex') >= 0 &&
          !$(element).closest('[inert]').length,
      );
    const $first = $focusable.first();
    const $last = $focusable.last();
    const active = document.activeElement;

    if (!$first.length) {
      event.preventDefault();
      return;
    }

    // 포커스가 메뉴 밖에 있거나 양 끝에서 벗어나려 하면 반대쪽 끝으로 돌린다.
    if (
      !$nav.has(active).length ||
      (event.shiftKey ? $first.is(active) : $last.is(active))
    ) {
      event.preventDefault();
      (event.shiftKey ? $last : $first).trigger('focus');
    }
  });

  // 데스크톱은 항상 접근 가능, 모바일은 닫힌 상태로 시작한다.
  syncNavigationMode();
}
