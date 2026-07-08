# 🔋 KT AIVLE Big Project — Frontend

> React 19 기반 배터리 검사 및 대시보드 웹 애플리케이션입니다.

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

## 🚀 시작하기

### 사전 준비

> Bun이 없으면 https://bun.sh 에서 설치 후 진행합니다.

### 명령어

```bash
# 1. 의존성 설치
bun install

# 2. 개발 서버 실행
bun dev
# → http://localhost:5173
```

```bash
# 타입 체크 + 프로덕션 빌드
bun build

# 빌드 결과 미리보기
bun preview

# 린트
bun lint
```

---

## 📁 폴더 구조

```
src/
├── features/          # 비즈니스 도메인별 코드
│   ├── header/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   ├── battery/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── store/
│   │   ├── services/
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── store/
│   │   ├── services/
│   │   └── index.ts
│   └── report/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       ├── store/
│       ├── services/
│       └── index.ts
├── pages/             # 라우트 1:1 페이지 컴포넌트
│   ├── DashboardPage.tsx
│   ├── InspectionPage.tsx
│   └── ReportPage.tsx
├── core/              # 앱 전반 인프라
│   ├── api/           # axios 인스턴스 + 인터셉터
│   ├── auth/          # 전역 Auth Zustand 스토어
│   └── navigation/    # Router, PrivateRoute, routes 상수
└── shared/            # 2개 이상 feature에서 쓰이는 공통 코드
    ├── ui/            # 재사용 UI 컴포넌트 (Button, Modal 등)
    ├── hooks/         # 크로스 피처 훅 (useDebounce 등)
    ├── utils/         # 순수 유틸 함수 (formatDate, cn 등)
    └── types/         # 공통 TypeScript 타입
```

### 폴더별 역할 요약

| 폴더 | 역할 |
|---|---|
| `features/` | 도메인별 독립 코드 (battery, dashboard, report, header) |
| `pages/` | 라우트와 1:1 대응하는 페이지, features를 조합해 구성 |
| `core/` | 앱 전반 인프라 (API 클라이언트, 인증, 라우터) |
| `shared/` | 2개 이상 feature에서 실제로 쓰이는 공통 코드만 |

---

## 🏗️ 아키텍처 원칙

### 의존성 방향 (단방향, 역방향 금지)

```
shared/ → features/ → pages/
```

### 핵심 규칙

- features 간 직접 import 금지 — 공통 코드는 `shared/`로 이동
- 각 feature는 `index.ts`를 통해서만 외부에 노출
- `pages/`에서 여러 feature를 조합해 화면 구성
- Zustand 스토어는 각 `features/<domain>/store/` 안에 위치 (전역 Auth만 `core/auth/`에)

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
