# reports

# 리포트 (reports)

> `src/features/reports/`
관련 API: `POST /report/individual`, `POST /report/daily`, `GET /report/individual/{id}`, `GET /report/daily/{id}report.ready` WS 이벤트 미확정 → 자동 갱신 없음. 생성 후 수동 `fetchDetail()` 재호출 필요.
> 

## 작업 이력

| 날짜 | 디자인 | 컴포넌트 | 스토어 | 서비스 |
| --- | --- | --- | --- | --- |
| 2026-07-08 |  |  | `useIndividualReportListStore` / `useIndividualReportDetailStore` / `useDailyReportListStore` / `useDailyReportDetailStore` 파일 생성 (스캐폴딩 + 목업 연동) | `individualReportService` / `dailyReportService` 파일 생성 (스캐폴딩 + 목업 연동) |
| 2026-07-13 |  | 일일 리포트/개별 리포트 버튼 구현 (`99f63c9`) · 일일 리포트 목록 페이지네이션 적용 (`b1b8589`) · 개별 리포트 목록 구현 (`ac5bf70`) | API 명세 반영 수정 (`a9b2b1b`) | API 명세 반영 수정 (`a9b2b1b`) |
| 2026-07-14 | 일일-개별 리스트 공통 CSS 분리 (`5dc40f1`) | 배터리·리포트 목록 공통 컴포넌트 분리 (`1f72d12`) · Pagination/DetailLinkButton 공통 컴포넌트 추가 (`1204dd0`) |  |  |
| 2026-07-15 | 디자인 요소 수정 (`33b63ad`) |  |  |  |
| 2026-07-16 | 리포트 목록 테이블 열 너비 맞춤 (`4003bcd`) · 열 너비 (`1ea5da4`) |  |  |  |
| 2026-07-20 |  | 일일 리포트 조회 페이지 구현 (`f795e31`) |  |  |
| 2026-07-21 | 일일 리포트 조회 피그마 배치 (`81fcfaa`) · 파이 차트 위치 조정 (`93b84f5`) | 미구현 기능 제거 (`1f748c9`) · 일일 리포트 컴포넌트 분리 (`ec5b389`) · 개별 리포트 조회 화면 생성 (`ef2f645`) |  |  |
| 2026-07-22 | 개별 리포트 조회 박스 배치 (`c4b31a1`) · 목록 테이블 판정일자 열 이동 (`01953fa`) |  |  |  |

---

## 브랜치 & 커밋 이력

| 브랜치 | 커밋 | 날짜 | 내용 |
| --- | --- | --- | --- |
| `feat/scaffold` | `8f09267` | 2026-07-08 | axios 기반 HTTP 클라이언트 및 모듈 확장 타입 추가 |
| `test` | `5848645` | 2026-07-08 | mockup 및 테스트용 BE 서버 생성 |
| `feat/report` | `99f63c9` | 2026-07-13 | feat: 일일 리포트/개별 리포트 버튼 구현 |
| `feat/report` | `b1b8589` | 2026-07-13 | feat: 일일 리포트 목록에 페이지네이션 적용 |
| `feat/report` | `ac5bf70` | 2026-07-13 | feat: 개별 리포트 목록 구현 |
| `feat/report` | `a9b2b1b` | 2026-07-13 | Fix: api 및 문서 수정 |
| `feat/shared-components` | `1f72d12` | 2026-07-14 | feat: 배터리·리포트 목록 공통 컴포넌트 분리 |
| `feat/shared-components` | `1204dd0` | 2026-07-14 | feat: Pagination, DetailLinkButton 공통 컴포넌트 추가 |
| `feat/report` | `5dc40f1` | 2026-07-14 | feat: 일일-개별 리스트간 공통 CSS를 ReportTable.css로 분리 |
| `feat/report` (PR #23) | `33b63ad` | 2026-07-15 | Fix: 디자인 요소 |
| `fix/sidebar-report-active` | `8320f6c` | 2026-07-15 | fix: 리포트 목록 하위 경로에서도 사이드바 탭 active 처리 |
| `feat/report` | `4003bcd` | 2026-07-16 | style: 리포트 목록 테이블 열 너비 맞춤 |
| `feat/report` | `1ea5da4` | 2026-07-16 | style: 열 너비 |
| `feat/report` | `f795e31` | 2026-07-20 | feat: 일일 리포트 조회 페이지 구현 |
| `feat/report` | `1f748c9` | 2026-07-21 | feat: mock에는 아직 없는 기능(회색 박스) 제거 |
| `feat/report` | `81fcfaa` | 2026-07-21 | style: 일일 리포트 조회 페이지를 figma 구성안에 맞게끔 박스 배치 |
| `feat/report` | `93b84f5` | 2026-07-21 | style: 일일 리포트 조회 페이지 파이 차트 위치 조정 |
| `feat/report` | `ec5b389` | 2026-07-21 | feat: 일일 리포트 조회 페이지의 컴포넌트 분리 |
| `feat/report` | `ef2f645` | 2026-07-21 | feat: 개별 리포트 조회 화면 생성 |
| `feat/report` (PR #27) | `c4b31a1` | 2026-07-22 | style: 개별 리포트 조회 페이지에 요소들을 박스 형태로 배치 |
| `feat/report` | `01953fa` | 2026-07-22 | style: 리포트 목록 테이블의 '판정일자' 열 이동 |