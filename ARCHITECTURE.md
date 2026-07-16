# Architecture

## 기술 스택
- React 19 + TypeScript + React Compiler
- Vite (번들러)
- Bun (패키지 매니저)
- Zustand (상태관리)

## 폴더 구조
src/
├── features/
│     ├── header/
│     │     ├── components/
│     │     └── hooks/
│     ├── auth/
│     │     ├── components/
│     │     ├── hooks/
│     │     ├── types/
│     │     ├── store/
│     │     ├── services/
│     │     └── index.ts
│     ├── battery/
│     │     ├── components/
│     │     ├── hooks/
│     │     ├── types/
│     │     ├── store/
│     │     ├── services/
│     │     └── index.ts
│     ├── dashboard/
│     │     ├── components/
│     │     ├── hooks/
│     │     ├── types/
│     │     ├── store/
│     │     ├── services/
│     │     └── index.ts
│     ├── simulation/
│     │     ├── components/
│     │     ├── hooks/
│     │     ├── types/
│     │     ├── store/
│     │     ├── services/
│     │     └── index.ts
│     └── reports/
│           ├── components/
│           ├── hooks/
│           ├── types/
│           ├── store/
│           ├── services/
│           └── index.ts
├── pages/
│     ├── LoginPage.tsx
│     ├── SignupPage.tsx
│     ├── DashboardPage.tsx
│     ├── BatteryPage.tsx
│     ├── BatteryDetailPage.tsx
│     ├── IndividualReportPage.tsx
│     ├── IndividualReportDetailPage.tsx
│     ├── DailyReportPage.tsx
│     └── DailyReportDetailPage.tsx
├── core/
│     ├── api/
│     │     ├── httpClient.ts
│     │     ├── socketClient.ts
│     │     └── axios.d.ts
│     ├── auth/          ← 현재 빈 폴더 (gitkeep만 존재)
│     └── navigation/
│           ├── router.tsx
│           ├── PrivateRoute.tsx
│           ├── RootLayout.tsx
│           ├── routes.ts
│           ├── useLogout.ts
│           └── index.ts
└── shared/
    ├── ui/
    ├── hooks/
    ├── utils/
    └── types/
          ├── api.ts
          └── store.ts

## 폴더 역할

### features/
비즈니스 도메인별 코드 모음. 각 feature는 독립적으로 동작.

| 폴더 | 역할 |
|---|---|
| `components/` | 해당 도메인 전용 UI 컴포넌트 |
| `hooks/` | 해당 도메인 전용 커스텀 훅 |
| `types/` | 해당 도메인 TypeScript 타입/인터페이스 |
| `store/` | Zustand 스토어 (state + actions) |
| `services/` | 실제 API 호출 함수 (httpClient / socketClient 사용) |
| `index.ts` | public API 진입점 (외부 노출 항목만 export) |

### pages/
라우트와 1:1 대응하는 페이지 컴포넌트. features를 조합해서 화면을 구성.

| 파일 | 역할 | 라우트 |
|---|---|---|
| `LoginPage.tsx` | 로그인 화면 | `/auth/login` |
| `SignupPage.tsx` | 회원가입 화면 | `/auth/signup` |
| `DashboardPage.tsx` | 메인 대시보드 — `dashboard`(KPI) + `simulation`(실시간 진행) feature 조합 | `/dashboard` |
| `BatteryPage.tsx` | 배터리 목록 화면 | `/battery` |
| `BatteryDetailPage.tsx` | 배터리 상세 화면 | `/battery/:batteryCellId` |
| `IndividualReportPage.tsx` | 개별 리포트 목록 화면 | `/reports/individual` |
| `IndividualReportDetailPage.tsx` | 개별 리포트 상세 화면 | `/reports/individual/:reportId` |
| `DailyReportPage.tsx` | 일일 리포트 목록 화면 | `/reports/daily` |
| `DailyReportDetailPage.tsx` | 일일 리포트 상세 화면 | `/reports/daily/:reportId` |

### core/
앱 전반의 인프라 레이어.

