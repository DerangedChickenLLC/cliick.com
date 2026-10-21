import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../get/index.html', import.meta.url), 'utf8');
const script = html.match(/<script>\s*(\(function \(\) \{[\s\S]*?\}\)\(\);)\s*<\/script>/)[1];

function run(ua, search, maxTouchPoints = 0) {
  let target = null;
  vm.runInNewContext(script, {
    navigator: { userAgent: ua, maxTouchPoints },
    location: { search, replace: (u) => { target = u; } },
    URLSearchParams, encodeURIComponent,
  });
  return target;
}
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X)';
const ANDROID = 'Mozilla/5.0 (Linux; Android 16; Pixel 9)';
const APPLE = 'https://apps.apple.com/us/app/cliick-your-private-network/id6608980465';
const PLAY = 'https://play.google.com/store/apps/details?id=com.derangedchicken.clique';

test('no token: stores as before', () => {
  assert.equal(run(IPHONE, ''), APPLE);
  assert.equal(run(ANDROID, ''), PLAY);
});

test('iPhone with a token gets an App Store campaign link', () => {
  assert.equal(run(IPHONE, '?c=oct26-organisers'), APPLE + '?pt=677695&ct=oct26-organisers&mt=8');
});

test('Android with a token gets a Play referrer', () => {
  assert.equal(run(ANDROID, '?c=oct26-organisers'),
    PLAY + '&referrer=' + encodeURIComponent('utm_source=meta&utm_medium=paid&utm_campaign=oct26-organisers'));
});

test('a malformed token is dropped, not forwarded', () => {
  assert.equal(run(IPHONE, '?c=<script>'), APPLE);
  assert.equal(run(ANDROID, '?c=' + 'x'.repeat(41)), PLAY);
  assert.equal(run(ANDROID, '?c=Has%20Space'), PLAY);
});

test('a desktop is not redirected', () => {
  assert.equal(run('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '?c=oct26-organisers'), null);
});
