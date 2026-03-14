/**
 * LittleScience Knowledge Platform - Sample Data
 * 문서형 지식 데이터 플랫폼 샘플 데이터
 */

const CATEGORIES = [
  {
    id: 'education',
    slug: 'education',
    name: 'Education',
    nameKo: '교육',
    icon: '📚',
    description: '교육 방법, AI 교육, 프로젝트 수업, 커리큘럼 관련 문서',
    subcategories: ['교육 방법', 'AI 교육', '프로젝트 수업', '커리큘럼']
  },
  {
    id: 'research',
    slug: 'research',
    name: 'Research',
    nameKo: '연구',
    icon: '🔬',
    description: '과학 소논문, 탐구 주제, 실험 설계, 데이터 분석 관련 문서',
    subcategories: ['과학 소논문', '탐구 주제', '실험 설계', '데이터 분석']
  },
  {
    id: 'engineering',
    slug: 'engineering',
    name: 'Engineering',
    nameKo: '공학',
    icon: '⚙️',
    description: '반도체, 공정, 장비, 시뮬레이터 관련 기술 문서',
    subcategories: ['반도체', '공정', '장비', '시뮬레이터']
  },
  {
    id: 'academy',
    slug: 'academy',
    name: 'Academy',
    nameKo: '학원/기관',
    icon: '🏫',
    description: '학원 소개, 지역 학원, 과목별 학원, 교육 특징',
    subcategories: ['학원 소개', '지역 학원', '과목별 학원', '교육 특징']
  },
  {
    id: 'study',
    slug: 'study',
    name: 'Study',
    nameKo: '학습',
    icon: '📝',
    description: '공부법, 수행평가, 진로, 학습 도구 관련 문서',
    subcategories: ['공부법', '수행평가', '진로', '학습 도구']
  }
];