| 폴더/파일 | 역할 |
|---|---|
| `api/httpClient.ts` | axios 인스턴스 + 인터셉터 (비즈니스 로직 없음) |
| `api/socketClient.ts` | WebSocket 팩토리 — `createSocket(path)` 하나만 노출 |
| `api/axios.d.ts` | axios 반환 타입 재정의 (`Promise<AxiosResponse<T>>` → `Promise<T>`) |
| `auth/` | 현재 빈 폴더. 쿠키 방식이므로 토큰 저장 코드가 필요 없다 |
| `navigation/` | Router, PrivateRoute, RootLayout, routes 상수, useLogout 훅 |

### auth — 인증 상태는 어디에 있는가
인증은 httpOnly 쿠키 기반이다 — `POST /auth/login` 응답 바디에는 토큰이 없고 `{ name, role }`만 오며, 실제 세션은 백엔드가 내려주는 `Set-Cookie`로 유지된다. 그래서 FE는 토큰을 직접 저장·조회할 코드가 필요 없다: `httpClient`가 `withCredentials: true`로 모든 요청에 쿠키를 자동 첨부하고, 로그인 성공 여부는 `features/auth/store/useLoginStore`의 `isAuthenticated` 플래그 하나로만 추적한다. `PrivateRoute`도 이 플래그만 보고 접근을 제어한다.

- `core/auth/`는 현재 빈 폴더다 — 쿠키 방식이라 토큰을 앱 코드가 직접 다룰 필요가 없어서 채워지지 않았다.
- **알려진 한계**: `isAuthenticated`는 zustand 메모리 상태라 새로고침하면 초기화된다 — 쿠키 자체는 유효해도 `PrivateRoute`가 로그인 페이지로 돌려보낸다. 새로고침 시 서버에 인증 여부를 다시 확인하는 세션 복구 로직은 아직 없다.

### core/api/httpClient.ts — HTTP 클라이언트
- response interceptor에서 `response.data`를 반환해 `AxiosResponse` 래핑을 제거하고, 백엔드 응답 스펙(`ApiResponse<T>`)만 남긴다.
- axios의 기본 타입 정의는 이 인터셉터 동작을 알지 못해 여전히 `Promise<AxiosResponse<T>>`를 반환한다고 추론하므로, `core/api/axios.d.ts`에서 모듈 확장(`declare module 'axios'`)으로 `get/post/put/patch/delete`의 반환 타입을 `Promise<T>`로 재정의한다.
- 서비스 함수는 `httpClient.get<ApiResponse<T>>(url)`처럼 호출하고, 응답은 `res.data`(백엔드가 내려주는 실제 `data` 필드)로 한 번만 접근한다 — `res.data.data`가 아니다.

### core/api/socketClient.ts — WebSocket 클라이언트
- `createSocket(path)`가 현재 origin 기준으로 `ws://`/`wss://` URL을 조립해 `new WebSocket(...)`을 반환하는 순수 팩토리. httpClient와 동일하게 비즈니스 로직(재연결, 메세지 파싱 등)은 갖지 않는다 — 그건 각 feature의 `services/*SocketService.ts` 몫이다.

### shared/types/ — 공통 타입
실제로 구현된 공통 타입이 `shared/types/`에 있다.

| 파일 | 주요 타입 |
|---|---|
| `api.ts` | `ApiResponse<T>`, `Pageable`, `PageResponse<T>`, `ListResponse<T>`, `normalizeListResponse()` |
| `store.ts` | `AsyncState` (`isLoading`, `error`) |

`ListResponse<T>`는 페이지네이션이 있는 `PageResponse<T>`와 배열만 오는 응답을 모두 포괄한다. `normalizeListResponse()`로 두 형태를 `{ content, pageable }` 단일 구조로 정규화한다.

### shared/
2개 이상 feature에서 실제로 쓰이는 공통 코드만.

