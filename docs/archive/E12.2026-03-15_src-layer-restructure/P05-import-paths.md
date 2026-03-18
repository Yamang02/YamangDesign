# P05: import 경로 수정 및 빌드 검증

## 목표

P02~P04의 파일 이동으로 깨진 모든 import 경로를 수정하고,
빌드와 TypeScript 컴파일이 정상 통과함을 확인한다.

## 구현 상세

### 1. tsconfig path alias 업데이트

`tsconfig.json` 또는 `vite.config.ts`의 path alias를 신규 경로에 맞게 수정한다.

```jsonc
// tsconfig.json paths 예시 (변경 후)
{
  "paths": {
    "@domain/*": ["./src/domain/*"],
    "@app/*": ["./src/app/*"],
    "@shared/*": ["./src/shared/*"],
    // 기존 alias (필요시 유지 또는 제거)
    "@components/*": ["./src/app/components/*"],
    "@pages/*": ["./src/app/pages/*"],
    "@tokens/*": ["./src/domain/tokens/*"],
    "@themes/*": ["./src/domain/themes/*"],
    "@palettes/*": ["./src/domain/palettes/*"]
  }
}
```

### 2. 소스 파일 import 경로 일괄 수정

파일 이동으로 상대 경로 `../../` 패턴이 모두 깨진다.
IDE의 자동 import 수정 또는 스크립트로 일괄 처리한다.

주요 영향 범위:
- `app/components/` → `domain/` 참조
- `app/pages/` → `domain/` 및 `app/` 참조
- `app/hooks/` → `domain/` 참조
- `domain/` 내부 상호 참조

### 3. CSS import 경로 수정

`src/styles/*.css` → `src/shared/styles/`로 이동했으므로
`main.tsx` 또는 `App.tsx`의 CSS import 경로를 수정한다.

### 4. 검증

```bash
npm run build    # Vite 빌드 통과
npx tsc --noEmit # TypeScript 컴파일 통과
npm run lint     # ESLint 통과
```

## 체크리스트

- [x] `tsconfig.json` / `vite.config.ts` path alias 업데이트
- [x] 전체 소스 파일 import 경로 수정 (domain, app, shared 모두)
- [x] CSS import 경로 수정 (`main.tsx`, `App.tsx` 등)
- [x] `npm run build` 통과
- [x] `npx tsc --noEmit` 통과
- [x] `npm run lint` 통과
- [x] 브라우저에서 주요 페이지 시각적 확인 (Labs, Build, Context)
