// Standalone quantity behavior from initCart in src/js/main.js.
// aria-disabled retains focus at zero, matching the product page.
function initQuantity($, { initialQuantity = 0 } = {}) {
  const $value = $('.c-quantity__value');
  const $decrease = $('.c-quantity__button--decrease');
  let quantity = initialQuantity;
  function render() {
    $value.text(quantity);
    $('#quantity-input').val(quantity);
    $decrease
      .toggleClass('is-disabled', quantity === 0)
      .attr('aria-disabled', String(quantity === 0));
  }
  $decrease.on('click', () => {
    if (quantity === 0) return;
    quantity -= 1;
    render();
  });
  $('.c-quantity__button--increase').on('click', () => {
    quantity += 1;
    render();
  });
  render();
}