| 폴더 | 역할 |
|---|---|
| `ui/` | 순수 재사용 UI 컴포넌트 (Button, Modal 등) |
| `hooks/` | 크로스 피처 훅 (useDebounce, useMediaQuery 등) |
| `utils/` | 순수 유틸 함수 (formatDate, cn 등) |
| `types/` | 공통 TypeScript 타입 (`api.ts`, `store.ts`) |

## 아키텍처 원칙

### 의존성 방향
shared/ → features/ → pages/
(단방향, 역방향 금지)

### features 간 규칙
- features 간 직접 import 금지
- 두 feature가 같은 코드를 필요로 하면 shared/로 이동
- 각 feature는 index.ts로만 외부에 노출
- pages/에서 여러 feature를 조합해서 화면 구성

### Zustand 스토어 방침

**스토어는 도메인이 아니라 라우트 단위로 분리한다.** 하나의 feature라도 목록/상세처럼 서로 다른 라우트에 대응하면 스토어를 나눈다.

- **왜 라우트 단위인가**: 같은 시점에 함께 화면에 존재하지 않고, 갱신 시점도 서로 다른 데이터를 하나의 스토어에 묶으면(예: 배터리 목록 + 배터리 상세) 관심사가 섞여 `reset()` 하나가 서로 무관한 두 화면의 데이터를 동시에 지우는 등 모호함이 생긴다. 라우트별로 나누면 각 스토어의 생명주기가 그 라우트의 생명주기와 정확히 일치한다.
- 목록 페이지 → `use<Domain>ListStore` (list, pageable, isLoading, error)
- 상세 페이지 → `use<Domain>DetailStore` (detail, isLoading, error)
- 라우트가 하나뿐인 도메인(예: 대시보드)은 굳이 나누지 않는다
- 같은 라우트라도 서로 다른 feature가 갱신 시점이 다른 데이터를 다루면(예: HTTP로 받는 KPI vs. WS로 실시간 push되는 진행 상황) 각 feature가 자기 스토어를 따로 갖는다 — "라우트 단위"는 "한 라우트 = 스토어 하나"가 아니라 "갱신 시점이 다른 데이터를 한 스토어에 섞지 않는다"는 뜻이다 (예: `/dashboard` 라우트의 `useDashboardStore` + `useSimulationStore`)
- 생성(create) 액션처럼 트리거 위치와 데이터 소속 도메인이 다를 수 있는 경우, **데이터가 최종적으로 표시되는 라우트의 스토어**에 둔다 (예: 개별 리포트 생성 버튼은 배터리 상세 페이지에 있지만, 생성된 리포트를 보여주는 곳은 리포트 상세 페이지이므로 `useIndividualReportDetailStore`에 위치)
- state와 actions를 분리해 actions는 객체로 묶어 관리
- 컴포넌트에서는 셀렉터로 필요한 값만 구독 (불필요한 리렌더링 방지)
- Auth는 토큰을 앱이 직접 저장하지 않으므로(§auth — 인증 상태는 어디에 있는가) 전역 인증 스토어가 따로 없다 — 로그인/회원가입 모두 `features/auth/store/`에 라우트별로 분리(`useLoginStore`, `useSignupStore`)

**현재 라우트별 스토어 목록**

| 라우트 | 스토어 | 주요 state |
|---|---|---|
| 배터리 목록 | `useBatteryListStore` | `list: BatteryListItem[]`, `pageable` |
| 배터리 상세 | `useBatteryDetailStore` | `detail: BatteryDetail \| null` |
| 개별 리포트 목록 | `useIndividualReportListStore` | `list: IndividualReportListItem[]`, `pageable` |
| 개별 리포트 상세 | `useIndividualReportDetailStore` | `detail: IndividualReportDetail \| null` (리포트 생성 액션 포함) |
| 일일 리포트 목록 | `useDailyReportListStore` | `list: DailyReportListItem[]`, `pageable` |
| 일일 리포트 상세 | `useDailyReportDetailStore` | `detail: DailyReportDetail \| null` (리포트 생성 액션 포함) |
| 로그인 | `useLoginStore` | `name`, `role`, `isAuthenticated` |
| 회원가입 | `useSignupStore` | — |
| 대시보드 (KPI, HTTP) | `useDashboardStore` | `kpiData`, `summaryData`, `graphData` |
| 대시보드 — 실시간 시뮬레이션 (WS) | `useSimulationStore` | `registered[]`, `capture`, `analyze`, `completed[]`, `wsStatus`, `simulationStatus` |

