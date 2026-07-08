# 🏗️ Architecture

---

## ⚡ 기술 스택

| 구분 | 기술 |
|---|---|
| UI | React 19 + TypeScript |
| 번들러 | Vite 8 |
| 패키지 매니저 | Bun |
| 상태관리 | Zustand |
| 컴파일러 | React Compiler (자동 메모이제이션) |
| Lint | ESLint 10 + typescript-eslint |

---

## 📁 폴더 구조

```
src/
├── features/
│     ├── header/
│     │     ├── components/
│     │     ├── hooks/
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
│     └── navigation/
└── shared/
      ├── ui/
      ├── hooks/
      ├── utils/
      └── types/
```

---

## 📂 폴더 역할

### features/

> 비즈니스 도메인별 코드 모음. 각 feature는 독립적으로 동작.

| 폴더 | 역할 |
|---|---|
| `components/` | 해당 도메인 전용 UI 컴포넌트 |
| `hooks/` | 해당 도메인 전용 커스텀 훅 |
| `types/` | 해당 도메인 TypeScript 타입/인터페이스 |
| `store/` | Zustand 스토어 (state + actions) |
| `services/` | 실제 API 호출 함수 (apiClient 사용) |
| `index.ts` | public API 진입점 (외부 노출 항목만 export) |

### pages/

> 라우트와 1:1 대응하는 페이지 컴포넌트. features를 조합해서 화면을 구성.

| 파일 | 역할 |
|---|---|
| `DashboardPage.tsx` | 메인 대시보드 화면 |
| `InspectionPage.tsx` | 배터리 검사 결과 화면 |
| `ReportPage.tsx` | 리포트 화면 |

### core/

> 앱 전반의 인프라 레이어.

| 폴더 | 역할 |
|---|---|
| `api/` | axios 인스턴스 생성 + 인터셉터 (비즈니스 로직 없음) |
| `auth/` | 전역 Auth Zustand 스토어 |
| `navigation/` | Router, PrivateRoute, routes 상수 |

### shared/

> 2개 이상 feature에서 실제로 쓰이는 공통 코드만.

| 폴더 | 역할 |
|---|---|
| `ui/` | 순수 재사용 UI 컴포넌트 (Button, Modal 등) |
| `hooks/` | 크로스 피처 훅 (useDebounce, useMediaQuery 등) |
| `utils/` | 순수 유틸 함수 (formatDate, cn 등) |
| `types/` | 공통 TypeScript 타입 |

---

## 🏛️ 아키텍처 원칙

### 의존성 방향 (단방향, 역방향 금지)

```
shared/ → features/ → pages/
```

### features 간 규칙

- features 간 직접 import 금지
- 두 feature가 같은 코드를 필요로 하면 `shared/`로 이동
- 각 feature는 `index.ts`로만 외부에 노출
- `pages/`에서 여러 feature를 조합해서 화면 구성

### Zustand 스토어 방침

- 각 도메인 스토어 독립 운영 (`features/<domain>/store/`)
- state와 actions를 분리해 actions는 객체로 묶어 관리
- 컴포넌트에서는 셀렉터로 필요한 값만 구독 (불필요한 리렌더링 방지)
- Auth(전역)만 `core/auth/`에 위치

```typescript
// store 작성 예시
const useBatteryStore = create<BatteryState & BatteryActions>((set) => ({
  // state
  status: 'idle',
  defects: [],

  // actions — 객체로 분리
  actions: {
    setStatus: (s) => set({ status: s }),
    addDefect: (d) => set((state) => ({ defects: [...state.defects, d] })),
  },
}))

// 사용 예시
const status = useBatteryStore((state) => state.status)           // state만
const { setStatus } = useBatteryStore((state) => state.actions)   // action만
```

### shared/ 승격 기준

| 상황 | 위치 |
|---|---|
| feature 하나에서만 쓰임 | feature 안에 위치 |
| 두 개 이상 feature에서 쓰임 | `shared/`로 이동 |
| "나중에 쓸 것 같다" | `shared/` 금지 |

---

## ✏️ 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `BatteryCard.tsx` |
| 페이지 | PascalCase + `Page` 접미사 | `DashboardPage.tsx` |
| 훅 | `use` 접두사 + camelCase | `useDefects.ts` |
| 스토어 | `use` 접두사 + PascalCase + `Store` 접미사 | `useBatteryStore.ts` |
| 서비스 | camelCase + `Service` 접미사 | `batteryService.ts` |
| 타입/인터페이스 | PascalCase | `Defect`, `BatteryCell` |
| 폴더 | 소문자 camelCase | `battery`, `dashboard` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |

---

## 💬 커밋 컨벤션

| 태그 | 설명 |
|---|---|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `style` | 코드 스타일 변경 |
| `docs` | 문서 수정 |
| `chore` | 빌드/설정 변경 |
