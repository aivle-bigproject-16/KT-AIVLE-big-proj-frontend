# 인증 (auth)

> `src/features/auth/`
> 관련 API: `POST /auth/login`, `POST /auth/signup`
> 인증 방식: httpOnly 쿠키 + `withCredentials`. FE는 `isAuthenticated` / `name` / `role`만 zustand로 보관.

## 작업 이력

| 날짜 | 디자인 | 컴포넌트 | 스토어 | 서비스 |
|---|---|---|---|---|
| 2026-07-08 | | | `useLoginStore` / `useSignupStore` 파일 생성 (스캐폴딩) | `authService` 파일 생성 (스캐폴딩) |
| 2026-07-13 | | | API 명세 반영 수정 (`a9b2b1b`) | API 명세 반영 수정 (`a9b2b1b`) |

---

## 브랜치 & 커밋 이력

| 브랜치 | 커밋 | 날짜 | 내용 |
|---|---|---|---|
| `feat/scaffold` | `8f09267` | 2026-07-08 | axios 기반 HTTP 클라이언트 및 모듈 확장 타입 추가 |
| `feat/login` | `4a1674d` | 2026-07-13 | 로그인 화면 초안 생성 |
| `feat/login` | `19fd034` | 2026-07-13 | 회원가입 페이지 초안 구현 |
| `feat/login` | `59328ca` | 2026-07-13 | 컴포넌트 디렉터리 재배치 |
| `feat/login` | `be08944` | 2026-07-13 | auth 컴포넌트 분리 |
| `feat/login` | `1a8a09b` | 2026-07-13 | style: 회원가입 페이지 버튼 위치 조절 |
| `feat/dashboard` | `a9b2b1b` | 2026-07-13 | Fix: api 및 문서 수정 |
