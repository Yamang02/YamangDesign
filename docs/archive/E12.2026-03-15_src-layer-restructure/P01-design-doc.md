# P01: 설계 문서 기록

## 목표

3계층 구조 원칙을 공식 문서에 반영한다.
코드 변경 없이 문서만 업데이트하는 Phase다.

## 구현 상세

### 1. `docs/design/02-folder-structure.md` 전면 재작성

현재 내용은 초기 POC 구조(단일 계층)를 반영하고 있어 실제 코드와 크게 다르다.
3계층 구조 기준으로 전면 재작성한다.

포함 내용:
- 3계층 정의 및 의존성 방향
- 목표 디렉토리 트리 (`domain/`, `app/`, `shared/`)
- 계층별 역할 설명
- "어디에 넣어야 하나?" 판단 기준 (결정 흐름)
- 디렉토리별 역할 및 예시

### 2. `docs/design/ARCHITECTURE.md` 업데이트

**현재**: `src/` 구조 섹션이 없거나 구식 정보를 담고 있음
**변경**: 3계층 구조 요약 섹션 추가 또는 `02-folder-structure.md` 참조 링크 추가

### 3. `AGENT.md` 업데이트

**현재**: 파일 배치 관련 규칙 없음
**추가 내용**: "새 파일을 어디에 두어야 하나?" 판단 기준을 Coding Rules에 추가

```markdown
### File Placement — 3계층 구조

새 파일 생성 시 아래 기준으로 계층을 결정한다:

| 조건 | 위치 |
|---|---|
| React import가 있다 | `app/` |
| localStorage / fetch / 파일 I/O가 있다 | `app/infra/` |
| palette/theme/token 개념을 다루되 React 없다 | `domain/` |
| 도메인 지식 없는 순수 함수 | `shared/utils/` |
| 전역 CSS 파일 | `shared/styles/` |
| 정적 콘텐츠(JSON, 텍스트) | `app/content/` |

의존성 방향: `app/ → domain/ → shared/`
domain은 app을 import하지 않는다.
```

## 체크리스트

- [x] `docs/design/02-folder-structure.md` 3계층 구조로 전면 재작성
- [x] `docs/design/ARCHITECTURE.md` 에 3계층 구조 섹션 추가
- [x] `AGENT.md` 에 File Placement 규칙 추가
