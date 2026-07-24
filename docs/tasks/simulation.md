# simulation

# 시뮬레이션 (simulation)

> `src/features/simulation/`
관련 API: `PUT /sim { running }`, WS `/ws/sim`, `GET /sim/status`
WS는 배치 전체 스냅샷을 매번 push (delta 아님).
> 

## 작업 이력

| 날짜 | 디자인 | 컴포넌트 | 스토어 | 서비스 |
| --- | --- | --- | --- | --- |
| 2026-07-09 |  | 대시보드 Flow 화면 초기 구성·시뮬레이션 전신 (`b419967`) |  |  |
| 2026-07-10 |  | FlowStep.tsx 분리 (`7e11a2e`) |  |  |
| 2026-07-13 |  | 시뮬레이션 애니메이션 (`341db7f`) · 애니메이션 및 데이터 렌더링 (`d5259db`) | `useSimulationStore` 생성 + 애니메이션 연동 상태 확장 (`a9b2b1b` · `5972da9`) | `simulationService` 생성 (`a9b2b1b`) · `simulationSocketService` WS 싱글턴 + 지수 백오프 구현 (`a9b2b1b` · `5972da9`) |
| 2026-07-14 | 디자인 변경 (`aff3791`) | 팔로우 라인 제거 (`c0eb12b`) · 모달 설정 생성 (`9dd9495`) · 셀 클릭 이벤츠 추가 (`15df162`) |  |  |
| 2026-07-15 | 디자인 수정 (`8950fad`) · 디자인 전략 수립 및 적용 (`737a596`) · 인라인 스타일 제거 (`d0a9473`) |  |  |  |
| 2026-07-16 | 디자인 정책 수립 (`86fa158`) |  |  |  |
| 2026-07-22 |  | 배치단위 → 셀단위 버그 수정 (`5a9fd9d`) |  |  |

---

## 브랜치 & 커밋 이력

| 브랜치 | 커밋 | 날짜 | 내용 |
| --- | --- | --- | --- |
| `test` | `5848645` | 2026-07-08 | mockup 및 테스트용 BE 서버 생성 |
| `test` | `79d7ba4` | 2026-07-09 | Feat: WS 설정 및 싱글턴 구현 |
| `feat/dashboard` | `b419967` | 2026-07-09 | 대시보드의 Flow 화면 초기 구성 (시뮬레이션 전신) |
| `feat/dashboard` | `7e11a2e` | 2026-07-10 | FlowStep.tsx 분리 및 Flow.tsx에서 제거 |
| `feat/dashboard` | `5ec7ab8` | 2026-07-10 | chore: flow → simulation 명칭 정정 |
| `feat/dashboard` | `a9b2b1b` | 2026-07-13 | Fix: api 및 문서 수정 |
| `feat/sim` | `341db7f` | 2026-07-13 | Feat: 시뮬레이션 에니메이션 |
| `feat/sim` | `5972da9` | 2026-07-13 | Feat: 에니메이션 |
| `feat/sim` | `d5259db` | 2026-07-13 | Feat: 애니메이션 및 데이터 렌더링 |
| `feat/sim` | `aff3791` | 2026-07-14 | feat: 디자인 변경 |
| `feat/sim` | `c0eb12b` | 2026-07-14 | Feat: 팔로우 라인 제거 |
| `feat/modal` | `9dd9495` | 2026-07-14 | Feat: 모달 설정 생성 |
| `feat/modal` | `15df162` | 2026-07-14 | feat: 셀 클릭 이벤츠 추가 |
| `feat/sim` | `8950fad` | 2026-07-15 | Feat: 디자인 수정 |
| `design` | `737a596` | 2026-07-15 | chore: 디자인 전략 수립 및 적용 |
| `develop` | `d0a9473` | 2026-07-15 | fix: 인라인 스타일 제거 |
| `develop` | `86fa158` | 2026-07-16 | Feat: 디자인 정책 수립 |
| `feat/simulation` (PR #26) | `5a9fd9d` | 2026-07-22 | fix: 시뮬레이션 배치단위 → 셀단위 |