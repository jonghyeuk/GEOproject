# EduAtlas 문서 생성 공통 규칙

## 플랫폼 정체성
- **EduAtlas**: 교육 데이터를 구조화하여 AI와 사람 모두 탐색하기 쉬운 형태로 제공하는 교육 정보 플랫폼
- 문서는 "글"이 아니라 **"레코드"** — 제목, 카테고리, 태그, 요약, 본문, 관련 항목, 출처, 공개 상태를 가진 구조화된 데이터

## 문체 원칙
- 직답형: 핵심 답변을 먼저, 설명은 그 다음
- 간결체: 불필요한 수식어, 반복, 과장 금지
- 구조화: h2/h3 계층, 목록, 표를 적극 활용
- 실용적: 이론만이 아니라 실행 가능한 단계 제시
- 대상 명시: 누구를 위한 문서인지 항상 표시

## JSON 출력 규칙
생성된 문서는 아래 JSON 구조를 따릅니다:

```json
{
  "slug": "kebab-case-url-friendly",
  "title": "문서 제목",
  "summary": "1~2문장 요약",
  "docType": "article | topic | guide | academy | company | concept",
  "categoryId": "academies | research | topics | experiments | study | engineering",
  "tags": ["태그1", "태그2", "태그3"],
  "targetAudience": ["중학생", "교사"],
  "directAnswer": [
    "핵심 답변 1문장",
    "핵심 답변 2문장"
  ],
  "keyInfo": {
    "definition": "...",
    "importance": "...",
    "audience": "..."
  },
  "body": "## Markdown 본문",
  "faqItems": [
    { "question": "질문?", "answer": "답변" }
  ],
  "authorInfo": {
    "name": "EduAtlas 편집팀",
    "role": "콘텐츠 에디터",
    "expertise": "분야"
  },
  "cluster": {
    "pillarTopic": "상위 주제",
    "subTopic": "하위 주제",
    "intentType": "how-to | what-is | comparison | list",
    "relatedClusterSlugs": ["slug1", "slug2"]
  },
  "relatedDocs": [],
  "relatedServices": [],
  "status": "published"
}
```

## directAnswer 규칙
- 반드시 3개 이내
- 각 답변은 1문장 완결형
- "~입니다"로 끝나는 단정적 문장
- 문서를 읽지 않아도 핵심을 알 수 있어야 함
- AI 검색 결과에 바로 표시될 수 있는 수준

## FAQ 규칙
- 최소 3개, 최대 7개
- 실제 학생/학부모가 묻는 질문
- 답변은 2~3문장 이내
- FAQ로 검색 롱테일 키워드 커버

## Core / Service-Bridge 문서 정의

### Core 문서
- EduAtlas 자체의 지식 문서
- 특정 서비스를 홍보하지 않음
- 순수 정보 제공 목적
- 예: "과학 소논문 작성법", "변인 통제 방법", "반도체 식각 공정"

### Service-Bridge 문서
- Core 문서에서 자연스럽게 외부 서비스로 연결
- 문서의 80%는 정보 제공, 20% 이내에서 서비스 언급
- CTA는 문서 하단에 1회만
- 억지스러운 연결 금지
- 예: "과학 탐구 주제 탐색" → 하단에 "LittleScienceAI로 더 많은 주제 탐색하기"

## CTA 원칙
- Bridge 문서에만 포함
- 문서 하단에 1회만
- "자세히 알아보기", "탐색하기" 등 소프트한 표현
- 가격, 가입, 구매 등 직접적 판매 언어 금지
- CTA가 없어도 문서가 완전해야 함

## GEO 관점 작성 원칙
1. 직답형 구조 — 상단에 핵심 답변
2. 구조화된 본문 — AI가 파싱하기 좋은 h2/h3/목록/표
3. FAQ 포함 — 롱테일 검색 대응
4. 엔티티 명확화 — entities 필드에 핵심 개념 나열
5. 클러스터 연결 — 관련 문서와 주제 클러스터 형성
6. 메타데이터 완성 — seoTitle, seoDescription, schemaTypes

## 금지사항
- 과장된 표현 ("최고의", "유일한", "완벽한")
- 근거 없는 주장
- 다른 기관/서비스 비하
- 개인정보 포함
- 저작권 침해 콘텐츠
- 의료/법률 자문 대체
- AI 생성임을 숨기는 것 (EduAtlas는 AI 활용을 공개함)