```typescript
// store 작성 예시 — 라우트(목록) 단위 스토어
const useBatteryListStore = create<BatteryListState & BatteryListActions>((set) => ({
  // state
  list: [],
  pageable: null,
  isLoading: false,
  error: null,

  // actions — 객체로 분리
  actions: {
    fetchList: async (page, size) => {
      set({ isLoading: true, error: null })
      const res = await batteryService.getBatteryList({ page, size })
      const { content, pageable } = normalizeListResponse(res.data)
      set({ list: content, pageable, isLoading: false })
    },
    reset: () => set(initialState),
  },
}))

// 사용 예시
const list = useBatteryListStore((state) => state.list)              // state만
const { fetchList } = useBatteryListStore((state) => state.actions)  // action만
```

### WebSocket 연결 정책

**소켓은 feature의 `services/*SocketService.ts`에 모듈 싱글턴으로 둔다.** React 컴포넌트/훅이 소켓을 직접 소유하지 않는다 — 훅은 `start*Socket({ onMessage, onStatusChange })`처럼 콜백만 등록하고, 연결·재연결·핸들러 배선은 전부 서비스가 캡슐화한다. 컴포넌트가 언마운트돼도 연결은 끊지 않는다(재마운트 시 기존 연결을 그대로 재사용) — 명시적 종료(로그아웃 등)만 별도 `disconnect*Socket()`으로 트리거한다.

- **연결 상태와 도메인 상태를 분리한다.** 소켓이 열려 있다는 것(`WsStatus`: `idle`/`connecting`/`reconnecting`/`open`/`closed`)과, 그 소켓으로 진행 중인 도메인 작업이 끝났는지(예: `SimulationRunStatus`: `idle`/`running`/`completed`)는 서로 다른 축이다. 하나의 상태값으로 합치면 "연결은 살아있는데 작업은 끝남" 같은 조합을 표현할 수 없다.
- **재연결은 지수 백오프로 한다.** 기본 지연 1초, 실패할 때마다 2배씩 증가, 상한 30초, 지연값의 20% 이내 jitter 추가. 연결 성공(`onopen`) 시 백오프 카운터를 리셋한다. 도메인 작업이 끝나도(예: `COMPLETED`) 소켓은 끊지 않는다 — 다음 배치/세션을 위해 채널을 상시 유지한다.
- **세대(generation) 가드를 둔다.** 재연결 과정에서 옛 소켓의 이벤트 핸들러가 뒤늦게 발화해 새 소켓 상태를 덮어쓰는 레이스가 있다. 각 핸들러 안에서 `socket === ws` (모듈 전역 변수와 클로저가 캡처한 참조를 비교)로 자신이 현재 소켓인지 확인하고, 아니면 무시한다.
- **메세지 종류는 봉투(envelope) 필드로 나눈다.** 한 채널에 여러 종류의 메세지가 올 수 있으면(예: 진행 스냅샷 vs. 종료 알림), `event` 필드값으로 명시적으로 분기한다. 필드 존재 여부·형태로 추측하는 것은 백엔드 계약이 없을 때만 쓰는 임시방편이다.
- **서버가 보낸 값은 그대로 신뢰한다.** 배열 길이 제한 등 "몇 개까지 유지할지"는 백엔드의 정책이다 — 프론트가 임의로 `slice` 등으로 잘라내지 않는다.
- **WS는 push-only이고 재전송을 보장하지 않는다.** 연결이 끊겨 있던 동안, 혹은 새로고침으로 상태가 초기화된 동안 발생한 이벤트는 유실된다. 재연결 성공 자체를 "데이터가 최신"이라는 증거로 삼지 않는다 — 새로고침·재연결 시점의 실제 최신 상태를 따라잡으려면 별도 HTTP recovery 엔드포인트(`GET /sim`)로 현재 스냅샷을 받아와 스토어를 덮어써야 한다.

