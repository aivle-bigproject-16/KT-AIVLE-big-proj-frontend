# 기술 결정 기록 (ADR)

아키텍처 및 기술 스택 선택의 이유를 기록한 문서입니다.
**2026년 현업 환경 기준**으로 작성되었습니다.

---

## 1. React 19 선택 이유

**결정:** React 19 + TypeScript

**현업 현황 (2026):**
- React는 2026년 기준 프론트엔드 프레임워크 점유율 약 45%로 1위 유지
- TypeScript는 현업 프로젝트에서 사실상 기본값으로 자리잡음
- React + TypeScript + Vite 조합이 Next.js 다음으로 가장 많이 사용되는 셋업

**선택 이유:**
- 현업에서 가장 많이 쓰이는 스택이므로 레퍼런스, 라이브러리, 채용 시장 모두 유리
- TypeScript로 타입 안정성 확보, 초보자도 IDE 자동완성으로 실수를 줄일 수 있음
- React 19에서 도입된 React Compiler가 자동 메모이제이션을 처리해 `useMemo`, `useCallback`을 수동으로 관리할 필요 없음

**대안으로 고려한 것:** Vue 3, Svelte
- Vue 3는 진입장벽이 낮지만 생태계 규모와 현업 수요가 React보다 작음
- Svelte는 성능이 좋지만 현업 채택률이 낮고 레퍼런스 부족

---

## 2. Vite 선택 이유

**결정:** Vite 8 (번들러)

**현업 현황 (2026):**
- 2026년 기준 SPA 빌드 도구의 사실상 표준
- Next.js 없이 React + TypeScript로 SPA를 만들 때 Vite 외의 선택지는 사실상 없음
- CRA(Create React App) 대비 최대 40배 빠른 빌드 속도

**선택 이유:**
- 개발 서버 기동 속도가 Webpack 대비 압도적으로 빠름 (ES Module 기반 HMR)
- 설정이 간단해 초보자도 커스터마이징하기 쉬움
- React 공식 권장 빌드 도구이며 현업 표준

**대안으로 고려한 것:** Create React App (CRA), Webpack
- CRA는 2023년 이후 사실상 유지보수 중단, 현업에서 더 이상 사용하지 않음
- Webpack은 설정 복잡도가 높아 팀 부담이 큼

---

## 3. Bun 선택 이유

**결정:** Bun (패키지 매니저)

**현업 현황 (2026):**
- 2026년 기준 npm 대비 빠른 속도로 채택률 증가 중
- 패키지 매니저로만 사용할 경우 npm 생태계와 완전 호환되어 리스크가 낮음
- 현업에서 런타임 + 패키지 매니저 + 번들러 통합 도구로 주목받는 중

**선택 이유:**
- npm, yarn 대비 패키지 설치 속도가 월등히 빠름
- 패키지 매니저 역할로만 사용하므로 호환성 리스크 최소화
- 현업 전환 추세에 맞춰 미리 경험해두는 것이 유리

**대안으로 고려한 것:** npm, yarn, pnpm
- npm은 속도가 느림
- pnpm은 symlink 구조로 간혹 호환 이슈 발생
- yarn은 점유율이 점차 감소 추세

---

## 4. Feature-Sliced 구조 선택 이유

**결정:** `features/` + `pages/` + `core/` + `shared/` 레이어 구조

**현업 현황 (2026):**
- 도메인 중심 폴더 구조(Feature-Sliced Design)는 중대형 현업 프로젝트의 표준으로 자리잡는 추세
- 역할별 구조(`components/`, `hooks/` 최상위 분리)는 프로젝트 규모가 커질수록 유지보수 어려움이 증가해 현업에서 기피하는 패턴

**선택 이유:**
- 도메인(battery, dashboard, report)이 명확히 구분되어 있어 도메인별 폴더 분리가 자연스러움
- 팀원이 각자 담당 도메인 폴더 안에서만 작업하면 되므로 충돌이 줄어듦
- 의존성 방향(`shared → features → pages`)을 단방향으로 강제해 순환 참조를 원천 차단
- 초보자도 "이 코드는 어디에 두어야 하는가"를 규칙으로 판단할 수 있음

