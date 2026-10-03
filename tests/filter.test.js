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
  "음주운전 vs 대리",
  "졸음운전 vs 휴게소",
  "헬멧 없이 vs 쓰고",
  "마약 한번만 vs 참기",
  "다이어트약 vs 운동",
  "타이레놀 vs 참기",
  "라식 vs 라섹",
  "치과 가기 vs 참기",
  "보톡스 vs 필러",
  "정신과 약 끊기 vs 계속",
  "take my pills vs skip",
  "stop treatment vs keep going",
  "surgery or wait",
  "go to the hospital vs rest",
  "lasik vs glasses",
  "drive drunk vs taxi",
  "take medicine vs sleep it off"
];

const SELF_HARM_INPUTS = [
  "죽고 싶다 vs 참자",
  "죽고싶어",
  "살까 죽을까",
  "자해 vs 참기",
  "자살",
  "극단적 선택 vs 버티기",
  "손목 긋기 vs 참기",
  "살고 싶지 않다",
  "생을 마감할까",
  "없어지고 싶다",
  "목을 맬까",
  "약 모아서 한꺼번에 먹기",
  "과다복용 vs 참기",
  "뛰어내리기 vs 버티기",
  "I want to end my life",
  "kill myself vs keep going",
  "cut myself or not",
  "I don’t want to live",
  "overdose vs wait"
];

const EVERYDAY_INPUTS = [
  "짜장 vs 짬뽕",
  "주사위 vs 동전",
  "약속 나가기 vs 집에 있기",
  "예약하기 vs 그냥 가기",
  "유서 깊은 식당 vs 새 식당",
  "죽 vs 밥",
  "운동 vs 휴식",
  "마약떡볶이 vs 순대",
  "마약김밥 vs 라면",
  "대마도 여행 vs 제주도",
  "필라테스 vs 요가",
  "치약 vs 칫솔",
  "손목시계 vs 스마트워치",
  "숙제 끝내버릴까 vs 내일 하기",
  "운전 연수 vs 대중교통",
  "약과 vs 쿠키",
  "Mercedes-Benz vs BMW",
  "spend my life savings vs invest",
  "medicine ball vs dumbbell",
  "hospitality job vs office job",
  "pillow vs blanket",
  "cutting board vs plate"
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

test("두 칸 입력에서도 어느 칸이든 걸리면 추첨하지 않는다", () => {
  const cases = [
    ["약 먹기", "참기", "health"],
    ["버티기", "수술 받기", "health"],
    ["죽고 싶다", "참자", "selfHarm"]
  ];

  for (const [first, second, kind] of cases) {
    const draw = spyDraw();
    const decision = plain(core.decidePair(first, second, draw));

    assert.equal(decision.status, "safety", `${first} / ${second}`);
    assert.equal(decision.kind, kind);
    assert.equal(draw.calls, 0);
  }
});

test("두 칸의 글자가 이어 붙어 생기는 오탐은 없다", () => {
  // "예약" + "먹방"을 공백 없이 이으면 "약먹"이 생긴다.
  const draw = spyDraw();
  const decision = plain(core.decidePair("예약", "먹방", draw));

  assert.equal(decision.status, "picked");
  assert.equal(draw.calls, 1);
});

test("키워드 목록은 상수로 노출되어 있고 비어 있지 않다", () => {
  assert.ok(core.HEALTH_KEYWORDS.length > 0);
  assert.ok(core.SELF_HARM_KEYWORDS.length > 0);
});
