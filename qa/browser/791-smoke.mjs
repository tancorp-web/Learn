import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];

page.on('pageerror', error => pageErrors.push(error.message));

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

  const marker = page.locator('#wheel g[data-planet-marker="true"]').first();
  await marker.click({ timeout: 30000 });

  await page.waitForFunction(() => {
    const panel = document.getElementById('planetSignStayPanel8');
    if (!panel || panel.hidden) return false;
    const text = panel.textContent || '';
    return text.includes('รายการเข้า–ออกย้อนหลัง 5 ปี')
      && text.includes('รายการเข้า–ออกล่วงหน้า 5 ปี');
  }, null, { timeout: 180000 });

  const panelText = await page.locator('#planetSignStayPanel8').innerText();
  assert.match(panelText, /วันและเวลาที่เข้าราศี/);
  assert.match(panelText, /วันและเวลาที่ออกราศี/);
  assert.doesNotMatch(panelText, /คำนวณเวลาเข้าราศี\/ออกราศีไม่สำเร็จ/);
  assert.deepEqual(pageErrors, [], 'browser page errors: ' + pageErrors.join(' | '));

  process.stdout.write('PASS: 791 loaded, chart calculated, planet marker clicked, and 5-year ingress/egress results rendered.\n');
} finally {
  await browser.close();
}
