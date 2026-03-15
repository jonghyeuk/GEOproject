# EduAtlas 코딩 담당자 전달 문서 v2

## 용도
개발 담당자가 구현 범위, 데이터 구조, 저장 방식, 보안 규칙을 한 번에 파악하기 위한 최종 전달 문서입니다.

---

## 1. 프로젝트 개요

**EduAtlas**는 교육·연구·기술 정보를 구조화된 문서로 축적하고, AI 검색에 최적화된 형태로 제공하는 교육 데이터 플랫폼입니다.

- 프론트엔드: Vanilla HTML/CSS/JS (프레임워크 없음)
- 데이터 저장: 현재 localStorage (향후 Firestore 전환 예정)
- 호스팅: Firebase Hosting
- 문서 생성: LLM 기반 (Claude/GPT + 프롬프트 파이프라인)

---

## 2. 파일 구조

```
littlescienceHTML/
├── index.html           ← 메인 홈
├── knowledge.html       ← 문서 목록 (필터, 검색, 태그)
├── document.html        ← 문서 상세 (엔티티 링크, 추천, schema)
├── categories.html      ← 카테고리 허브 (통계, CollectionPage)
├── tag.html             ← 태그 허브 (클라우드, 테이블, 상세)
├── geo-builder.html     ← GEO 생성기 (콘텐츠 생성, 편집, 발행)
├── search.html          ← 검색
├── admin.html           ← 관리자 (CRUD, AI 초안, 데이터, sitemap)
├── services.html        ← 서비스 연결
├── about.html           ← 소개
├── contact.html         ← 문의
├── privacy.html         ← 개인정보처리방침
├── terms.html           ← 이용약관
├── content-policy.html  ← 콘텐츠 운영 원칙
├── css/style.css        ← 공통 스타일
├── js/app.js            ← 공통 로직 (헤더/푸터, 렌더링, 네비게이션)
├── data/documents.js    ← 데이터 + CRUD + 추천/링크 함수
├── prompts/             ← LLM 프롬프트 (호스팅 제외)
├── firebase.json        ← Firebase 설정
├── sitemap.xml
└── robots.txt
```

---

## 3. 데이터 구조

### 3.1 핵심 데이터 (data/documents.js)

**CATEGORIES** — 6개 고정 카테고리
```js
{ id, slug, name, nameKo, icon, description, subcategories }
```

**DOCUMENTS** — 샘플 문서 7개 (하드코딩)
```js
{
  id, slug, title, summary, docType, categoryId, tags, status,
  createdAt, updatedAt, body, keyInfo, relatedDocs, relatedServices,
  // GEO v2 필드 (선택)
  directAnswer, targetAudience, entities, cluster,
  contentBlocks, faqItems, authorInfo,
  seoTitle, seoDescription, schemaTypes, technicalMeta
}
```

**SERVICES** — 2개 연결 서비스
```js
{ id, name, description, url, icon, color }
```

### 3.2 커스텀 문서 저장

localStorage 키: `kp_documents`

샘플 + 커스텀을 합쳐서 사용:
```js
getAllDocuments() // DOCUMENTS + localStorage 커스텀
```

커스텀 문서 ID 규칙: `doc-custom-{timestamp}`

### 3.3 docType 종류
`article` | `topic` | `guide` | `academy` | `company` | `concept`

---

## 4. 주요 함수 (data/documents.js)

### CRUD
| 함수 | 설명 |
|------|------|
| `getAllDocuments()` | 샘플 + 커스텀 문서 전체 |
| `getDocumentBySlug(slug)` | slug로 문서 조회 |
| `getDocumentById(id)` | id로 문서 조회 |
| `saveDocument(doc)` | 새 문서 저장 (id 자동 생성) |
| `updateDocument(doc)` | 기존 커스텀 문서 수정 |
| `deleteDocument(id)` | 커스텀 문서 삭제 |
| `isCustomDocument(id)` | 커스텀 문서 여부 확인 |

### 검색/필터
| 함수 | 설명 |
|------|------|
| `getDocumentsByCategory(categoryId)` | 카테고리별 published 문서 |
| `getDocumentsByTag(tag)` | 태그별 published 문서 |
| `searchDocuments(query)` | title/summary/tags/body 검색 |
| `getAllTags()` | 전체 태그 + 빈도 (내림차순) |

### 추천/링크
| 함수 | 설명 |
|------|------|
| `getRelatedDocuments(doc)` | relatedDocs 기반 수동 연결 |
| `getRecommendedDocs(doc, limit)` | 태그+카테고리+클러스터+엔티티 점수 기반 자동 추천 |
| `autoLinkEntities(html, currentSlug)` | 본문에서 다른 문서 제목/엔티티를 내부 링크로 교체 |

