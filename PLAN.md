# LittleScience Knowledge Platform - 개발 계획서

## 플랫폼 정체성
> **문서형 지식 데이터 플랫폼 + GEO 생성 엔진**
> 교육·연구·기술 정보를 AI가 읽기 좋은 구조로 축적하고, 검색 노출과 서비스 연결까지 만드는 플랫폼

### 핵심 역할 2가지
1. **문서형 지식 플랫폼** (Knowledge)
2. **교육 GEO 페이지 생성기** (GEO Builder)

---

## 단계별 계획

### 0단계: 플랫폼 정체성 확정 ✅
- [x] 이름/역할 분리
- [x] 메뉴 구조 확정: Home / Knowledge / GEO Builder / Categories / Services / Search

### 1단계: 가장 작은 MVP 🔲 ← 현재 단계
- [ ] 공통 CSS/JS 생성
- [ ] 샘플 데이터 (data/documents.js) ✅ 생성됨
- [ ] index.html (메인 홈페이지)
- [ ] knowledge.html (문서 목록)
- [ ] document.html (문서 상세 페이지)
- [ ] categories.html (카테고리 허브)
- [ ] geo-builder.html (GEO 생성기 기본형)
- [ ] services.html (서비스 연결)
- [ ] search.html (검색)
- [ ] admin.html (관리자 - 문서 발행)
- [ ] firebase.json / sitemap.xml / robots.txt 업데이트

#### MVP 문서 타입 (3개)
1. **정보 문서** - 반도체 식각, 과학 소논문, 탐구 설계 방법
2. **기관/회사 문서** - 반도체 회사, 학원 소개, 교육 기관
3. **주제형 문서** - 중학생 과학 탐구 주제, 화학 실험 아이디어, 공부법

#### 카테고리 구조 (최상위 5개)
| 카테고리 | 하위 |
|----------|------|
| Education | 교육 방법, AI 교육, 프로젝트 수업, 커리큘럼 |
| Research | 과학 소논문, 탐구 주제, 실험 설계, 데이터 분석 |
| Engineering | 반도체, 공정, 장비, 시뮬레이터 |
| Academy | 학원 소개, 지역 학원, 과목별 학원, 교육 특징 |
| Study | 공부법, 수행평가, 진로, 학습 도구 |

### 2단계: 데이터 축적 🔲
- [ ] 기존 지식/문서를 카테고리별 정리
- [ ] AI 초안 생성 기능
- [ ] 템플릿에 맞춰 저장
- [ ] 내부 링크 자동 연결
- [ ] related pages 자동 생성
- 문서를 "글"이 아닌 **"레코드"**로 관리 (제목/카테고리/태그/요약/본문/관련항목/출처/공개상태)

### 3단계: GEO 생성기 추가 🔲
- [ ] 입력: 기관명, 지역, 과목, 대상, 특징
- [ ] 출력: 기관 소개 페이지, 지역+과목 페이지, 교육 특징 페이지, 공부법/주제 페이지
- [ ] 기본 10페이지 생성
- [ ] 수정/발행 기능
- 구조: 사람용 30% + AI용 70%

### 4단계: 검색/연결 구조 강화 🔲
- [ ] 관련 문서 추천
- [ ] 카테고리별 허브 페이지
- [ ] 태그 페이지
- [ ] 기관/회사/주제 연결
- [ ] 검색 결과 페이지
- [ ] sitemap 자동 생성
- [ ] schema markup (Article, EducationalOrganization, FAQ, Breadcrumb)

### 5단계: 수익화 🔲
- [ ] 무료 공개 문서
- [ ] GEO 10페이지 생성 유료
- [ ] 수정/추가 페이지 유료
- [ ] 기관용 관리 기능 유료
- [ ] 서비스 연결 (LittleScience, 반도체 플랫폼)

---

## UI 구조 요약

### 홈 화면
- 상단 메뉴: Home / Knowledge / GEO Builder / Categories / Services / Search
- 메인: 검색창 → 카테고리 카드 → 최신 문서 → 추천 문서 → GEO 생성기 진입
- 하단: 서비스 연결 배너 (LittleScience, 반도체 플랫폼)

### 문서 상세 페이지
- 제목 → 한 줄 요약 → 핵심 정보 박스 → 본문 → 관련 문서 → 관련 카테고리 → 관련 서비스

### 카테고리 페이지 (허브 역할)
- 소개 → 하위 분류 → 대표 문서 → 최신 문서 → 인기 태그

### GEO Builder
- 입력 폼 (기관명/지역/과목/대상/특징/톤/페이지 수) → 생성 → 미리보기 → 수정 → 발행

---

## 데이터 저장 구조

### 핵심 테이블 (현재 localStorage / 향후 DB 전환)
- `documents` - 문서 저장 (id, slug, title, summary, body, docType, status, categoryId, tags)
- `categories` - 카테고리 트리 (id, slug, name, parentId, description)
- `tags` - 태그 관리
- `entities` - 위키형 엔티티 (company, academy, topic, concept, technology, region)
- `relations` - 문서 간 연결 (related, belongs_to, references, service_link)
- `geo_projects` / `geo_pages` - GEO 프로젝트/페이지

### docType 종류
article / topic / company / academy / concept / guide / geo_page

---

## 파일 구조 (현재)
```
littlescienceHTML/
├── PLAN.md          ← 이 파일 (개발 계획)
├── index.html       ← 메인 홈
├── knowledge.html   ← 문서 목록
├── document.html    ← 문서 상세
├── categories.html  ← 카테고리 허브
├── geo-builder.html ← GEO 생성기
├── services.html    ← 서비스 연결
├── search.html      ← 검색
├── admin.html       ← 관리자
├── css/
│   └── style.css    ← 공통 스타일
├── js/
│   └── app.js       ← 공통 로직
├── data/
│   └── documents.js ← 샘플 데이터 ✅
├── firebase.json
├── sitemap.xml
├── robots.txt
└── .firebaserc
```

---

## 핵심 원칙
1. 문서는 "글"이 아니라 **"레코드"**
2. AI가 읽기 좋은 구조 (명확한 제목, 짧은 요약, 구조화된 섹션, 태그, schema)
3. 처음엔 **문서 저장소 + 자동 문서 생성기**로 시작
4. 직접 영업보다 **문서/도구/구조가 유입을 만드는 방식**
