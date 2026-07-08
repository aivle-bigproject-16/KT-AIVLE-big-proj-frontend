# 기능 명세서

> KT AIVLE 9기 빅프로젝트 / AI 06반 16조 / 배터리 셀 결함검사 생산 시뮬레이션
> 요구사항 ID는 요구사항 명세서 기준. 노드 구성: FE / BE(Spring Boot) / AI 분류 서버(FastAPI) / LLM 리포트 서버(LangGraph+Qwen)
>
> 작성일: 2026-07-02 / 버전: v0.2
>
> ⚠️ **문서 정합성 플래그**: 본 문서는 판정 등급을 `PASS`/`REJECT` 2단계로 확정하여 작성됨. 요구사항 명세서 §9.2, FR-DASH-004, AC-007은 `PASS/WARNING/REJECT` 3단계를 Must로 규정하고 있어, 요구사항 명세서 측 공식 개정이 필요함.

---

## 0. 전역 결정사항 요약

| 항목 | 결정 |
|---|---|
| 인증 방식 | JWT |
| 판정 등급 | `PASS` / `REJECT` (2단계, ※ 요구사항 §9.2 개정 필요) |
| **CT/RGB 종합 판정 규칙** | **OR 방식 — CT 또는 RGB 중 하나라도 `REJECT`이면 최종 판정은 `REJECT`. 둘 다 `PASS`일 때만 최종 `PASS`.** |
| 촬영 방식 | 배치 처리, 배치 크기·속도는 FE 설정값으로 제어 |
| AI 분석 트리거 | `CAPTURED` 전환 시 BE가 자동 호출 (사용자 개입 없음) |
| 결함 유형 | 현재 4종(부풀음/오점/미세결함/갈라짐) 고정, 확장 가능한 구조로 설계 |
| bbox 형식 | `{ x, y, width, height }` 객체 |
| 리포트 저장 | 개별/일일 리포트 테이블 분리, 개별 리포트는 요청 시에만 생성(자동 생성 아님) |
| CT/RGB 세트 | 항상 쌍으로 입력, 미세트 시 공정 오류(`FAILED`, reason=`INCOMPLETE_SET`) |
| 저장소 | 개발: MinIO / 배포: S3 (API 호환, 코드 동일) |
| BE 기술스택 | Spring Boot |
| BE↔AI 통신 | 비동기(큐 기반) |
| CT/RGB 요청 방식 | AI 서버에 각각 별도 요청 |
| Presigned URL | BE로 일원화 — FE, AI 서버, LLM 서버 모두 이미지 필요 시 BE에 요청해 URL 발급받음 |
| 로깅 | 개발 초기: JSON 로그를 PostgreSQL에도 병행 저장 / 이후: MongoDB 전용, RDBMS는 정형 테이블만 |
| AI 모델 | YOLOv11-seg(+SAHI), CT/RGB 각각 별도 모델 2개. 고도화: Atrous 적용 모델, YOLO26 모델 추가 예정 |
| bbox 시각화 | BE는 좌표만 전달, 렌더링은 FE 담당 |
| 실패 처리 | NFR-006 준수, `FAILED` + 실패 사유 저장, 배치 내 타 셀은 계속 진행 |
| LLM 모델 | Qwen(버전 미정) |
| BE↔LLM 통신 | 비동기(디스패치 + WS 콜백) |
| 리포트 엔드포인트 | 개별/일일 완전 분리된 2개 엔드포인트 |
| LLM 큐 스케줄링 | 미정 — 우선순위(개별 HIGH, 일일 LOW)·디바운스·재시도 정책은 별도 논의 필요 |

---

## 1. FE — 프론트엔드 (React)

### 1.1 인증 (MVP) (FR-AUTH-001, FR-AUTH-002)
- **입력**: 로그인 화면(이메일/비밀번호), 회원가입 화면(이메일/비밀번호/이름)
- **처리**: `POST /auth/login`, `POST /auth/signup` 호출 → JWT 발급받아 저장(예: httpOnly 쿠키 또는 로컬 상태)
- **출력**: 로그인 성공 시 대시보드로 리다이렉트, 이후 모든 API 요청에 JWT 첨부
- **예외**: 인증 실패 시 에러 메시지 표시, 만료된 토큰은 재로그인 유도
- **비고**: 모든 화면 접근 시 JWT 필수(비회원은 로그인/회원가입만 접근 가능)

