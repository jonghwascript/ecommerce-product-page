const meta = {
  title: 'Product/Product Details',
  parameters: { layout: 'centered' },
  render: () => `
    <section class="c-product__details l-stack" aria-labelledby="product-title">
      <div class="c-product__heading l-stack">
        <p class="c-product__brand">Sneaker Company</p>
        <h1 class="c-product__title" id="product-title">Fall Limited Edition Sneakers</h1>
        <p class="c-product__description">
          These low-profile sneakers are your perfect casual wear companion.
          Featuring a durable rubber outer sole, they'll withstand everything
          the weather can offer.
        </p>
      </div>
      <div class="c-product__price c-price l-cluster" data-justify="between">
        <div class="c-price__sale l-cluster">
          <p class="c-price__current"><span class="u-sr-only">Current price:</span><span class="c-price__amount">$125.00</span></p>
          <span class="c-price__badge c-badge c-badge--discount">50%<span class="u-sr-only"> off</span></span>
        </div>
        <p class="c-price__original"><span class="u-sr-only">Original price:</span><del>$250.00</del></p>
      </div>
    </section>
  `,
};

export default meta;

export const Default = {};
