# Art Page Design Prompt Template

YamangDesign Art Reference Gallery에 새 작품 페이지를 추가할 때 사용하는 분석 프레임워크.
brainstorming 단계에서 디자인 사조를 분석하고 토큰을 추출하는 데 활용한다.

---

## 입력 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `{디자인_사조}` | 이 작품에 적용할 UI 스타일 | 글라스모피즘, 미니멀리즘, 브루탈리즘 |
| `{작품_이미지_URL}` | 원화 이미지 URL | https://... |
| `{작품_정보}` | 제목 / 작가 / 연도 / 기법 | Water Lilies / Monet / 1914–18 / Oil on Canvas |
| `{인용구}` | 작가 또는 작품 관련 인용구 | "I perhaps owe..." |

---

## Step 1 — 디자인 사조 분석

`{디자인_사조}`의 핵심 특성을 아래 항목으로 정리한다:

- **시각적 철학**: 이 사조가 추구하는 미학적 핵심 (1~2줄)
- **물리 법칙**: 빛, 레이어, 질감, 깊이감이 어떻게 표현되는가
- **CSS 핵심 속성**: 이 사조를 구현하는 핵심 CSS 기법
- **Do / Don't**: 이 사조에서 해야 할 것과 하지 말아야 할 것

**글라스모피즘 예시:**
```
철학: 유리 너머로 보이는 레이어드 공간감
물리: 빛 굴절(blur), 반투명 표면, Z축 위계
CSS: backdrop-filter: blur(), rgba() 배경, border: rgba(white, 0.2)
Do: 배경 위에 레이어링, 미세한 테두리
Don't: 불투명 배경, 강한 drop shadow
```

---

## Step 2 — 색상 팔레트 추출

`{작품_이미지_URL}`에서 대표 색상 6~8개를 추출하고 DS 시맨틱 역할에 매핑한다.

```ts
const {작품명}_PALETTE = [
  { name: '{색상명}', hex: '#??????', role: 'Primary' },
  { name: '{색상명}', hex: '#??????', role: 'Secondary' },
  { name: '{색상명}', hex: '#??????', role: 'Accent' },
  { name: '{색상명}', hex: '#??????', role: 'Sub' },
  { name: '{색상명}', hex: '#??????', role: 'Surface' },
  { name: '{색상명}', hex: '#??????', role: 'Info' },
  { name: '{색상명}', hex: '#??????', role: 'Deep' },
  { name: '{색상명}', hex: '#??????', role: 'Muted' },
];
```

**WCAG 검증**: Surface 색상이 배경 위에서 텍스트 가독성(AA 기준 4.5:1) 확보하는지 확인.

---

## Step 3 — 챕터별 컴포넌트 매핑

### Chapter 1 — The Painting (원화 직접 참조)

| 컴포넌트 | 역할 | 스타일 적용 |
|----------|------|-------------|
| `HeroStage` | 이미지 컨테이너 (65vh, border-radius) | — |
| `MuseumLabel` | 우측 상단 텍스트 라벨 | 텍스트 전용, 배경 없음 |
| `PaletteSwatchBar` | 좌하단 색상 스와치 | `{디자인_사조}` glass 스타일 |

### Chapter 2 — The Impression (심상 차용)

| 컴포넌트 | 역할 | 구현 방식 |
|----------|------|-----------|
| `{작품명}Background` | 배경 색감 재현 | CSS radial-gradient 애니메이션 |
| `{인터랙션}Canvas` | 마우스 인터랙션 | Canvas API 또는 CSS |
| `{작품명}Quote` | 인용구 glass 카드 | `{디자인_사조}` 스타일 카드 |

**배경 색상 가이드**: PALETTE에서 3~4색을 `rgba(r,g,b, 0.3~0.5)` 투명도로 사용.

### Chapter 3 — The Application (DS 컴포넌트 적용)

| 블록 | 컴포넌트 | 팔레트 역할 |
|------|----------|-------------|
| Color Tokens | 칩 그리드 | 8색 전체 |
| Buttons | Primary / Secondary / Accent / Ghost | Primary, Secondary, Accent |
| Typography | Display / Body / Caption | Surface, Sub, Accent |
| Art Card | 이미지 + 메타 카드 | Info border, Sub badge |

---

## Step 4 — WCAG 체크

- [ ] Glass 패널 텍스트가 이미지 배경 위에서 충분히 읽히는가 (최소 text-shadow 보조)
- [ ] Button 텍스트와 배경 대비 4.5:1 이상
- [ ] Chapter 2 glass 카드 내부 텍스트 가독성 확보
- [ ] 모바일(375px) 뷰포트에서 레이아웃 깨짐 없음

---

## MuseumLabel 텍스트 템플릿

```
{작품 제목 full name}
{부제 또는 section (있을 경우)}
──
{작가명}
{기법}, {연도}
```

소장처는 포함하지 않는다.

---

## 인용구 선정 기준

- 작가 본인의 말 우선
- 작품의 핵심 감성을 1문장으로 담을 것
- 영문 원문 사용 (번역 불필요)
- 10~20 단어 내외 (word-by-word 애니메이션 고려)
