# 배터리 — 검사 목록 / 상세 (battery)

> `src/features/battery/`
> 관련 API: `GET /battery?page=&size=`, `GET /battery/{batteryCellId}`
> 필터 파라미터는 현재 API_SPEC에 없음 — `page` / `size`만 확정.

## 작업 이력

| 날짜 | 디자인 | 컴포넌트 | 스토어 | 서비스 |
|---|---|---|---|---|
| 2026-07-08 | | | `useBatteryListStore` / `useBatteryDetailStore` 파일 생성 (스캐폴딩 + 목업 연동) | `batteryService` 파일 생성 (스캐폴딩 + 목업 연동) |
| 2026-07-13 | | | API 명세 반영 수정 (`a9b2b1b`) | API 명세 반영 수정 (`a9b2b1b`) |

---

## 브랜치 & 커밋 이력

| 브랜치 | 커밋 | 날짜 | 내용 |
|---|---|---|---|
| `feat/scaffold` | `560fee7` | 2026-07-08 | API 명세 기반 도메인 타입 인터페이스 정의 |
| `feat/scaffold` | `8f09267` | 2026-07-08 | axios 기반 HTTP 클라이언트 및 모듈 확장 타입 추가 |
| `test` | `5848645` | 2026-07-08 | mockup 및 테스트용 BE 서버 생성 |
| `feat/battery` | `09c29f1` | 2026-07-13 | feat: 배터리 목록 페이지 구현 |
| `feat/battery` | `58f8f9d` | 2026-07-13 | feat: 배터리 목록의 아이콘 컴포넌트 분리 |
| `feat/battery` | `4557441` | 2026-07-13 | feat: 배터리 목록에서 REJECT/FAIL에 따른 필터 구현 |
| `feat/battery` | `37838b3` | 2026-07-13 | feat: 배터리 목록 탭 너비 고정 |
| `feat/battery` | `5bfe631` | 2026-07-13 | style: 배터리 목록의 FAIL 옆에 느낌표 표시, 페이지 칸 비율 조정 |
| `feat/battery` | `7c75fa7` | 2026-07-13 | style: 배터리 목록 FAIL 느낌표 노란색, 행 높이 통일 |
| `feat/battery` | `34fcf0d` | 2026-07-13 | style: 배터리 목록 상세 열 버튼 수정 |
| `feat/battery` | `a9b2b1b` | 2026-07-13 | Fix: api 및 문서 수정 |
| `feat/shared-components` | `1f72d12` | 2026-07-14 | feat: 배터리·리포트 목록 공통 컴포넌트 분리 |
| `feat/shared-components` | `1204dd0` | 2026-07-14 | feat: Pagination, DetailLinkButton 공통 컴포넌트 추가 |
| `feat/battery` (PR #22) | `9048e42` | 2026-07-14 | Fix: 디자인 요소 일부 수정 |
| `feat/battery` | `66bd78e` | 2026-07-14 | Feat: api_spec 수정 |
