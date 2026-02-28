# 01. Tech Stack

## Overview

POC 목적에 맞게 라이브러리 종속성을 최소화하면서, 확장성과 에이전틱 코딩에 유리한 기술 스택을 선정한다.

---

## 선정 기술

| 항목 | 선택 | 버전 |
|------|------|------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| Package Manager | pnpm | 8.x |
| Styling | CSS Variables + TypeScript 객체 | - |

---

## 선정 이유

### React

- AI 학습 데이터가 풍부하여 에이전틱 코딩에 최적
- 컴포넌트 기반 구조로 디자인 시스템과 궁합 좋음
- 생태계 풍부 (추후 Storybook, 테스트 도구 연동 용이)

### TypeScript

- 타입 정의가 곧 문서 역할
- AI가 Props/API 빠르게 파악 가능
- 리팩토링 시 타입 에러로 누락 방지
- 토큰 시스템의 타입 안전성 보장

### Vite

- 빠른 HMR (Hot Module Replacement)
- 설정 최소화
- ESM 기반으로 현대적

### pnpm

- 빠른 설치 속도
- 디스크 효율적 (심볼릭 링크 활용)
- 모노레포 확장 시 유리

### CSS Variables + TypeScript 객체

- PRD에 명시된 "CSS 변수 + JS 객체" 방향 유지
- 테마 전환 시 CSS 변수만 교체
- TypeScript로 토큰 타입 안전성 확보
- 런타임 오버헤드 최소화

---

## 의존성 최소화 원칙

### 사용하지 않는 것

| 라이브러리 | 이유 |
|------------|------|
| CSS-in-JS (styled-components, emotion) | 런타임 오버헤드, 불필요한 종속성 |
| UI 프레임워크 (MUI, Chakra) | 디자인 시스템 직접 구축이 목적 |
| 상태 관리 (Redux, Zustand) | 테마 상태만 필요, Context로 충분 |
| 유틸리티 CSS (Tailwind) | 토큰 시스템과 충돌, 목적에 부합하지 않음 |

### 최소 의존성 목록

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x"
  }
}
```

---

## 개발 환경 설정

### 프로젝트 초기화

```bash
pnpm create vite yamang-design --template react-ts
cd yamang-design
pnpm install
```

### TypeScript 설정 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@tokens/*": ["./src/tokens/*"],
      "@themes/*": ["./src/themes/*"],
      "@components/*": ["./src/components/*"]
    }
  },
  "include": ["src"]
}
```

### Path Alias 설정 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tokens': path.resolve(__dirname, './src/tokens'),
      '@themes': path.resolve(__dirname, './src/themes'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
```

---

## 확장 고려사항 (현재 구현 X)

- Storybook 연동
- Vitest 테스트 환경
- ESLint + Prettier 설정
- Figma 토큰 연동 (Style Dictionary)
