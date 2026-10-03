# HANDOFF

세션 사이 인수인계 기록. 새 세션은 대화 기록을 모르므로 이어서 할 정보는 여기에 남긴다.

## 현재 상태 (마지막 갱신: 2026-10-03)

- 앱은 GitHub Pages에 배포되어 있다: https://rundope.github.io/Pick-assist/
- Pull Request(PR) 1번(MVP), 2번(공유 미리보기), 3번(영어 버전)은 merge되었다 (`main` = `a77474f`). 세 번 모두 Pages 배포가 성공했다.
- merge된 Pull Request(PR)는 다시 쓰지 않는다. 새 작업은 최신 `main`에서 branch를 새로 시작해 새 Pull Request(PR)로 올린다.
- merge 규칙이 바뀌었다: 기본은 사용자가 merge하고, 사용자가 특정 Pull Request(PR)의 merge를 명시적으로 요청하면 Claude가 CLAUDE.md의 확인 절차(충돌 없음·head 일치·테스트 통과·merge commit·Pages 배포 확인)를 거쳐 merge한다. Pull Request(PR) 3번은 이 방식으로 Claude가 merge했다.
- 테스트는 54개이고 모두 통과한다 (`node --test tests/*.test.js`).
- 화면은 한국어·영어 두 언어다. `?lang=ko|en` → 브라우저 첫 번째 언어 순으로 정하고, 오른쪽 위 버튼으로 바꾼다. 영어 슬로건은 "Don't hesitate" / "Leave the verdict to Pick-assist; the choice is still yours.", 버튼은 "Pick for me"다. 규칙은 CLAUDE.md의 "두 언어" 절에 있다.
- 회사 이름은 Spoonbills다. 첫 화면 제목(슬로건)은 "망설이지 마세요 - 판결은 Pick-assist 에게, 선택은 자유", 그 아래 "두 선택지를 올리면, 공정하게 판결합니다."(사용자가 유지하기로 함)다.
- footer는 "이 법정은 철저한 비공개 재판입니다. / 사건도 판결도 이 기기 밖으로 새지 않아요."와 "Spoonbills"다.
- 입력 예시(placeholder)와 README 예시는 `Mercedes-Benz` vs `BMW`다.
- 공유 미리보기(Open Graph) 이미지는 `docs/og-image.png`(1200×630)이고 배포되었다. 사용자는 아직 이미지 주소와 카카오톡 카드를 새 배포 기준으로 확인하지 않았다.

### 2026-10-03에 한 일

- 사용자 요청으로 Pull Request(PR) 3번을 Claude가 merge했고, 이에 맞춰 CLAUDE.md와 `wrap-up` 스킬의 merge 규칙을 고쳤다.
- 영어 버전을 넣었다. 결과 문구 30개·반응 6개·안내·안전 문구를 영어로 쓰고, 문구를 `PickCore.COPY.ko/en`, 화면 글자를 `STRINGS.ko/en`으로 나눴다.
- 영어 건강·안전 키워드를 추가했다. 영어 키워드는 단어 시작 위치에서만 맞춘다 ("spend my life" ≠ "end my life", "medicine ball", "hospitality"는 걸리지 않음).
- 영어 자해 안내는 109(한국)와 함께 988(미국), 116 123(영국·아일랜드 Samaritans)을 알려 주고 전화 버튼 세 개를 보여준다. 세 번호는 2026-10-03에 공식 출처로 확인했다.
- README를 두 언어 사용설명서로 다시 쓰고, 스크린샷을 `docs/screenshot-{ko,en}-{light,dark}.png`로 새로 찍었다.

### 2026-09-29에 한 일

- 저장소를 처음부터 만들고 MVP를 배포했다: 두 칸 입력, `crypto.getRandomValues()` 50:50 추첨, 건강·안전 필터(109 안내 포함), 판사 목소리 결과 문구 30개, 재판정 디자인, Spoonbills 로고.
- 회사 이름을 The Spoon Lab에서 Spoonbills로, 슬로건과 브랜드 톤을 "망설이지 마세요 - 판결은 Pick-assist 에게, 선택은 자유"로 확정했다.
- 건강·안전 키워드를 실제 입력 예시로 보강하고 오탐 반례를 테스트에 넣었다.
- README 스크린샷과 공유 미리보기(Open Graph) 카드를 넣었다.

### 다음에 할 일 (우선순위 순)

1. https://rundope.github.io/Pick-assist/?lang=en 에서 영어 화면을 확인한다 (배포 완료).
2. 공유 미리보기를 확인한다. https://rundope.github.io/Pick-assist/docs/og-image.png 가 열리는지 보고, 카카오 개발자 사이트의 도구 → 공유 디버거에서 `https://rundope.github.io/Pick-assist/` 캐시를 초기화한 뒤 카카오톡 카드를 확인한다 (merge 전에 붙인 링크가 이미지 없는 카드로 캐시되어 있을 수 있다).
3. 실제 iPhone Safari와 iPad에서 두 언어를 모두 확인한다. iOS에는 한글 명조 폰트가 기본으로 없어서 제목이 고딕으로 보일 수 있다. 명조가 꼭 필요하면 폰트 파일을 저장소에 직접 넣는 방법을 검토한다 (외부 폰트 CDN은 원칙상 쓰지 않는다).

### 주의할 점

