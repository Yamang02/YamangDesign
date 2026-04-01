# Epic E24: Mondrian Composition — Minimalism

## 목표

몬드리안의 "Composition with Large Blue Plane, Red, Black, Yellow, and Gray (1921)"를 Art Reference Gallery에 추가한다.
디자인 사조는 **Minimalism (muted)** — De Stijl의 격자 구조와 색면 대비를 차분하게 재해석한다.
이미지: https://mdl.artvee.com/sftb/913118ab.jpg

## 배경 / 맥락

E22 (모네 / 글라스모피즘), E23 (마티스 / 브루탈리즘)에 이어 세 번째 Art Reference Gallery 작품.
각 작품은 서로 다른 디자인 사조를 탐구하며, 이번은 미니멀리즘 — 여백, 격자, 색면의 절제된 대비.

## 특이점

- **팔레트**: 몬드리안 원색(파/빨/노)을 20~30% 채도 낮춤. 색 정체성은 유지하되 차분하게.
- **Ch.2 인터랙션**: CSS Grid div 기반 N×M 셀. 마우스가 지나간 셀에 muted 색 채워짐 + transition 0.3s. Canvas API 미사용 (모네 RippleCanvas와 차별화).
- **variant="minimal"**: `ArtHeroStage`, `ArtApplicationSection`에 minimal variant 추가 필요 여부는 P02/P04에서 판단.
- **인용구**: "The position of the artist is humble. He is essentially a channel." — Piet Mondrian

## Phase 목록

- [P01: 라우팅 + 폴더 구조](./P01.routing-scaffold.md)
- [P02: Ch.1 — The Painting](./P02.chapter1-painting.md)
- [P03: Ch.2 — The Impression](./P03.chapter2-impression.md)
- [P04: Ch.3 — The Application + 검증](./P04.chapter3-application.md)

## 상태

- [x] P01 완료
- [x] P02 완료
- [x] P03 완료
- [x] P04 완료

## 완료
아카이브일: 2026-04-01
