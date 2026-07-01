# Architecture

## 기술 스택
- React 19 + TypeScript + React Compiler
- Vite (번들러)
- Bun (패키지 매니저)

## 폴더 구조
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
│     │     ├── context/
│     │     ├── services/
│     │     └── index.ts
│     ├── dashboard/
│     │     ├── components/
│     │     ├── hooks/
│     │     ├── types/
│     │     ├── context/
│     │     ├── services/
│     │     └── index.ts
│     └── report/
│           ├── components/
│           ├── hooks/
│           ├── types/
│           ├── context/
│           ├── services/
│           └── index.ts
├── core/
│     ├── api/
│     ├── auth/
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
| `context/` | Context + Reducer + InitialState |
| `services/` | 실제 API 호출 함수 (apiClient 사용) |
| `index.ts` | public API 진입점 (외부 노출 항목만 export) |

### core/
앱 전반의 인프라 레이어.

| 폴더 | 역할 |
|---|---|
| `api/` | axios 인스턴스 생성 + 인터셉터 (비즈니스 로직 없음) |
| `auth/` | 전역 AuthContext + AuthReducer + AuthInitialState |
| `navigation/` | Router, PrivateRoute, routes 상수 |

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

### Reducer 방침
- 각 도메인 Reducer 독립 운영
- Context + InitialState + Reducer는 각 feature/context/ 안에 위치
- Auth(전역)만 core/auth/에 위치

### shared/ 승격 기준
feature 하나에서만 쓰임 → feature 안에 위치
두 개 이상 feature에서 실제로 쓰임 → shared/로 이동
"나중에 쓸 것 같다"는 이유로 shared/ 금지


## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `BatteryCard.tsx` |
| 훅 | use 접두사 + camelCase | `useDefects.ts` |
| 서비스 | camelCase + Service | `batteryService.ts` |
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