### 1.2 시뮬레이션 제어 및 설정 (MVP) (FR-CAP-001, FR-CAP-002)
- **입력**: 배치 크기 입력, 배속 설정 값 입력, 시작 버튼, 정지 버튼
- **처리**:
  - `PUT /sim` — 배치 크기·속도 설정 + 시작/정지 토글(`running: true/false`)을 단일 엔드포인트에서 일괄 처리
- **출력**: 버튼 상태 반영(시작 중엔 시작 버튼 비활성화 등), 공정 흐름도 애니메이션 시작/정지
- **예외**: API 실패 시 토스트 알림, 상태 롤백
- **비고**: 정지/시작만 지원(일시정지·리셋·실시간 배속 슬라이더 조작은 MVP 범위 아님, 배치·속도는 시작 전 설정값으로만 반영)

### 1.3 공정 흐름 시각화 (MVP) (FR-CAP-004 관련, WS 기반)
- **입력**: WebSocket `cell.injected` / `cell.capturing` / `cell.captured` / `cell.analyzing` / `cell.result` 이벤트
- **처리**: react-flow로 공정 블록(촬영→검사→판정) 상태 갱신, 셀 이동을 엣지 위 애니메이션으로 표현
- **출력**: 배치 진행률, 셀별 실시간 상태 표시

### 1.4 통계 대시보드 (MVP) (FR-DASH-001~005)
- **입력**: WS `stats` 이벤트(주기 발행)
- **처리**: 총 검사 수, PASS/REJECT 수, 촬영 상태별 개수(REGISTERED/CAPTURING/CAPTURED/ANALYZING/COMPLETED/FAILED), 결함 유형별 통계를 차트/카드로 표시(재계산 없이 BE 스냅샷 그대로 사용)
- **출력**: 실시간 갱신 대시보드
- **예외**: WS 연결 끊김 시 최근 수신 데이터 유지 + 재연결 시 §1.7 상태 복구로 갱신

### 1.5 검사 목록 (MVP) (FR-LIST-001~005)
- **입력**: 목록 페이지 진입, 필터 조작(정상/불량, 결함 유형, 촬영/분석 상태)
- **처리**: `GET /battery?filter=...` 호출 → 목록 렌더, 항목 클릭 시 상세 페이지 이동
- **출력**: 필터링된 배터리 검사 목록

### 1.6 검사 상세 (MVP) (FR-DETAIL-001~005)
- **입력**: 특정 배터리 상세 페이지 진입
- **처리**: `GET /battery/{id}` 호출 → CT 결과, RGB 결과, 최종 종합 판정, confidence, bbox 좌표, CT/RGB 원본 이미지 presigned URL, AI 원본 응답 JSON 조회
- **출력**: CT/RGB 이미지 위에 **FE가 좌표 기반으로 bbox를 직접 렌더링**(canvas/SVG 오버레이), 결함 정보 패널. **CT/RGB 개별 결과와 최종 종합 판정을 구분하여 표시**(예: "CT: REJECT / RGB: PASS → 최종: REJECT")
- **비고**: AI 서버는 좌표만 반환하므로 시각화 로직은 FE 전담(§3 참고)

### 1.7 상태 복구 (FR-12)
- **입력**: 페이지 새로고침, WS 재연결 감지
- **처리**: `GET /sim/status`, `GET /stats` 호출로 현재 스냅샷 재조회 → 화면 재구성 후 WS 실시간 갱신 재개
- **출력**: 새로고침 이전과 동일한 화면 상태

