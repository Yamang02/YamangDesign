# P04: 프리뷰 컨트롤 패널 UI 교체

## 목표

드롭박스 방식의 프리뷰 컨트롤이 넓은 패널 + radio 버튼 UI로 교체된다.
재사용 가능한 `PreviewControlPanel` 컴포넌트가 LabLayout 레이어에 추가된다.

## 구현 상세

**현재 상태:**
- Palette, Style, Build showcase, ServiceContext Controls에서 `<select>` 드롭박스 사용
- 한 번에 하나의 값만 보이고, 선택지를 훑어보기 어려운 구식 패턴

**접근 방법:**
- `PreviewControlPanel` 컴포넌트 설계 및 구현
  - 옵션 목록을 radio 버튼 그리드로 표시
  - 선택된 항목 시각적 강조
  - 레이블 + 설명 텍스트 지원
  - LabLayout 컴포넌트 레이어에 추가
- P02 LabLayout 툴바와 공간 공유 (Inspector 트리거 버튼과 동일 툴바 영역)
- 드롭박스 완전 제거, 패널로 일원화

**적용 순서:**
1. Palette 컨트롤
2. Style 컨트롤
3. Build showcase 컨트롤
4. ServiceContext Controls 섹션 (P03에서 건드리지 않은 상태)

## 체크리스트

- [x] `PreviewControlPanel` 컴포넌트 구현
- [x] Palette 컨트롤 교체 및 동작 확인
- [x] Style 컨트롤 교체 및 동작 확인
- [x] Build showcase 컨트롤 교체 및 동작 확인 (Atoms, Molecules, Organisms)
- [x] ServiceContext Controls 섹션 교체 및 동작 확인
- [x] 드롭박스(`<select>`) 완전 제거 확인
