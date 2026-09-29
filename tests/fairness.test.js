const test = require("node:test");
const assert = require("node:assert/strict");
const { loadCore } = require("./load-core");

const RUNS = 100000;

test(`추첨 ${RUNS.toLocaleString("en-US")}회: 한쪽 비율이 49%–51% 안에 든다`, () => {
  const core = loadCore();
  let first = 0;

  for (let i = 0; i < RUNS; i += 1) {
    const decision = core.decide("짜장 vs 짬뽕");
    if (decision.picked === "짜장") {
      first += 1;
    }
  }

  const ratio = first / RUNS;
  assert.ok(ratio >= 0.49 && ratio <= 0.51, `짜장 비율 ${(ratio * 100).toFixed(2)}%`);
});

test("입력 순서를 바꿔도 앞쪽에 쏠리지 않는다", () => {
  const core = loadCore();
  let first = 0;

  for (let i = 0; i < RUNS; i += 1) {
    const decision = core.decide("짬뽕 vs 짜장");
    if (decision.index === 0) {
      first += 1;
    }
  }

  const ratio = first / RUNS;
  assert.ok(ratio >= 0.49 && ratio <= 0.51, `앞쪽 비율 ${(ratio * 100).toFixed(2)}%`);
});

test("추첨은 crypto.getRandomValues 값만으로 정해진다", () => {
  const queue = [];
  let calls = 0;
  const fakeCrypto = {
    getRandomValues(array) {
      calls += 1;
      array[0] = queue.shift();
      return array;
    }
  };
  const core = loadCore(fakeCrypto);

  queue.push(4);
  assert.equal(core.decide("짜장 vs 짬뽕").picked, "짜장");

  queue.push(7);
  assert.equal(core.decide("짜장 vs 짬뽕").picked, "짬뽕");

  assert.equal(calls, 2);
});

test("cryptoRandomInt는 나머지 편향 없이 거절 샘플링한다", () => {
  const queue = [0xffffffff, 5];
  const fakeCrypto = {
    getRandomValues(array) {
      array[0] = queue.shift();
      return array;
    }
  };
  const core = loadCore(fakeCrypto);

  // max = 3이면 limit = 4294967295 이므로 0xffffffff는 버리고 다음 값(5)을 쓴다.
  assert.equal(core.cryptoRandomInt(3), 5 % 3);
  assert.equal(queue.length, 0);
});

test("crypto가 없으면 다른 난수로 대체하지 않고 오류를 낸다", () => {
  const core = loadCore({});
  assert.throws(() => core.decide("짜장 vs 짬뽕"));
});