### 1.8 리포트 조회/생성 (MVP)
- **입력**: 검사 상세 페이지에서 "개별 리포트 생성" 버튼(최종 판정 `REJECT` 건에만 노출), 대시보드에서 "일일 리포트 생성" 버튼
- **처리**:
  - `POST /reports/individual/{battery_id}` → 상태 `pending`으로 즉시 응답, WS `report.ready` 수신 시 자동 갱신
  - `POST /reports/daily?date=...` → 동일한 비동기 흐름
  - `GET /reports/individual/{id}`, `GET /reports/daily/{date}` → 조회
- **출력**: 리포트 미생성 시 "생성 중" 표시, 완료 시 마크다운/텍스트 렌더링
- **비고**: 개별 리포트는 사용자 요청 시에만 생성(자동 생성 없음)

---

## 2. BE — Spring Boot (오케스트레이션)

### 2.1 인증/권한 (MVP) (FR-AUTH-001~006)
- **처리**: JWT 발급/검증, Spring Security 기반 역할별(비회원/일반사용자/검사담당자/관리자) 엔드포인트 접근 제어
- **DB**: 사용자 정보(PostgreSQL) — 이메일, 해시된 비밀번호, 이름, 역할

### 2.2 시뮬레이션 설정 및 배치 제어 (MVP) (FR-CAP-001~003)
- **입력**: FE로부터 배치 크기·속도 설정, 시작/정지 명령
- **처리**:
  1. `PUT /sim` — 배치 크기·간격 저장 + `running` 플래그로 시작/정지 일괄 처리
  2. `running: true` 수신 시 스케줄러(택트 루프) 가동, 설정된 배치 크기만큼 이미지 pool에서 pop
  3. 배치 내 각 셀: `REGISTERED → CAPTURING → CAPTURED` 상태 전이, 각 전이마다 WS push
  4. `CAPTURED` 전환 즉시 AI 분석 자동 트리거(§2.3)
- **출력**: 배치 단위 진행 상태, WS 이벤트 발행
- **예외**: CT/RGB 세트가 불완전하게 들어온 경우 즉시 `FAILED`(reason=`INCOMPLETE_SET`) 처리, 해당 셀만 스킵하고 배치 계속 진행

### 2.3 AI 분석 요청 및 종합 판정 (MVP) (비동기, 큐 기반) (FR-AI-001~007)
- **처리**:
  1. `CAPTURED` 셀 발생 시 BE가 작업 큐(예: Redis)에 CT/RGB 각각 별도 작업 항목으로 등록
  2. 상태를 `ANALYZING`으로 전환, WS push
  3. AI 분류 서버(Pod 1개)가 큐에서 순차적으로 꺼내 처리 후 콜백 또는 결과 큐에 적재
  4. BE가 CT 결과, RGB 결과를 각각 수신 → `label(PASS/REJECT)`, `confidence`, `defect_type`, `bbox` 저장
  5. **두 결과가 모두 도착하면 종합 판정 로직 수행**:
  if CT.label == 'REJECT' OR RGB.label == 'REJECT':
     final_label = 'REJECT'
  else:
      final_label = 'PASS'
6. 최종 판정(`final_label`)을 검사 결과에 저장, 상태를 `COMPLETED`로 전환
- **출력**: 정상=카운터 증가, 불량(`final_label = REJECT`)=`defects` 테이블 INSERT
- **예외**:
  - 큐 처리 실패/타임아웃 시 `FAILED` + 실패 사유(`TIMEOUT`, `AI_SERVER_ERROR`, `MALFORMED_RESPONSE` 등) 저장, 배치 내 타 셀은 영향 없이 계속 진행 (NFR-006)
  - CT/RGB 중 한쪽만 실패한 경우, 실패하지 않은 쪽 결과와 무관하게 해당 셀 전체를 `FAILED`(reason=`PARTIAL_ANALYSIS_FAILURE`) 처리(부분 판정 금지 — 종합 판정은 두 결과가 모두 확보된 경우에만 수행)