- 공유 미리보기 카드(Open Graph)와 정적 `<title>`은 한국어뿐이다. 메신저는 JavaScript를 실행하지 않으므로 `?lang=en` 링크도 한국어 카드로 보인다. 영어 카드가 필요하면 별도 영어 페이지나 영어 카드 이미지를 검토해야 한다.

- `.claude/skills/`의 스킬은 세션이 시작되거나 저장소가 등록될 때 읽힌다. 1차에는 세션 도중에 만들어서 `wrap-up`을 호출하지 못했지만, 3차 시점에는 `wrap-up`·`start-work`가 스킬 목록에 등록된 것을 확인했다.
- 테스트는 `node --test tests/`가 아니라 `node --test tests/*.test.js`로 돌린다. Node.js 22는 디렉터리 인자를 파일 경로로 해석한다.
- `index.html`의 `<script id="pick-core">`와 `var PickCore`는 테스트가 직접 읽는다. 이름을 바꾸면 테스트가 깨진다.
- 키워드 매칭은 공백을 지우고 비교한다. 짧은 키워드는 일상어와 겹치기 쉽다 ("주사"→"주사위", "약"→"약속", "유서"→"유서 깊은"). 새 키워드를 넣으면 `EVERYDAY_INPUTS` 테스트에 반례도 넣는다.
- 정규식 lookbehind는 구형 Safari에서 스크립트 전체를 멈추게 하므로 쓰지 않는다 (테스트로 막아 두었다).
- 로고는 사용자가 준 PNG를 potrace로 벡터화한 path다. 새 로고를 받으면 같은 방식으로 SVG path를 만들어 헤더(`.brand .logo`)와 favicon data URI를 함께 바꾼다.
- README 스크린샷(`docs/screenshot-*.png`)은 화면을 바꾸면 다시 찍는다 (Playwright, 390px, deviceScaleFactor 2, fullPage).
- 클라우드 세션의 네트워크 정책이 `rundope.github.io`를 막는다. 세션 안에서는 배포된 사이트를 직접 열 수 없으므로, 배포 확인은 GitHub Actions의 "pages build and deployment" 기록으로 한다. 직접 열려면 환경 설정의 Network access에 이 도메인을 추가해야 한다.
- 공유 미리보기 이미지는 문구를 그림으로 만든 것이다. 슬로건을 바꾸면 `docs/og-image.png`도 다시 만든다 (Noto Serif KR·Noto Sans KR로 렌더링, 폰트 파일은 저장소에 넣지 않음).
- auto mode의 권한 검사 서버가 일시적으로 응답하지 않으면 Bash(git·테스트)가 막힌다. 그동안에는 편집 도구로 파일만 고치고, 복구되면 테스트 → commit → push 순서로 처리한다.


## 5차 기록 (2026-09-29): 공유 미리보기

- HANDOFF.md를 merge·배포 상태에 맞게 고쳤다.
- 공유 미리보기(Open Graph)를 넣었다. 카드 이미지는 `docs/og-image.png`(1200×630)이고, 로고·"망설이지 마세요"·"판결은 Pick-assist 에게, 선택은 자유"가 들어간다. 이미지는 Noto Serif KR·Noto Sans KR로 렌더링했지만 폰트 파일은 저장소에 넣지 않았다 (사이트는 여전히 외부 폰트 없음). 문구를 바꾸면 이미지도 다시 만들어야 한다.

## 4차 기록 (2026-09-29): 슬로건·예시·footer

- 첫 화면 제목을 옛 슬로건("망설임은 기각합니다. 지금 결정하세요.")에서 브랜드 톤 문장으로 바꿨다. 휴대폰에서 줄바꿈이 흔들리지 않게 "망설이지 마세요" / "판결은 Pick-assist 에게, 선택은 자유" 두 줄로 나누고, 이음표 " - "는 화면에서만 숨겨 스크린 리더에는 원문 그대로 읽힌다.
- 입력 예시를 짜장/짬뽕에서 Mercedes-Benz/BMW로 바꾸고 README 스크린샷을 다시 찍었다.
- footer에서 슬로건 줄을 뺐다 (제목과 중복). 개인정보 문구는 딱딱하다는 사용자 의견에 따라 법정 유머로 바꿨다: "이 법정은 철저한 비공개 재판입니다. 사건도 판결도 이 기기 밖으로 새지 않아요." 문구는 사실(서버·저장·전송 없음, CSP 차단)과 맞아야 한다.

## 3차 기록 (2026-09-29): 스크린샷·키워드

- footer 첫 줄을 브랜드 톤 문장으로 바꿨다.
- README의 스크린샷 자리를 실제 화면(라이트·다크, 390px)으로 채웠다 (`docs/`).
- 건강·안전 키워드를 보강했다 (라식·라섹, 타이레놀, 졸음운전, 헬멧, 손목 긋기, 생을 마감, 과다복용 등). 오탐 반례(마약떡볶이, 대마도, 숙제 끝내버릴까 등)도 테스트에 넣었다.

## 2차 기록 (2026-09-29): 재판정 디자인

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

## 1차 기록 (2026-09-29): MVP

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

### 당시 상태

- 모든 기능이 동작하고 테스트 29개가 통과한다 (`node --test tests/*.test.js`).
- Playwright로 390px·1280px, 라이트·다크에서 레이아웃과 동작을 확인했고 콘솔 오류는 없었다.
- 실제 iPhone·iPad Safari에서는 아직 확인하지 않았다.
- GitHub Pages는 아직 켜지 않았다. 저장소 Settings → Pages에서 `main` / root를 선택해야 한다.
