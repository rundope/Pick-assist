const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCore } = require("./load-core");

const core = loadCore();
const KNOWN_PARTICLES = ["으로", "은", "이", "을", "과"];

test("결과 문구는 20개 이상이고 중복이 없다", () => {
  const lines = Array.from(core.RESULT_LINES);
  assert.ok(lines.length >= 20, `현재 ${lines.length}개`);
  assert.equal(new Set(lines).size, lines.length);
});

test("모든 결과 문구에 고른 쪽 {c}가 들어 있고, 조사 표기는 지원 목록 안에 있다", () => {
  for (const line of core.RESULT_LINES) {
    assert.match(line, /\{c(?::[^}]+)?\}/, line);

    for (const match of line.matchAll(/\{[co]:([^}]+)\}/g)) {
      assert.ok(KNOWN_PARTICLES.includes(match[1]), `${line}: 모르는 조사 ${match[1]}`);
    }
  }
});

test("채운 문구에는 중괄호가 남지 않는다", () => {
  const values = { picked: "짬뽕", other: "짜장" };
  const templates = [...core.RESULT_LINES, ...core.LIKE_LINES, core.OTHER_LINE];

  for (const template of templates) {
    const filled = core.fillTemplate(template, values);
    assert.doesNotMatch(filled, /[{}]/, filled);
  }
});

test("받침에 맞춰 조사를 붙인다", () => {
  assert.equal(core.withParticle("짬뽕", "으로"), "짬뽕으로");
  assert.equal(core.withParticle("짜장", "으로"), "짜장으로");
  assert.equal(core.withParticle("피자", "으로"), "피자로");
  assert.equal(core.withParticle("국물", "으로"), "국물로");
  assert.equal(core.withParticle("카페", "은"), "카페는");
  assert.equal(core.withParticle("집", "이"), "집이");
  assert.equal(core.withParticle("라면", "을"), "라면을");
  assert.equal(core.withParticle("2번", "으로"), "2번으로");
  assert.equal(core.withParticle("1", "으로"), "1로");
  assert.equal(core.withParticle("짬뽕!", "으로"), "짬뽕!으로");
});

test("'다른 거' 안내는 고르지 않은 쪽을 가리킨다", () => {
  const line = core.fillTemplate(core.OTHER_LINE, { picked: "짬뽕", other: "짜장" });
  assert.equal(line, "그럼 이미 답은 정해져 있었네요. 짜장으로 가세요.");
});

test("문구 선택은 직전 문구를 반복하지 않고, 모든 문구가 나올 수 있다", () => {
  const count = core.RESULT_LINES.length;
  const seen = new Set();
  let previous = -1;

  for (let i = 0; i < 5000; i += 1) {
    const index = core.pickLineIndex(count, null, previous);
    assert.ok(index >= 0 && index < count);
    assert.notEqual(index, previous);
    seen.add(index);
    previous = index;
  }

  assert.equal(seen.size, count);
});

test("결과·반응 문구에 '떠먹여'·'숟가락'류 표현을 쓰지 않는다", () => {
  const lines = [...core.RESULT_LINES, ...core.LIKE_LINES, core.OTHER_LINE];

  for (const line of lines) {
    assert.doesNotMatch(line, /떠먹|숟가락|숟갈|떠 드|떠 왔/, line);
  }
});
