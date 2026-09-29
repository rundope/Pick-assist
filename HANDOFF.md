# HANDOFF

세션 사이 인수인계 기록. 새 세션은 대화 기록을 모르므로 이어서 할 정보는 여기에 남긴다.

## 마지막 갱신: 2026-09-29 (2차: 재판정 디자인)

### 이번에 한 일

- 회사 이름이 **Spoonbills**로 정해졌다. "The Spoon Lab" 표기를 화면·README·LICENSE·CLAUDE.md에서 모두 바꿨고, CLAUDE.md에 규칙으로 남겼다.
- 저장소를 `rundope/Pick-assist`로 새로 만들어서 로컬 `origin`을 그쪽으로 바꿨다. README 데모 링크(`https://rundope.github.io/Pick-assist/`)와 이제 맞는다.
- 입력을 `vs` 한 줄에서 **두 칸**으로 바꿨다. 첫 칸에서 Enter를 치면 둘째 칸으로 넘어간다. 한 칸에 `짜장 vs 짬뽕`을 붙여 넣어도 나눠 준다 (`parsePair`, `decidePair`).
- 안전 필터는 두 칸을 `" / "`로 이어서 검사한다. 공백으로 이으면 칸 경계를 넘는 오탐이 생긴다 ("예약" + "먹방" → "약먹").
- 로고를 사용자가 준 회사 로고(저어새와 원호)로 바꿨다. PNG를 potrace로 벡터화해 inline SVG와 favicon으로 넣었고, 색은 테마를 따른다.
- 디자인을 **재판정** 콘셉트로 바꿨다. 남색 잉크·양피지·황동색, 명조 제목, VS 도장, 판결문 카드, 의사봉 연출, 선고 날짜를 넣었다.
- 슬로건: "망설임은 기각합니다. 지금 결정하세요." "떠먹여 준다"는 나쁜 이미지라서 결과 문구·반응 문구·footer에서도 빼고, 판사 목소리로 바꿨다. 테스트로 막아 두었다.
- 테스트는 38개이고 모두 통과한다.

### 아직 결정되지 않은 것

- 없음. 브랜드 톤 문장은 "망설이지 마세요 - 판결은 Pick-assist 에게, 선택은 자유"로 확정되어 CLAUDE.md와 README에 반영했다.

## 1차 기록 (2026-09-29)

### 한 일

- 저장소를 처음부터 만들었다. 원격이 완전히 비어 있어서 `main`에 빈 초기 commit(`Initialize repository`)만 올려 Pull Request(PR)의 기준 branch로 삼았다.
- `CLAUDE.md`(제품 원칙·작업 규칙)와 `.claude/skills/wrap-up`, `.claude/skills/start-work` 스킬을 추가했다.
- `index.html` 한 파일로 MVP(Minimum Viable Product, 최소 기능 제품)를 완성했다.
  - 파싱: `vs`/`VS`/`Vs`/`/`/`아니면`/`or` 구분자, 하나뿐·같음·빈 입력·셋 이상 안내.
  - 추첨: `crypto.getRandomValues()` + 거절 샘플링으로 정확한 50:50.
  - 건강·안전 필터: 추첨 전에 검사하고, 걸리면 추첨 함수를 부르지 않는다. 자해·자살은 109 안내와 `tel:109` 버튼.
  - 화면: 모바일 우선, 라이트/다크 자동, 0.7초 연출(동작 줄이기 설정 시 0.5초), 좋아/다른 거 반응, 한 번 더/새로 입력.
  - 문구: 결과 30개, "좋아" 반응 6개, 받침에 맞춘 조사 처리, 직전 문구 반복 방지.
  - Content-Security-Policy로 외부 요청을 모두 차단했다.
- `tests/`에 Node.js 내장 테스트 29개를 추가했다. 모두 통과한다.
- LICENSE(MIT), README(영어 → 한국어)를 추가했다.

### 현재 상태

- 모든 기능이 동작하고 테스트 29개가 통과한다 (`node --test tests/*.test.js`).
- Playwright로 390px·1280px, 라이트·다크에서 레이아웃과 동작을 확인했고 콘솔 오류는 없었다.
- 실제 iPhone·iPad Safari에서는 아직 확인하지 않았다.
- GitHub Pages는 아직 켜지 않았다. 저장소 Settings → Pages에서 `main` / root를 선택해야 한다.

### 다음에 할 일 (우선순위 순)

1. push 권한을 해결한다. Claude GitHub App이 `rundope/Pick-assist`에 설치되어 있지 않아 push가 403으로 막혀 있다. 해결되면 `main`(빈 초기 commit)을 먼저 push해서 기본 branch로 만들고, 작업 branch를 push한 뒤 Pull Request(PR)를 만든다. 그다음 Settings → Pages에서 `main` / root를 켠다.
2. 실제 iPhone Safari와 iPad에서 확인하고, README의 스크린샷 자리를 채운다. iOS에는 한글 명조 폰트가 기본으로 없어서 제목이 고딕으로 보일 수 있다.
3. 건강·안전 키워드의 오탐·미탐을 보강한다.

### 주의할 점

- `.claude/skills/`의 스킬은 세션이 시작될 때 등록된다. 오늘은 세션 도중에 만들어서 `wrap-up`을 스킬로 호출하지 못했고, `SKILL.md` 절차를 수동으로 따랐다. 다음 세션부터는 "퇴근"/"출근"으로 바로 호출되는지 확인할 것.
- 테스트는 `node --test tests/`가 아니라 `node --test tests/*.test.js`로 돌린다. Node.js 22는 디렉터리 인자를 파일 경로로 해석한다.
- `index.html`의 `<script id="pick-core">`와 `var PickCore`는 테스트가 직접 읽는다. 이름을 바꾸면 테스트가 깨진다.
- 키워드 매칭은 공백을 지우고 비교한다. 짧은 키워드는 일상어와 겹치기 쉽다 ("주사"→"주사위", "약"→"약속", "유서"→"유서 깊은"). 새 키워드를 넣으면 `EVERYDAY_INPUTS` 테스트에 반례도 넣는다.
- 정규식 lookbehind는 구형 Safari에서 스크립트 전체를 멈추게 하므로 쓰지 않는다 (테스트로 막아 두었다).
