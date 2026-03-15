# EduAtlas 문서 JSON 스키마 레퍼런스

## 용도
문서 JSON의 전체 필드 목록과 규칙입니다.
생성기 결과물이 이 스키마를 따르는지 확인할 때 씁니다.

---

## 필수 필드

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `slug` | string | URL용 고유 식별자. kebab-case. 한글 가능. | `"science-research-paper-guide"` |
| `title` | string | 문서 제목. 50자 이내. | `"중학생 과학 소논문 작성 가이드"` |
| `summary` | string | 1~2문장 요약. | `"중학생이 과학 소논문을 작성할 때..."` |
| `docType` | enum | 문서 유형 | `"article"` \| `"topic"` \| `"guide"` \| `"academy"` \| `"company"` \| `"concept"` |
| `categoryId` | enum | 카테고리 ID | `"academies"` \| `"research"` \| `"topics"` \| `"experiments"` \| `"study"` \| `"engineering"` |
| `tags` | string[] | 태그 목록. 3~10개. | `["소논문", "과학탐구", "중학생"]` |
| `status` | enum | 공개 상태 | `"published"` \| `"draft"` |
| `body` | string | Markdown 본문. h2 최소 2개. | `"## 정의\n\n..."` |

## GEO 필드 (권장)

| 필드 | 타입 | 설명 | 규칙 |
|------|------|------|------|
| `directAnswer` | string[] | 핵심 답변. AI 검색 결과용. | 1~3개. 각 1문장 완결형. "~입니다"로 끝남. |
| `targetAudience` | string[] | 대상 독자 | `["중학교 1~3학년", "과학 교사"]` |
| `entities` | string[] | 핵심 개념/엔티티 | 본문에서 자동 링크 대상이 됨 |
| `faqItems` | object[] | FAQ 목록 | 3~7개. `{question, answer}` |
| `keyInfo` | object | 핵심 정보 박스 | 최소 2개 필드. 문서 유형에 따라 키가 다름. |

## 클러스터 필드

```json
{
  "cluster": {
    "pillarTopic": "상위 주제 (예: 중학생 과학 탐구)",
    "subTopic": "하위 주제 (예: 소논문 작성)",
    "intentType": "how-to | what-is | comparison | list",
    "relatedClusterSlugs": ["slug1", "slug2"]
  }
}
```

| 필드 | 설명 |
|------|------|
| `pillarTopic` | 이 문서가 속한 큰 주제 |
| `subTopic` | 이 문서의 세부 주제 |
| `intentType` | 검색 의도 유형 |
| `relatedClusterSlugs` | 같은 클러스터의 다른 문서 slug |

## 메타 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `authorInfo` | object | `{name, role, expertise}` |
| `seoTitle` | string | SEO용 제목 (title과 다를 수 있음) |
| `seoDescription` | string | meta description |
| `schemaTypes` | string[] | 적용할 schema.org 타입 |
| `createdAt` | string | 생성일 `YYYY-MM-DD` |
| `updatedAt` | string | 수정일 `YYYY-MM-DD` |

## 연결 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `relatedDocs` | string[] | 수동 연결 문서 ID 목록 |
| `relatedServices` | string[] | 연결 서비스 ID (`"littlescience"`, `"semiconductor-platform"`) |

## Bridge 전용 필드 (선택)

```json
{
  "bridgeInfo": {
    "targetService": "서비스명",
    "connectionType": "natural | topic-extension | tool-recommendation",
    "ctaText": "CTA 문구",
    "ctaUrl": "서비스 URL"
  }
}
```

## contentBlocks 필드 (선택)

body(Markdown) 대신 구조화된 블록으로 본문을 제공할 때 사용.
상세 스펙은 `31_contentblocks_spec.md` 참조.

```json
{
  "contentBlocks": [
    { "type": "heading", "level": 2, "text": "제목" },
    { "type": "paragraph", "text": "본문" },
    { "type": "list", "ordered": false, "items": ["항목1", "항목2"] }
  ]
}
```

## keyInfo 유형별 키

### article / concept
```json
{ "definition": "...", "importance": "...", "types": "..." }
```

### topic
```json
{ "definition": "...", "audience": "...", "difficulty": "초급~중급" }
```

### guide
```json
{ "definition": "...", "types": "...", "audience": "..." }
```

### academy
```json
{ "name": "기관명", "location": "지역", "subjects": "주요 과목" }
```

### company
```json
{ "name": "회사명", "industry": "산업", "headquarters": "본사" }
```

## 유효성 규칙 요약

- `slug`: 공백 없음, kebab-case
- `title`: 비어있지 않음, 50자 이내
- `summary`: 비어있지 않음, 1~2문장
- `tags`: 3개 이상, 10개 이하
- `body`: h2 최소 2개
- `directAnswer`: 각 문장 "~입니다"로 끝남
- `faqItems`: question과 answer 모두 비어있지 않음
- `status`: published 또는 draft만 허용
