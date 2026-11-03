import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
const consoleErrors = [];
const failedRequests = [];

page.on('pageerror', error => pageErrors.push(error.stack || error.message));
page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('requestfailed', request => {
  failedRequests.push(request.url() + ' :: ' + (request.failure()?.errorText || 'request failed'));
});

async function runTransitDateScenario(label, day, month, year) {
  await page.locator('#fDay').selectOption(String(day));
  await page.locator('#fMonth').selectOption(String(month));
  await page.locator('#fYear').selectOption(String(year));
  await page.locator('#fHour').selectOption('12');
  await page.locator('#fMinute').selectOption('0');

  await page.evaluate(() => {
    window.__horaSmokeScenarioCalculated = false;
    window.addEventListener('hora50:chart-calculated', () => {
      window.__horaSmokeScenarioCalculated = true;
    }, { once: true });
  });
  await page.locator('#calc').click();
  await page.waitForFunction(() => window.__horaSmokeScenarioCalculated === true, null, {
    timeout: 120000,
    polling: 250
  });

  assert.equal(await page.locator('#fDay').inputValue(), String(day));
  assert.equal(await page.locator('#fMonth').inputValue(), String(month));
  assert.equal(await page.locator('#fYear').inputValue(), String(year));

  const transitPlanets = ['อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'มฤตยู', 'จันทร์', 'เกตุ'];
  for (const planet of transitPlanets) {
    const marker = page.locator(
      '#wheel g[data-planet-marker="true"][data-kind="transit"][data-planet="' + planet + '"]'
    ).first();
    assert.ok(await marker.count(), label + ': missing transit marker for ' + planet);
    await checkBoundarySearch(marker, planet, 'transit');
  }
  process.stdout.write('PASS date-boundary scenario: ' + label + ' (' + day + '/' + month + '/' + year + ' พ.ศ.)\\n');
}

async function checkBoundarySearch(marker, planet, kind) {
  const kindLabel = kind === 'natal' ? 'ดาวเดิม (ดวงกำเนิด)' : 'ดาวจร';
  const expectedTitle = planet + ' · ' + kindLabel + ' · ';

  await marker.click({ timeout: 30000 });

  let outcome;
  try {
    const stateHandle = await page.waitForFunction(({ expectedTitle }) => {
      const panel = document.getElementById('planetSignStayPanel8');
      if (!panel || panel.hidden) return false;

      const title = panel.querySelector('.pss-title')?.textContent || '';
      const text = panel.textContent || '';
      if (text.includes('คำนวณเวลาเข้าราศี/ออกราศีไม่สำเร็จ:')) return 'error';
      if (title.startsWith(expectedTitle)
        && text.includes('วันและเวลาที่เข้าราศี')
        && text.includes('วันและเวลาที่ออกราศี')
        && !text.includes('รายการเข้า–ออกย้อนหลัง 1 เดือน')
        && !text.includes('รายการเข้า–ออกล่วงหน้า 1 เดือน')) return 'success';
      return false;
    }, { expectedTitle }, { timeout: planet === 'เกตุ' ? 180000 : 60000, polling: 250 });
    outcome = await stateHandle.jsonValue();
    await stateHandle.dispose();
  } catch (error) {
    const panelText = await page.locator('#planetSignStayPanel8').innerText().catch(() => '(อ่าน panel ไม่ได้)');
    throw new Error(
      'หมดเวลา 60 วินาที: ' + planet + ' (' + kindLabel + ') ไม่ได้ผลลัพธ์ค้นหาขอบเขตราศี'
      + '\nPanel ล่าสุด: ' + panelText
      + '\nPage errors: ' + pageErrors.join(' | ')
      + '\nConsole errors: ' + consoleErrors.slice(-10).join(' | ')
      + '\nFailed requests: ' + failedRequests.slice(-10).join(' | ')
      + '\nสาเหตุ wait: ' + error.message
    );
  }

  const panelText = await page.locator('#planetSignStayPanel8').innerText();
  if (outcome === 'error') {
    throw new Error(
      'ระบบคำนวณแจ้งข้อผิดพลาดสำหรับ ' + planet + ' (' + kindLabel + '): '
      + panelText
      + '\nPage errors: ' + pageErrors.join(' | ')
      + '\nConsole errors: ' + consoleErrors.slice(-10).join(' | ')
    );
  }

  assert.match(panelText, /วันและเวลาที่เข้าราศี/);
  assert.match(panelText, /วันและเวลาที่ออกราศี/);
  assert.equal(panelText.includes('คำนวณเวลาเข้าราศี/ออกราศีไม่สำเร็จ'), false);
  process.stdout.write('PASS boundary search: ' + planet + ' (' + kindLabel + ')\n');
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
  assert.match(main51Src || '', /20261104-planetary-standards/);

  // Verify the exact Libra Rahu standards used by the 791 detail panel.
  const libraRahuStandards = await page.evaluate(async () => {
    const dignity = await import('./js/data/planetary-dignities.js?v=20261104-source-workbook-standards');
    return dignity.getPlanetaryDignities('ราหู', 'ตุล', 29, 21, 0);
  });
  for (const standard of ['ราชาโชค', 'อุจจาวิลาศ', 'ปกิณโชค']) {
    assert.ok(libraRahuStandards.includes(standard), 'Libra Rahu missing standard: ' + standard);
  }

  const natalMarker = page.locator('#wheel g[data-planet-marker="true"][data-kind="natal"]').first();
  await checkBoundarySearch(natalMarker, await natalMarker.getAttribute('data-planet'), 'natal');

  const transitPlanets = ['อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'มฤตยู', 'จันทร์', 'เกตุ'];
  for (const planet of transitPlanets) {
    const marker = page.locator(
      '#wheel g[data-planet-marker="true"][data-kind="transit"][data-planet="' + planet + '"]'
    ).first();
    assert.ok(await marker.count(), 'missing transit marker for ' + planet);
    await checkBoundarySearch(marker, planet, 'transit');
  }

  // Explicit year-boundary regression: the one-month search must cross Dec -> Jan.
  await runTransitDateScenario('ข้ามธันวาคม–มกราคม', 31, 12, 2568);
  // Thai solar-year / Thaloeng Sok period in พ.ศ. 2569.
  await runTransitDateScenario('เถลิงศก พ.ศ. 2569', 13, 4, 2569);

  assert.deepEqual(pageErrors, [], 'browser page errors: ' + pageErrors.join(' | '));
  process.stdout.write('PASS: 791 loaded and calculated; natal marker, six motion planets, Moon, and Ketu returned ingress/egress results without browser exceptions.\n');
} finally {
  await browser.close();
}
