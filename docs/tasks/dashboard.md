# dashboard

# 대시보드 (dashboard)

> `src/features/dashboard/`
관련 API: `POST /dashboard { todayDate, startDate, size, graphType }`
WS 아님. 진입 시 1회 HTTP 호출.
> 

## 작업 이력

| 날짜 | 디자인 | 컴포넌트 | 스토어 | 서비스 |
| --- | --- | --- | --- | --- |
| 2026-07-08 |  |  | `useDashboardStore` 파일 생성 (스캐폴딩) | `dashboardService` 파일 생성 (스캐폴딩) |
| 2026-07-13 |  |  | API 명세 반영 수정 (`a9b2b1b`) · KPI/ResultSummary 경로 변경 (`08b7339`) | API 명세 반영 수정 (`a9b2b1b`) |

---

## 브랜치 & 커밋 이력

| 브랜치 | 커밋 | 날짜 | 내용 |
| --- | --- | --- | --- |
| `feat/scaffold` | `8f09267` | 2026-07-08 | axios 기반 HTTP 클라이언트 및 모듈 확장 타입 추가 |
| `feat/dashboard` | `9157fb7` | 2026-07-09 | 대시보드 목업 완성 |
| `feat/dashboard` | `b419967` | 2026-07-09 | 대시보드의 Flow 화면 초기 구성 |
| `feat/dashboard` | `0c22f17` | 2026-07-10 | 대시보드에 KpiCards 구현 |
| `feat/dashboard` | `f991a8d` | 2026-07-10 | style: KpiCard 상태 표시등 높이 조절 |
| `feat/dashboard` | `ff647c3` | 2026-07-13 | 대시보드 ‘검사 요약 목록’ 기능 구현 |
| `feat/dashboard` | `82aad45` | 2026-07-13 | 검사 요약 목록에 스크롤, 필터 기능 추가 |
| `feat/dashboard` | `4a294a1` | 2026-07-13 | 검사 요약 목록 날짜 포맷 YYYY-MM-DD HH:mm |
| `feat/dashboard` | `a249b78` | 2026-07-13 | 대시보드 파이 차트 구현 |
| `feat/dashboard` | `a4e3dc1` | 2026-07-13 | 대시보드 일자별 불량률 그래프 추가 |
| `feat/dashboard` | `a9b2b1b` | 2026-07-13 | Fix: api 및 문서 수정 |
| `feat/dashboard` | `08b7339` | 2026-07-13 | chore: KPI 및 ResultSummary 경로 변경/대시보드 수정 |
| `feat/size` | `1090668` | 2026-07-14 | style: 대시보드 그래프-검사요약목록 비율 조절 |
| `feat/size` | `f091b22` | 2026-07-14 | style: 대시보드 파이차트 비율 및 색상 수정 |