### 2.4 WS 이벤트 발행 (MVP) (FR-06 계열)
- **이벤트 스키마**: `cell.injected`, `cell.capturing`, `cell.captured`, `cell.analyzing`, `cell.result`, `stats`(주기), `report.ready`
- **처리**: 단일 WS 연결로 전체 이벤트 발행, 스키마는 별도 아키텍처 문서에서 고정
- **`cell.result` 페이로드 예시**:
```json
  {
    "cell_id": "cell_001",
    "final_label": "REJECT",
    "ct_result": { "label": "REJECT", "confidence": 0.91, "defect_type": "미세결함" },
    "rgb_result": { "label": "PASS", "confidence": 0.88, "defect_type": null }
  }
```

### 2.5 저장소 관리 (MVP) (MinIO/S3)
- **처리**: 개발 환경은 MinIO 엔드포인트, 배포 환경은 S3 엔드포인트로 설정만 교체(NFR-003 준수, S3 호환 API이므로 코드 변경 없음)
- **presigned URL 발급**: BE가 모든 이미지 접근 요청의 단일 창구
  - `GET /images/presigned?key=...` — FE 요청 시
  - AI 서버·LLM 서버도 원본 이미지가 필요하면 BE에 내부 API로 presigned URL 요청 후 사용
  - **채택 이유**: 자격증명 관리 지점을 BE 하나로 통일 → 구현/운영 단순화 (성능상 약간의 홉 증가는 감수)

### 2.6 리포트 디스패치 (MVP) (FR-REPORT-001~005, 비동기)
- **처리**:
  - 개별: FE의 명시적 요청 시에만(최종 판정 `REJECT` 건 대상) → LLM 서버에 비동기 디스패치(`@Async` 또는 큐). **CT/RGB 중 어느 쪽이 원인인지, 혹은 양쪽 모두인지 명시하여 전달**
  - 일일: FE의 명시적 요청 시 → 당일 누적 통계(최종 판정 기준) 집계 후 LLM 서버에 디스패치
  - 두 경로 모두 별도 엔드포인트(`/reports/individual/...`, `/reports/daily/...`)로 완전 분리
  - 완료 콜백 수신 시 `reports_individual` / `reports_daily` 각각 별도 테이블에 저장 + `report.ready` WS push
- **예외**: 배치 폭주 시 버퍼링/동시 호출 상한 필요 (§4 LLM 서버 스케줄링 전략과 연동, **정책 미정**)

### 2.7 로깅
- **처리**:
  - 개발 초기: AI/BE 동작 로그를 JSON 형태로 생성 + PostgreSQL(JSONB)에도 병행 저장
  - 추후: 로그는 MongoDB 전용 컬렉션으로만 저장, PostgreSQL에는 정형 테이블(검사 결과, 결함 결과 등)만 유지
- **비고**: 전환 시점과 마이그레이션 방식은 별도 확정 필요

---

## 3. AI 분류 서버 (FastAPI, 순수 추론)

### 3.1 CT 결함 판정 (MVP)
- **입력**: `POST /infer/ct { cell_id, image_key }` (BE 큐를 통해 비동기 수신)
- **처리**: BE에서 발급받은 presigned URL로 MinIO/S3에서 이미지 다운로드 → 전처리 → **CT 전용 YOLOv11-seg(+SAHI) 모델**로 추론
- **출력**: `{ cell_id, label(PASS/REJECT), confidence, defect_type, bbox: {x, y, width, height}, latency_ms }`
- **예외**: 추론 실패 시 5xx 반환 → BE가 `FAILED` 처리(NFR-006)
- **비고**: 이 label은 **CT 단독 판정**이며, 최종 판정(final_label)은 BE의 종합 판정 로직(§2.3)에서 RGB 결과와 함께 결정됨

### 3.2 RGB 결함 판정 (MVP)
- **입력**: `POST /infer/rgb { cell_id, image_key }` (CT와 별도 요청)
- **처리**: 동일 흐름, **RGB 전용 YOLOv11-seg(+SAHI) 모델**로 추론
- **출력**: CT와 동일 스키마
- **비고**: 이 label 또한 **RGB 단독 판정**, 최종 종합 판정은 BE 담당

### 3.3 헬스체크
- **입력**: `GET /health`
- **처리**: 두 모델(CT/RGB) 모두 로드 상태 확인
- **출력**: 200 OK / 미로드 시 503

