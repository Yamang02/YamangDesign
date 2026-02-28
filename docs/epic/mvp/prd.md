좋다.
확장성 우선 + POC 빠르게.

네 선택 정리:

* 테마: **Minimal + Neumorphism**
* 전시 구조: **한 페이지 토글**
* 토큰: **CSS 변수 + JS 객체**
* 라이브러리 종속 최소화

남은 건 컴포넌트 4개.

---

# 컴포넌트 추천 (확장성 기준)

## ❌ Modal 제외

이유:

* 상태 복잡
* overlay 처리 필요
* POC 단계에서 시스템 사고 보여주기에 비효율

---

## ✅ 추천 4개

1. **Button**
2. **Card**
3. **Input**
4. **Navigation Bar**

---

### 왜 이 조합이 좋냐

| 컴포넌트       | 테스트하는 것                     |
| ---------- | --------------------------- |
| Button     | 상태(hover/active), elevation |
| Card       | surface, shadow 구조          |
| Input      | border, focus, 접근성          |
| Navigation | layout + spacing            |

이 4개면

* surface 토큰
* shadow 토큰
* border 토큰
* spacing 토큰
* state 토큰

전부 검증 가능.

확장성 측면에서 최적.

---

# 🔥 이제 바로 PRD (POC 압축버전)

---

# Project: Modular Exhibition UI – POC

## 1. 목적

디자인 시스템 기반 테마 전환 구조 검증.

* 동일 컴포넌트가
* Minimal / Neumorphism 테마에서
* 토큰 교체만으로 변경되는지 확인

---

## 2. 핵심 원칙

1. 스타일은 토큰으로만 제어
2. 컴포넌트 내부에 스타일 하드코딩 금지
3. 테마 변경은 전역 상태 1개로 처리

---

## 3. 테마 구조

### Theme Object (JS)

```js
const themes = {
  minimal: { ... },
  neumorphism: { ... }
}
```

### CSS Variables

```css
:root {
  --color-bg:
  --color-surface:
  --shadow-elevated:
  --radius-md:
}
```

JS → CSS 변수 주입 방식.

---

## 4. MVP 컴포넌트 범위

### 1️⃣ Button

Variants:

* primary
* secondary

States:

* default
* hover
* active

---

### 2️⃣ Card

* surface 표현 핵심
* shadow 차이 명확히

---

### 3️⃣ Input

* focus 스타일
* border vs inset shadow 대비

---

### 4️⃣ Navigation Bar

* 상단 고정
* 테마 토글 버튼 포함

---

## 5. 페이지 구조

Single Page Layout

```
[ Navigation ]
[ Theme Toggle ]
[ Button Section ]
[ Card Section ]
[ Input Section ]
```

---

## 6. 확장 고려사항 (지금 구현 X)

* 다크모드
* 3번째 테마 추가
* 컴포넌트 문서화
* Storybook 연동
* Figma 토큰 연동

---

## 7. 완료 기준 (POC Definition of Done)

* 테마 토글 시 모든 컴포넌트 즉시 변화
* 스타일 하드코딩 없음
* 테마 추가 시 기존 코드 수정 최소
* 최소 1개의 shadow 구조가 완전히 다르게 동작

---

# 지금 당장 할 일

1. 폴더 구조 설계
2. 토큰 초안 작성
3. 테마 2개 초안 작성
4. Button부터 구현

