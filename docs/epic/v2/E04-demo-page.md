# E04: 데모 사이트 페이지

## 목적

컴포넌트를 단순 나열하는 Exhibition이 아닌,
실제 웹사이트처럼 자연스럽게 통합된 데모 페이지.

---

## 현재 상태

**Exhibition 페이지:**
- 컴포넌트별 섹션 분리
- "여기 버튼들, 여기 카드들, 여기 인풋들" 형식
- 쇼케이스 목적

**필요:**
- 실제 사이트처럼 보이는 페이지
- 모든 컴포넌트가 자연스럽게 어우러짐
- 테마 변경 시 전체 사이트 느낌 변화 체험

---

## 목표 상태

**SaaS 랜딩 페이지 스타일 데모:**

```
┌─────────────────────────────────────────┐
│ [Nav] Logo    Features Pricing  [Theme] │
├─────────────────────────────────────────┤
│                                         │
│         Build Something Amazing         │
│     The design system for modern apps   │
│                                         │
│      [Get Started]  [Learn More]        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────┐  ┌─────┐  ┌─────┐            │
│   │ 🚀  │  │ 🎨  │  │ ⚡  │            │
│   │Fast │  │Themed│ │Simple│           │
│   │     │  │     │  │     │            │
│   └─────┘  └─────┘  └─────┘            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│   │  Free   │ │  Pro    │ │Enterprise│ │
│   │  $0/mo  │ │ $29/mo  │ │  Custom  │  │
│   │ [Start] │ │ [Start] │ │ [Contact]│  │
│   └─────────┘ └─────────┘ └─────────┘  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   "This changed our workflow..."        │
│   - Customer Name, Company              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   Get in Touch                          │
│   [Name         ]                       │
│   [Email        ]                       │
│   [Message               ]              │
│   [Send Message]                        │
│                                         │
├─────────────────────────────────────────┤
│   © 2024 YamangDesign   Terms  Privacy  │
└─────────────────────────────────────────┘
```

---

## 태스크

### T04-1: 페이지 구조 설계

**파일 구조:**
```
src/pages/Demo/
├── Demo.tsx              # 메인 페이지
├── Demo.styles.ts
├── sections/
│   ├── HeroSection.tsx
│   ├── HeroSection.styles.ts
│   ├── FeaturesSection.tsx
│   ├── FeaturesSection.styles.ts
│   ├── PricingSection.tsx
│   ├── PricingSection.styles.ts
│   ├── TestimonialsSection.tsx
│   ├── TestimonialsSection.styles.ts
│   ├── ContactSection.tsx
│   ├── ContactSection.styles.ts
│   └── FooterSection.tsx
└── index.ts
```

---

### T04-2: HeroSection

**사용 컴포넌트:**
- Typography (텍스트)
- Button (primary, secondary variants)

**구현:**
```tsx
<section style={styles.hero}>
  <h1>Build Something Amazing</h1>
  <p>The design system for modern applications</p>
  <div>
    <Button variant="primary" size="lg">Get Started</Button>
    <Button variant="outline" size="lg">Learn More</Button>
  </div>
</section>
```

---

### T04-3: FeaturesSection

**사용 컴포넌트:**
- Card (elevated variant)
- Icon

**구현:**
```tsx
<section>
  <h2>Features</h2>
  <div style={styles.grid}>
    <Card variant="elevated">
      <Card.Body>
        <Icon name="speed" size="lg" />
        <h3>Lightning Fast</h3>
        <p>Optimized for performance...</p>
      </Card.Body>
    </Card>
    {/* 3개 더 */}
  </div>
</section>
```

**Feature 목록:**
| 아이콘 | 제목 | 설명 |
|--------|------|------|
| speed | Lightning Fast | Built for performance |
| palette | Themeable | Switch themes instantly |
| code | Developer First | TypeScript native |
| devices | Responsive | Works everywhere |

---

### T04-4: PricingSection

**사용 컴포넌트:**
- Card (outlined, elevated variants)
- Button