**현재 WS 채널 목록**

| 채널 | 서비스 | 스토어 | 메세지 타입 |
|---|---|---|---|
| `/ws/sim` | `simulationSocketService.ts` | `useSimulationStore` | `SimulationProgressPayload` (`event: 'PROGRESS'`) / `SimulationCompletedPayload` (`event: 'COMPLETED'`) |

WS 채널은 짝이 되는 HTTP 서비스(시작/설정·복구용)를 같은 feature의 `services/`에 함께 둔다 — `/ws/sim`은 `simulationService.ts`(`POST /sim` 시작, `GET /sim` 복구)와 짝을 이루고, 스토어의 `applyMessage`가 WS 메세지와 이 HTTP 응답을 동일한 로직으로 처리한다.

### API 엔드포인트 요약

| feature | 서비스 파일 | 메서드 + 경로 |
|---|---|---|
| auth | `authService.ts` | `POST /auth/login`, `POST /auth/signup` |
| battery | `batteryService.ts` | `GET /battery`, `GET /battery/:batteryCellId` |
| dashboard | `dashboardService.ts` | `POST /dashboard` |
| simulation (HTTP) | `simulationService.ts` | `POST /sim`, `GET /sim` |
| simulation (WS) | `simulationSocketService.ts` | `WS /ws/sim` |
| report (개별) | `individualReportService.ts` | `POST /reports/individual`, `GET /reports/individual`, `GET /reports/individual/:reportId` |
| report (일일) | `dailyReportService.ts` | `POST /reports/daily`, `GET /reports/daily`, `GET /reports/daily/:reportId` |

### shared/ 승격 기준
feature 하나에서만 쓰임    → feature 안에 위치
두 개 이상 feature에서 쓰임 → shared/로 이동
"나중에 쓸 것 같다"        → shared/ 금지

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `BatteryCard.tsx` |
| 페이지 | PascalCase + Page 접미사 | `DashboardPage.tsx` |
| 훅 | use 접두사 + camelCase | `useDefects.ts` |
| 스토어 | use 접두사 + PascalCase + (List\|Detail) + Store 접미사 (라우트 단위) | `useBatteryListStore.ts`, `useBatteryDetailStore.ts` |
| 서비스 (HTTP) | camelCase + Service 접미사 (파일명 = export하는 객체 이름) | `batteryService.ts` |
| 서비스 (WS) | camelCase + SocketService 접미사 | `simulationSocketService.ts` |
| 타입/인터페이스 | PascalCase | `Defect`, `BatteryCell` |
| 폴더 | 소문자 camelCase | `battery`, `dashboard` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |

## CSS 디자인 전략

### rem 스케일링

Figma 1920px 기준으로 디자인하고, `:root`에 아래를 설정한다:

```css
font-size: clamp(6px, calc(100vw / 192), 10px);
```

1920px에서 1rem = 10px. 화면이 좁아지면 전체 UI가 비율을 유지하며 자동 스케일된다.

### CSS 값 입력 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 일반 크기/간격 | 피그마 px ÷ 10 = rem | `260px → 26rem` |
| border 두께 | px 그대로 유지 | `border: 1px solid ...` |
| box-shadow | px 그대로 유지 | `0 8px 24px rgba(...)` |

### 고정 레이아웃 규칙

- 고정 크기 컴포넌트(카드, 버튼, 사이드바 등)에 `flex-shrink: 0` 적용
- flex 컨테이너가 좁아져도 자식이 찌그러지지 않도록 명시적 `width`/`height` rem 사용
- `flex: 1`로 늘어나야 하는 영역은 예외 (레이아웃 컨테이너, 빈 공간 채우기 등)

## 커밋 컨벤션
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
style: 코드 스타일 변경
docs: 문서 수정
chore: 빌드/설정 변경
