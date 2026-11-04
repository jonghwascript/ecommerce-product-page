// Storybook-only copy adapted from src/js/main.js. The production script is unchanged.
function initCart(
  $,
  { initialQuantity = 0, initialItems = 0, initialOpen = false } = {},
) {
  // 수량 선택 폼
  const $form = $('.c-purchase');
  const $decrease = $form.find('.c-quantity__button--decrease');
  const $increase = $form.find('.c-quantity__button--increase');
  const $value = $form.find('.c-quantity__value');
  const $input = $form.find('#quantity-input');
  // 헤더 카트 버튼과 패널
  const $toggle = $('#cart-toggle');
  const $panel = $('#cart-panel');
  const $list = $panel.find('.c-cart__list');
  const $checkout = $panel.find('.c-cart__checkout');
  const $badge = $toggle.find('.c-badge');
  // 스크린 리더 안내용 영역
  const $status = $('#cart-status');
  const $error = $form.find('.c-purchase__error');

  if (!$form.length || !$value.length || !$toggle.length || !$panel.length)
    return;

  // 상품 정보는 이 객체를 원본으로 사용하고 본문과 장바구니에 렌더링한다.
  const product = {
    id: 'fall-limited-edition-sneakers',
    name: 'Fall Limited Edition Sneakers',
    price: 125,
    thumbnail: './images/image-product-1-thumbnail.jpg',
  };
  const $productTitle = $('.c-product__title');
  const $productPrice = $('.c-price__amount');

  let quantity = initialQuantity; // 현재 선택한 수량
  let isOpen = false; // 카트 패널 열림 여부
  const items =
    initialItems > 0 ? [{ ...product, quantity: initialItems }] : [];

  const formatPrice = (amount) => `$${amount.toFixed(2)}`;

  function renderProduct() {
    $productTitle.text(product.name);
    $productPrice.text(formatPrice(product.price));
  }

  let errorTimer = 0;

  // 같은 문구를 다시 넣어도 role="alert"가 다시 읽히도록 비운 뒤 잠시 후 채운다.
  function showError(message) {
    clearTimeout(errorTimer);
    $error.text('');
    errorTimer = setTimeout(() => $error.text(message), 100);
  }

  // 문구를 비우면 CSS :empty 규칙으로 에러 영역이 숨겨진다.
  function clearError() {
    clearTimeout(errorTimer);
    $error.text('');
  }

  // 수량 표시, 폼 전송용 hidden input, 감소 버튼 비활성 상태를 함께 갱신한다.
  function renderQuantity() {
    const atMin = quantity === 0;
    $value.text(quantity);
    $input.val(quantity);
    // disabled 대신 aria-disabled를 써서 0일 때도 버튼에 포커스가 남게 한다.
    $decrease
      .toggleClass('is-disabled', atMin)
      .attr('aria-disabled', String(atMin));
  }

  // 배지에는 항목 수가 아니라 담긴 수량의 합계를 표시한다.
  // 숫자는 CSS가 attr(data-count)로 그리고, 0이면 배지를 숨긴다.
  function renderBadge() {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    $badge.attr('data-count', count);
    $badge
      .find('.u-sr-only')
      .text(`, ${count} ${count === 1 ? 'item' : 'items'}`);
  }

  // 장바구니 항목 하나의 <li>를 만든다.
  // 상품명 등 데이터는 .text()/.attr()로 넣어 HTML로 해석되지 않게 한다.
  function createItem(item) {
    const $remove = $(
      '<button class="c-cart__remove c-icon-button" type="button"></button>',
    )
      .attr('data-id', item.id)
      .append($('#cart-remove-icon').prop('content').cloneNode(true))
      .append(
        $('<span class="u-sr-only"></span>').text(
          `Remove ${item.name} from cart`,
        ),
      );

    return $('<li class="c-cart__item l-cluster"></li>').append(
      $('<div class="c-cart__thumb l-frame"></div>').append(
        $('<img alt="" width="50" height="50">').attr('src', item.thumbnail),
      ),
      $('<div class="c-cart__info"></div>').append(
        $('<p class="c-cart__name"></p>').text(item.name),
        $('<p class="c-cart__price"></p>').append(
          $('<span class="c-cart__unit"></span>').text(
            `${formatPrice(item.price)} × ${item.quantity} `,
          ),
          $('<strong class="c-cart__total"></strong>').text(
            formatPrice(item.price * item.quantity),
          ),
        ),
      ),
      $remove,
    );
  }

  // 목록을 items 기준으로 다시 그린다.
  // 비어 있으면 CSS(:has)가 Checkout 대신 "Your cart is empty."를 보여 준다.
  function renderCart() {
    $list.empty().append(items.map(createItem));
    renderBadge();
  }

  // 패널 표시(hidden)와 버튼의 aria-expanded를 함께 바꾼다.
  // 사용자가 버튼·Esc로 닫았을 때만 포커스를 카트 버튼으로 돌려준다.
  function setCartOpen(open, { restoreFocus = false } = {}) {
    isOpen = open;
    $panel.prop('hidden', !open);
    $toggle.attr('aria-expanded', String(open));
    if (isOpen) {
      $('.c-purchase__submit').addClass('u-orange-300');
    } else {
      $('.c-purchase__submit').removeClass('u-orange-300');
    }

    if (!open && restoreFocus) $toggle[0].focus({ preventScroll: true });
  }

  // 수량 감소: 0 아래로 내려가지 않는다.
  $decrease.on('click', () => {
    if (quantity === 0) return;
    quantity -= 1;
    renderQuantity();
  });

  // 수량 증가: 1 이상이 되므로 에러 문구를 지운다.
  $increase.on('click', () => {
    quantity += 1;
    renderQuantity();
    clearError();
  });

  // Add to cart: 실제 폼 전송은 막고 장바구니 상태만 갱신한다.
  $form.on('submit', (event) => {
    event.preventDefault();

    if (quantity === 0) {
      showError('Please select a quantity of at least 1.');
      return;
    }

    // 같은 상품이면 새 줄을 만들지 않고 수량만 누적한다.
    const existing = items.find((item) => item.id === product.id);
    if (existing) existing.quantity += quantity;
    else items.push({ ...product, quantity });

    renderCart();
    $status.text(`Added ${quantity} ${product.name} to cart.`);

    // 담은 뒤 선택 수량을 0으로 초기화한다.
    quantity = 0;
    renderQuantity();
  });

  // 삭제 버튼은 매번 다시 그려지므로 목록에 이벤트를 위임한다.
  $list.on('click', '.c-cart__remove', (event) => {
    const id = $(event.currentTarget).attr('data-id');
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;

    const [removed] = items.splice(index, 1);
    renderCart();
    $status.text(`Removed ${removed.name} from cart.`);

    // 삭제된 버튼에 있던 포커스를 다음 삭제 버튼이나 카트 버튼으로 옮긴다.
    const $next = $list
      .find('.c-cart__remove')
      .eq(Math.min(index, items.length - 1));
    ($next.length ? $next : $toggle).trigger('focus');
  });

  // 카트 버튼으로 열고 닫으며, Checkout을 누르면 패널을 닫는다.
  $toggle.on('click', () => setCartOpen(!isOpen));
  $checkout.on('click', () => setCartOpen(false, { restoreFocus: true }));

  $(document).on('keydown', (event) => {
    if (isOpen && event.key === 'Escape')
      setCartOpen(false, { restoreFocus: true });
  });

  // 패널 내부나 카트 버튼이 아닌 곳을 클릭하면 닫는다.
  // .hide()는 인라인 display를 남겨 다시 열리지 않으므로 setCartOpen으로 상태를 함께 바꾼다.
  // 삭제 버튼은 클릭 처리 중 DOM에서 제거되므로 closest 대신 클릭 시점의 경로로 판단한다.
  $(document).on('click', (event) => {
    if (!isOpen) return;
    const path = event.originalEvent.composedPath();
    if (path.includes($panel[0]) || path.includes($toggle[0])) return;
    setCartOpen(false);
  });

  // 초기 상태: 수량 0, 빈 장바구니, 패널 닫힘
  renderProduct();
  renderQuantity();
  renderCart();
  setCartOpen(initialOpen);
}
