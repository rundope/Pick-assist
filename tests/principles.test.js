// 제품 원칙이 코드에서 무너지지 않았는지 정적으로 확인한다.

const test = require("node:test");
const assert = require("node:assert/strict");
const { readIndexHtml } = require("./load-core");

const html = readIndexHtml();

test("Math.random을 쓰지 않는다", () => {
  assert.doesNotMatch(html, /Math\.random/);
});

test("crypto.getRandomValues로 추첨한다", () => {
  assert.match(html, /crypto\.getRandomValues\(/);
});

test("외부로 요청을 보내는 코드가 없다", () => {
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /XMLHttpRequest/);
  assert.doesNotMatch(html, /sendBeacon/);
  assert.doesNotMatch(html, /WebSocket/);
  assert.doesNotMatch(html, /(src|href|action)\s*=\s*["']https?:/i);
});

test("Content-Security-Policy가 외부 요청을 막는다", () => {
  const csp = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/);
  assert.ok(csp, "CSP meta 태그가 없습니다");
  assert.match(csp[1], /default-src 'none'/);
  assert.doesNotMatch(csp[1], /https?:/);
});

test("구형 Safari에서 스크립트를 멈추게 하는 정규식 lookbehind를 쓰지 않는다", () => {
  assert.doesNotMatch(html, /\(\?<[=!]/);
});
