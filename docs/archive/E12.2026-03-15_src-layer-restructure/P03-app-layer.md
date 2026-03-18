# P03: app/ 레이어 구성

## 목표

`src/app/` 디렉토리를 만들고 React 애플리케이션 코드를 이동한다.
`app/infra/`를 신설해 외부 경계(localStorage, 파일 export)를 명시적으로 분리한다.

## 구현 상세

### 이동 목록

| 현재 경로 | 신규 경로 | 비고 |
|---|---|---|
| `src/components/` | `src/app/components/` | 디렉토리 통째로 이동 |
| `src/pages/` | `src/app/pages/` | 디렉토리 통째로 이동 |
| `src/layouts/` | `src/app/layouts/` | 디렉토리 통째로 이동 |
| `src/hooks/` | `src/app/hooks/` | 디렉토리 통째로 이동 |
| `src/state/` | `src/app/state/` | 디렉토리 통째로 이동 |
| `src/content/` | `src/app/content/` | 디렉토리 통째로 이동 |
| `src/config/` | `src/app/config/` | 디렉토리 통째로 이동 |

### 통합 (constants/*-content.ts → app/content/)

아래 파일들은 기존 `src/content/` 구조에 맞춰 통합 또는 이동한다.

| 현재 경로 | 신규 경로 |
|---|---|
| `src/constants/build-content.ts` | `src/app/content/build/` 또는 직접 통합 |
| `src/constants/lab-content.ts` | `src/app/content/labs/` 또는 직접 통합 |
| `src/constants/landing-content.ts` | `src/app/content/landing/` |
| `src/constants/showcase-content.ts` | `src/app/content/showcase/` |

> 기존 `src/content/labs/` 하위 JSON 파일들과 중복/충돌 여부를 확인하고 병합한다.

### infra/ 신설

| 현재 경로 | 신규 경로 | 비고 |
|---|---|---|
| `src/utils/component-mapping-storage.ts` | `src/app/infra/storage.ts` | localStorage CRUD |
| `src/utils/yamang-export.ts` | `src/app/infra/export.ts` | 파일 export |

### 완료 기준

- `src/constants/` 디렉토리가 비거나 삭제됨 (도메인 상수는 P02에서, 콘텐츠는 이 Phase에서 이동 완료)
- TypeScript 컴파일 통과

## 체크리스트

- [x] `src/app/` 디렉토리 생성
- [x] `components/`, `pages/`, `layouts/`, `hooks/`, `state/`, `content/`, `config/` 이동
- [x] `constants/*-content.ts` 파일들을 `app/content/`로 통합
- [x] `app/infra/` 신설 및 storage.ts, export.ts 이동
- [x] `src/constants/` 디렉토리 정리 (비어있으면 삭제)
- [x] TypeScript 컴파일 통과
