// index.html 안의 <script id="pick-core"> 블록을 꺼내 Node.js에서 실행한다.
// 앱은 한 파일이어야 하므로, 테스트가 앱 코드를 복사하지 않고 원본을 그대로 읽는다.

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const INDEX_PATH = path.join(__dirname, "..", "index.html");

function readIndexHtml() {
  return fs.readFileSync(INDEX_PATH, "utf8");
}

function extractCoreSource(html) {
  const match = html.match(/<script id="pick-core">([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error('index.html에서 <script id="pick-core"> 블록을 찾지 못했습니다.');
  }
  return match[1];
}

// cryptoImpl을 넘기면 그걸 crypto로 쓴다. 기본은 Node.js의 Web Crypto.
function loadCore(cryptoImpl) {
  const context = { crypto: cryptoImpl || globalThis.crypto };
  vm.createContext(context);
  vm.runInContext(extractCoreSource(readIndexHtml()), context);
  return context.PickCore;
}

// vm 안에서 만든 객체는 프로토타입이 달라 deepStrictEqual이 실패하므로 평범한 값으로 바꾼다.
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = { loadCore, readIndexHtml, plain };
