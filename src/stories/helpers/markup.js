import pageTemplate from '../../pages/index.html?raw';
import { inlineIcons } from './icons';

// index.html pulls its sections in with gulp-file-include (@@include).
// Resolve those directives from the source partials the same way the build does.
const partials = import.meta.glob('../../pages/components/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const pageSource = pageTemplate.replace(
  /@@include\(\s*['"]\.\/components\/([^'"]+)['"]\s*\)/g,
  (_directive, file) => {
    const partial = partials[`../../pages/components/${file}`];
    if (partial === undefined) throw new Error(`Missing page partial: ${file}`);
    return partial;
  },
);

// Reuse source markup, never generated dist files or executable page scripts.
export function pageDocument() {
  const page = new DOMParser().parseFromString(pageSource, 'text/html');
  page.querySelectorAll('script').forEach((script) => script.remove());
  inlineIcons(page);
  const removeIcon = page.createElement('template');
  removeIcon.id = 'cart-remove-icon';
  removeIcon.innerHTML =
    '<svg aria-hidden="true" focusable="false" width="14" height="16"><use href="./images/icon-delete.svg"></use></svg>';
  inlineIcons(removeIcon.content);
  page.body.append(removeIcon);
  return page;
}

export function fragment(selector) {
  const element = pageDocument().querySelector(selector);
  if (!element) throw new Error(`Missing product page fragment: ${selector}`);
  return element.outerHTML;
}

export function purchaseMarkup({ hideForm = false } = {}) {
  return `${fragment('#cart-remove-icon')}${fragment('.c-header')}
    <main id="main" class="l-center l-box" tabindex="-1">
      <div style="max-inline-size: 28rem; margin-inline: auto" ${hideForm ? 'hidden' : ''}>
        ${fragment('.c-purchase')}
      </div>
    </main>`;
}
