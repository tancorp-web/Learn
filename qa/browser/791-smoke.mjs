import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];

page.on('pageerror', error => pageErrors.push(error.stack || error.message));

async function checkBoundarySearch(marker, planet, kind) {
  await marker.click({ timeout: 30000 });
  const kindLabel = kind === 'natal' ? 'ดาวเดิม (ดวงกำเนิด)' : 'ดาวจร';
  await page.waitForFunction(({ planet, kindLabel }) => {
    const panel = document.getElementById('planetSignStayPanel8');
    const title = panel?.querySelector('.pss-title')?.textContent || '';
    const text = panel?.textContent || '';
    return panel && !panel.hidden
      && title.startsWith(planet + ' · ' + kindLabel + ' · ')
      && text.includes('รายการเข้า–ออกย้อนหลัง 5 ปี')
      && text.includes('รายการเข้า–ออกล่วงหน้า 5 ปี');
  }, { planet, kindLabel }, { timeout: 180000 });

  const panelText = await page.locator('#planetSignStayPanel8').innerText();
  assert.match(panelText, /วันและเวลาที่เข้าราศี/);
  assert.match(panelText, /วันและเวลาที่ออกราศี/);
  assert.doesNotMatch(panelText, /คำนวณเวลาเข้าราศี\/ออกราศีไม่สำเร็จ/);
}

try {
  await page.goto('http://127.0.0.1:8000/791.html', {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });

  await page.locator('#calc').waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('#calc').click();

  await page.waitForFunction(() => {
    const wheel = document.getElementById('wheel');
    return wheel && wheel.querySelectorAll('g[data-planet-marker="true"]').length > 0;
  }, null, { timeout: 90000 });

  await page.waitForFunction(() => {
    const layer = document.querySelector('#wheel svg #ascendantBoundaryTimes3');
    return layer && layer.querySelectorAll('text.transit-zodiac-all-time5').length === 12;
  }, null, { timeout: 120000 });

  const main51Src = await page.locator('script[src*="main51.js"]').getAttribute('src');
  assert.match(main51Src || '', /20261103-utc0642-main51-01/);

  const natalMarker = page.locator('#wheel g[data-planet-marker="true"][data-kind="natal"]').first();
  await checkBoundarySearch(natalMarker, await natalMarker.getAttribute('data-planet'), 'natal');

  const transitPlanets = ['อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'มฤตยู', 'จันทร์'];
  for (const planet of transitPlanets) {
    const marker = page.locator(
      '#wheel g[data-planet-marker="true"][data-kind="transit"][data-planet="' + planet + '"]'
    ).first();
    assert.ok(await marker.count(), 'missing transit marker for ' + planet);
    await checkBoundarySearch(marker, planet, 'transit');
  }

  assert.deepEqual(pageErrors, [], 'browser page errors: ' + pageErrors.join(' | '));
  process.stdout.write('PASS: 791 loaded and calculated; natal marker and all six motion planets and Moon returned five-year ingress/egress results without browser exceptions.\n');
} finally {
  await browser.close();
}