### 3.4 비고 — 모델 로드맵
- 현재: CT/RGB 각각 별도 YOLOv11-seg(+SAHI) 모델(총 2개), 서버 기동 시 1회 로드 + 워밍업
- 고도화: Atrous Convolution 적용 모델, YOLO26 기반 모델 추가 검증 예정(현재 모델과 A/B 비교)
- bbox는 항상 응답에 포함(FR-AI-006 Must 충족), heatmap 이미지는 AI 서버가 생성하지 않음 — 좌표만 전달, 시각화는 FE 담당(§1.6)
- **AI 서버는 CT/RGB 종합 판정에 관여하지 않음** — 각 모달리티별 단독 결과만 반환하고, 종합 판정 책임은 전적으로 BE에 있음(관심사 분리)

---

## 4. LLM 리포트 서버 (LangGraph + Qwen)

### 4.1 개별 리포트 생성 (MVP)
- **입력**: `POST /reports/generate/individual { inspection_id, final_label, ct_defect_info, rgb_defect_info }` (BE의 비동기 디스패치, 사용자 요청 발생 시에만 트리거)
- **처리**: LangGraph 노드가 CT/RGB 중 어느 쪽에서(혹은 양쪽 모두에서) 결함이 발견됐는지 구분하여 오류 유형·예상 원인·점검 부분을 텍스트로 생성(stateless, 순수 생성)
- **출력**: 마크다운/텍스트 → BE에 콜백 전달
- **모델**: Qwen(버전 미정)

### 4.2 일일 리포트 생성 (MVP)
- **입력**: `POST /reports/generate/daily { date, aggregated_stats }`
- **처리**: 수율 요약, 결함 타입 최다 순위 등 집계 기반 요약 생성(최종 판정 기준 REJECT 건 집계)
- **출력**: 종합 리포트 문서 → BE 콜백

### 4.3 큐 및 스케줄링 전략 — 미정
> 요구사항 §4.1 예외처리(버퍼링/디바운스/동시 호출 상한/재시도 제한)를 충족하려면 큐 기반 처리가 필요하지만, 구체적 정책은 팀 논의 후 확정 필요:
> - 개별 vs 일일 리포트 간 우선순위 규칙
> - 동시 호출 상한 값
> - 재시도 횟수 및 백오프 정책
> - 큐 적체 시 대응(알림/우선순위 재조정 등)

---

## 5. 노드 간 통신 요약도
[FE] ──JWT 인증──> [BE(Spring Boot)]
│                      │
│◄──WS(실시간 이벤트)──┤
│                      │
│◄──presigned URL──────┤ (이미지 접근, BE 일원화)
│
├──비동기 큐──> [AI 분류 서버] (CT/RGB 별도 요청, Pod 1개)
│◄──CT/RGB 개별 결과──┤
│
├─(BE 내부: OR 로직으로 종합 판정)
│
├──비동기 디스패치──> [LLM 리포트 서버] (개별/일일 별도 엔드포인트)
│◄──콜백(report.ready)──┤
│
[PostgreSQL / MongoDB(로그) / MinIO·S3(이미지)]
---

## 6. 확정이 필요한 잔여 항목

| 항목 | 내용 |
|---|---|
| 요구사항 §9.2 개정 | PASS/REJECT 2단계로 확정됐으니 WARNING 관련 FR-DASH-004, AC-007 등도 공식 수정 필요 |
| CT/RGB 종합 판정 규칙 | ✅ 확정됨 — OR 방식(하나라도 REJECT면 최종 REJECT) |
| CT/RGB 부분 실패 처리 | 확정: 한쪽만 실패해도 셀 전체 `FAILED` 처리(부분 판정 금지) — 재검토 필요 시 별도 논의 |
| LLM 큐 스케줄링 정책 | §4.3 참고, 우선순위·재시도·상한값 구체화 필요 |
| 로그 이관 시점 | PostgreSQL 병행 저장 → MongoDB 전용 전환 시점/방식 |
