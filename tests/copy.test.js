const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCore, plain } = require("./load-core");

const core = loadCore();
const LANGS = ["ko", "en"];
const KNOWN_PARTICLES = ["으로", "은", "이", "을", "과"];

function allTemplates(copy) {
  return [...copy.resultLines, ...copy.likeLines, copy.otherLine];
}

test("지원 언어는 한국어와 영어이고, 기본은 한국어다", () => {
  assert.deepEqual(Object.keys(core.COPY).sort(), ["en", "ko"]);
  assert.equal(core.DEFAULT_LANG, "ko");
  assert.equal(core.copyFor("xx"), core.COPY.ko);
});

for (const lang of LANGS) {
  test(`[${lang}] 결과 문구는 20개 이상이고 중복이 없다`, () => {
    const lines = Array.from(core.COPY[lang].resultLines);
    assert.ok(lines.length >= 20, `현재 ${lines.length}개`);
    assert.equal(new Set(lines).size, lines.length);
  });

  test(`[${lang}] 모든 결과 문구에 고른 쪽 {c}가 들어 있다`, () => {
    for (const line of core.COPY[lang].resultLines) {
      assert.match(line, /\{c(?::[^}]+)?\}/, line);
    }
  });

  test(`[${lang}] 채운 문구에는 중괄호가 남지 않는다`, () => {
    const values = { picked: "Mercedes-Benz", other: "BMW" };
    for (const template of allTemplates(core.COPY[lang])) {
      const filled = core.fillTemplate(template, values);
      assert.doesNotMatch(filled, /[{}]/, filled);
    }
  });

  test(`[${lang}] 안내·안전 문구가 빠짐없이 있다`, () => {
    const copy = plain(core.COPY[lang]);
    for (const reason of ["empty", "single", "same", "tooMany"]) {
      assert.ok(copy.notices[reason], `notices.${reason}`);
    }
    assert.ok(copy.safety.health);
    assert.match(copy.safety.selfHarm, /109/);
  });

  test(`[${lang}] 결과·반응 문구에 '떠먹여'·'숟가락'(spoon-feed)류 표현을 쓰지 않는다`, () => {
    for (const line of allTemplates(core.COPY[lang])) {
      assert.doesNotMatch(line, /떠먹|숟가락|숟갈|떠 드|떠 왔|spoon/i, line);
    }
  });
}

test("두 언어의 결과 문구 수가 같다", () => {
  assert.equal(core.COPY.ko.resultLines.length, core.COPY.en.resultLines.length);
  assert.equal(core.COPY.ko.likeLines.length, core.COPY.en.likeLines.length);
});

test("[ko] 조사 표기는 지원 목록 안에 있다", () => {
  for (const line of allTemplates(core.COPY.ko)) {
    for (const match of line.matchAll(/\{[co]:([^}]+)\}/g)) {
      assert.ok(KNOWN_PARTICLES.includes(match[1]), `${line}: 모르는 조사 ${match[1]}`);
    }
  }
});

test("[en] 영어 문구에는 한국어 조사 표기를 쓰지 않는다", () => {
  for (const line of allTemplates(core.COPY.en)) {
    assert.doesNotMatch(line, /\{[co]:/, line);
  }
});

test("[en] 자해 안내는 109와 함께 미국 988, 영국·아일랜드 116 123을 알려 준다", () => {
  const message = core.COPY.en.safety.selfHarm;
  assert.match(message, /109/);
  assert.match(message, /988/);
  assert.match(message, /116 123/);
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
  const values = { picked: "짬뽕", other: "짜장" };
  assert.equal(
    core.fillTemplate(core.COPY.ko.otherLine, values),
    "그럼 이미 답은 정해져 있었네요. 짜장으로 가세요."
  );
  assert.equal(
    core.fillTemplate(core.COPY.en.otherLine, { picked: "BMW", other: "Mercedes-Benz" }),
    "Then your answer was already decided. Go with Mercedes-Benz."
  );
});

test("문구 선택은 직전 문구를 반복하지 않고, 모든 문구가 나올 수 있다", () => {
  const count = core.COPY.ko.resultLines.length;
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

test("언어를 넘기면 안내 문구가 그 언어로 나오고, 추첨에는 영향이 없다", () => {
  let calls = 0;
  const fixedDraw = () => {
    calls += 1;
    return 1;
  };

  const invalid = plain(core.decidePair("BMW", "", fixedDraw, "en"));
  assert.equal(invalid.message, core.COPY.en.notices.single);

  const ko = plain(core.decidePair("Mercedes-Benz", "BMW", fixedDraw, "ko"));
  const en = plain(core.decidePair("Mercedes-Benz", "BMW", fixedDraw, "en"));
  assert.equal(ko.picked, "BMW");
  assert.equal(en.picked, "BMW");
  assert.equal(calls, 2);
});