const DOCUMENTS = [
  {
    id: 'doc-001',
    slug: 'semiconductor-etching-process',
    title: '반도체 식각(Etching) 공정의 이해',
    summary: '반도체 제조 공정에서 식각의 역할, 건식 식각과 습식 식각의 차이, 주요 기술과 응용 분야를 구조화하여 설명합니다.',
    docType: 'article',
    categoryId: 'engineering',
    tags: ['반도체', '식각', '공정', '건식식각', '습식식각'],
    status: 'published',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10',
    keyInfo: {
      definition: '반도체 식각(Etching)은 웨이퍼 표면의 불필요한 부분을 선택적으로 제거하는 공정입니다.',
      importance: '반도체 회로 패턴 형성의 핵심 단계로, 소자의 성능과 집적도를 결정합니다.',
      types: '건식 식각(Dry Etching)과 습식 식각(Wet Etching)으로 나뉩니다.'
    },
    body: `## 정의

반도체 식각(Etching)은 포토레지스트 패턴을 마스크로 사용하여 웨이퍼 위의 박막(산화막, 금속막 등)을 선택적으로 제거하는 공정입니다.

## 핵심 개념

### 건식 식각 (Dry Etching)
- 플라즈마를 이용한 식각 방식
- 이방성 식각이 가능하여 미세 패턴에 적합
- RIE(Reactive Ion Etching), ICP(Inductively Coupled Plasma) 등

### 습식 식각 (Wet Etching)
- 화학 용액을 이용한 식각 방식
- 등방성 식각이 일반적
- 비용이 저렴하고 대면적 처리에 유리

## 적용 분야
- 게이트 패터닝
- 금속 배선 형성
- 비아 홀 생성
- MEMS 구조물 제작

## 관련 기술
- 포토리소그래피
- 박막 증착
- CMP (Chemical Mechanical Polishing)
- ALD (Atomic Layer Deposition)`,
    relatedDocs: ['doc-002', 'doc-003'],
    relatedServices: ['semiconductor-platform']
  },
  {
    id: 'doc-002',
    slug: 'science-research-paper-guide',
    title: '중학생 과학 소논문 작성 가이드',
    summary: '중학생이 과학 소논문을 작성할 때 필요한 구조, 방법론, 주제 선정부터 결론까지의 과정을 단계별로 안내합니다.',
    docType: 'article',
    categoryId: 'research',
    tags: ['소논문', '과학탐구', '중학생', '연구방법', '실험설계'],
    status: 'published',
    createdAt: '2026-03-08',
    updatedAt: '2026-03-12',
    keyInfo: {
      definition: '과학 소논문은 학생이 직접 과학적 탐구를 수행하고 그 과정과 결과를 체계적으로 기술한 보고서입니다.',
      importance: '과학적 사고력, 문제 해결 능력, 논리적 글쓰기 능력을 키우는 핵심 활동입니다.',
      audience: '중학교 1~3학년 학생 및 지도 교사'
    },
    body: `## 정의

과학 소논문은 학생이 스스로 과학적 질문을 세우고, 실험이나 조사를 통해 답을 찾아가는 과정을 체계적으로 기록한 문서입니다.

## 소논문 구조

### 1. 서론
- 연구 동기
- 연구 목적
- 가설 설정

### 2. 이론적 배경
- 관련 개념 정리
- 선행 연구 조사

### 3. 연구 방법
- 실험 설계
- 변인 통제
- 측정 방법

### 4. 결과
- 데이터 정리
- 그래프/표 작성
- 통계 분석

### 5. 결론
- 가설 검증
- 의의와 한계
- 후속 연구 제안

## 주제 선정 팁
- 일상에서 궁금한 점 출발
- 측정 가능한 변인 설정
- 반복 실험 가능한 주제
- 안전하게 수행 가능한 실험

## 흔한 실수
- 변인 통제 미흡
- 데이터 부족 (반복 횟수 적음)
- 결론과 결과 불일치
- 참고문헌 누락`,
    relatedDocs: ['doc-004', 'doc-005'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-003',
    slug: 'semiconductor-photolithography',
    title: '포토리소그래피(Photolithography) 공정 개요',
    summary: '반도체 제조의 핵심 공정인 포토리소그래피의 원리, 단계, 최신 기술 동향을 구조적으로 정리합니다.',
    docType: 'article',
    categoryId: 'engineering',
    tags: ['반도체', '포토리소그래피', '노광', 'EUV', '공정'],
    status: 'published',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-05',
    keyInfo: {
      definition: '포토리소그래피는 빛을 이용하여 웨이퍼 위에 회로 패턴을 전사하는 공정입니다.',
      importance: '반도체 미세화의 핵심 기술로, 공정 한계가 곧 기술 세대를 결정합니다.',
      types: 'DUV(Deep Ultraviolet), EUV(Extreme Ultraviolet) 리소그래피'
    },
    body: `## 정의

포토리소그래피(Photolithography)는 감광액(Photoresist)이 도포된 웨이퍼에 빛을 조사하여 마스크의 패턴을 전사하는 공정입니다.

## 공정 단계

### 1. 감광액 도포 (Coating)
- 스핀 코팅으로 균일한 감광막 형성
- 두께 제어가 핵심

### 2. 소프트 베이크 (Soft Bake)
- 용매 제거
- 감광막 안정화

### 3. 노광 (Exposure)
- 마스크를 통해 UV 조사
- 감광액의 화학적 변화 유도

### 4. 현상 (Development)
- 노광 부분 또는 비노광 부분 제거
- Positive / Negative 레지스트

### 5. 하드 베이크 (Hard Bake)
- 패턴 안정화
- 식각 내성 강화

## 최신 기술
- EUV (13.5nm 파장)
- 멀티 패터닝
- 고NA EUV
- DSA (Directed Self-Assembly)`,
    relatedDocs: ['doc-001'],
    relatedServices: ['semiconductor-platform']
  },
  {
    id: 'doc-004',
    slug: 'middle-school-science-topics',
    title: '중학생 과학 탐구 주제 50선',
    summary: '중학교 과학 교과과정에 맞는 탐구 주제 50가지를 물리, 화학, 생물, 지구과학 분야별로 정리했습니다.',
    docType: 'topic',
    categoryId: 'research',
    tags: ['탐구주제', '중학생', '과학실험', '물리', '화학', '생물', '지구과학'],
    status: 'published',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-13',
    keyInfo: {
      definition: '과학 탐구 주제는 학생이 직접 실험하고 조사할 수 있는 과학적 질문입니다.',
      audience: '중학교 1~3학년',
      difficulty: '초급~중급'
    },
    body: `## 물리 분야

1. 종이비행기 날개 모양에 따른 비행 거리 비교
2. 탄성 재질에 따른 공의 반발 계수 측정
3. 빛의 색깔이 식물 성장에 미치는 영향
4. 경사면 각도에 따른 물체 가속도 변화
5. 소리의 주파수에 따른 진동 패턴 관찰
6. 자석의 세기와 거리의 관계
7. 단열재 종류별 보온 효과 비교
8. 풍력발전기 날개 수와 발전량 관계
9. 물의 깊이에 따른 수압 변화
10. 렌즈의 곡률과 초점 거리 관계

## 화학 분야

11. 천연 지시약의 pH 변색 범위 비교
12. 비타민C 함량 비교 (과일별)
13. 금속의 반응성 서열 확인 실험
14. 온도에 따른 용해도 변화
15. 전해질 용액의 전도도 비교

## 생물 분야

16. 음악이 식물 성장에 미치는 영향
17. 손 세정제 종류별 살균 효과
18. 발효 조건에 따른 요구르트 생성량
19. 씨앗 발아에 영향을 미치는 환경 요인
20. 미세먼지가 식물 기공에 미치는 영향

## 지구과학 분야

21. 토양 종류별 수분 보유력 비교
22. 구름 생성 실험 (간이 구름 상자)
23. 자외선 차단제의 UV 차단 효과 비교
24. 암석 풍화 과정 시뮬레이션
25. 지진파 전달 속도와 매질의 관계`,
    relatedDocs: ['doc-002', 'doc-005'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-005',
    slug: 'experiment-design-methodology',
    title: '과학 실험 설계 방법론',
    summary: '올바른 과학 실험 설계를 위한 변인 통제, 대조군 설정, 반복 실험, 데이터 수집 방법을 체계적으로 정리합니다.',
    docType: 'article',
    categoryId: 'research',
    tags: ['실험설계', '변인통제', '대조군', '과학적방법'],
    status: 'published',
    createdAt: '2026-02-28',
    updatedAt: '2026-03-10',
    keyInfo: {
      definition: '실험 설계는 과학적 질문에 답하기 위해 실험 조건을 체계적으로 계획하는 과정입니다.',
      importance: '올바른 실험 설계 없이는 신뢰할 수 있는 결론을 도출할 수 없습니다.',
      components: '독립변인, 종속변인, 통제변인, 대조군, 실험군'
    },
    body: `## 정의

실험 설계(Experimental Design)는 가설을 검증하기 위해 실험 조건, 측정 방법, 데이터 수집 절차를 사전에 계획하는 과정입니다.

## 핵심 개념

### 변인(Variable)
- **독립변인**: 연구자가 의도적으로 변화시키는 요인
- **종속변인**: 독립변인에 의해 변화하는 결과
- **통제변인**: 일정하게 유지해야 하는 조건

### 대조군과 실험군
- **대조군**: 독립변인을 적용하지 않은 기준 그룹
- **실험군**: 독립변인을 적용한 그룹

### 반복 실험
- 최소 3회 이상 반복
- 평균값 활용
- 이상치 처리

## 설계 절차

1. 연구 질문 설정
2. 가설 수립
3. 변인 정의
4. 실험 절차 계획
5. 데이터 수집 방법 결정
6. 결과 분석 방법 선택

## 좋은 실험 설계의 조건
- 재현 가능성
- 객관적 측정
- 적절한 표본 크기
- 윤리적 고려`,
    relatedDocs: ['doc-002', 'doc-004'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-006',
    slug: 'ai-education-trends-2026',
    title: '2026년 AI 교육 트렌드와 활용 방법',
    summary: 'AI 기술이 교육 현장에서 어떻게 활용되고 있는지, 교사와 학생을 위한 실질적인 AI 도구와 방법론을 정리합니다.',
    docType: 'article',
    categoryId: 'education',
    tags: ['AI교육', '에듀테크', '교육혁신', 'ChatGPT', '학습도구'],
    status: 'published',
    createdAt: '2026-03-12',
    updatedAt: '2026-03-14',
    keyInfo: {
      definition: 'AI 교육은 인공지능 기술을 교수학습 과정에 통합하여 개인화된 학습 경험을 제공하는 것입니다.',
      importance: '미래 사회 대비를 위한 필수 역량이자, 교육 효율성을 높이는 핵심 도구입니다.',
      trends: 'AI 튜터, 자동 평가, 맞춤형 학습 경로, 창작 보조 도구'
    },
    body: `## 정의

AI 교육은 인공지능 기술을 활용하여 학습 과정을 개선하고, 학생 개개인에 맞춘 교육을 제공하는 접근 방식입니다.

## 주요 트렌드

### 1. AI 튜터링
- 24시간 개인 맞춤 학습 지원
- 학생 수준에 따른 난이도 조절
- 즉각적 피드백 제공

### 2. 자동 평가 시스템
- 서술형 답안 자동 채점
- 학습 분석 대시보드
- 취약점 진단

### 3. 창작 보조 도구
- AI 글쓰기 보조
- 코딩 학습 도우미
- 과학 탐구 주제 생성

## 교사를 위한 활용 방법
- 수업 자료 생성
- 평가 문항 제작
- 학생 맞춤 피드백
- 수업 설계 보조

## 주의사항
- AI 의존도 과다 방지
- 비판적 사고 유지
- 저작권 및 윤리 교육
- 정보 검증 습관`,
    relatedDocs: ['doc-002'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-007',
    slug: 'study-methods-for-performance-assessment',
    title: '수행평가 준비를 위한 효과적인 학습법',
    summary: '중고등학생을 위한 수행평가 유형별 준비 전략과 효과적인 학습 방법을 정리합니다.',
    docType: 'guide',
    categoryId: 'study',
    tags: ['수행평가', '공부법', '중학생', '고등학생', '학습전략'],
    status: 'published',
    createdAt: '2026-03-06',
    updatedAt: '2026-03-06',
    keyInfo: {
      definition: '수행평가는 학생의 지식, 기능, 태도를 종합적으로 평가하는 과정 중심 평가입니다.',
      types: '보고서, 발표, 실험, 포트폴리오, 프로젝트',
      audience: '중학생, 고등학생'
    },
    body: `## 수행평가란?

수행평가는 단순 암기가 아닌, 학생이 직접 수행한 과정과 결과물을 평가하는 방식입니다.

## 유형별 준비 전략

### 보고서형
- 구조화된 글쓰기 연습
- 참고자료 인용 방법 학습
- 핵심 → 근거 → 결론 구조

### 발표형
- 슬라이드 구조화
- 발표 연습 최소 3회
- Q&A 예상 질문 준비

### 실험형
- 사전 실험 계획서 작성
- 데이터 기록 습관
- 결과 분석 및 해석

### 프로젝트형
- 역할 분담 명확히
- 주간 진행 체크
- 최종 산출물 품질 관리

## 공통 학습 팁
- 평가 기준표 먼저 확인
- 기한 관리 (역산 스케줄링)
- 초안 → 수정 → 완성 3단계
- 동료 피드백 활용`,
    relatedDocs: ['doc-004'],
    relatedServices: []
  }
];

const SERVICES = [
  {
    id: 'littlescience',
    name: 'LittleScienceAI',
    description: '과학논문 주제 탐색 AI 도우미',
    url: '#',
    icon: '🧪',
    color: '#667eea'
  },
  {
    id: 'semiconductor-platform',
    name: '반도체 플랫폼',
    description: '반도체 공정·장비·기술 정보 플랫폼',
    url: '#',
    icon: '💎',
    color: '#764ba2'
  }
];

// Data access functions
function getAllDocuments() {
  const stored = localStorage.getItem('kp_documents');
  if (stored) {
    const custom = JSON.parse(stored);
    return [...DOCUMENTS, ...custom];
  }
  return DOCUMENTS;
}

function getDocumentBySlug(slug) {
  return getAllDocuments().find(d => d.slug === slug);
}

function getDocumentById(id) {
  return getAllDocuments().find(d => d.id === id);
}

function getDocumentsByCategory(categoryId) {
  return getAllDocuments().filter(d => d.categoryId === categoryId && d.status === 'published');
}

function getDocumentsByTag(tag) {
  return getAllDocuments().filter(d => d.tags.includes(tag) && d.status === 'published');
}

function searchDocuments(query) {
  const q = query.toLowerCase();
  return getAllDocuments().filter(d => {
    return d.status === 'published' && (
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.body.toLowerCase().includes(q)
    );
  });
}

function getRelatedDocuments(doc) {
  if (!doc.relatedDocs) return [];
  return doc.relatedDocs.map(id => getDocumentById(id)).filter(Boolean);
}

function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}

function getAllTags() {
  const tags = {};
  getAllDocuments().forEach(d => {
    if (d.status === 'published') {
      d.tags.forEach(t => {
        tags[t] = (tags[t] || 0) + 1;
      });
    }
  });
  return Object.entries(tags).sort((a, b) => b[1] - a[1]);
}

function saveDocument(doc) {
  const stored = localStorage.getItem('kp_documents');
  const custom = stored ? JSON.parse(stored) : [];
  doc.id = 'doc-custom-' + Date.now();
  doc.createdAt = new Date().toISOString().slice(0, 10);
  doc.updatedAt = doc.createdAt;
  custom.push(doc);
  localStorage.setItem('kp_documents', JSON.stringify(custom));
  return doc;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}
