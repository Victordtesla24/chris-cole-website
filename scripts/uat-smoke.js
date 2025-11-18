/**
 * Playwright smoke UAT for the 3-step BTR wizard.
 * Runs two flows against the dev server:
 * 1) Minimal mandatory data (unknown ToB)
 * 2) Approximate ToB + optional traits/events
 */
const path = require('path');
const playwrightModulePath = require.resolve('playwright', {
  paths: [
    path.join(__dirname, '../frontend-react/node_modules'),
    __dirname,
  ],
});
const { chromium } = require(playwrightModulePath);

const BASE_URL = process.env.BTR_UI_URL || 'http://localhost:5173/';

async function runScenario(page, name, actions) {
  const consoleLogs = [];
  const requestLog = [];

  page.on('console', (msg) => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', (err) => consoleLogs.push({ type: 'pageerror', text: err.message }));
  page.on('requestfailed', (req) => requestLog.push({ url: req.url(), failure: req.failure() }));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await actions(page, requestLog);

  return { name, consoleLogs, requestLog };
}

async function scenarioMinimal(page, requestLog) {
  await page.fill('#dob', '1990-05-15');
  await page.fill('#pob', 'Sialkot, Pakistan');
  await page.waitForTimeout(1200); // allow geocode debounce
  await page.click('text=Next: Optional Verification →');
  await page.click('text=Next: Review & Submit →');

  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/btr') && res.request().method() === 'POST'),
    page.click('text=Calculate BTR'),
  ]);

  const status = response.status();
  const body = await response.json();
  requestLog.push({ url: response.url(), status, best: body?.best_candidate?.time_local });

  await page.waitForSelector('text=Top 5 Candidates', { timeout: 20000 });
}

async function scenarioApproxOptional(page, requestLog) {
  await page.fill('#dob', '1985-08-20');
  await page.fill('#pob', 'Delhi, India');
  await page.waitForTimeout(1200); // allow geocode debounce
  await page.selectOption('#tob-mode', 'approx');
  await page.fill('#tob-center', '14:30');
  await page.fill('#tob-window', '3');
  await page.selectOption('#tz-select', '5.5');

  await page.click('text=Next: Optional Verification →');

  // Optional traits/events
  await page.selectOption('#height', 'TALL');
  await page.selectOption('#build', 'ATHLETIC');
  await page.selectOption('#complexion', 'WHEATISH');
  await page.fill('#marriage-date', '2020-05-15');
  await page.fill('#children-count', '2');
  await page.fill('#child-0', '2021-08-20');
  await page.fill('#child-1', '2023-03-10');
  await page.fill('#career-events', '2018-06-01, 2022-03-15');

  await page.click('text=Next: Review & Submit →');

  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/btr') && res.request().method() === 'POST'),
    page.click('text=Calculate BTR'),
  ]);

  const status = response.status();
  const body = await response.json();
  requestLog.push({ url: response.url(), status, best: body?.best_candidate?.time_local });

  await page.waitForSelector('text=Top 5 Candidates', { timeout: 20000 });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const runs = [];
  runs.push(await runScenario(page, 'minimal-mandatory', scenarioMinimal));
  runs.push(await runScenario(page, 'approx-optional', scenarioApproxOptional));

  await browser.close();

  const errors = runs.flatMap((r) => r.consoleLogs.filter((m) => m.type === 'error' || m.type === 'pageerror'));
  const failedRequests = runs.flatMap((r) => r.requestLog.filter((req) => req.failure || (req.status && req.status >= 400)));

  console.log(JSON.stringify({ runs, errors, failedRequests }, null, 2));

  if (errors.length || failedRequests.length) {
    console.error('UAT smoke detected issues. See log above.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
