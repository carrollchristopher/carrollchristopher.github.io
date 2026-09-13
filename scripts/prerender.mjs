// Renders the app to static HTML and writes it into dist/index.html so the page paints
// before JavaScript loads. Runs after the client build and the SSR build of entry-server.tsx.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const indexPath = path.join(distDir, 'index.html');
const placeholder = '<div id="root"></div>';

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const template = fs.readFileSync(indexPath, 'utf8');

if (!template.includes(placeholder)) {
  throw new Error(`Placeholder ${placeholder} not found in ${indexPath}`);
}

const appHtml = render();
// Replacer functions keep "$" sequences in the markup from being read as replacement patterns.
let html = template.replace(placeholder, () => `<div id="root">${appHtml}</div>`);

// Inline the stylesheet. It is small, and on high-latency mobile networks the separate
// render-blocking request costs a full round trip before anything can paint.
const stylesheet = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/);
if (!stylesheet) {
  throw new Error('Stylesheet link not found in dist/index.html');
}
const css = fs.readFileSync(path.join(distDir, stylesheet[1]), 'utf8');
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);

fs.writeFileSync(indexPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`Prerendered dist/index.html (${(appHtml.length / 1024).toFixed(1)} KB markup, ${(css.length / 1024).toFixed(1)} KB inlined CSS)`);
