const meta = {
  title: 'Product/Purchase Button',
  render: () => `
    <button class="c-purchase__submit c-button c-button--primary" type="button">
      <span class="l-with-icon">
        <svg class="icon l-icon" aria-hidden="true" focusable="false" viewBox="0 0 22 20">
          <use href="/images/icon-cart.svg"></use>
        </svg>
        Add to cart
      </span>
    </button>
  `,
};

export default meta;

export const Default = {};
