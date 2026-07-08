# 🏗️ 기술 결정 기록 (ADR)

> 아키텍처 및 기술 스택 선택의 이유를 기록한 문서입니다.
> **2026년 현업 환경 기준**으로 작성되었습니다.

---

## 📌 요약

| 항목 | 결정 | 핵심 이유 |
|---|---|---|
| UI 라이브러리 | React 19 + TypeScript | 현업 점유율 1위 (45%), 생태계 최대 |
| 번들러 | Vite 8 | SPA 빌드 도구 사실상 표준, CRA 대비 40배 빠름 |
| 패키지 매니저 | Bun | npm 대비 빠른 설치 속도, 완전 호환 |
| 폴더 구조 | Feature-Sliced | 도메인 충돌 최소화, 단방향 의존성 |
| 상태관리 | Zustand | 현업 채택률 50% 돌파, 경량·간단 |
| 모듈 공개 방식 | index.ts 패턴 | 캡슐화, 내부 변경이 외부에 영향 없음 |

---

## 1️⃣ React 19 + TypeScript

> **결정:** React 19 + TypeScript

### 💼 현업 현황 (2026)

> 📊 React는 2026년 기준 프론트엔드 점유율 약 **45%로 1위** 유지
> TypeScript는 현업에서 사실상 기본값으로 자리잡음
> React + TypeScript + Vite 조합이 Next.js 다음으로 가장 많이 사용되는 셋업

### ✅ 선택 이유

- 현업에서 가장 많이 쓰이는 스택 → 레퍼런스, 라이브러리, 채용 시장 모두 유리
- TypeScript로 타입 안정성 확보, 초보자도 IDE 자동완성으로 실수 감소
- React 19 React Compiler → `useMemo`, `useCallback` 수동 관리 불필요

### ❌ 대안 및 탈락 이유

| 대안 | 탈락 이유 |
|---|---|
| Vue 3 | 생태계 규모와 현업 수요가 React보다 작음 |
| Svelte | 현업 채택률 낮음, 레퍼런스 부족 |

---

## 2️⃣ Vite 8

> **결정:** Vite 8 (번들러)

### 💼 현업 현황 (2026)

> 📊 2026년 기준 SPA 빌드 도구의 **사실상 표준**
> Next.js 없이 SPA 만들 때 Vite 외 선택지는 사실상 없음
> CRA 대비 최대 **40배 빠른** 빌드 속도

### ✅ 선택 이유

- ES Module 기반 HMR로 개발 서버 기동 속도 압도적으로 빠름
- 설정이 간단해 초보자도 커스터마이징 가능
- React 공식 권장 빌드 도구

### ❌ 대안 및 탈락 이유

| 대안 | 탈락 이유 |
|---|---|
| CRA | 2023년 이후 유지보수 중단, 현업에서 사용 안 함 |
| Webpack | 설정 복잡도가 높아 팀 부담이 큼 |

---

## 3️⃣ Bun

> **결정:** Bun (패키지 매니저 용도로만 사용)

### 💼 현업 현황 (2026)

> 📊 npm 대비 빠른 속도로 채택률 증가 중
> 패키지 매니저로만 사용 시 npm 생태계와 **완전 호환**
> 런타임 + 패키지 매니저 + 번들러 통합 도구로 주목받는 중

### ✅ 선택 이유

- npm, yarn 대비 패키지 설치 속도 월등히 빠름
- 패키지 매니저 역할로만 사용 → 호환성 리스크 최소화
- 현업 전환 추세에 맞춰 미리 경험

### ❌ 대안 및 탈락 이유

| 대안 | 탈락 이유 |
|---|---|
| npm | 속도가 느림 |
| pnpm | symlink 구조로 간혹 호환 이슈 |
| yarn | 점유율 감소 추세 |

---

## 4️⃣ Feature-Sliced 폴더 구조

> **결정:** `features/` + `pages/` + `core/` + `shared/` 레이어 구조

### 💼 현업 현황 (2026)

> 📊 도메인 중심 폴더 구조(Feature-Sliced Design)는 중대형 현업 프로젝트 표준으로 자리잡는 추세
> 역할별 구조(`components/`, `hooks/` 최상위 분리)는 규모가 커질수록 유지보수 어려움 → 현업에서 기피

### ✅ 선택 이유

- 도메인(battery, dashboard, report)이 명확히 구분 → 폴더 분리 자연스러움
- 팀원이 각자 담당 도메인 폴더 안에서만 작업 → 충돌 감소
- 의존성 방향 단방향 강제 (`shared → features → pages`) → 순환 참조 원천 차단
- 초보자도 "이 코드는 어디에?" 를 규칙으로 판단 가능

