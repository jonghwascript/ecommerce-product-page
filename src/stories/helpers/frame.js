import jquery from '../../js/lib/jquery-4.0.0.js?raw';
import styles from '../../scss/style.scss?inline';

const escapeAttribute = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');
const inlineScript = (source) =>
  `<script>${source.replace(/<\/script/gi, '<\\/script')}</script>`;

export function scriptSource(...scripts) {
  return { type: 'code', language: 'javascript', code: scripts.join('\n\n') };
}

// Each render owns its document, global listeners, media queries and timers.
// Removing the frame disposes them, including during Docs/Controls rerenders.
export function renderFrame({
  title,
  markup,
  scripts = [],
  setup = '',
  css = '',
  height = 760,
}) {
  const frame = document.createElement('iframe');
  frame.title = title;
  frame.dataset.storyFrame = '';
  frame.style.cssText = `display:block;width:100%;height:${height}px;border:0;`;
  const base = new URL('.', window.location.href).href;
  frame.srcdoc = `<!doctype html>
    <html lang="en"><head>
      <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
      <base href="${escapeAttribute(base)}">
      <title>${escapeAttribute(title)}</title>
      <style>${styles}\n${css}</style>
      ${inlineScript(`window.addEventListener('error', () => { document.documentElement.dataset.storyError = 'true'; });`)}
    </head><body>
      ${markup}
      ${inlineScript(jquery)}
      ${scripts.map(inlineScript).join('\n')}
      ${inlineScript(`${setup}\ndocument.documentElement.dataset.storyReady = 'true';`)}
    </body></html>`;
  return frame;
}
