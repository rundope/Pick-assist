const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCore, plain } = require("./load-core");

const core = loadCore();

function parse(input) {
  return plain(core.parseChoices(input));
}

test("구분자 vs / VS / Vs / '/' / 아니면 / or 를 인식한다", () => {
  const cases = [
    "짜장 vs 짬뽕",
    "짜장 VS 짬뽕",
    "짜장 Vs 짬뽕",
    "짜장/짬뽕",
    "짜장 / 짬뽕",
    "짜장 아니면 짬뽕",
    "짜장 or 짬뽕",
    "짜장vs짬뽕",
    "  짜장   vs   짬뽕  "
  ];

  for (const input of cases) {
    assert.deepEqual(parse(input), { ok: true, choices: ["짜장", "짬뽕"] }, input);
  }
});

test("선택지 안의 공백은 유지하고 앞뒤 공백만 정리한다", () => {
  assert.deepEqual(parse("짜장면 곱빼기 vs 짬뽕 보통"), {
    ok: true,
    choices: ["짜장면 곱빼기", "짬뽕 보통"]
  });
});

test("영단어 안에 들어 있는 or / vs 는 구분자로 보지 않는다", () => {
  assert.deepEqual(parse("orange vs color"), { ok: true, choices: ["orange", "color"] });
  assert.deepEqual(parse("pizza or pasta"), { ok: true, choices: ["pizza", "pasta"] });
});

test("선택지가 하나뿐이면 single", () => {
  assert.deepEqual(parse("짜장"), { ok: false, reason: "single" });
  assert.deepEqual(parse("짜장 vs"), { ok: false, reason: "single" });
  assert.deepEqual(parse("/ 짬뽕"), { ok: false, reason: "single" });
});

test("두 선택지가 같으면 same (공백·대소문자 차이 무시)", () => {
  assert.deepEqual(parse("짜장 vs 짜장"), { ok: false, reason: "same" });
  assert.deepEqual(parse("Pizza vs  pizza "), { ok: false, reason: "same" });
});

test("빈 입력은 empty", () => {
  assert.deepEqual(parse(""), { ok: false, reason: "empty" });
  assert.deepEqual(parse("   "), { ok: false, reason: "empty" });
  assert.deepEqual(parse("vs"), { ok: false, reason: "empty" });
});

test("선택지가 셋 이상이면 tooMany", () => {
  assert.deepEqual(parse("짜장 vs 짬뽕 vs 탕수육"), { ok: false, reason: "tooMany" });
});

test("잘못된 입력에는 안내 문구가 붙고 추첨하지 않는다", () => {
  let calls = 0;
  const spy = () => {
    calls += 1;
    return 0;
  };

  for (const input of ["", "짜장", "짜장 vs 짜장", "a vs b vs c"]) {
    const decision = plain(core.decide(input, spy));
    assert.equal(decision.status, "invalid", input);
    assert.equal(typeof decision.message, "string");
    assert.ok(decision.message.length > 0);
  }
  assert.equal(calls, 0);
});