### 📁 구조 한눈에 보기

```
src/
├── features/      # 도메인별 코드 (battery, dashboard, report, header)
├── pages/         # 라우트 1:1 페이지
├── core/          # 앱 전반 인프라 (api, auth, navigation)
└── shared/        # 2개 이상 feature에서 쓰이는 공통 코드
```

### ❌ 대안 및 탈락 이유

| 대안 | 탈락 이유 |
|---|---|
| 역할별 구조 | 규모 커질수록 도메인 파일이 분산, 탐색 어려움 |

---

## 5️⃣ Zustand

> **결정:** Zustand, 도메인별 독립 스토어 (`features/<domain>/store/`), 전역 Auth만 `core/auth/`

### 💼 현업 현황 (2026)

> 📊 Zustand 채택률 **50% 돌파**, 가장 빠르게 성장 중
> Redux는 감소 추세, 대규모 엔터프라이즈에서만 유지
> 현업 컨센서스: `TanStack Query + Zustand + URL state` 조합이 95% 케이스 커버

### ✅ 선택 이유

- Redux 대비 보일러플레이트 없음 → 초보자도 빠르게 사용 가능
- 번들 크기 약 **1KB(gzip)** 로 매우 가벼움
- actions를 객체로 분리해 리렌더링 최적화
- 셀렉터 패턴으로 필요한 값만 구독 가능

### 💡 현업 권장 패턴

```typescript
// actions 객체로 분리 — 현업 표준 패턴
const useBatteryStore = create<BatteryState & BatteryActions>((set) => ({
  // state
  status: 'idle',
  defects: [],

  // actions — 객체로 묶어 리렌더링 방지
  actions: {
    setStatus: (s) => set({ status: s }),
    addDefect: (d) => set((state) => ({ defects: [...state.defects, d] })),
  },
}))

// 사용 시
const status = useBatteryStore((state) => state.status)           // state만 구독
const { setStatus } = useBatteryStore((state) => state.actions)   // action만 구독 (리렌더링 없음)
```

### ❌ 대안 및 탈락 이유

| 대안 | 탈락 이유 |
|---|---|
| Redux Toolkit | 규모 대비 복잡도 높음, 보일러플레이트 과다 |
| Context + Reducer | 렌더링 최적화 약함, 현업 표준 아님 |
| Jotai | atom 단위 관리로 세밀하나 팀 학습 곡선 존재 |

---

## 6️⃣ index.ts Public API 패턴

> **결정:** 각 feature는 `index.ts`를 통해서만 외부에 노출

### 💼 현업 현황 (2026)

> 📊 현업 대형 프로젝트에서 표준으로 사용하는 캡슐화 패턴
> feature 내부 변경이 외부에 영향 주지 않도록 경계를 명확히 하는 것이 현업 관행

### ✅ 선택 이유

- feature 내부 구현 변경해도 `index.ts`만 유지하면 외부 영향 없음
- 팀원이 다른 feature 내부 파일을 직접 import하는 실수 방지
- 어떤 것이 공개 API인지 명확히 파악 가능

### 💡 예시

```typescript
// features/battery/index.ts
export { BatteryCard } from './components/BatteryCard'
export { useBatteryStore } from './store/useBatteryStore'
export type { Battery, Defect } from './types'

// 외부에서는 이렇게만 import
import { BatteryCard } from '@/features/battery'
```

---

## 📚 참고 자료

- [Vite + TypeScript: Fastest Frontend Setup for React in 2026](https://medium.com/@mernstackdevbykevin/vite-typescript-2026-frontend-setup-in-the-fast-lane-822c28a6c3f0)
- [React + Vite: The Fastest Stack for 2026 Frontend Projects](https://devot.team/blog/react-vite)
- [Frontend Tooling 2026: Vite, Rsbuild & Bun Cheat Sheet](https://techbytes.app/posts/frontend-tooling-2026-vite-rsbuild-bun-cheat-sheet/)
- [Full-stack TypeScript/React Boilerplate for 2026](https://github.com/vitejs/vite/discussions/21819)
- [JavaScript 2026: The New Era of Bun, Deno, TypeScript 7, Vite](https://medium.com/@developerawam/javascript-2026-the-new-era-of-bun-deno-typescript-7-vite-and-what-developers-should-learn-next-ced385ffc648)
- [Redux vs Zustand vs Context API in 2026](https://medium.com/@sparklewebhelp/redux-vs-zustand-vs-context-api-in-2026-7f90a2dc3439)
- [Zustand Best Practices](https://www.projectrules.ai/rules/zustand)
