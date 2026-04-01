# YamangDesign 프로젝트 코딩 컨벤션

E26 보일러플레이트 점검(E26 P06)·E27 Audit Remediation에서 도출한 **이 저장소에 적용하는** 규칙이다. basis 전문(CN-01, CC-01~05 등)은 vibe_boilerplate `docs/basis/convention/coding/` 및 스택 문서를 본다.

---

## 1. 레이어·의존성 (E27 P01, E26 P04/P06 CC-04)

| 레이어 | 경로 별칭 | 허용 의존 |
|--------|-----------|-----------|
| Domain | `@domain/*` | `@shared/*`, 상대·도메인 내부 |
| App | `@app/*` | `@domain/*`, `@shared/*`, `@app/*` |
| Shared | `@shared/*` | `@shared/*`, 외부 라이브러리 |

- **금지:** `src/domain/**`·`src/shared/**`에서 `@app/` 로의 import. (ESLint `no-restricted-imports`로 차단.)
- 상세 아키텍처: [docs/design/ARCHITECTURE.md](../design/ARCHITECTURE.md).

---

## 2. TypeScript·빌드 (`tsconfig.app.json`)

- `strict`, `noUnusedLocals`, `noUnusedParameters` 유지.
- 경로 별칭: `@domain`, `@app`, `@shared`만 사용(깊은 상대경로 남용 지양).

---

## 3. 린트·품질 게이트 (E27 P06·P07)

- **`npm run lint`** = ESLint + Stylelint + `check:literals` (색·크기 리터럴 정책).
- **미사용 심볼:** `@typescript-eslint/no-unused-vars` (error), `_` 접두로 의도적 미사용 표시.
- **React Hooks:** `react-hooks/exhaustive-deps`는 **error** — effect/useMemo 의존성 누락을 merge 전에 막는다.
- 스타일: Stylelint는 CSS·CSS Modules; TS/TSX 내 색·크기 리터럴은 스크립트가 담당.

---

## 4. 주석·문서 (CC-05, E27 P07)

- 긴 맥락·정책은 **`docs/design`** 등 공식 문서**; 코드에는 파일 상단 블록과 `@see docs/...` 정도.
- 구현부 인라인에 설명·단계 나열을 두지 않는다. 예외: Sonar `NOSONAR`, ESLint disable 한 줄, export 직상 JSDoc, 대형 데이터 맵의 **카탈로그용** 구간 표시(파일 상단에 용도 명시).
- 요약: [ARCHITECTURE.md § 코드 위생](../design/ARCHITECTURE.md#코드-위생cc-05과-모듈-주석).

---

## 5. 네이밍·구조 (E26 P06 CN-01 샘플링)

- 도메인 용어: `palette`, `theme`, `token`, `semantic` 등 일관 사용.
- App 훅: `use*` 접두. boolean props·상태: `is` / `has` / `can` 선호.
- Domain에 **try/catch로 비즈니스 흐름 제어**를 두지 않는다(점검 기준 0건 유지 목표).

---

## 6. Git·브랜치 (E27 P05, GC-01)

- 에픽: `epic/E##-{scope}`, 기능: `feat/E##/P##-{scope}` 등 — `docs/epic`의 E##·P##와 대응.
- 커밋: Conventional Commits, 에픽 작업 시 본문에 `Refs: E##/P##` 권장.

---

## 7. 변경 시

- 이 문서는 **프로젝트 단위** 약속이다. basis나 보일러플레이트가 갱신되면 에픽/백로그에서 재점검해 반영한다.
