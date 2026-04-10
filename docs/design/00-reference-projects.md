# 참조 프로젝트 (vibe_boilerplate)

YamangDesign는 **디자인 시스템 POC의 소스 오브 트루스**이고, 동일 개발 머신에서 함께 두는 **`vibe_boilerplate`** 저장소는 **멀티 앱·에이전트 워크플로·백엔드 포함 보일러플레이트** 참조로 둔다. 두 저장소의 역할을 섞지 않도록 아래를 기준으로 한다.

## 경로

| 저장소 | 로컬 경로 (예시) |
|--------|-------------------|
| YamangDesign (본 repo) | `C:\Users\ljj02\Desktop\dev\YamangDesign` |
| vibe_boilerplate (참조) | `C:\Users\ljj02\Desktop\dev\vibe_boilerplate` |

경로는 환경마다 다를 수 있으나, 문서·이슈에서 “참조 보일러플레이트”라고 하면 **vibe_boilerplate**를 가리킨다.

## 역할 분담

| 주제 | YamangDesign | vibe_boilerplate |
|------|----------------|------------------|
| `--ds-*` / `--ui-*` 토큰, 팔레트·테마 파이프라인 | **정의·검증의 기준** | 앱은 필요 시 동일 변수명으로 주입·소비 |
| 컴포넌트 폴더 패턴 (`*.module.css`, types 분리) | [ARCHITECTURE.md](./ARCHITECTURE.md), [yamang-design-stack](../../.cursor/skills/yamang-design-stack/SKILL.md) | `apps/frontend` 등은 **역할별 `src/`** (예: `routes/`, `pages/`, `components/`) — 구조는 다를 수 있음 |
| 에이전트 스킬·`AGENTS.md`·에픽 생명주기 | 일부 스킬이 vibe_boilerplate **E26 등에서 포팅**됨 ([AGENTS.md](../../AGENTS.md)) | 스킬·워크플로 **원천 저장소**로 삼을 수 있음 |
| 백엔드·DB·배포 | 없음 | `apps/backend`, `docs/epic/` 등 |

## 프론트 구현 순서 정렬

앱 쪽에서 **요소 재사용·토큰 우선**을 목표로 할 때, vibe_boilerplate 에픽에 정리된 **권장 순서**와 맞춘다 (폴더 이름은 저장소별로 다름).

1. **디자인 토큰** — 색·간격·타이포·레이어 등은 `var(--ds-*)` / `var(--ui-*)`만 사용 (정의는 YamangDesign 쪽 패턴·스크립트와 정합).
2. **레이아웃 뼈대** — 뷰포트는 필요 시 **PC 기준 최소·최대 폭**만 두고, 반응형·다크모드가 범위 밖이면 에픽/이슈에 명시.
3. **작은 재사용 단위(프리미티브)** → **기능/페이지 컴포넌트** 순으로 조립.

참고 에픽 문서 예: `vibe_boilerplate/docs/epic/E10.2026-04-06_local-llm-chat-ui/P02.frontend-chat-ui.md` (프론트 아키텍처·상태 분담).

## 문서·코드 탐색 포인터 (vibe_boilerplate)

| 목적 | 위치 |
|------|------|
| 에이전트 진입·스킬 라우팅 | `vibe_boilerplate/AGENTS.md` |
| 에픽·Phase | `vibe_boilerplate/docs/epic/` |
| 프론트 앱 (예시) | `vibe_boilerplate/apps/frontend/` |

## 주의

- **토큰 이름·스타일 정책**을 바꿀 때는 YamangDesign의 `docs/design/`·`check:literals` 정책을 먼저 갱신한다.
- vibe_boilerplate만 수정하고 YamangDesign 문서를 갱신하지 않으면, DS와 실제 앱 정책이 어긋날 수 있다.
