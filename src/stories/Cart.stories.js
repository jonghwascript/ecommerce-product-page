const cartMarkup = (filled) => `
  <header class="c-header">
    <div class="c-header__actions">
      <section class="c-cart" aria-labelledby="cart-title">
        <h2 class="c-cart__title" id="cart-title">Cart</h2>
        <div class="c-cart__body l-stack">
      ${
        filled
          ? `<ul class="c-cart__list l-stack" role="list">
              <li class="c-cart__item l-cluster">
                <img class="c-cart__thumb" src="/images/image-product-1-thumbnail.jpg" alt="" width="50" height="50" />
                <div class="c-cart__info l-stack">
                  <p class="c-cart__name">Fall Limited Edition Sneakers</p>
                  <p class="c-cart__price"><span class="c-cart__unit">$125.00 × 3 </span><strong class="c-cart__total">$375.00</strong></p>
                </div>
                <button class="c-cart__remove c-icon-button" type="button" aria-label="Remove Fall Limited Edition Sneakers from cart">
                  <svg aria-hidden="true" focusable="false" width="14" height="16"><use href="/images/icon-delete.svg"></use></svg>
                </button>
              </li>
            </ul>
            <button class="c-cart__checkout c-button c-button--primary c-button--block" type="button">Checkout</button>`
          : `<ul class="c-cart__list l-stack" role="list"></ul><p class="c-cart__empty">Your cart is empty.</p>`
      }
        </div>
      </section>
    </div>
  </header>
`;

const meta = {
  title: 'Cart/Cart Panel',
  render: ({ filled }) => cartMarkup(filled),
  args: { filled: false },
  argTypes: { filled: { control: 'boolean' } },
};

export default meta;

export const Empty = { args: { filled: false } };

export const WithProduct = { args: { filled: true } };