### 렌더링
| 함수 | 설명 |
|------|------|
| `renderMarkdown(md)` | 간이 Markdown → HTML |
| `renderContentBlocks(blocks)` | contentBlocks JSON → HTML |
| `renderDocCard(doc)` | 문서 카드 HTML |
| `renderCatCard(cat)` | 카테고리 카드 HTML |

---

## 5. Schema Markup

### document.html에서 자동 생성
| schema 타입 | 조건 |
|-------------|------|
| Article | 모든 문서 |
| FAQPage | faqItems가 있을 때 |
| EducationalOrganization | docType이 academy 또는 company |
| BreadcrumbList | 모든 문서 |

### categories.html
| schema 타입 | 조건 |
|-------------|------|
| CollectionPage | 카테고리 상세 페이지 |

### index.html
| schema 타입 | 고정 |
|-------------|------|
| WebSite + SearchAction | 항상 |

### about.html
| schema 타입 | 고정 |
|-------------|------|
| Organization | 항상 |

---

## 6. GEO Builder (geo-builder.html)

### 입력
기관명, 지역, 과목, 대상, 특징, 톤, 페이지 수

### 출력
15종 페이지 템플릿 중 선택된 수만큼 생성:
`intro`, `region`, `subject`, `audience`, `feature`, `study`, `topic`, `review`, `faq`, `comparison`, `curriculum`, `event`, `career`, `parent`, `tip`

### 워크플로우
1. 입력 → 자동 생성 (실제 본문 포함)
2. 개별 편집 (제목/요약/본문)
3. 개별 또는 전체 발행 → `saveDocument()`로 localStorage에 저장
4. 내보내기 (JSON)

---

## 7. Admin (admin.html)

### 탭 구조
1. **새 문서 작성** — 폼 기반 생성/편집
2. **AI 초안 생성** — 템플릿 기반 초안 → 폼으로 전달
3. **문서 관리** — 검색, 편집, 삭제 (커스텀만)
4. **데이터** — 내보내기, 가져오기, sitemap 생성, 초기화

### 편집 플로우
문서 관리 > 편집 클릭 → 폼에 데이터 로드 → 수정 → 발행 → `updateDocument()`

---

## 8. 검증은 LLM에서 한다

코드 레벨 검증은 최소한으로 합니다.
문서 품질 검증은 LLM 파이프라인에서 처리:

```
생성 (카테고리 generator)
  → 검증 (20_document_validator.md)
  → 수정 (21_document_rewriter.md)
  → Admin에서 업로드
```

코드에서 하는 것:
- 필수 필드 체크 (title, summary, categoryId, body)
- JSON 파싱 에러 처리
- slug 자동 생성

---

## 9. 보안 규칙

### 현재 (Phase 1~4)
- Admin 페이지에 인증 없음 (URL 직접 접근 가능)
- localStorage 기반이므로 서버 보안 이슈 없음
- firebase.json에서 prompts/, PLAN.md 호스팅 제외

### 향후 Firestore 전환 시
- Firebase Auth로 Admin 보호
- Firestore Security Rules 설정
- 읽기: 모든 사용자 (published 문서만)
- 쓰기: 인증된 관리자만

---

## 10. 향후 개발 고려

### SSR / 프리렌더링
현재는 클라이언트 렌더링이므로 검색엔진 크롤링에 제한이 있을 수 있음.
향후 옵션:
- Firebase Cloud Functions + SSR
- 빌드 타임 프리렌더링 (문서별 정적 HTML 생성)
- 또는 Astro/Next.js 전환

### Firestore 전환
```
localStorage → Firestore
kp_documents → documents 컬렉션
CATEGORIES → categories 컬렉션 (또는 유지)
```

### API 연동
Admin에서 직접 LLM API 호출하여 문서 생성 → 검증 → 저장을 자동화할 수 있음.

---

## 11. 핵심 원칙 (개발 시 유의)

1. 문서는 "글"이 아니라 **"레코드"** — 구조화된 데이터로 취급
2. AI가 읽기 좋은 구조 — 명확한 제목, 짧은 요약, 구조화된 섹션, 태그, schema
3. 직접 영업보다 **문서/도구/구조가 유입을 만드는 방식**
4. 현재 localStorage로 충분. 과도한 인프라 투자 금지.
5. LLM 파이프라인이 품질을 담당. 코드는 저장/표시만.