**구현:**
```tsx
<section>
  <h2>Pricing</h2>
  <div style={styles.pricingGrid}>
    <Card variant="outlined">
      <Card.Header>Free</Card.Header>
      <Card.Body>
        <span style={styles.price}>$0</span>/month
        <ul>
          <li>5 projects</li>
          <li>Basic themes</li>
        </ul>
      </Card.Body>
      <Card.Footer>
        <Button variant="outline" fullWidth>Get Started</Button>
      </Card.Footer>
    </Card>

    <Card variant="elevated">  {/* 추천 플랜 강조 */}
      <Card.Header>Pro</Card.Header>
      ...
      <Button variant="primary" fullWidth>Upgrade</Button>
    </Card>

    <Card variant="outlined">
      <Card.Header>Enterprise</Card.Header>
      ...
    </Card>
  </div>
</section>
```

---

### T04-5: TestimonialsSection

**사용 컴포넌트:**
- Card (flat variant)

**구현:**
```tsx
<section>
  <h2>What People Say</h2>
  <div style={styles.testimonialGrid}>
    <Card variant="flat">
      <Card.Body>
        <p>"This design system transformed our workflow..."</p>
        <footer>
          <strong>Jane Doe</strong>
          <span>CEO, TechCorp</span>
        </footer>
      </Card.Body>
    </Card>
    {/* 2-3개 더 */}
  </div>
</section>
```

---

### T04-6: ContactSection

**사용 컴포넌트:**
- Input (name, email, textarea)
- Button

**구현:**
```tsx
<section>
  <h2>Get in Touch</h2>
  <Card variant="elevated">
    <Card.Body>
      <Input label="Name" placeholder="Your name" />
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input
        label="Message"
        as="textarea"  // 또는 별도 Textarea 컴포넌트
        placeholder="How can we help?"
      />
      <Button variant="primary" fullWidth>Send Message</Button>
    </Card.Body>
  </Card>
</section>
```

---

### T04-7: FooterSection

**구현:**
```tsx
<footer style={styles.footer}>
  <div>
    <span>© 2024 YamangDesign</span>
  </div>
  <nav>
    <a href="#">Terms</a>
    <a href="#">Privacy</a>
    <a href="#">GitHub</a>
  </nav>
</footer>
```

---

### T04-8: 페이지 네비게이션 추가

**App.tsx 수정:**
```tsx
const [page, setPage] = useState<'exhibition' | 'demo'>('demo');

<Navigation
  rightContent={
    <>
      <Button
        variant={page === 'demo' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('demo')}
      >
        Demo
      </Button>
      <Button
        variant={page === 'exhibition' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setPage('exhibition')}
      >
        Components
      </Button>
    </>
  }
/>

{page === 'demo' ? <Demo /> : <Exhibition />}
```

---

### T04-9: 반응형 레이아웃

**Breakpoints (권장):**
```typescript
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};
```

**적용:**
- Hero: 모바일에서 버튼 수직 정렬
- Features: 2열 → 1열
- Pricing: 3열 → 1열
- Contact: 폼 너비 조정

---

## 완료 기준

- [ ] Hero 섹션 완성 (타이틀 + CTA 버튼)
- [ ] Features 섹션 완성 (4개 카드 + 아이콘)
- [ ] Pricing 섹션 완성 (3개 플랜 카드)
- [ ] Testimonials 섹션 완성 (2-3개 후기)
- [ ] Contact 섹션 완성 (폼 + 버튼)
- [ ] Footer 완성
- [ ] Exhibition ↔ Demo 페이지 전환
- [ ] 테마 변경 시 전체 데모 페이지 스타일 변경 확인
- [ ] 모바일 반응형 기본 대응

---

## 예상 파일 변경

| 파일 | 변경 |
|------|------|
| `src/pages/Demo/*` | 신규 |
| `src/App.tsx` | 수정 (페이지 전환) |
| `src/components/Navigation/Navigation.tsx` | 수정 (페이지 네비게이션) |

---

## 의존성

- **E01 (Select)**: 테마 드롭다운이 Navigation에 있어야 함
- **E02 (Icon)**: Features 섹션에 아이콘 필요
