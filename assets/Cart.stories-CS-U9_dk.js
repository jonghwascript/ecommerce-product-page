import{t as e}from"./rolldown-runtime-Dh6celcD.js";var t,n,r,i,a;function o(){return(o=e((()=>{t=e=>`
  <header class="c-header">
    <div class="c-header__actions">
      <section class="c-cart" aria-labelledby="cart-title">
        <h2 class="c-cart__title" id="cart-title">Cart</h2>
        <div class="c-cart__body l-stack">
      ${e?`<ul class="c-cart__list l-stack" role="list">
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
            <button class="c-cart__checkout c-button c-button--primary c-button--block" type="button">Checkout</button>`:`<ul class="c-cart__list l-stack" role="list"></ul><p class="c-cart__empty">Your cart is empty.</p>`}
        </div>
      </section>
    </div>
  </header>
`,n={title:`Cart/Cart Panel`,render:({filled:e})=>t(e),args:{filled:!1},argTypes:{filled:{control:`boolean`}}},r={args:{filled:!1}},i={args:{filled:!0}},a=[`Empty`,`WithProduct`]})))()}o();export{r as Empty,i as WithProduct,a as __namedExportsOrder,n as default};