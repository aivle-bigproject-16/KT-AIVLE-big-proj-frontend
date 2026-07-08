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
│     │     ├── hooks/
│     │     └── index.ts
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
│     └── report/
│           ├── components/
│           ├── hooks/
│           ├── types/
│           ├── store/
│           ├── services/
│           └── index.ts
├── pages/
│     ├── DashboardPage.tsx
│     ├── InspectionPage.tsx
│     └── ReportPage.tsx
├── core/
│     ├── api/
│     ├── auth/
│     │     ├── tokenStorage.ts
│     │     └── index.ts
│     └── navigation/
└── shared/
├── ui/
├── hooks/
├── utils/
└── types/

## 폴더 역할

### features/
비즈니스 도메인별 코드 모음. 각 feature는 독립적으로 동작.

| 폴더 | 역할 |
|---|---|
| `components/` | 해당 도메인 전용 UI 컴포넌트 |
| `hooks/` | 해당 도메인 전용 커스텀 훅 |
| `types/` | 해당 도메인 TypeScript 타입/인터페이스 |
| `store/` | Zustand 스토어 (state + actions) |
| `services/` | 실제 API 호출 함수 (apiClient 사용) |
| `index.ts` | public API 진입점 (외부 노출 항목만 export) |

### pages/
라우트와 1:1 대응하는 페이지 컴포넌트. features를 조합해서 화면을 구성.

| 파일 | 역할 |
|---|---|
| `DashboardPage.tsx` | 메인 대시보드 화면 |
| `InspectionPage.tsx` | 배터리 검사 결과 화면 |
| `ReportPage.tsx` | 리포트 화면 |

### core/
앱 전반의 인프라 레이어.

| 폴더 | 역할 |
|---|---|
| `api/` | axios 인스턴스 생성 + 인터셉터 (비즈니스 로직 없음) |
| `auth/` | 토큰(쿠키/로컬스토리지) 저장·조회·삭제 전담. 로그인/회원가입 로직은 없음 |
| `navigation/` | Router, PrivateRoute, routes 상수 |

### auth — core와 features에 나뉘어 있는 이유
"인증"은 두 가지 서로 다른 관심사를 포함하므로 위치를 분리한다.

| 위치 | 다루는 것 | 이유 |
|---|---|---|
| `core/auth/` | 토큰(쿠키/로컬스토리지) 저장·조회·삭제만 | 앱 전역 인프라 — `core/api/httpClient.ts`의 요청 인터셉터처럼 특정 feature에 속하지 않는 코드가 참조해야 함. UI가 없으므로 `components/hooks` 없이 `tokenStorage.ts` 하나만 존재 |
| `features/auth/` | 로그인/회원가입 **페이지**(화면, 폼 상태, API 호출) | 사용자가 보는 화면이 있는 일반 도메인이므로 다른 feature와 동일하게 `components/hooks/types/store/services/index.ts` 구조를 따름 |

`features/auth`의 로그인 액션은 `authService.login()` 호출 성공 후 `core/auth`의 `tokenStorage.setAccessToken()`으로 토큰을 저장한다 — feature가 core를 참조하는 것은 아키텍처 원칙(`shared → features → pages`)에 어긋나지 않는다(core는 어느 계층에서든 참조 가능한 최하위 인프라).

### core/api/httpClient.ts — HTTP 클라이언트
- response interceptor에서 `response.data`를 반환해 `AxiosResponse` 래핑을 제거하고, 백엔드 응답 스펙(`ApiResponse<T>`)만 남긴다.
- axios의 기본 타입 정의는 이 인터셉터 동작을 알지 못해 여전히 `Promise<AxiosResponse<T>>`를 반환한다고 추론하므로, `core/api/axios.d.ts`에서 모듈 확장(`declare module 'axios'`)으로 `get/post/put/patch/delete`의 반환 타입을 `Promise<T>`로 재정의한다.
- 서비스 함수는 `httpClient.get<ApiResponse<T>>(url)`처럼 호출하고, 응답은 `res.data`(백엔드가 내려주는 실제 `data` 필드)로 한 번만 접근한다 — `res.data.data`가 아니다.

### shared/
2개 이상 feature에서 실제로 쓰이는 공통 코드만.

| 폴더 | 역할 |
|---|---|
| `ui/` | 순수 재사용 UI 컴포넌트 (Button, Modal 등) |
| `hooks/` | 크로스 피처 훅 (useDebounce, useMediaQuery 등) |
| `utils/` | 순수 유틸 함수 (formatDate, cn 등) |
| `types/` | 공통 TypeScript 타입 |

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
- 생성(create) 액션처럼 트리거 위치와 데이터 소속 도메인이 다를 수 있는 경우, **데이터가 최종적으로 표시되는 라우트의 스토어**에 둔다 (예: 개별 리포트 생성 버튼은 배터리 상세 페이지에 있지만, 생성된 리포트를 보여주는 곳은 리포트 상세 페이지이므로 `useIndividualReportDetailStore`에 위치)
- state와 actions를 분리해 actions는 객체로 묶어 관리
- 컴포넌트에서는 셀렉터로 필요한 값만 구독 (불필요한 리렌더링 방지)
- Auth 중 토큰 저장(전역, 라우트 무관)만 `core/auth/`에 위치, 로그인/회원가입처럼 라우트가 있는 것은 `features/auth/store/`에 라우트별로 분리

**현재 라우트별 스토어 목록**

| 라우트 | 스토어 |
|---|---|
| 배터리 목록 | `useBatteryListStore` |
| 배터리 상세 | `useBatteryDetailStore` |
| 개별 리포트 목록 | `useIndividualReportListStore` |
| 개별 리포트 상세 | `useIndividualReportDetailStore` (리포트 생성 액션 포함) |
| 일일 리포트 목록 | `useDailyReportListStore` |
| 일일 리포트 상세 | `useDailyReportDetailStore` (리포트 생성 액션 포함) |
| 로그인 | `useLoginStore` |
| 회원가입 | `useSignupStore` |
| 대시보드 (단일 라우트) | `useDashboardStore` |

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
      set({ list: res.data.content, pageable: res.data.pageable, isLoading: false })
    },
    reset: () => set(initialState),
  },
}))

// 사용 예시
const list = useBatteryListStore((state) => state.list)              // state만
const { fetchList } = useBatteryListStore((state) => state.actions)  // action만
```

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
| 서비스 | camelCase + Service 접미사 | `batteryService.ts` |
| 타입/인터페이스 | PascalCase | `Defect`, `BatteryCell` |
| 폴더 | 소문자 camelCase | `battery`, `dashboard` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |

## 커밋 컨벤션
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
style: 코드 스타일 변경
docs: 문서 수정
chore: 빌드/설정 변경
