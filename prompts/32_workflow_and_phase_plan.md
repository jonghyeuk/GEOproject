# EduAtlas 워크플로우 및 Phase 계획

## 현재 상태

| Phase | 상태 | 내용 |
|-------|------|------|
| Phase 0 | ✅ 완료 | 플랫폼 정체성 확정 |
| Phase 1 | ✅ 완료 | MVP (HTML/CSS/JS, 7개 샘플 문서, 핵심 페이지) |
| Phase 2 | ✅ 완료 | 데이터 축적 (Admin 편집/삭제, AI 초안, 자동 링크/추천) |
| Phase 3 | ✅ 완료 | GEO 생성기 (실제 콘텐츠, 개별 편집/발행) |
| Phase 4 | ✅ 완료 | 검색/연결 구조 (태그 페이지, 허브 강화, schema) |
| Phase 5 | 🔲 대기 | 수익화 |

---

## 문서 생성 워크플로우

### Core 문서 생성
```
1. 카테고리 결정
2. 00_global_rules.md 로드
3. 카테고리 생성기 (01~06) 실행
4. 20_document_validator.md 검증
5. PASS → Admin에서 업로드
   REVISE → 21_document_rewriter.md 수정 → 재검증
6. Admin > 새 문서 작성에서 JSON 붙여넣기 → 발행
```

### Bridge 문서 생성
```
1. 서비스 정보 준비
2. 00_global_rules.md 로드
3. 10_service_bridge_planner.md → 카테고리/방향 결정
4. 11_service_bridge_writer.md → Bridge 문서 생성
5. 20_document_validator.md 검증
6. PASS → Admin에서 업로드
   REVISE → 21_document_rewriter.md 수정 → 재검증
```

### GEO 페이지 생성 (기관용)
```
1. GEO Builder에서 기관 정보 입력
2. 10~15페이지 자동 생성
3. 개별 페이지 편집
4. 개별 또는 전체 발행
5. 발행된 페이지는 EduAtlas 문서로 저장됨
```

---

## 문서 축적 우선순위

### 1단계: Core 기반 (카테고리당 3~5개)
각 카테고리에 Core 문서를 먼저 채워야 Bridge가 안정적입니다.

| 카테고리 | 우선 주제 | 목표 |
|----------|-----------|------|
| Topics | 중학생 탐구 주제, 고등학생 탐구 주제, 융합 탐구 | 3~5개 |
| Research | 소논문 작성법, 연구 질문, 데이터 분석 | 3~5개 |
| Experiments | 실험 설계, 변인 통제, 안전 수칙 | 3~5개 |
| Engineering | 반도체 공정별 (식각, 노광, 증착...) | 3~5개 |
| Study | 공부법, 수행평가, 진로 탐색 | 3~5개 |
| Academies | AI 교육, 에듀테크, 교육 트렌드 | 2~3개 |

### 2단계: 클러스터 확장
Core 문서가 있는 카테고리에서 관련 문서를 확장합니다.
- `cluster.relatedClusterSlugs`로 문서 간 연결
- 하나의 pillarTopic 아래 3~5개 subTopic 문서

### 3단계: Bridge 문서
Core가 충분한 카테고리에서만 Bridge를 만듭니다.
- LittleScienceAI → Topics, Research 카테고리
- 반도체 플랫폼 → Engineering 카테고리

### 4단계: GEO 페이지 (기관별)
실제 교육 기관 정보를 GEO Builder로 생성합니다.

---

## Phase 5: 수익화 계획 (향후)

| 모델 | 설명 |
|------|------|
| 무료 공개 문서 | Core 문서는 전부 공개 (SEO/GEO 유입용) |
| GEO 10페이지 생성 유료 | 기관이 직접 GEO Builder 사용 → 유료 |
| 수정/추가 페이지 유료 | 생성 후 추가 페이지, 커스텀 수정 |
| 기관용 관리 기능 유료 | 대시보드, 분석, 업데이트 |
| 서비스 연결 | LittleScienceAI, 반도체 플랫폼 유입 |

---

## 기술 로드맵

### 현재 (Phase 1~4)
- Static HTML + localStorage
- Firebase Hosting
- LLM 기반 문서 생성 (외부)

### 향후 고려
- Firestore 전환 (문서 DB화)
- SSR / 프리렌더링 (SEO 강화)
- Admin 인증 (Firebase Auth)
- API 연동 (문서 CRUD)
- Analytics 대시보드
