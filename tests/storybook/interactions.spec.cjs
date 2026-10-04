const { test, expect } = require('@playwright/test');

async function openStory(page, id) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  const frame = page.frameLocator('iframe[data-story-frame]');
  await expect(frame.locator('html')).toHaveAttribute(
    'data-story-ready',
    'true',
  );
  await expect(frame.locator('html')).not.toHaveAttribute(
    'data-story-error',
    'true',
  );
  return frame;
}

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
});

for (const width of [375, 768, 1440]) {
  test(`complete purchase flow at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const frame = await openStory(page, 'pages-purchase-flow--default');
    const increase = frame.locator('.c-quantity__button--increase');
    const decrease = frame.locator('.c-quantity__button--decrease');
    const submit = frame.locator('.c-purchase__submit');
    const toggle = frame.locator('#cart-toggle');
    await expect(frame.locator('.c-gallery__list')).toHaveClass(
      /slick-initialized/,
    );
    await expect(frame.locator('svg use')).toHaveCount(0);
    expect(
      await frame
        .locator('.c-header__cart svg path')
        .evaluate((path) => path.getBBox().width),
    ).toBeGreaterThan(0);
    expect(
      await frame
        .locator('.c-quantity__button--increase svg path')
        .evaluate((path) => path.getBBox().width),
    ).toBeGreaterThan(0);
    await frame.locator('html').evaluate(async (element) => {
      const doc = element.ownerDocument;
      await doc.fonts.ready;
      await Promise.all([...doc.images].map((image) => image.decode()));
    });
    await page.screenshot({
      path: testInfo.outputPath(`purchase-${width}.png`),
      fullPage: true,
    });
    await submit.click();
    await expect(frame.locator('.c-purchase__error')).toContainText(
      'at least 1',
    );
    await increase.click();
    await increase.click();
    await expect(frame.locator('.c-purchase__error')).toBeEmpty();
    await submit.focus();
    await page.keyboard.press('Enter');
    await expect(frame.locator('.c-quantity__value')).toHaveText('0');
    await expect(decrease).toHaveAttribute('aria-disabled', 'true');
    await expect(decrease).toHaveJSProperty('disabled', false);
    await expect(frame.locator('.c-header__badge')).toHaveAttribute(
      'data-count',
      '2',
    );
    await toggle.click();
    await expect(frame.locator('.c-cart__total')).toHaveText('$250.00');
    await page.keyboard.press('Escape');
    await expect(frame.locator('#cart-panel')).toBeHidden();
    await expect(toggle).toBeFocused();
    await increase.click();
    await submit.click();
    await toggle.click();
    await expect(frame.locator('.c-cart__item')).toHaveCount(1);
    await expect(frame.locator('.c-cart__total')).toHaveText('$375.00');
    await frame.locator('.c-cart__checkout').click();
    await expect(frame.locator('#cart-panel')).toBeHidden();
    await toggle.click();
    await frame.locator('.c-cart__remove').click();
    await expect(frame.locator('.c-cart__empty')).toBeVisible();
    await expect(frame.locator('.c-header__badge')).toHaveAttribute(
      'data-count',
      '0',
    );
    await expect(toggle).toBeFocused();
    await expect(frame.locator('#cart-panel')).toBeVisible();
    await frame.locator('.c-product__description').click();
    await expect(frame.locator('#cart-panel')).toBeHidden();
    expect(
      await frame
        .locator('html')
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
  });
}

test('menu keyboard behavior and breakpoint transitions', async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 800 });
  const frame = await openStory(page, 'layout-header--default');
  const toggle = frame.locator('.c-header__menu-toggle');
  const nav = frame.locator('#primary-nav');
  const close = frame.locator('.c-nav__close');
  await expect(nav).toHaveJSProperty('hidden', true);
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(nav).toBeVisible();
  await expect(frame.locator('#main')).toHaveJSProperty('inert', true);
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(nav.locator('a').last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(nav).toHaveJSProperty('hidden', true);
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(nav).toBeVisible();
  await expect(nav).toHaveAttribute('aria-hidden', 'false');
  await expect(frame.locator('#main')).toHaveJSProperty('inert', false);
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(nav).toHaveJSProperty('hidden', true);
  await toggle.click();
  await frame
    .locator('.c-header__backdrop')
    .click({ position: { x: 350, y: 200 } });
  await expect(nav).toHaveJSProperty('hidden', true);
});

test('gallery slide navigation and integrated desktop lightbox', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  const frame = await openStory(page, 'ui-components-gallery--default');
  await expect(frame.locator('.c-gallery__thumbs')).toHaveCount(0);
  await frame.locator('.c-gallery__control--next').click();
  await expect(frame.locator('.c-gallery__status')).toHaveText('Image 2 of 4');
  await expect(frame.locator('.slick-active .c-gallery__open')).toBeDisabled();
  await page.setViewportSize({ width: 1440, height: 1000 });
  const opener = frame.locator('.slick-active .c-gallery__open');
  await opener.click();
  await expect(frame.locator('.c-lightbox')).toBeVisible();
  await expect(frame.locator('.c-lightbox__status')).toHaveText('Image 2 of 4');
  await page.keyboard.press('ArrowRight');
  await expect(frame.locator('.c-lightbox__status')).toHaveText('Image 3 of 4');
  await frame.locator('.c-lightbox__thumb').last().click();
  await expect(frame.locator('.c-lightbox__image')).toHaveAttribute(
    'src',
    /image-product-4.jpg$/,
  );
  await page.keyboard.press('Escape');
  await expect(frame.locator('.c-lightbox')).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await page.setViewportSize({ width: 1023, height: 800 });
  await expect(frame.locator('.c-lightbox')).toBeHidden();
  await expect(frame.locator('.c-gallery__control--next')).toBeFocused();
});

test('standalone lightbox controls', async ({ page }) => {
  const frame = await openStory(page, 'ui-components-lightbox--default');
  const opener = frame.locator('#open-lightbox-btn');
  await opener.click();
  await frame.locator('.c-lightbox__control--prev').click();
  await expect(frame.locator('.c-lightbox__status')).toHaveText('Image 4 of 4');
  await frame.locator('.c-lightbox__control--next').click();
  await expect(frame.locator('.c-lightbox__status')).toHaveText('Image 1 of 4');
  await frame.locator('.c-lightbox__close').click();
  await expect(opener).toBeFocused();
});

test('standalone quantity keeps zero minimum and keyboard focus', async ({
  page,
}) => {
  const frame = await openStory(page, 'product-quantity-selector--default');
  const decrease = frame.locator('.c-quantity__button--decrease');
  await frame.locator('.c-quantity__button--increase').click();
  await decrease.focus();
  await page.keyboard.press('Space');
  await expect(frame.locator('.c-quantity__value')).toHaveText('0');
  await expect(decrease).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(frame.locator('.c-quantity__value')).toHaveText('0');
});

test('standalone purchase form submits to header cart', async ({ page }) => {
  const frame = await openStory(page, 'product-purchase-button--default');
  await frame.locator('.c-quantity__button--increase').click();
  await frame.locator('.c-purchase__submit').click();
  await frame.locator('#cart-toggle').click();
  await expect(frame.locator('.c-cart__total')).toHaveText('$125.00');
});

test('standalone thumbnails selection and integrated gallery connection', async ({
  page,
}) => {
  const frame = await openStory(
    page,
    'ui-components-gallery-thumbnails--second-selected',
  );
  await expect(frame.locator('.c-gallery__thumb').nth(1)).toHaveAttribute(
    'aria-current',
    'true',
  );
  await frame.locator('.c-gallery__thumb').last().click();
  await expect(frame.locator('.c-gallery__thumb.is-active')).toHaveCount(1);
  await expect(frame.locator('.c-gallery__thumb').last()).toHaveAttribute(
    'aria-current',
    'true',
  );
  const integrated = await openStory(page, 'pages-purchase-flow--default');
  await integrated.locator('.c-gallery__thumb').nth(2).click();
  await expect(integrated.locator('.c-gallery__status')).toHaveText(
    'Image 3 of 4',
  );
  await expect(integrated.locator('.slick-active img')).toHaveAttribute(
    'src',
    /image-product-3.jpg$/,
  );
});

test('Docs frames keep cart states isolated', async ({ page }) => {
  await page.goto('/iframe.html?id=cart-cart-panel--docs&viewMode=docs');
  const frames = page.locator('iframe[data-story-frame]');
  await expect.poll(() => frames.count()).toBeGreaterThanOrEqual(2);
  const empty = page.frameLocator('iframe[data-story-frame]').first();
  const filled = page.frameLocator('iframe[data-story-frame]').last();
  await expect(empty.locator('.c-cart__empty')).toBeVisible();
  await expect(filled.locator('.c-cart__total')).toHaveText('$375.00');
  await filled.locator('.c-cart__remove').click();
  await expect(filled.locator('.c-cart__empty')).toBeVisible();
  await expect(empty.locator('#cart-toggle')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(empty.locator('.c-header__badge')).toHaveAttribute(
    'data-count',
    '0',
  );
  await page.getByRole('switch', { name: 'Show code' }).first().click();
  await expect(page.getByRole('switch', { name: 'Hide code' }).first()).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#anchor--primary--cart-cart-panel--empty')).toContainText(
    'function initCart',
  );
});

test('story navigation resets state and Docs Controls recreate the frame', async ({
  page,
}) => {
  const first = await openStory(page, 'product-purchase-button--default');
  await first.locator('.c-quantity__button--increase').click();
  await first.locator('.c-purchase__submit').click();
  await openStory(page, 'layout-header--default');
  const fresh = await openStory(page, 'product-purchase-button--default');
  await expect(fresh.locator('.c-header__badge')).toHaveAttribute(
    'data-count',
    '0',
  );
  await page.goto('/iframe.html?id=cart-cart-panel--docs&viewMode=docs');
  const frame = page.frameLocator('iframe[data-story-frame]').first();
  await expect(frame.locator('.c-cart__empty')).toBeVisible();
  await page.getByRole('switch', { name: 'filled', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('switch', { name: 'filled', exact: true })).toBeChecked();
  await expect(frame.locator('.c-cart__total')).toHaveText('$375.00');
});

test('reduced motion disables Slick animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const frame = await openStory(page, 'pages-purchase-flow--default');
  expect(
    await frame
      .locator('.c-gallery__list')
      .evaluate(
        (el) =>
          el.ownerDocument.defaultView.jQuery(el).slick('getSlick').options
            .speed,
      ),
  ).toBe(0);
});
