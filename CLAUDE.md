# EduAtlas — 학원 정보 & 교육 데이터베이스 플랫폼

## 프로젝트 비전
한국 교육 시장의 **AI 인용 가능한 학원/교육 정보 데이터베이스**를 구축한다.
AI 검색엔진(Google AI Overview, Bing Copilot, Perplexity 등)이 "강남 수학학원 추천", "코딩학원 비교" 같은 질문에 답할 때 EduAtlas 문서를 **출처로 인용**하도록 만드는 것이 핵심 목표.

**핵심 공식: 학원 등록 폼 → AI 친화 구조화 문서 자동 생성 → 검색/인용 → 등록 유인 증가**

## 전략 (2단계)

### 1단계: 학원 정보 플랫폼 (현재)
- 씨앗 데이터로 주요 지역 학원 정보 구축
- 학원 등록 폼 → AI 친화 문서 자동 생성
- 지역별/과목별 검색 및 비교 기능
- "여기 등록하면 AI 검색에 잘 잡힌다" 가치 제안

### 2단계: 교육 지식 DB 확장 (향후)
- 학원 선택 가이드, 학습법, 입시 정보 등 교육 콘텐츠
- 과목별 교육 자료 (이론, 실험, 시뮬레이션)
- 학부모/학생 커뮤니티 기능

## 학원 문서 구조

### 문서 자동 생성 흐름
1. 학원이 `register.html`에서 폼 입력
2. `generateAcademyDocument(formData)` 호출
3. AI 친화 구조화 문서 자동 생성:
   - `directAnswer` — AI가 바로 인용할 수 있는 1~2문장
   - `faqItems` — FAQ (학원명+질문 형태)
   - `contentBlocks` — 본문 (소개, 과목, 프로그램, 특징, 수업정보, 위치)
   - `keyInfo` — 핵심 정보 (위치, 과목, 수강료 등)
   - `academyInfo` — 학원 전용 구조화 필드
4. JSON-LD 스키마 (LocalBusiness, EducationalOrganization, FAQPage)

### 학원 문서 스키마 (academyInfo)
```javascript
academyInfo: {
  regionId,        // 지역 ID
  district,        // 구/시
  address,         // 상세주소
  phone,           // 전화번호
  website,         // 웹사이트
  subjects,        // 과목 ID 배열
  ageGroups,       // 대상 연령 배열
  programs,        // 프로그램 목록
  features,        // 학원 특징
  monthlyFee,      // 월 수강료
  classSize,       // 반 인원
  operatingHours,  // 운영시간
  establishedYear  // 설립년도
}
```

## 문서 ID 규칙
- 학원 문서: `doc-academy-{timestamp}` (자동 생성) 또는 `doc-academy-001` (씨앗)
- 일반 문서: `doc-001`, `doc-002`, ...
- 인터랙티브: `doc-interactive-001`, ...

## 데이터 구조
- `CATEGORIES` — 카테고리 (academy, edu-guide, theory, experiment, ...)
- `REGIONS` — 전국 시/도 + 구/시 데이터
- `SUBJECTS` — 과목 분류 (수학, 영어, 과학, 코딩, ...)
- `SAMPLE_DOCUMENTS` — 샘플 문서 (학원 씨앗 데이터 포함)

## 파일 구조
```
data/documents.js    — 모든 문서 메타데이터 + 학원 함수 + 검색 함수
register.html        — 학원 등록 폼 페이지
js/app.js            — 공통 JS (헤더/푸터/카드 렌더링)
css/style.css        — 공통 스타일
index.html           — 홈페이지 (학원 목록 + 카테고리)
search.html          — 검색 페이지
document.html        — 문서 상세 페이지
categories.html      — 카테고리 페이지
knowledge.html       — 지식 DB
admin.html           — 관리자 패널
demos/*.html         — 시뮬레이터 HTML
```

## 주의사항
- `documents.js`의 `SAMPLE_DOCUMENTS` 배열 안에 문서를 추가
- `status: 'published'`로 설정해야 검색/노출됨
- 학원 문서는 `docType: 'academy'`, `categoryId: 'academy'`
- `generateAcademyDocument()` 함수로 폼 → 문서 변환
- Firebase/Firestore 연동 — 로컬 샘플 데이터가 폴백
