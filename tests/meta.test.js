// 공유 미리보기(Open Graph) 태그가 빠지거나 깨진 이미지를 가리키지 않는지 확인한다.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { readIndexHtml } = require("./load-core");

const SITE_URL = "https://rundope.github.io/Pick-assist/";
const html = readIndexHtml();

function metaProperty(name) {
  const pattern = new RegExp(`<meta property="${name}" content="([^"]+)">`);
  const match = html.match(pattern);
  return match ? match[1] : null;
}

test("Open Graph 기본 태그가 모두 있다", () => {
  for (const name of ["og:type", "og:url", "og:title", "og:description", "og:image"]) {
    assert.ok(metaProperty(name), `${name} 태그가 없습니다`);
  }
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
});

test("og:url은 GitHub Pages 주소다", () => {
  assert.equal(metaProperty("og:url"), SITE_URL);
});

test("og:image는 사이트 절대 URL이고, 가리키는 파일이 저장소에 있다", () => {
  const image = metaProperty("og:image");
  assert.ok(image.startsWith(SITE_URL), image);

  const relative = image.slice(SITE_URL.length);
  const filePath = path.join(__dirname, "..", relative);
  assert.ok(fs.existsSync(filePath), `${relative} 파일이 없습니다`);
});

test("og:title과 og:description에 브랜드 톤 문장이 들어 있다", () => {
  assert.match(metaProperty("og:title"), /망설이지 마세요/);
  assert.match(metaProperty("og:description"), /판결은 Pick-assist 에게, 선택은 자유/);
});
