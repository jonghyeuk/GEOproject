# EduAtlas GEO 프로젝트 — Claude 작업 가이드

## 프로젝트 개요
EduAtlas는 중고등학생 대상 과학 교육 플랫폼으로, AI 검색엔진(Google AI Overview, Perplexity 등)에서 콘텐츠가 인용되도록 최적화(GEO)하는 것이 핵심 목표입니다.

## GEO 핵심 전략

### 시뮬레이터 → 이론 문서 추출 패턴
시뮬레이터 HTML은 인터랙티브 체험 도구입니다. 그 안의 이론/원리/실험방법은 **독립된 텍스트 문서**로 추출해야 AI봇이 크롤링·인용할 수 있습니다.

**새 시뮬레이터가 추가될 때마다 아래 패턴을 따릅니다:**

1. **이론 문서 추출** — 시뮬레이터의 "이론 탭" 콘텐츠를 `data/documents.js`에 독립 article로 생성
   - `docType: 'article'`
   - `categoryId: 'science'`
   - 반드시 `directAnswer`, `faqItems`, `contentBlocks`, `keyInfo` 포함
   - `body` 필드에 마크다운 본문 (정의, 원리, 공식 유도, 실생활 적용)

2. **relatedDocs 양방향 연결** — 시뮬레이터 ↔ 이론 문서 ↔ 관련 문서 모두 양방향
   - 시뮬레이터 doc에 이론 doc ID 추가
   - 이론 doc에 시뮬레이터 doc ID 추가
   - 기존 관련 문서(실험설계, 탐구주제 등)에도 연결

3. **GEO 타겟 검색어 설정** — `seoTitle`, `seoDescription`, `tags`에 실제 검색어 반영
   - 예: "플랑크 상수란", "PV=nRT 이상기체 법칙", "Beer-Lambert 법칙 공식"

4. **시뮬레이터 HTML 정식버전 링크** — 각 탭 하단 + 제출 버튼 아래에:
   - 정식버전 안내: `kr.littlescienceclass.com`
   - 선생님 평가시스템 안내 문구

### 문서 ID 규칙
- 일반 문서: `doc-001`, `doc-002`, ...
- 인터랙티브: `doc-interactive-001`, `doc-interactive-002`, ...
- 시뮬레이터에서 추출한 이론 문서: `doc-008` 부터 순번

### 정식버전 링크 패턴
시뮬레이터 HTML에 삽입할 공통 요소:

**각 탭(section) 하단:**
```html
<div class="official-banner">
  <span class="official-icon">🔬</span>
  <span>더 많은 실험과 학습 콘텐츠는 <a href="https://kr.littlescienceclass.com" target="_blank" rel="noopener">정식버전</a>에서 이용하세요</span>
</div>
```

**제출 버튼 아래:**
```html
<div class="teacher-system-notice">
  <p>📋 정식버전에서는 선생님 평가시스템을 이용할 수 있습니다.</p>
  <a href="https://kr.littlescienceclass.com" target="_blank" rel="noopener">
    kr.littlescienceclass.com →
  </a>
</div>
```

## 파일 구조
```
data/documents.js    — 모든 문서/시뮬레이터 메타데이터
demos/*.html         — 시뮬레이터 HTML (독립 실행)
interactive.html     — 시뮬레이터 허브 페이지
js/app.js            — 공통 JS (헤더/푸터)
```

## 주의사항
- `documents.js`의 `SAMPLE_DOCUMENTS` 배열 안에 문서를 추가
- `status: 'published'`로 설정해야 검색/노출됨
- 시뮬레이터 HTML은 인라인 CSS/JS (별도 파일 없음)
- Firebase/Firestore 연동 — 로컬 샘플 데이터가 폴백
