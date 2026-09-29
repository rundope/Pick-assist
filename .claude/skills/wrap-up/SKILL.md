---
name: wrap-up
description: 사용자가 "퇴근", "마무리", "오늘 여기까지"라고 하면 사용한다. 진행 중인 작업을 동작하는 상태로 정리하고 HANDOFF.md를 갱신한 뒤 commit, push, Pull Request(PR)까지 끝낸다.
---

1. 진행 중인 작업을 동작하는 상태로 정리한다. 끝내지 못한 기능은 화면에 드러나지 않게 숨기거나 되돌리고, 무엇을 했는지는 HANDOFF.md에 적는다. main에 합쳐도 데모가 깨지지 않아야 한다.
2. tests/의 테스트를 모두 실행한다. 실패하면 고치고, 못 고치면 그 사실을 HANDOFF.md와 Pull Request(PR) 설명 맨 위에 적는다.
3. HANDOFF.md를 갱신한다: 오늘 한 일, 현재 상태, 다음에 할 일(우선순위 순 3개 이내), 주의할 점.
4. 남은 변경을 commit하고 push한다.
5. Pull Request(PR)를 만들거나, 이미 있으면 설명을 갱신한다. 제목은 오늘 작업 요약, 본문은 HANDOFF.md의 요약과 확인 방법.
6. 사용자에게 다섯 줄 이내로 알린다: 오늘 한 일, 테스트 결과, Pull Request(PR) 링크, "merge하면 다른 기기에서 이어갈 수 있습니다".
7. merge는 사용자가 한다. 직접 merge하지 않는다.
