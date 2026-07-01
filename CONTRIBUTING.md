# Contributing Guide

## 도메인 담당자

| 도메인 | 담당자 | 경로 |
|---|---|---|
| header | ooo | `src/features/header/` |
| battery | ooo | `src/features/battery/` |
| dashboard | ooo | `src/features/dashboard/` |
| report | ooo | `src/features/report/` |
| core / shared | ooo | `src/core/`, `src/shared/` |

## 브랜치 전략

```
main          — 배포 브랜치 (직접 push 금지)
develop       — 통합 브랜치 (직접 push 금지)
feat/<name>   — 기능 개발
fix/<name>    — 버그 수정
refactor/<name>
```

PR은 반드시 `develop`으로 올립니다. `main` 머지는 배포 시점에만 진행합니다.

### 브랜치 보호 규칙 (Ruleset: protect-main/develop)

`main`과 `develop` 브랜치에 다음 ruleset이 적용되어 있습니다.

| 규칙 | 내용 |
|---|---|
| Restrict updates | 형상관리자(bandalgomim)만 직접 push 가능 |
| Restrict deletions | 브랜치 삭제 금지 |
| Require a pull request before merging | 팀원은 반드시 PR을 통해서만 머지 가능 |
| Require conversation resolution before merging | PR 코멘트 모두 resolve 후 머지 |
| Block force pushes | `git push --force` 금지 |

**형상관리자**: bandalgomim — PR 검토 및 머지 담당

## 개발 흐름

```bash
# 1. develop에서 브랜치 생성
git switch develop
git pull origin develop
git switch -c feat/battery-chart

# 2. 작업 후 커밋
git add src/features/battery/...
git commit -m "feat: 배터리 차트 컴포넌트 추가"

# 3. develop 최신화 반영 (작업 중 주기적으로)
git fetch origin
git merge origin/develop

# 4. PR 생성 (develop 타겟)
```

> 충돌 방지를 위해 PR 올리기 전에도 반드시 3번을 먼저 수행합니다.

## 커밋 컨벤션

```
feat:     새 기능
fix:      버그 수정
refactor: 리팩토링
style:    코드 스타일 변경
docs:     문서 수정
chore:    빌드/설정 변경
```

제목은 한 줄, 50자 이내. 본문이 필요하면 빈 줄 하나 띄우고 작성합니다.

## 코드 규칙

### 의존성 방향

```
shared/ → features/ → pages/
```

- features 간 직접 import 금지
- 두 feature 이상에서 쓰이는 코드 → `shared/`로 이동
- 각 feature 외부 노출은 `index.ts`로만

### 파일 위치

| 파일 종류 | 위치 |
|---|---|
| 도메인 UI 컴포넌트 | `features/<domain>/components/` |
| 도메인 커스텀 훅 | `features/<domain>/hooks/` |
| 도메인 TypeScript 타입 | `features/<domain>/types/` |
| Context + Reducer | `features/<domain>/context/` |
| API 호출 함수 | `features/<domain>/services/` |
| 전역 인증 | `core/auth/` |
| 공통 UI 컴포넌트 | `shared/ui/` |
| 공통 훅 | `shared/hooks/` |
| 유틸 함수 | `shared/utils/` |

### 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `BatteryCard.tsx` |
| 페이지 | PascalCase + `Page` 접미사 | `DashboardPage.tsx` |
| 훅 | `use` 접두사 + camelCase | `useDefects.ts` |
| 서비스 | camelCase + `Service` 접미사 | `batteryService.ts` |
| 타입/인터페이스 | PascalCase | `Defect`, `BatteryCell` |
| 폴더 | 소문자 camelCase | `battery`, `dashboard` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |

## PR 규칙

- 제목: `[feat] 배터리 차트 컴포넌트 추가` 형식
- Reviewer로 형상관리자(bandalgomim) 지정
- 머지는 형상관리자만 수행 — 셀프 머지 금지
- PR 단위는 하나의 기능 또는 하나의 버그 수정으로 유지
- PR 내 모든 코멘트는 resolve 후 머지 가능

## 로컬 환경 세팅

```bash
# Node.js 대신 Bun 사용
bun install
bun dev
```

> Bun이 없으면 https://bun.sh 에서 설치 후 진행합니다.
