import cart from '../../images/icon-cart.svg?raw';
import close from '../../images/icon-close.svg?raw';
import remove from '../../images/icon-delete.svg?raw';
import menu from '../../images/icon-menu.svg?raw';
import minus from '../../images/icon-minus.svg?raw';
import next from '../../images/icon-next.svg?raw';
import plus from '../../images/icon-plus.svg?raw';
import previous from '../../images/icon-previous.svg?raw';

const icons = {
  'icon-cart.svg': cart,
  'icon-close.svg': close,
  'icon-delete.svg': remove,
  'icon-menu.svg': menu,
  'icon-minus.svg': minus,
  'icon-next.svg': next,
  'icon-plus.svg': plus,
  'icon-previous.svg': previous,
};

// Inline trusted local assets only in the Storybook copy of the page markup.
export function inlineIcons(page) {
  const document = page.ownerDocument || page;
  page.querySelectorAll('svg > use[href]').forEach((use) => {
    const name = use.getAttribute('href').split('/').pop();
    if (!icons[name]) return;
    const icon = new DOMParser().parseFromString(
      icons[name],
      'image/svg+xml',
    ).documentElement;
    // Resolve local references too: the iframe's <base> changes fragment URLs.
    icon.querySelectorAll('use').forEach((reference) => {
      const href =
        reference.getAttribute('href') || reference.getAttribute('xlink:href');
      const target = icon.querySelector(`[id="${href?.slice(1)}"]`);
      if (!target) return;
      const shape = target.cloneNode(true);
      for (const attribute of reference.attributes) {
        if (attribute.localName !== 'href')
          shape.setAttribute(attribute.name, attribute.value);
      }
      reference.replaceWith(shape);
    });
    icon.querySelectorAll('defs').forEach((defs) => defs.remove());
    icon
      .querySelectorAll('[id]')
      .forEach((element) => element.removeAttribute('id'));
    const svg = use.parentElement;
    if (!svg.hasAttribute('viewBox')) {
      svg.setAttribute(
        'viewBox',
        icon.getAttribute('viewBox') ||
          `0 0 ${icon.getAttribute('width')} ${icon.getAttribute('height')}`,
      );
    }
    use.replaceWith(
      ...[...icon.childNodes].map((node) => document.importNode(node, true)),
    );
  });
}
