const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCore, plain } = require("./load-core");

const core = loadCore();

function spyDraw() {
  const spy = () => {
    spy.calls += 1;
    return 0;
  };
  spy.calls = 0;
  return spy;
}

const HEALTH_INPUTS = [
  "약 먹을까 vs 참을까",
  "약 복용 계속 vs 중단",
  "치료 중단할까 vs 계속할까",
  "수술 받을까 vs 말까",
  "병원 가기 vs 버티기",
  "수면제 vs 그냥 자기",
  "주사 맞기 vs 안 맞기",
  "음주운전 vs 대리"
];

const SELF_HARM_INPUTS = [
  "죽고 싶다 vs 참자",
  "죽고싶어",
  "살까 죽을까",
  "자해 vs 참기",
  "자살",
  "극단적 선택 vs 버티기"
];

const EVERYDAY_INPUTS = [
  "짜장 vs 짬뽕",
  "주사위 vs 동전",
  "약속 나가기 vs 집에 있기",
  "예약하기 vs 그냥 가기",
  "유서 깊은 식당 vs 새 식당",
  "죽 vs 밥",
  "운동 vs 휴식"
];

test("건강·안전 표현이 있으면 추첨하지 않고 전문가 안내를 낸다", () => {
  for (const input of HEALTH_INPUTS) {
    const draw = spyDraw();
    const decision = plain(core.decide(input, draw));

    assert.equal(decision.status, "safety", input);
    assert.equal(decision.kind, "health", input);
    assert.equal(decision.message, "이 결정은 전문가와 상의하세요.");
    assert.equal(draw.calls, 0, `${input}: 추첨 함수가 호출됨`);
  }
});

test("자해·자살 표현이 있으면 추첨하지 않고 109 안내를 낸다", () => {
  for (const input of SELF_HARM_INPUTS) {
    const draw = spyDraw();
    const decision = plain(core.decide(input, draw));

    assert.equal(decision.status, "safety", input);
    assert.equal(decision.kind, "selfHarm", input);
    assert.match(decision.message, /109/);
    assert.equal(draw.calls, 0, `${input}: 추첨 함수가 호출됨`);
  }
});

test("둘 다 해당하면 자해·자살 안내가 우선한다", () => {
  assert.equal(core.checkSafety("약 먹고 죽고 싶다"), "selfHarm");
});

test("평범한 입력은 필터에 걸리지 않고 정상 추첨된다", () => {
  for (const input of EVERYDAY_INPUTS) {
    const draw = spyDraw();
    const decision = plain(core.decide(input, draw));

    assert.equal(core.checkSafety(input), null, input);
    assert.equal(decision.status, "picked", input);
    assert.equal(draw.calls, 1, input);
  }
});

test("키워드 목록은 상수로 노출되어 있고 비어 있지 않다", () => {
  assert.ok(core.HEALTH_KEYWORDS.length > 0);
  assert.ok(core.SELF_HARM_KEYWORDS.length > 0);
});