**대안으로 고려한 것:** 역할별 구조 (`components/`, `hooks/`, `services/` 최상위 분리)
- 프로젝트가 커질수록 같은 도메인 파일이 여러 폴더에 분산되어 탐색이 어려워짐
- 도메인 단위로 삭제/수정할 때 파일이 흩어져 있어 누락 위험이 높음

---

## 5. Zustand 선택 이유

**결정:** Zustand, 각 도메인별 독립 스토어 (`features/<domain>/store/`), 전역 Auth만 `core/auth/`에 위치

**현업 현황 (2026):**
- Zustand는 2026년 기준 React 상태관리 라이브러리 채택률 50% 돌파, 가장 빠르게 성장 중
- Redux는 감소 추세, 대규모 엔터프라이즈에서만 유지되는 분위기
- Context API는 전역 설정값(테마, 언어)에만 적합, 복잡한 상태관리에는 부적합하다는 것이 현업 공통 의견
- 현업 컨센서스: `TanStack Query + Zustand + URL state` 조합이 95% 케이스를 커버

**선택 이유:**
- Redux 대비 보일러플레이트가 없어 초보자도 빠르게 사용 가능
- 번들 크기 약 1KB(gzip)로 매우 가벼움
- state와 actions를 한 스토어에서 관리하되 actions를 객체로 분리해 리렌더링 최적화
- 셀렉터 패턴으로 필요한 값만 구독 가능 (불필요한 리렌더링 방지)

```typescript
// 현업 권장 패턴 — actions 객체 분리
const useBatteryStore = create<BatteryState & BatteryActions>((set) => ({
  status: 'idle',
  defects: [],
  actions: {
    setStatus: (s) => set({ status: s }),
    addDefect: (d) => set((state) => ({ defects: [...state.defects, d] })),
  },
}))

// state만 구독
const status = useBatteryStore((state) => state.status)
// action만 구독 (리렌더링 없음)
const { setStatus } = useBatteryStore((state) => state.actions)
```

**대안으로 고려한 것:** Redux Toolkit, Context + Reducer, Jotai
- Redux Toolkit은 현재 규모 대비 설정 복잡도가 높고 보일러플레이트 과다
- Context + Reducer는 React 내장이지만 렌더링 최적화가 약하고 현업 표준이 아님
- Jotai는 atom 단위 관리로 세밀하지만 팀 학습 곡선 존재

---

## 6. index.ts public API 패턴 선택 이유

**결정:** 각 feature는 `index.ts`를 통해서만 외부에 노출

**현업 현황 (2026):**
- 현업 대형 프로젝트에서 표준으로 사용하는 캡슐화 패턴
- feature 내부 변경이 외부에 영향을 주지 않도록 경계를 명확히 하는 것이 현업 관행

**선택 이유:**
- feature 내부 구현을 변경해도 `index.ts`만 유지하면 외부에 영향 없음
- 팀원이 다른 feature의 내부 파일을 직접 import하는 실수를 방지
- 어떤 것이 공개 API인지 명확히 파악 가능

---

## 참고 자료

- [Vite + TypeScript: Fastest Frontend Setup for React in 2026](https://medium.com/@mernstackdevbykevin/vite-typescript-2026-frontend-setup-in-the-fast-lane-822c28a6c3f0)
- [React + Vite: The Fastest Stack for 2026 Frontend Projects](https://devot.team/blog/react-vite)
- [Frontend Tooling 2026: Vite, Rsbuild & Bun Cheat Sheet](https://techbytes.app/posts/frontend-tooling-2026-vite-rsbuild-bun-cheat-sheet/)
- [Full-stack TypeScript/React Boilerplate for 2026](https://github.com/vitejs/vite/discussions/21819)
- [JavaScript 2026: The New Era of Bun, Deno, TypeScript 7, Vite](https://medium.com/@developerawam/javascript-2026-the-new-era-of-bun-deno-typescript-7-vite-and-what-developers-should-learn-next-ced385ffc648)
