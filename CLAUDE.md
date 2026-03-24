# EduAtlas — AI 교육 지식 데이터베이스 프로젝트

## 프로젝트 비전
한국어 과학 교육의 **AI 인용 가능한 지식 데이터베이스**를 구축한다.
AI 검색엔진(Google AI Overview, Bing Copilot, Perplexity 등)이 교육 관련 질문에 답할 때 EduAtlas 문서를 **출처로 인용**하도록 만드는 것이 핵심 목표.

**핵심 공식: 시뮬레이터 HTML → 구조화된 문서 대량 생산 → AI가 인용하는 지식 DB**

## 작업 흐름 (시뮬레이터 → 문서 생산)

### 1단계: 시뮬레이터 HTML 수령
사용자가 시뮬레이터 HTML 파일을 제공한다.

### 2단계: 콘텐츠 추출 → 독립 문서 분리 생산
하나의 시뮬레이터에서 **여러 개의 독립 문서**를 추출한다. 각 문서는 AI가 특정 검색 쿼리에 대해 인용할 수 있는 단위.

| 문서 유형 | 타겟 쿼리 예시 | docType |
|---|---|---|
| **이론/원리 문서** | "플랑크 상수란", "이상기체 법칙 공식" | `article` |
| **실험 방법 문서** | "플랑크 상수 측정 실험", "보일 법칙 실험 방법" | `article` |
| **실험장치 제작 문서** | "분광기 만들기", "간이 기체 실험장치 제작" | `article` |

**각 문서에 반드시 포함:**
- `directAnswer` — AI가 바로 인용할 수 있는 1~2문장 요약
- `faqItems` — FAQ 구조 (Q&A 쌍)
- `contentBlocks` — 본문 섹션별 구조화
- `keyInfo` — 핵심 데이터/수치
- `body` — 마크다운 본문 (정의, 원리, 공식, 적용 등)

### 3단계: 문서 간 연결 그래프
모든 문서는 양방향으로 연결한다:

```
이론 문서 ←→ 실험 방법 문서 ←→ 실험장치 제작 문서
    ↕              ↕                    ↕
시뮬레이터 (외부 링크 또는 내부 데모)
    ↕
관련 다른 주제 문서들
```

- `relatedDocs` 필드로 문서 ID 양방향 연결
- 시뮬레이터가 외부 도메인(예: `kr.littlescienceclass.com`)에 있으면 `simulatorUrl` 필드에 URL 저장
- 사용자가 시뮬레이터 URL을 별도로 알려주면 해당 문서에 링크 추가

### 4단계: GEO 최적화
- `seoTitle`, `seoDescription` — 실제 사용자 검색어 기반
- `tags` — 다양한 검색 변형 포함
- JSON-LD 스키마 마크업 (Article, FAQPage, HowTo) 적용
- `categoryId: 'science'`, `status: 'published'`

## 문서 ID 규칙
- 일반 문서: `doc-001`, `doc-002`, ...
- 인터랙티브(시뮬레이터 메타): `doc-interactive-001`, `doc-interactive-002`, ...
- 추출된 지식 문서: `doc-008`부터 순번 증가

## 외부 시뮬레이터 연결 방식
시뮬레이터 코드가 다른 도메인 서비스에 공개되어 있는 경우:
1. 사용자가 시뮬레이터 URL을 알려줌
2. 관련 문서의 `simulatorUrl` 필드에 해당 URL 저장
3. 문서 본문과 스키마 마크업에 "인터랙티브 시뮬레이션 체험하기" 링크로 삽입
4. 시뮬레이터 메타 문서(`doc-interactive-*`)에도 외부 URL 기록

```javascript
// 문서 예시
{
  id: 'doc-012',
  title: '플랑크 상수와 광전효과 원리',
  simulatorUrl: 'https://kr.littlescienceclass.com/sims/planck',  // 외부 시뮬레이터
  relatedDocs: ['doc-013', 'doc-014', 'doc-interactive-003'],
  // ...
}
```

## 대량 생산 전략
- 시뮬레이터 1개 → 문서 2~4개 생산 (이론, 실험, 장치제작 등)
- 교과과정 단원별 체계적 확장
- 문서가 쌓일수록 AI 인용 확률 증가 (복리 효과)
- 문서 간 링크가 촘촘할수록 AI가 관련 문서를 함께 참조

## 파일 구조
```
data/documents.js    — 모든 문서 메타데이터 (SAMPLE_DOCUMENTS 배열)
demos/*.html         — 시뮬레이터 HTML (독립 실행, 있는 경우)
interactive.html     — 시뮬레이터 허브 페이지
js/app.js            — 공통 JS (헤더/푸터)
```

## 주의사항
- `documents.js`의 `SAMPLE_DOCUMENTS` 배열 안에 문서를 추가
- `status: 'published'`로 설정해야 검색/노출됨
- 시뮬레이터 HTML은 인라인 CSS/JS (별도 파일 없음)
- Firebase/Firestore 연동 — 로컬 샘플 데이터가 폴백
