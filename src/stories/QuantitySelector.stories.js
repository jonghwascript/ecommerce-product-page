const meta = {
  title: 'Product/Quantity Selector',
  render: () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <div class="c-purchase__quantity c-quantity" role="group" aria-labelledby="quantity-label">
        <span class="u-sr-only" id="quantity-label">Quantity</span>
        <button class="c-quantity__button c-quantity__button--decrease is-disabled" type="button" aria-disabled="true" aria-controls="quantity-value">
          <svg aria-hidden="true" focusable="false" width="12" height="4"><use href="/images/icon-minus.svg"></use></svg>
          <span class="u-sr-only">Decrease quantity</span>
        </button>
        <output class="c-quantity__value" id="quantity-value" aria-labelledby="quantity-label" aria-live="polite">0</output>
        <button class="c-quantity__button c-quantity__button--increase" type="button" aria-controls="quantity-value">
          <svg aria-hidden="true" focusable="false" width="12" height="12"><use href="/images/icon-plus.svg"></use></svg>
          <span class="u-sr-only">Increase quantity</span>
        </button>
      </div>
    `;

    const value = root.querySelector('.c-quantity__value');
    const decrease = root.querySelector('.c-quantity__button--decrease');
    let quantity = 0;

    const update = (nextQuantity) => {
      quantity = Math.max(0, nextQuantity);
      value.value = String(quantity);
      value.textContent = String(quantity);
      const atMinimum = quantity === 0;
      decrease.disabled = atMinimum;
      decrease.classList.toggle('is-disabled', atMinimum);
      decrease.setAttribute('aria-disabled', String(atMinimum));
    };

    decrease.addEventListener('click', () => update(quantity - 1));
    root.querySelector('.c-quantity__button--increase').addEventListener('click', () => update(quantity + 1));

    return root;
  },
};

export default meta;

export const Default = {};
