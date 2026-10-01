import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [,, w = 1440, h = 900, ...hashes] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
for (const hash of hashes) {
  const [hh, wait] = hash.split('@');
  await page.goto('http://localhost:8000/#' + hh);
  await page.waitForTimeout(+(wait || 1500));
  const name = `shots/${w}x${h}-${hh.replace(/\//g, '_') || 'home'}.png`;
  await page.screenshot({ path: name, fullPage: +w < 900 });
  console.log(name);
}
console.log('errors:', errs);
await browser.close();
