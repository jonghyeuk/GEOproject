/**
 * EduAtlas - Education Data Platform
 * Firebase Firestore 기반 데이터 레이어
 *
 * 아키텍처:
 * - 페이지 로드 시 Firestore에서 전체 데이터를 메모리에 캐싱
 * - 읽기 함수는 동기식 (캐시 기반)
 * - 쓰기 함수는 비동기식 (Firestore + 캐시 동시 업데이트)
 * - Firestore 연결 실패 시 내장 샘플 데이터로 폴백
 */

// ============================================================
// 내장 샘플 데이터 (Firestore 연결 전 / 실패 시 폴백)
// ============================================================

const CATEGORIES = [
  {
    id: 'academy',
    slug: 'academy',
    name: '학원찾기',
    nameKo: '학원찾기',
    icon: '🏫',
    description: '지역별·과목별 학원 정보를 한눈에 비교하고 찾아보세요',
    subcategories: ['수학', '영어', '과학', '코딩', '예체능', '입시', '초등', '중등', '고등']
  },
  {
    id: 'edu-guide',
    slug: 'edu-guide',
    name: '교육가이드',
    nameKo: '교육가이드',
    icon: '📖',
    description: '학원 선택 가이드, 학습법, 입시 정보 등 교육 관련 실용 정보',
    subcategories: ['학원 선택법', '학습법', '입시 정보', '교육 트렌드']
  },
  {
    id: 'theory',
    slug: 'theory',
    name: '이론·원리',
    nameKo: '이론·원리',
    icon: '📐',
    description: '과학 법칙, 공식, 핵심 개념을 구조화하여 정리한 지식 문서',
    subcategories: ['물리', '화학', '생물', '지구과학', '수학']
  },
  {
    id: 'experiment',
    slug: 'experiment',
    name: '실험방법',
    nameKo: '실험방법',
    icon: '🧪',
    description: '실험 설계, 변인 통제, 측정 방법, 데이터 수집 절차 가이드',
    subcategories: ['실험 설계', '변인 통제', '데이터 수집', '보고서 작성']
  },
  {
    id: 'equipment',
    slug: 'equipment',
    name: '실험장치',
    nameKo: '실험장치',
    icon: '🔧',
    description: '간이 실험장치 제작법, 센서 활용, 아두이노 연동 가이드',
    subcategories: ['간이장치 제작', '센서 활용', '아두이노', '3D프린팅']
  },
  {
    id: 'simulation',
    slug: 'simulation',
    name: '시뮬레이션',
    nameKo: '시뮬레이션',
    icon: '🎮',
    description: '과학 원리를 직접 체험하는 인터랙티브 시뮬레이션',
    subcategories: ['물리', '화학', '생물', '지구과학']
  }
];

// ============================================================
// 지역 데이터 (학원 등록/검색용)
// ============================================================
const REGIONS = [
  { id: 'seoul', name: '서울', districts: ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '종로구', '중구', '영등포구', '동작구', '관악구', '금천구', '구로구', '양천구', '강서구'] },
  { id: 'gyeonggi', name: '경기', districts: ['성남시', '수원시', '용인시', '고양시', '부천시', '안양시', '화성시', '남양주시', '의정부시', '시흥시', '파주시', '김포시', '광주시', '광명시', '군포시', '하남시', '오산시', '이천시', '안산시', '평택시'] },
  { id: 'incheon', name: '인천', districts: ['남동구', '부평구', '서구', '연수구', '미추홀구', '계양구'] },
  { id: 'busan', name: '부산', districts: ['해운대구', '수영구', '남구', '동래구', '연제구', '부산진구', '사하구'] },
  { id: 'daegu', name: '대구', districts: ['수성구', '달서구', '중구', '북구', '동구'] },
  { id: 'daejeon', name: '대전', districts: ['유성구', '서구', '중구', '동구', '대덕구'] },
  { id: 'gwangju', name: '광주', districts: ['북구', '서구', '남구', '광산구', '동구'] },
  { id: 'sejong', name: '세종', districts: ['세종시'] },
  { id: 'chungnam', name: '충남', districts: ['천안시', '아산시', '서산시', '당진시'] },
  { id: 'chungbuk', name: '충북', districts: ['청주시', '충주시', '제천시'] },
  { id: 'jeonnam', name: '전남', districts: ['여수시', '순천시', '목포시'] },
  { id: 'jeonbuk', name: '전북', districts: ['전주시', '익산시', '군산시'] },
  { id: 'gyeongnam', name: '경남', districts: ['창원시', '김해시', '양산시', '진주시'] },
  { id: 'gyeongbuk', name: '경북', districts: ['포항시', '경주시', '구미시'] },
  { id: 'gangwon', name: '강원', districts: ['춘천시', '원주시', '강릉시'] },
  { id: 'jeju', name: '제주', districts: ['제주시', '서귀포시'] }
];

// 과목 분류
const SUBJECTS = [
  { id: 'math', name: '수학', icon: '📐' },
  { id: 'english', name: '영어', icon: '🔤' },
  { id: 'science', name: '과학', icon: '🔬' },
  { id: 'korean', name: '국어', icon: '📝' },
  { id: 'coding', name: '코딩/SW', icon: '💻' },
  { id: 'art', name: '미술', icon: '🎨' },
  { id: 'music', name: '음악', icon: '🎵' },
  { id: 'sports', name: '체육', icon: '⚽' },
  { id: 'exam-prep', name: '입시/논술', icon: '🎓' },
  { id: 'language', name: '외국어', icon: '🌐' },
  { id: 'social', name: '사회/역사', icon: '🌍' },
  { id: 'all-subjects', name: '종합반', icon: '📚' }
];

const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-002',
    slug: 'science-research-paper-guide',
    title: '중학생 과학 소논문 작성 가이드',
    summary: '중학생이 과학 소논문을 작성할 때 필요한 구조, 방법론, 주제 선정부터 결론까지의 과정을 단계별로 안내합니다.',
    docType: 'article',
    categoryId: 'theory',
    tags: ['소논문', '과학탐구', '중학생', '연구방법', '실험설계'],
    status: 'published',
    createdAt: '2026-03-08',
    updatedAt: '2026-03-12',
    directAnswer: [
      '과학 소논문은 서론→이론적 배경→연구 방법→결과→결론의 5단계 구조로 작성합니다.',
      '가장 중요한 것은 변인 통제와 반복 실험이며, 이 두 가지가 빠지면 신뢰할 수 있는 결론을 낼 수 없습니다.',
      '주제는 일상의 궁금증에서 출발하되, 측정 가능한 변인이 있는지 먼저 확인해야 합니다.'
    ],
    targetAudience: ['중학교 1~3학년', '과학 교사', '학부모'],
    entities: ['과학 소논문', '변인 통제', '가설 설정', '실험 설계', '데이터 분석'],
    cluster: {
      pillarTopic: '중학생 과학 탐구',
      subTopic: '소논문 작성',
      intentType: 'how-to',
      relatedClusterSlugs: ['middle-school-science-topics', 'experiment-design-methodology', 'study-methods-for-performance-assessment']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '정의' },
      { type: 'paragraph', text: '과학 소논문은 학생이 스스로 과학적 질문을 세우고, 실험이나 조사를 통해 답을 찾아가는 과정을 체계적으로 기록한 문서입니다.' },
      { type: 'heading', level: 2, text: '소논문 구조' },
      { type: 'heading', level: 3, text: '1. 서론' },
      { type: 'list', ordered: false, items: ['연구 동기', '연구 목적', '가설 설정'] },
      { type: 'heading', level: 3, text: '2. 이론적 배경' },
      { type: 'list', ordered: false, items: ['관련 개념 정리', '선행 연구 조사'] },
      { type: 'heading', level: 3, text: '3. 연구 방법' },
      { type: 'list', ordered: false, items: ['실험 설계', '변인 통제', '측정 방법'] },
      { type: 'heading', level: 3, text: '4. 결과' },
      { type: 'list', ordered: false, items: ['데이터 정리', '그래프/표 작성', '통계 분석'] },
      { type: 'heading', level: 3, text: '5. 결론' },
      { type: 'list', ordered: false, items: ['가설 검증', '의의와 한계', '후속 연구 제안'] },
      { type: 'heading', level: 2, text: '연구 질문을 좁히는 방법' },
      { type: 'paragraph', text: '처음에는 넓은 관심사에서 시작하되, "무엇이 ~에 영향을 미치는가?" 형태로 질문을 좁혀야 합니다. 예를 들어 "식물"이라는 관심사는 "빛의 색깔이 콩나물 성장 속도에 미치는 영향"으로 구체화합니다.' },
      { type: 'heading', level: 2, text: '주제 선정 팁' },
      { type: 'list', ordered: false, items: ['일상에서 궁금한 점 출발', '측정 가능한 변인 설정', '반복 실험 가능한 주제', '안전하게 수행 가능한 실험'] },
      { type: 'heading', level: 2, text: '보고서 작성 시 피해야 할 점' },
      { type: 'list', ordered: false, items: [
        '변인 통제 미흡 — 독립변인 외 다른 조건이 바뀌면 결과를 신뢰할 수 없습니다',
        '데이터 부족 — 최소 3회 반복 실험이 필요합니다',
        '결론과 결과 불일치 — 데이터가 보여주는 것만 결론에 써야 합니다',
        '참고문헌 누락 — 인용한 자료는 반드시 출처를 밝혀야 합니다'
      ]}
    ],
    faqItems: [
      { question: '과학 소논문과 일반 보고서의 차이점은 무엇인가요?', answer: '소논문은 가설 설정→실험→검증의 과학적 방법론을 따르는 반면, 일반 보고서는 조사 결과를 정리하는 데 초점을 둡니다.' },
      { question: '중학생 소논문의 적절한 분량은 어느 정도인가요?', answer: 'A4 기준 5~10페이지가 일반적입니다. 분량보다 변인 통제와 데이터의 신뢰성이 더 중요합니다.' },
      { question: '실험 없이 조사만으로 소논문을 쓸 수 있나요?', answer: '가능합니다. 설문 조사, 문헌 분석, 관찰 연구 등도 과학적 방법론을 따르면 소논문으로 인정됩니다.' },
      { question: '가설이 틀린 것으로 나오면 실패한 건가요?', answer: '아닙니다. 가설이 기각되어도 그 과정과 이유를 분석하면 훌륭한 소논문이 됩니다. 과학에서 가설 기각도 중요한 결과입니다.' }
    ],
    authorInfo: {
      name: 'EduAtlas 편집팀',
      role: '콘텐츠 에디터',
      expertise: '과학 교육, 탐구 활동 설계'
    },
    seoTitle: '중학생 과학 소논문 작성법 - 구조, 주제 선정, 실험 설계 가이드',
    seoDescription: '중학생을 위한 과학 소논문 작성 가이드. 서론부터 결론까지 5단계 구조, 주제 선정 팁, 변인 통제 방법, 흔한 실수와 해결법을 안내합니다.',
    schemaTypes: ['Article', 'FAQPage'],
    technicalMeta: {
      canonicalPath: '/document.html?slug=science-research-paper-guide',
      indexable: true
    },
    keyInfo: {
      definition: '과학 소논문은 학생이 직접 과학적 탐구를 수행하고 그 과정과 결과를 체계적으로 기술한 보고서입니다.',
      importance: '과학적 사고력, 문제 해결 능력, 논리적 글쓰기 능력을 키우는 핵심 활동입니다.',
      audience: '중학교 1~3학년 학생 및 지도 교사'
    },
    relatedDocs: ['doc-004', 'doc-005'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-004',
    slug: 'middle-school-science-topics',
    title: '중학생 과학 탐구 주제 50선',
    summary: '중학교 과학 교과과정에 맞는 탐구 주제 50가지를 물리, 화학, 생물, 지구과학 분야별로 정리했습니다.',
    docType: 'topic',
    categoryId: 'theory',
    tags: ['탐구주제', '중학생', '과학실험', '물리', '화학', '생물', '지구과학'],
    status: 'published',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-13',
    keyInfo: {
      definition: '과학 탐구 주제는 학생이 직접 실험하고 조사할 수 있는 과학적 질문입니다.',
      audience: '중학교 1~3학년',
      difficulty: '초급~중급'
    },
    body: "## 물리 분야\n\n1. 종이비행기 날개 모양에 따른 비행 거리 비교\n2. 탄성 재질에 따른 공의 반발 계수 측정\n3. 빛의 색깔이 식물 성장에 미치는 영향\n4. 경사면 각도에 따른 물체 가속도 변화\n5. 소리의 주파수에 따른 진동 패턴 관찰\n6. 자석의 세기와 거리의 관계\n7. 단열재 종류별 보온 효과 비교\n8. 풍력발전기 날개 수와 발전량 관계\n9. 물의 깊이에 따른 수압 변화\n10. 렌즈의 곡률과 초점 거리 관계\n\n## 화학 분야\n\n11. 천연 지시약의 pH 변색 범위 비교\n12. 비타민C 함량 비교 (과일별)\n13. 금속의 반응성 서열 확인 실험\n14. 온도에 따른 용해도 변화\n15. 전해질 용액의 전도도 비교\n\n## 생물 분야\n\n16. 음악이 식물 성장에 미치는 영향\n17. 손 세정제 종류별 살균 효과\n18. 발효 조건에 따른 요구르트 생성량\n19. 씨앗 발아에 영향을 미치는 환경 요인\n20. 미세먼지가 식물 기공에 미치는 영향\n\n## 지구과학 분야\n\n21. 토양 종류별 수분 보유력 비교\n22. 구름 생성 실험 (간이 구름 상자)\n23. 자외선 차단제의 UV 차단 효과 비교\n24. 암석 풍화 과정 시뮬레이션\n25. 지진파 전달 속도와 매질의 관계",
    relatedDocs: ['doc-002', 'doc-005'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-005',
    slug: 'experiment-design-methodology',
    title: '과학 실험 설계 방법론',
    summary: '올바른 과학 실험 설계를 위한 변인 통제, 대조군 설정, 반복 실험, 데이터 수집 방법을 체계적으로 정리합니다.',
    docType: 'article',
    categoryId: 'experiment',
    tags: ['실험설계', '변인통제', '대조군', '과학적방법'],
    status: 'published',
    createdAt: '2026-02-28',
    updatedAt: '2026-03-10',
    directAnswer: [
      '과학 실험 설계의 핵심은 독립변인·종속변인·통제변인을 명확히 정의하고, 대조군을 설정하는 것입니다.',
      '모든 실험은 최소 3회 반복해야 하며, 한 번에 하나의 변인만 바꿔야 결과를 신뢰할 수 있습니다.',
      '좋은 실험 설계는 다른 사람이 같은 절차를 따라 했을 때 같은 결과가 나오는 재현 가능성을 갖춰야 합니다.'
    ],
    targetAudience: ['중학교 1~3학년', '고등학생', '과학 교사'],
    entities: ['변인 통제', '독립변인', '종속변인', '대조군', '실험군', '반복 실험'],
    cluster: {
      pillarTopic: '중학생 과학 탐구',
      subTopic: '실험 설계',
      intentType: 'how-to',
      relatedClusterSlugs: ['science-research-paper-guide', 'middle-school-science-topics', 'study-methods-for-performance-assessment']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '정의' },
      { type: 'paragraph', text: '실험 설계(Experimental Design)는 가설을 검증하기 위해 실험 조건, 측정 방법, 데이터 수집 절차를 사전에 계획하는 과정입니다.' },
      { type: 'heading', level: 2, text: '이 실험으로 무엇을 확인할 수 있는가' },
      { type: 'paragraph', text: '올바른 실험 설계를 통해 특정 원인(독립변인)이 결과(종속변인)에 실제로 영향을 미치는지 확인할 수 있습니다. 설계가 부실하면 결과가 나와도 "그래서 이게 진짜 원인 때문인지" 판단할 수 없습니다.' },
      { type: 'heading', level: 2, text: '핵심 개념' },
      { type: 'heading', level: 3, text: '변인(Variable)' },
      { type: 'list', ordered: false, items: [
        '독립변인: 연구자가 의도적으로 변화시키는 요인',
        '종속변인: 독립변인에 의해 변화하는 결과',
        '통제변인: 일정하게 유지해야 하는 조건'
      ]},
      { type: 'heading', level: 3, text: '변인통제 핵심' },
      { type: 'paragraph', text: '한 번에 하나의 변인만 바꿔야 합니다. 예를 들어 "빛의 색깔이 식물 성장에 미치는 영향"을 실험할 때, 물의 양·온도·토양은 모두 동일하게 유지해야 합니다. 두 가지 이상을 동시에 바꾸면 어떤 변인이 결과에 영향을 줬는지 알 수 없습니다.' },
      { type: 'heading', level: 3, text: '대조군과 실험군' },
      { type: 'list', ordered: false, items: [
        '대조군: 독립변인을 적용하지 않은 기준 그룹',
        '실험군: 독립변인을 적용한 그룹'
      ]},
      { type: 'heading', level: 3, text: '반복 실험' },
      { type: 'list', ordered: false, items: ['최소 3회 이상 반복', '평균값 활용', '이상치 처리'] },
      { type: 'heading', level: 2, text: '설계 절차' },
      { type: 'list', ordered: true, items: [
        '연구 질문 설정',
        '가설 수립',
        '변인 정의',
        '실험 절차 계획',
        '데이터 수집 방법 결정',
        '결과 분석 방법 선택'
      ]},
      { type: 'heading', level: 2, text: '자주 하는 실수' },
      { type: 'list', ordered: false, items: [
        '통제변인을 빠뜨리고 두 가지 이상을 동시에 바꿈',
        '반복 횟수가 1~2회로 부족함',
        '측정 기준이 모호함 (예: "많이 자랐다"가 아니라 cm로 측정해야 함)',
        '대조군 없이 실험군만 설정함'
      ]},
      { type: 'heading', level: 2, text: '결과 해석 포인트' },
      { type: 'paragraph', text: '실험 결과를 해석할 때는 데이터가 보여주는 것만 진술해야 합니다. 평균값과 편차를 확인하고, 이상치가 있다면 원인을 분석합니다. "예상과 다른 결과"도 중요한 발견이므로 왜 다른지를 논의합니다.' },
      { type: 'heading', level: 2, text: '좋은 실험 설계의 조건' },
      { type: 'list', ordered: false, items: ['재현 가능성', '객관적 측정', '적절한 표본 크기', '윤리적 고려'] }
    ],
    faqItems: [
      { question: '변인 통제가 왜 그렇게 중요한가요?', answer: '변인 통제 없이는 실험 결과가 독립변인 때문인지 다른 요인 때문인지 구분할 수 없습니다. 과학 실험의 신뢰성은 변인 통제에서 시작됩니다.' },
      { question: '대조군을 꼭 설정해야 하나요?', answer: '네. 대조군이 없으면 실험군의 결과가 독립변인 때문인지 자연적 변화인지 판단할 기준이 없습니다.' },
      { question: '반복 실험은 몇 회가 적당한가요?', answer: '최소 3회 이상이 기본이며, 5회 이상이면 더 신뢰할 수 있습니다. 결과 편차가 크다면 반복 횟수를 늘려야 합니다.' },
      { question: '실험 결과가 가설과 다르면 어떻게 하나요?', answer: '가설이 틀렸다고 실패가 아닙니다. 왜 다른 결과가 나왔는지 분석하고, 실험 설계의 한계나 새로운 변인 가능성을 논의하면 됩니다.' },
      { question: '관찰 연구도 실험 설계가 필요한가요?', answer: '네. 관찰 연구도 무엇을, 어떤 기준으로, 얼마나 자주 관찰할지 사전에 설계해야 체계적인 데이터를 얻을 수 있습니다.' }
    ],
    authorInfo: {
      name: 'EduAtlas 편집팀',
      role: '콘텐츠 에디터',
      expertise: '과학 교육, 실험 설계'
    },
    seoTitle: '과학 실험 설계 방법론 - 변인 통제, 대조군, 반복 실험 가이드',
    seoDescription: '과학 실험 설계의 핵심: 독립변인·종속변인·통제변인 정의, 대조군 설정, 반복 실험 방법. 중학생부터 고등학생까지 실험 설계 절차와 자주 하는 실수를 정리합니다.',
    schemaTypes: ['Article', 'FAQPage'],
    technicalMeta: {
      canonicalPath: '/document.html?slug=experiment-design-methodology',
      indexable: true
    },
    keyInfo: {
      definition: '실험 설계는 과학적 질문에 답하기 위해 실험 조건을 체계적으로 계획하는 과정입니다.',
      importance: '올바른 실험 설계 없이는 신뢰할 수 있는 결론을 도출할 수 없습니다.',
      components: '독립변인, 종속변인, 통제변인, 대조군, 실험군'
    },
    relatedDocs: ['doc-002', 'doc-004'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-006',
    slug: 'ai-education-trends-2026',
    title: '2026년 AI 교육 트렌드와 활용 방법',
    summary: 'AI 기술이 교육 현장에서 어떻게 활용되고 있는지, 교사와 학생을 위한 실질적인 AI 도구와 방법론을 정리합니다.',
    docType: 'article',
    categoryId: 'theory',
    tags: ['AI교육', '에듀테크', '교육혁신', 'ChatGPT', '학습도구'],
    status: 'draft',
    createdAt: '2026-03-12',
    updatedAt: '2026-03-14',
    keyInfo: {
      definition: 'AI 교육은 인공지능 기술을 교수학습 과정에 통합하여 개인화된 학습 경험을 제공하는 것입니다.',
      importance: '미래 사회 대비를 위한 필수 역량이자, 교육 효율성을 높이는 핵심 도구입니다.',
      trends: 'AI 튜터, 자동 평가, 맞춤형 학습 경로, 창작 보조 도구'
    },
    body: "## 정의\n\nAI 교육은 인공지능 기술을 활용하여 학습 과정을 개선하고, 학생 개개인에 맞춘 교육을 제공하는 접근 방식입니다.\n\n## 주요 트렌드\n\n### 1. AI 튜터링\n- 24시간 개인 맞춤 학습 지원\n- 학생 수준에 따른 난이도 조절\n- 즉각적 피드백 제공\n\n### 2. 자동 평가 시스템\n- 서술형 답안 자동 채점\n- 학습 분석 대시보드\n- 취약점 진단\n\n### 3. 창작 보조 도구\n- AI 글쓰기 보조\n- 코딩 학습 도우미\n- 과학 탐구 주제 생성\n\n## 교사를 위한 활용 방법\n- 수업 자료 생성\n- 평가 문항 제작\n- 학생 맞춤 피드백\n- 수업 설계 보조\n\n## 주의사항\n- AI 의존도 과다 방지\n- 비판적 사고 유지\n- 저작권 및 윤리 교육\n- 정보 검증 습관",
    relatedDocs: ['doc-002'],
    relatedServices: ['littlescience']
  },
  {
    id: 'doc-007',
    slug: 'study-methods-for-performance-assessment',
    title: '수행평가 준비를 위한 효과적인 학습법',
    summary: '중고등학생을 위한 수행평가 유형별 준비 전략과 효과적인 학습 방법을 정리합니다.',
    docType: 'guide',
    categoryId: 'experiment',
    tags: ['수행평가', '공부법', '중학생', '고등학생', '학습전략'],
    status: 'draft',
    createdAt: '2026-03-06',
    updatedAt: '2026-03-06',
    keyInfo: {
      definition: '수행평가는 학생의 지식, 기능, 태도를 종합적으로 평가하는 과정 중심 평가입니다.',
      types: '보고서, 발표, 실험, 포트폴리오, 프로젝트',
      audience: '중학생, 고등학생'
    },
    body: "## 수행평가란?\n\n수행평가는 단순 암기가 아닌, 학생이 직접 수행한 과정과 결과물을 평가하는 방식입니다.\n\n## 유형별 준비 전략\n\n### 보고서형\n- 구조화된 글쓰기 연습\n- 참고자료 인용 방법 학습\n- 핵심 → 근거 → 결론 구조\n\n### 발표형\n- 슬라이드 구조화\n- 발표 연습 최소 3회\n- Q&A 예상 질문 준비\n\n### 실험형\n- 사전 실험 계획서 작성\n- 데이터 기록 습관\n- 결과 분석 및 해석\n\n### 프로젝트형\n- 역할 분담 명확히\n- 주간 진행 체크\n- 최종 산출물 품질 관리\n\n## 공통 학습 팁\n- 평가 기준표 먼저 확인\n- 기한 관리 (역산 스케줄링)\n- 초안 → 수정 → 완성 3단계\n- 동료 피드백 활용",
    relatedDocs: ['doc-004'],
    relatedServices: []
  },
  {
    id: 'doc-interactive-001',
    slug: 'beer-lambert-law-simulator',
    title: 'Beer-Lambert 법칙 시뮬레이터',
    summary: '프리즘 분광기로 검증하는 빛의 흡수 법칙. 농도·경로길이·몰흡광계수를 조절하며 흡광도와 투과율을 체험하는 인터렉티브 시뮬레이션입니다.',
    docType: 'interactive',
    categoryId: 'simulation',
    tags: ['Beer-Lambert', '흡광도', '투과율', '분광학', '화학', '물리', '시뮬레이션', '실험'],
    status: 'published',
    createdAt: '2026-03-23',
    updatedAt: '2026-03-23',
    directAnswer: [
      'Beer-Lambert 법칙은 A = εlc로, 용액의 흡광도(A)가 몰흡광계수(ε), 경로길이(l), 농도(c)에 비례함을 나타냅니다.',
      '이 시뮬레이터에서 농도와 경로길이를 조절하며 흡광도·투과율 변화를 실시간으로 확인할 수 있습니다.',
      '이론 학습, 시뮬레이션, 실험 준비, 보고서 작성, 퀴즈까지 한번에 수행할 수 있는 올인원 실험 도구입니다.'
    ],
    targetAudience: ['고등학교 2~3학년', '과학 교사', '화학·물리 관심 학생'],
    entities: ['Beer-Lambert 법칙', '흡광도', '투과율', '프리즘', '분광학', '몰흡광계수'],
    cluster: {
      pillarTopic: '분광학과 빛의 흡수',
      subTopic: 'Beer-Lambert 법칙 시뮬레이션',
      intentType: 'interactive',
      relatedClusterSlugs: ['experiment-design-methodology']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '시뮬레이터 소개' },
      { type: 'paragraph', text: '이 인터렉티브 시뮬레이터는 Beer-Lambert 법칙(A = εlc)을 직접 체험할 수 있도록 설계되었습니다.' },
      { type: 'heading', level: 2, text: '주요 기능' },
      { type: 'list', ordered: false, items: [
        '이론 — 빛의 흡수, 법칙 유도, 프리즘 분산 원리',
        '시뮬레이터 — 농도/경로/ε 슬라이더 + 실시간 그래프',
        '실험준비 — 프리즘 박스 장치 구성, 준비물, 유의사항',
        '실험방법 — 6단계 실험 절차, ImageJ 분석 가이드',
        '결과보고 — 데이터 입력, 자동 계산 검증, 성찰, 퀴즈, 제출',
        '실생활 예제 — 혈액검사, 수질검사, DNA 정량 등 6가지'
      ]},
      { type: 'heading', level: 2, text: '사용 방법' },
      { type: 'paragraph', text: '아래 링크를 클릭하여 시뮬레이터를 실행하세요. 탭 메뉴로 이론→시뮬레이터→실험→보고서 순서로 진행합니다.' }
    ],
    faqItems: [
      { question: 'Beer-Lambert 법칙이란 무엇인가요?', answer: '용액의 흡광도가 몰흡광계수, 빛의 경로길이, 용액 농도의 곱과 같다는 법칙입니다 (A = εlc).' },
      { question: '이 시뮬레이터로 무엇을 배울 수 있나요?', answer: '농도 변화에 따른 흡광도의 선형 변화, 투과 스펙트럼의 변화, 프리즘 분산 원리 등을 직접 조작하며 배울 수 있습니다.' },
      { question: '교사 모드는 어떻게 사용하나요?', answer: '시뮬레이터 우하단의 "선생님" 버튼을 클릭하면 학생 제출 현황을 확인하고 CSV로 내보낼 수 있습니다.' }
    ],
    authorInfo: {
      name: 'EduAtlas 편집팀',
      role: '인터렉티브 콘텐츠 개발',
      expertise: '과학 교육, 시뮬레이션 설계'
    },
    seoTitle: 'Beer-Lambert 법칙 시뮬레이터 - 흡광도·투과율 인터렉티브 실험',
    seoDescription: '프리즘 분광기로 검증하는 Beer-Lambert 법칙 인터렉티브 시뮬레이터. 농도·경로길이·몰흡광계수를 조절하며 흡광도와 투과율을 실시간 체험합니다.',
    schemaTypes: ['Article', 'FAQPage'],
    technicalMeta: {
      canonicalPath: '/demos/beer-lambert-law.html',
      indexable: true,
      externalUrl: 'demos/beer-lambert-law.html'
    },
    keyInfo: {
      definition: 'Beer-Lambert 법칙은 용액의 흡광도가 농도에 비례한다는 분광학의 기본 법칙입니다.',
      importance: '화학 분석, 의료 검사, 환경 모니터링 등 광범위하게 활용되는 핵심 원리입니다.',
      audience: '고등학교 2~3학년 학생 및 과학 교사'
    },
    relatedDocs: ['doc-002', 'doc-004', 'doc-008', 'doc-interactive-002'],
    relatedServices: []
  },
  {
    id: 'doc-interactive-002',
    slug: 'planck-constant-led-simulator',
    title: '플랑크 상수 측정 시뮬레이터',
    summary: 'USB 가변전원과 5색 LED로 플랑크 상수를 직접 측정하는 인터렉티브 시뮬레이션. 문턱 전압과 파장의 관계에서 양자역학의 근본 상수 h를 구합니다.',
    docType: 'interactive',
    categoryId: 'simulation',
    tags: ['플랑크 상수', '양자역학', 'LED', '밴드갭', '물리', '시뮬레이션', '실험'],
    status: 'published',
    createdAt: '2026-03-23',
    updatedAt: '2026-03-23',
    directAnswer: [
      '플랑크 상수 h = 6.626 × 10⁻³⁴ J·s는 에너지의 최소 단위(양자)를 결정하는 근본 상수입니다.',
      'LED의 문턱 전압(Vth)과 파장(λ)의 관계 Vth = (hc/e) × (1/λ)를 이용하여 h를 측정합니다.',
      '5색 LED의 Vth vs 1/λ 그래프의 기울기에서 h = 기울기 × e / c로 플랑크 상수를 계산합니다.'
    ],
    targetAudience: ['고등학교 2~3학년', '물리 교사', '양자역학 관심 학생'],
    entities: ['플랑크 상수', '양자역학', 'LED', '밴드갭', '문턱 전압', '광전효과'],
    cluster: {
      pillarTopic: '양자역학과 에너지 양자화',
      subTopic: '플랑크 상수 LED 측정',
      intentType: 'interactive',
      relatedClusterSlugs: ['beer-lambert-law-simulator']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '시뮬레이터 소개' },
      { type: 'paragraph', text: 'USB 가변전원과 LED로 플랑크 상수를 측정하는 실험을 가상으로 체험할 수 있는 인터렉티브 시뮬레이터입니다.' }
    ],
    faqItems: [
      { question: '플랑크 상수란 무엇인가요?', answer: '에너지의 최소 단위를 결정하는 양자역학의 근본 상수입니다 (h = 6.626 × 10⁻³⁴ J·s).' },
      { question: 'LED로 어떻게 플랑크 상수를 측정하나요?', answer: 'LED 문턱 전압(Vth)과 파장(λ)의 관계 eVth = hc/λ를 이용합니다. Vth vs 1/λ 그래프 기울기에서 h를 구합니다.' },
      { question: '아두이노가 필요한가요?', answer: '아닙니다. USB 5V + 포텐시오미터 + 330Ω 저항 + 멀티미터만으로 측정 가능합니다.' }
    ],
    authorInfo: { name: 'EduAtlas 편집팀', role: '인터렉티브 콘텐츠 개발', expertise: '물리 교육, 양자역학 실험' },
    seoTitle: '플랑크 상수 측정 시뮬레이터 - LED로 양자역학 체험',
    seoDescription: 'USB 가변전원과 5색 LED로 플랑크 상수를 직접 측정하는 인터렉티브 시뮬레이터.',
    schemaTypes: ['Article', 'FAQPage'],
    technicalMeta: { canonicalPath: '/demos/planck-constant.html', indexable: true, externalUrl: 'demos/planck-constant.html' },
    keyInfo: {
      definition: '플랑크 상수는 에너지와 진동수의 비례 상수로, 양자역학의 가장 기본적인 물리 상수입니다.',
      importance: '반도체, 태양전지, 레이저, MRI 등 현대 기술의 근간을 이루는 상수입니다.',
      audience: '고등학교 2~3학년 학생 및 물리 교사'
    },
    relatedDocs: ['doc-009', 'doc-interactive-001', 'doc-interactive-003'],
    relatedServices: []
  },
  {
    id: 'doc-interactive-003',
    slug: 'ideal-gas-law-simulator',
    title: '이상기체 법칙 시뮬레이터',
    summary: 'PV=nRT 이상기체 법칙 인터랙티브 시뮬레이터. 보일, 샤를, 게이-뤼삭 법칙을 시각적으로 체험하고 아두이노 BMP280 센서로 등적 과정을 검증합니다.',
    docType: 'interactive',
    categoryId: 'simulation',
    tags: ['이상기체', 'PV=nRT', '보일의 법칙', '샤를의 법칙', '게이-뤼삭', '화학', '물리', '시뮬레이션', '아두이노'],
    status: 'published',
    createdAt: '2026-03-23',
    updatedAt: '2026-03-23',
    directAnswer: [
      'PV = nRT는 이상기체의 압력(P), 부피(V), 온도(T), 몰수(n)의 관계를 나타내는 상태방정식입니다.',
      '등압(P 고정): V ∝ T (샤를), 등적(V 고정): P ∝ T (게이-뤼삭), 등온(T 고정): PV = const (보일)',
      '아두이노 + BMP280 + DS18B20으로 밀폐 페트병의 등적 과정(P/T = const)을 정량 검증할 수 있습니다.'
    ],
    targetAudience: ['고등학교 1~3학년', '화학/물리 교사', '과학 탐구 학생'],
    entities: ['이상기체 법칙', '보일의 법칙', '샤를의 법칙', '게이-뤼삭 법칙', '몰', '아보가드로 수'],
    cluster: {
      pillarTopic: '기체의 성질과 상태방정식',
      subTopic: '이상기체 법칙 시뮬레이션',
      intentType: 'interactive',
      relatedClusterSlugs: ['beer-lambert-law-simulator', 'planck-constant-led-simulator']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '시뮬레이터 소개' },
      { type: 'paragraph', text: 'PV=nRT 이상기체 법칙을 변수 고정 조건별로 시각화하고, 아두이노 센서 실험으로 검증하는 인터렉티브 시뮬레이터입니다.' }
    ],
    faqItems: [
      { question: '이상기체 법칙이란?', answer: 'PV=nRT로, 이상적인 기체의 압력·부피·온도·몰수 사이의 관계를 나타내는 상태방정식입니다.' },
      { question: '시뮬레이터에서 어떤 법칙을 체험할 수 있나요?', answer: '보일의 법칙(등온), 샤를의 법칙(등압), 게이-뤼삭 법칙(등적)을 변수 고정 버튼으로 전환하며 체험합니다.' },
      { question: '실제 실험은 어떻게 하나요?', answer: '아두이노 + BMP280 기압센서 + DS18B20 온도센서로 밀폐 페트병의 등적 과정을 측정하여 P/T = const를 검증합니다.' }
    ],
    authorInfo: { name: 'EduAtlas 편집팀', role: '인터렉티브 콘텐츠 개발', expertise: '화학/물리 교육' },
    seoTitle: '이상기체 법칙 시뮬레이터 - PV=nRT 인터랙티브 체험',
    seoDescription: 'PV=nRT 이상기체 법칙 시뮬레이터. 보일, 샤를, 게이-뤼삭 법칙을 시각적으로 체험하고 아두이노 센서로 검증합니다.',
    schemaTypes: ['Article', 'FAQPage'],
    technicalMeta: { canonicalPath: '/demos/ideal-gas-law.html', indexable: true, externalUrl: 'demos/ideal-gas-law.html' },
    keyInfo: {
      definition: '이상기체 법칙(PV=nRT)은 기체의 압력, 부피, 온도, 몰수 사이의 관계를 나타내는 상태방정식입니다.',
      importance: '화학 반응의 기체 계산, 산업 공정, 기상학, 의료 장비 등에 핵심적으로 활용됩니다.',
      audience: '고등학교 1~3학년 학생 및 과학 교사'
    },
    relatedDocs: ['doc-interactive-001', 'doc-interactive-002'],
    relatedServices: []
  },
  // ============================================================
  // 씨앗 데이터: 학원 샘플 문서
  // ============================================================
  {
    id: 'doc-academy-001',
    slug: 'academy-청담수학학원-강남구',
    title: '청담수학학원 - 강남구 수학 학원',
    summary: '서울 강남구에 위치한 수학 전문 학원 청담수학학원의 프로그램, 수강료, 특징, 위치 정보를 안내합니다.',
    docType: 'academy',
    categoryId: 'academy',
    tags: ['청담수학학원', '수학학원', '강남구 수학학원', '강남구 학원', '서울 강남구 학원', '중등 학원', '고등 학원', '수학', '학원 추천', '강남구 학원 추천', '강남 수학', '대치동 학원'],
    status: 'published',
    createdAt: '2026-03-26',
    updatedAt: '2026-03-26',
    directAnswer: [
      '청담수학학원은 서울 강남구에 위치한 수학 전문 학원입니다. 소수정예 8~12명 수업을 운영합니다.',
      '청담수학학원의 특징: 수준별 반 편성, 주 2회 개별 클리닉, 내신+수능 병행 커리큘럼.',
      '월 수강료는 40만~60만원 수준이며, 중등, 고등 학생을 대상으로 합니다.'
    ],
    targetAudience: ['중등 학생 및 학부모', '고등 학생 및 학부모'],
    entities: ['청담수학학원', '수학학원', '강남구 학원'],
    cluster: {
      pillarTopic: '강남구 학원 정보',
      subTopic: '수학 학원',
      intentType: 'local-business',
      relatedClusterSlugs: ['academy-스마트영어-서초구', 'academy-코드랩아카데미-송파구']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '학원 소개' },
      { type: 'paragraph', text: '청담수학학원은 서울 강남구 대치동에서 15년간 중·고등 수학 교육을 전문으로 운영해온 학원입니다. 수능과 내신을 균형 있게 대비하며, 학생 개개인의 수준에 맞춘 맞춤형 수업을 제공합니다.' },
      { type: 'heading', level: 2, text: '교육 과목' },
      { type: 'list', ordered: false, items: ['📐 수학 (중등·고등 전 과정)'] },
      { type: 'heading', level: 2, text: '프로그램 안내' },
      { type: 'list', ordered: false, items: [
        '중등 수학 심화반 — 내신 대비 + 선행 학습',
        '고등 수학 정규반 — 교과서 + 수능 기출 연계',
        '수능 집중반 — 고3/N수 대상 수능 실전 대비',
        '주말 클리닉 — 개별 약점 보완 1:3 수업'
      ]},
      { type: 'heading', level: 2, text: '학원 특징' },
      { type: 'list', ordered: false, items: [
        '수준별 반 편성 (레벨 테스트 후 배정)',
        '주 2회 개별 클리닉 운영',
        '내신+수능 병행 커리큘럼',
        '매주 학부모 피드백 문자 발송',
        '자습실 상시 개방'
      ]},
      { type: 'heading', level: 2, text: '수업 정보' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['대상', '중등, 고등'],
        ['반 인원', '8~12명'],
        ['수강료', '40만~60만원/월'],
        ['운영시간', '평일 14:00~22:00, 토 10:00~18:00']
      ]},
      { type: 'heading', level: 2, text: '위치 및 연락처' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['주소', '서울 강남구 대치동 123-45'],
        ['전화', '02-555-1234']
      ]}
    ],
    faqItems: [
      { question: '청담수학학원은 어디에 있나요?', answer: '서울 강남구 대치동 123-45에 위치해 있습니다.' },
      { question: '청담수학학원에서 어떤 과목을 가르치나요?', answer: '수학 과목을 전문으로 가르칩니다. 중등부터 고등까지 전 과정을 다룹니다.' },
      { question: '청담수학학원의 수강료는 얼마인가요?', answer: '월 수강료는 40만~60만원 수준입니다. 반과 수업 횟수에 따라 달라지며 정확한 금액은 학원에 문의해주세요.' },
      { question: '청담수학학원은 몇 명씩 수업하나요?', answer: '8~12명 규모로 수업합니다.' },
      { question: '청담수학학원의 운영시간은 어떻게 되나요?', answer: '평일 14:00~22:00, 토요일 10:00~18:00입니다.' }
    ],
    authorInfo: { name: '청담수학학원', role: '교육기관', expertise: '수학 교육' },
    seoTitle: '청담수학학원 | 강남구 대치동 수학 학원 - 프로그램, 수강료, 위치',
    seoDescription: '서울 강남구 대치동 수학 전문 학원 청담수학학원. 수준별 반 편성, 주 2회 개별 클리닉, 내신+수능 병행. 프로그램, 수강료, 위치 정보를 확인하세요.',
    schemaTypes: ['LocalBusiness', 'EducationalOrganization', 'FAQPage'],
    technicalMeta: { canonicalPath: '/documents/academy-청담수학학원-강남구', indexable: true },
    keyInfo: {
      name: '청담수학학원',
      location: '서울 강남구',
      subjects: '수학',
      ageGroups: '중등, 고등',
      classSize: '8~12명',
      monthlyFee: '40만~60만원'
    },
    relatedDocs: ['doc-academy-002', 'doc-academy-003'],
    relatedServices: [],
    academyInfo: {
      regionId: 'seoul',
      district: '강남구',
      address: '대치동 123-45',
      phone: '02-555-1234',
      website: '',
      subjects: ['math'],
      ageGroups: ['중등', '고등'],
      programs: ['중등 수학 심화반', '고등 수학 정규반', '수능 집중반', '주말 클리닉'],
      features: ['수준별 반 편성', '주 2회 개별 클리닉', '내신+수능 병행 커리큘럼', '매주 학부모 피드백'],
      monthlyFee: '40만~60만원',
      classSize: '8~12명',
      operatingHours: '평일 14:00~22:00, 토 10:00~18:00',
      establishedYear: '2011'
    }
  },
  {
    id: 'doc-academy-002',
    slug: 'academy-스마트영어-서초구',
    title: '스마트영어 - 서초구 영어 학원',
    summary: '서울 서초구에 위치한 영어 전문 학원 스마트영어의 프로그램, 수강료, 특징, 위치 정보를 안내합니다.',
    docType: 'academy',
    categoryId: 'academy',
    tags: ['스마트영어', '영어학원', '서초구 영어학원', '서초구 학원', '서울 서초구 학원', '초등 학원', '중등 학원', '영어', '학원 추천', '서초구 학원 추천', '영어회화', '토플'],
    status: 'published',
    createdAt: '2026-03-26',
    updatedAt: '2026-03-26',
    directAnswer: [
      '스마트영어는 서울 서초구에 위치한 영어 전문 학원입니다. 소수정예 6~10명 수업을 운영합니다.',
      '스마트영어의 특징: 원어민+한국인 팀티칭, 레벨별 리딩 프로그램, 영어 토론 수업.',
      '월 수강료는 35만~50만원 수준이며, 초등, 중등 학생을 대상으로 합니다.'
    ],
    targetAudience: ['초등 학생 및 학부모', '중등 학생 및 학부모'],
    entities: ['스마트영어', '영어학원', '서초구 학원'],
    cluster: {
      pillarTopic: '서초구 학원 정보',
      subTopic: '영어 학원',
      intentType: 'local-business',
      relatedClusterSlugs: ['academy-청담수학학원-강남구']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '학원 소개' },
      { type: 'paragraph', text: '스마트영어는 서울 서초구 방배동에서 초등·중등 영어 교육을 전문으로 하는 학원입니다. 원어민과 한국인 강사의 팀티칭으로 회화와 내신을 동시에 준비합니다.' },
      { type: 'heading', level: 2, text: '교육 과목' },
      { type: 'list', ordered: false, items: ['🔤 영어 (초등·중등)'] },
      { type: 'heading', level: 2, text: '프로그램 안내' },
      { type: 'list', ordered: false, items: [
        '초등 파닉스+리딩 기초반',
        '초등 영어 독서 프로그램 (AR/Lexile 기반)',
        '중등 내신 영어 완성반',
        '영어 토론 & 에세이 클래스',
        '방학 집중 캠프 (여름/겨울)'
      ]},
      { type: 'heading', level: 2, text: '학원 특징' },
      { type: 'list', ordered: false, items: [
        '원어민+한국인 팀티칭',
        'AR/Lexile 기반 레벨별 리딩 프로그램',
        '영어 토론 수업 (주 1회)',
        '분기별 레벨 테스트 및 학부모 상담',
        '온라인 숙제 관리 시스템'
      ]},
      { type: 'heading', level: 2, text: '수업 정보' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['대상', '초등, 중등'],
        ['반 인원', '6~10명'],
        ['수강료', '35만~50만원/월'],
        ['운영시간', '평일 14:00~21:00, 토 10:00~17:00']
      ]},
      { type: 'heading', level: 2, text: '위치 및 연락처' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['주소', '서울 서초구 방배동 456-78'],
        ['전화', '02-533-5678']
      ]}
    ],
    faqItems: [
      { question: '스마트영어는 어디에 있나요?', answer: '서울 서초구 방배동 456-78에 위치해 있습니다.' },
      { question: '스마트영어에서 어떤 과목을 가르치나요?', answer: '영어를 전문으로 가르칩니다. 초등 파닉스부터 중등 내신까지 다룹니다.' },
      { question: '스마트영어의 수강료는 얼마인가요?', answer: '월 수강료는 35만~50만원 수준입니다.' },
      { question: '원어민 수업이 있나요?', answer: '네, 원어민과 한국인 강사가 함께 가르치는 팀티칭 방식으로 수업합니다.' }
    ],
    authorInfo: { name: '스마트영어', role: '교육기관', expertise: '영어 교육' },
    seoTitle: '스마트영어 | 서초구 방배동 영어 학원 - 원어민 팀티칭, 리딩 프로그램',
    seoDescription: '서울 서초구 방배동 영어 전문 학원 스마트영어. 원어민+한국인 팀티칭, AR 리딩 프로그램. 프로그램, 수강료, 위치 정보.',
    schemaTypes: ['LocalBusiness', 'EducationalOrganization', 'FAQPage'],
    technicalMeta: { canonicalPath: '/documents/academy-스마트영어-서초구', indexable: true },
    keyInfo: { name: '스마트영어', location: '서울 서초구', subjects: '영어', ageGroups: '초등, 중등', classSize: '6~10명', monthlyFee: '35만~50만원' },
    relatedDocs: ['doc-academy-001', 'doc-academy-003'],
    relatedServices: [],
    academyInfo: {
      regionId: 'seoul', district: '서초구', address: '방배동 456-78', phone: '02-533-5678', website: '',
      subjects: ['english'], ageGroups: ['초등', '중등'],
      programs: ['초등 파닉스+리딩 기초반', '영어 독서 프로그램', '중등 내신 영어 완성반', '영어 토론 & 에세이', '방학 집중 캠프'],
      features: ['원어민+한국인 팀티칭', 'AR/Lexile 리딩 프로그램', '영어 토론 수업', '온라인 숙제 관리'],
      monthlyFee: '35만~50만원', classSize: '6~10명', operatingHours: '평일 14:00~21:00, 토 10:00~17:00', establishedYear: '2015'
    }
  },
  {
    id: 'doc-academy-003',
    slug: 'academy-코드랩아카데미-송파구',
    title: '코드랩 아카데미 - 송파구 코딩 학원',
    summary: '서울 송파구에 위치한 코딩/SW 전문 학원 코드랩 아카데미의 프로그램, 수강료, 특징, 위치 정보를 안내합니다.',
    docType: 'academy',
    categoryId: 'academy',
    tags: ['코드랩아카데미', '코딩학원', '송파구 코딩학원', '송파구 학원', '서울 송파구 학원', '초등 학원', '중등 학원', '코딩', 'SW교육', '파이썬', '학원 추천', '송파구 학원 추천', '잠실 코딩'],
    status: 'published',
    createdAt: '2026-03-26',
    updatedAt: '2026-03-26',
    directAnswer: [
      '코드랩 아카데미는 서울 송파구에 위치한 코딩/SW 전문 학원입니다. 소수정예 4~8명 수업을 운영합니다.',
      '코드랩 아카데미의 특징: 프로젝트 기반 학습, 스크래치→파이썬→앱개발 단계별 커리큘럼, 정보올림피아드 대비반.',
      '월 수강료는 25만~40만원 수준이며, 초등, 중등 학생을 대상으로 합니다.'
    ],
    targetAudience: ['초등 학생 및 학부모', '중등 학생 및 학부모'],
    entities: ['코드랩 아카데미', '코딩학원', '송파구 학원'],
    cluster: {
      pillarTopic: '송파구 학원 정보',
      subTopic: '코딩 학원',
      intentType: 'local-business',
      relatedClusterSlugs: ['academy-청담수학학원-강남구']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '학원 소개' },
      { type: 'paragraph', text: '코드랩 아카데미는 서울 송파구 잠실에서 초등·중등 코딩/SW 교육을 전문으로 하는 학원입니다. 프로젝트 기반 학습으로 단순 코드 작성이 아닌 문제 해결 능력을 키웁니다.' },
      { type: 'heading', level: 2, text: '교육 과목' },
      { type: 'list', ordered: false, items: ['💻 코딩/SW (스크래치, 파이썬, 앱개발)'] },
      { type: 'heading', level: 2, text: '프로그램 안내' },
      { type: 'list', ordered: false, items: [
        '초등 스크래치 기초 — 블록코딩으로 논리적 사고력 키우기',
        '초등 파이썬 입문 — 텍스트 코딩 첫걸음',
        '중등 파이썬 심화 — 알고리즘 + 데이터 구조',
        '앱 개발 프로젝트반 — 실제 앱을 기획부터 배포까지',
        '정보올림피아드 대비반'
      ]},
      { type: 'heading', level: 2, text: '학원 특징' },
      { type: 'list', ordered: false, items: [
        '프로젝트 기반 학습 (PBL)',
        '스크래치→파이썬→앱개발 단계별 커리큘럼',
        '정보올림피아드 대비반 운영',
        '분기별 해커톤 이벤트',
        '학생별 포트폴리오 관리'
      ]},
      { type: 'heading', level: 2, text: '수업 정보' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['대상', '초등, 중등'],
        ['반 인원', '4~8명'],
        ['수강료', '25만~40만원/월'],
        ['운영시간', '평일 15:00~21:00, 토 10:00~18:00']
      ]},
      { type: 'heading', level: 2, text: '위치 및 연락처' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['주소', '서울 송파구 잠실동 789-12'],
        ['전화', '02-421-7890']
      ]}
    ],
    faqItems: [
      { question: '코드랩 아카데미는 어디에 있나요?', answer: '서울 송파구 잠실동 789-12에 위치해 있습니다.' },
      { question: '코딩을 처음 배우는 아이도 괜찮나요?', answer: '네, 스크래치 블록코딩부터 시작하므로 코딩 경험이 없어도 수강 가능합니다.' },
      { question: '어떤 프로그래밍 언어를 가르치나요?', answer: '스크래치(블록코딩), 파이썬, 앱 인벤터를 단계별로 가르칩니다.' },
      { question: '정보올림피아드 준비도 가능한가요?', answer: '네, 정보올림피아드 대비반을 별도로 운영하고 있습니다.' }
    ],
    authorInfo: { name: '코드랩 아카데미', role: '교육기관', expertise: '코딩/SW 교육' },
    seoTitle: '코드랩 아카데미 | 송파구 잠실 코딩 학원 - 스크래치, 파이썬, 앱개발',
    seoDescription: '서울 송파구 잠실 코딩 전문 학원 코드랩 아카데미. 프로젝트 기반 학습, 스크래치→파이썬→앱개발 단계별 커리큘럼. 프로그램, 수강료, 위치 정보.',
    schemaTypes: ['LocalBusiness', 'EducationalOrganization', 'FAQPage'],
    technicalMeta: { canonicalPath: '/documents/academy-코드랩아카데미-송파구', indexable: true },
    keyInfo: { name: '코드랩 아카데미', location: '서울 송파구', subjects: '코딩/SW', ageGroups: '초등, 중등', classSize: '4~8명', monthlyFee: '25만~40만원' },
    relatedDocs: ['doc-academy-001', 'doc-academy-002', 'doc-academy-004'],
    relatedServices: [],
    academyInfo: {
      regionId: 'seoul', district: '송파구', address: '잠실동 789-12', phone: '02-421-7890', website: '',
      subjects: ['coding'], ageGroups: ['초등', '중등'],
      programs: ['스크래치 기초', '파이썬 입문', '파이썬 심화', '앱 개발 프로젝트', '정보올림피아드 대비'],
      features: ['프로젝트 기반 학습', '단계별 커리큘럼', '정보올림피아드 대비', '분기별 해커톤', '포트폴리오 관리'],
      monthlyFee: '25만~40만원', classSize: '4~8명', operatingHours: '평일 15:00~21:00, 토 10:00~18:00', establishedYear: '2019'
    }
  },
  {
    id: 'doc-academy-004',
    slug: 'academy-한빛과학학원-성남시',
    title: '한빛과학학원 - 성남시 과학 학원',
    summary: '경기 성남시에 위치한 과학 전문 학원 한빛과학학원의 프로그램, 수강료, 특징, 위치 정보를 안내합니다.',
    docType: 'academy',
    categoryId: 'academy',
    tags: ['한빛과학학원', '과학학원', '성남시 과학학원', '성남시 학원', '경기 성남시 학원', '중등 학원', '고등 학원', '과학', '물리', '화학', '학원 추천', '분당 학원'],
    status: 'published',
    createdAt: '2026-03-26',
    updatedAt: '2026-03-26',
    directAnswer: [
      '한빛과학학원은 경기 성남시 분당구에 위치한 과학(물리·화학) 전문 학원입니다. 소수정예 6~10명 수업을 운영합니다.',
      '한빛과학학원의 특징: 실험 중심 수업, 과학탐구 대회 준비, 내신+수능 통합 커리큘럼.',
      '월 수강료는 35만~55만원 수준이며, 중등, 고등 학생을 대상으로 합니다.'
    ],
    targetAudience: ['중등 학생 및 학부모', '고등 학생 및 학부모'],
    entities: ['한빛과학학원', '과학학원', '성남시 학원'],
    cluster: {
      pillarTopic: '성남시 학원 정보',
      subTopic: '과학 학원',
      intentType: 'local-business',
      relatedClusterSlugs: ['academy-코드랩아카데미-송파구']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '학원 소개' },
      { type: 'paragraph', text: '한빛과학학원은 경기 성남시 분당구에서 중·고등 과학(물리, 화학) 교육을 전문으로 하는 학원입니다. 단순 이론 암기가 아닌 실험과 탐구 중심의 수업으로 과학적 사고력을 키웁니다.' },
      { type: 'heading', level: 2, text: '교육 과목' },
      { type: 'list', ordered: false, items: ['🔬 과학 (물리, 화학)'] },
      { type: 'heading', level: 2, text: '프로그램 안내' },
      { type: 'list', ordered: false, items: [
        '중등 과학 개념+실험반',
        '고등 물리학 정규반 (물리I·II)',
        '고등 화학 정규반 (화학I·II)',
        '과학탐구 대회 준비반',
        '수능 과탐 파이널반'
      ]},
      { type: 'heading', level: 2, text: '학원 특징' },
      { type: 'list', ordered: false, items: [
        '자체 실험실 보유 — 매주 실험 수업',
        '과학탐구 대회 준비 (다수 수상 실적)',
        '내신+수능 통합 커리큘럼',
        '월 1회 모의고사 + 성적 분석 리포트',
        '대학생 멘토 질의응답 프로그램'
      ]},
      { type: 'heading', level: 2, text: '수업 정보' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['대상', '중등, 고등'],
        ['반 인원', '6~10명'],
        ['수강료', '35만~55만원/월'],
        ['운영시간', '평일 15:00~22:00, 토 10:00~18:00']
      ]},
      { type: 'heading', level: 2, text: '위치 및 연락처' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['주소', '경기 성남시 분당구 서현동 234-56'],
        ['전화', '031-712-3456']
      ]}
    ],
    faqItems: [
      { question: '한빛과학학원은 어디에 있나요?', answer: '경기 성남시 분당구 서현동 234-56에 위치해 있습니다.' },
      { question: '어떤 과학 과목을 가르치나요?', answer: '물리와 화학을 전문으로 가르칩니다. 중등 통합과학부터 고등 물리I·II, 화학I·II까지 다룹니다.' },
      { question: '실험 수업이 있나요?', answer: '네, 자체 실험실을 보유하고 있으며 매주 실험 수업을 진행합니다.' },
      { question: '과학 대회 준비도 가능한가요?', answer: '네, 과학탐구 대회 준비반을 별도로 운영하며 다수의 수상 실적이 있습니다.' }
    ],
    authorInfo: { name: '한빛과학학원', role: '교육기관', expertise: '물리, 화학 교육' },
    seoTitle: '한빛과학학원 | 분당 성남시 과학 학원 - 물리, 화학, 실험 수업',
    seoDescription: '경기 성남시 분당구 과학 전문 학원 한빛과학학원. 실험 중심 수업, 과학탐구 대회 준비, 내신+수능 통합. 프로그램, 수강료, 위치 정보.',
    schemaTypes: ['LocalBusiness', 'EducationalOrganization', 'FAQPage'],
    technicalMeta: { canonicalPath: '/documents/academy-한빛과학학원-성남시', indexable: true },
    keyInfo: { name: '한빛과학학원', location: '경기 성남시', subjects: '과학(물리, 화학)', ageGroups: '중등, 고등', classSize: '6~10명', monthlyFee: '35만~55만원' },
    relatedDocs: ['doc-academy-001', 'doc-academy-003', 'doc-academy-005'],
    relatedServices: [],
    academyInfo: {
      regionId: 'gyeonggi', district: '성남시', address: '분당구 서현동 234-56', phone: '031-712-3456', website: '',
      subjects: ['science'], ageGroups: ['중등', '고등'],
      programs: ['중등 과학 개념+실험', '물리학 정규반', '화학 정규반', '과학탐구 대회 준비', '수능 과탐 파이널'],
      features: ['자체 실험실 보유', '과학탐구 대회 준비', '내신+수능 통합', '월 1회 모의고사', '멘토 질의응답'],
      monthlyFee: '35만~55만원', classSize: '6~10명', operatingHours: '평일 15:00~22:00, 토 10:00~18:00', establishedYear: '2013'
    }
  },
  {
    id: 'doc-academy-005',
    slug: 'academy-토탈종합학원-수원시',
    title: '토탈종합학원 - 수원시 종합 학원',
    summary: '경기 수원시에 위치한 수학, 영어, 과학 종합 학원 토탈종합학원의 프로그램, 수강료, 특징, 위치 정보를 안내합니다.',
    docType: 'academy',
    categoryId: 'academy',
    tags: ['토탈종합학원', '종합학원', '수원시 학원', '경기 수원시 학원', '초등 학원', '중등 학원', '수학', '영어', '과학', '학원 추천', '수원 학원 추천', '영통 학원'],
    status: 'published',
    createdAt: '2026-03-26',
    updatedAt: '2026-03-26',
    directAnswer: [
      '토탈종합학원은 경기 수원시 영통구에 위치한 수학, 영어, 과학 종합 학원입니다. 소수정예 8~15명 수업을 운영합니다.',
      '토탈종합학원의 특징: 전 과목 통합 관리, 학생 개별 학습 플래너, 정기 학부모 상담.',
      '월 수강료는 과목당 25만~35만원 수준이며, 초등, 중등 학생을 대상으로 합니다.'
    ],
    targetAudience: ['초등 학생 및 학부모', '중등 학생 및 학부모'],
    entities: ['토탈종합학원', '종합학원', '수원시 학원'],
    cluster: {
      pillarTopic: '수원시 학원 정보',
      subTopic: '종합 학원',
      intentType: 'local-business',
      relatedClusterSlugs: ['academy-한빛과학학원-성남시']
    },
    contentBlocks: [
      { type: 'heading', level: 2, text: '학원 소개' },
      { type: 'paragraph', text: '토탈종합학원은 경기 수원시 영통구에서 초등·중등 대상으로 수학, 영어, 과학을 통합적으로 가르치는 종합학원입니다. 한 곳에서 주요 과목을 모두 관리할 수 있어 학부모님들에게 편리합니다.' },
      { type: 'heading', level: 2, text: '교육 과목' },
      { type: 'list', ordered: false, items: ['📐 수학', '🔤 영어', '🔬 과학'] },
      { type: 'heading', level: 2, text: '프로그램 안내' },
      { type: 'list', ordered: false, items: [
        '초등 전과목 통합반',
        '중등 수학 내신 대비반',
        '중등 영어 독해+문법반',
        '중등 과학 개념+실험반',
        '방학특강 (과목별 집중 보강)'
      ]},
      { type: 'heading', level: 2, text: '학원 특징' },
      { type: 'list', ordered: false, items: [
        '전 과목 통합 관리 시스템',
        '학생별 개별 학습 플래너 제공',
        '정기 학부모 상담 (월 1회)',
        '자습실 운영 및 질의응답 지원',
        '셔틀버스 운행'
      ]},
      { type: 'heading', level: 2, text: '수업 정보' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['대상', '초등, 중등'],
        ['반 인원', '8~15명'],
        ['수강료', '과목당 25만~35만원/월'],
        ['운영시간', '평일 14:00~22:00, 토 09:00~17:00']
      ]},
      { type: 'heading', level: 2, text: '위치 및 연락처' },
      { type: 'table', headers: ['항목', '내용'], rows: [
        ['주소', '경기 수원시 영통구 영통동 567-89'],
        ['전화', '031-204-5678']
      ]}
    ],
    faqItems: [
      { question: '토탈종합학원은 어디에 있나요?', answer: '경기 수원시 영통구 영통동 567-89에 위치해 있습니다.' },
      { question: '어떤 과목을 가르치나요?', answer: '수학, 영어, 과학을 가르칩니다. 초등 전과목 통합반도 운영합니다.' },
      { question: '셔틀버스가 있나요?', answer: '네, 영통구 일대 셔틀버스를 운행합니다. 노선은 학원에 문의해주세요.' },
      { question: '과목별로 따로 등록 가능한가요?', answer: '네, 과목별 개별 등록이 가능합니다. 복수 과목 등록 시 할인 혜택이 있습니다.' }
    ],
    authorInfo: { name: '토탈종합학원', role: '교육기관', expertise: '수학, 영어, 과학 교육' },
    seoTitle: '토탈종합학원 | 수원 영통 종합 학원 - 수학, 영어, 과학 통합 관리',
    seoDescription: '경기 수원시 영통구 종합 학원 토탈종합학원. 수학·영어·과학 통합 관리, 개별 학습 플래너, 셔틀버스 운행. 프로그램, 수강료, 위치 정보.',
    schemaTypes: ['LocalBusiness', 'EducationalOrganization', 'FAQPage'],
    technicalMeta: { canonicalPath: '/documents/academy-토탈종합학원-수원시', indexable: true },
    keyInfo: { name: '토탈종합학원', location: '경기 수원시', subjects: '수학, 영어, 과학', ageGroups: '초등, 중등', classSize: '8~15명', monthlyFee: '과목당 25만~35만원' },
    relatedDocs: ['doc-academy-001', 'doc-academy-002', 'doc-academy-004'],
    relatedServices: [],
    academyInfo: {
      regionId: 'gyeonggi', district: '수원시', address: '영통구 영통동 567-89', phone: '031-204-5678', website: '',
      subjects: ['math', 'english', 'science'], ageGroups: ['초등', '중등'],
      programs: ['초등 전과목 통합반', '수학 내신 대비', '영어 독해+문법', '과학 개념+실험', '방학특강'],
      features: ['전 과목 통합 관리', '개별 학습 플래너', '정기 학부모 상담', '자습실 운영', '셔틀버스'],
      monthlyFee: '과목당 25만~35만원', classSize: '8~15명', operatingHours: '평일 14:00~22:00, 토 09:00~17:00', establishedYear: '2017'
    }
  }
];

const SERVICES = [
  {
    id: 'littlescience',
    name: 'LittleScienceAI',
    description: '과학논문 주제 탐색 AI 도우미',
    url: '#',
    icon: '\u{1F9EA}',
    color: '#667eea'
  },
];

// ============================================================
// 데이터 캐시 (Firestore 데이터를 메모리에 유지)
// ============================================================

let _cachedDocs = null;        // Firestore에서 로드된 문서 (null = 아직 로드 안됨)
let _firestoreReady = false;   // Firestore 초기 로드 완료 여부
let _dataReadyCallbacks = [];  // 데이터 로드 완료 콜백

/**
 * Firestore에서 모든 문서를 로드하여 캐시
 * 실패 시 샘플 데이터 + localStorage 폴백
 */
async function loadDocumentsFromFirestore() {
  // Firebase가 없으면 폴백
  if (typeof db === 'undefined') {
    console.warn('[EduAtlas] Firebase not loaded, using sample data');
    _cachedDocs = [...SAMPLE_DOCUMENTS];
    _loadLocalStorageFallback();
    _firestoreReady = true;
    _fireDataReadyCallbacks();
    return;
  }

  try {
    // 5초 타임아웃: Firestore가 응답 없으면 폴백
    var firestorePromise = db.collection('documents').get();
    var timeoutPromise = new Promise(function(_, reject) {
      setTimeout(function() { reject(new Error('Firestore timeout (5s)')); }, 5000);
    });
    var snapshot = await Promise.race([firestorePromise, timeoutPromise]);

    if (snapshot.empty) {
      console.log('[EduAtlas] Firestore empty, using sample data');
      _cachedDocs = [...SAMPLE_DOCUMENTS];
    } else {
      // SAMPLE_DOCUMENTS를 기본 베이스로, Firestore 데이터로 병합/덮어쓰기
      var byId = {};
      SAMPLE_DOCUMENTS.forEach(function(d) { byId[d.id] = d; });
      snapshot.forEach(function(doc) {
        var data = doc.data();
        var docId = data.id || doc.id;
        byId[docId] = data;
      });
      _cachedDocs = Object.values(byId);
      console.log('[EduAtlas] Merged ' + _cachedDocs.length + ' docs (Firestore + sample)');
    }
  } catch (err) {
    console.warn('[EduAtlas] Firestore load failed, using fallback:', err.message);
    _cachedDocs = [...SAMPLE_DOCUMENTS];
    _loadLocalStorageFallback();
  }

  _firestoreReady = true;
  _fireDataReadyCallbacks();
}

function _loadLocalStorageFallback() {
  try {
    const stored = localStorage.getItem('kp_documents');
    if (stored) {
      const custom = JSON.parse(stored);
      _cachedDocs = [..._cachedDocs, ...custom];
    }
  } catch(e) { /* ignore */ }
}

function _fireDataReadyCallbacks() {
  _dataReadyCallbacks.forEach(fn => fn());
  _dataReadyCallbacks = [];
}

/**
 * 데이터 로드 완료 시 콜백 실행
 * 이미 로드되었으면 즉시 실행
 */
function onDataReady(callback) {
  if (_firestoreReady) {
    callback();
  } else {
    _dataReadyCallbacks.push(callback);
  }
}

// ============================================================
// 읽기 함수 (동기식 — 캐시 기반)
// ============================================================

function getAllDocuments() {
  if (_cachedDocs !== null) return _cachedDocs;
  // 아직 Firestore 로드 전이면 샘플 데이터 반환
  return SAMPLE_DOCUMENTS;
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
  return getAllDocuments().filter(d => d.tags && d.tags.includes(tag) && d.status === 'published');
}

function searchDocuments(query) {
  const q = query.toLowerCase();
  return getAllDocuments().filter(d => {
    return d.status === 'published' && (
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q))) ||
      (d.body && d.body.toLowerCase().includes(q))
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
    if (d.status === 'published' && d.tags) {
      d.tags.forEach(t => {
        tags[t] = (tags[t] || 0) + 1;
      });
    }
  });
  return Object.entries(tags).sort((a, b) => b[1] - a[1]);
}

// ============================================================
// 쓰기 함수 (비동기 — Firestore + 캐시 동시 업데이트)
// ============================================================

async function saveDocument(doc) {
  doc.id = 'doc-custom-' + Date.now();
  doc.createdAt = new Date().toISOString().slice(0, 10);
  doc.updatedAt = doc.createdAt;

  // 캐시 업데이트
  if (_cachedDocs) {
    _cachedDocs.push(doc);
  }

  // Firestore 저장
  if (typeof db !== 'undefined') {
    try {
      await db.collection('documents').doc(doc.id).set(doc);
    } catch (err) {
      console.error('[EduAtlas] Firestore save failed:', err);
      _saveToLocalStorage(doc);
    }
  } else {
    _saveToLocalStorage(doc);
  }

  return doc;
}

async function updateDocument(doc) {
  doc.updatedAt = new Date().toISOString().slice(0, 10);

  // 캐시 업데이트
  if (_cachedDocs) {
    const idx = _cachedDocs.findIndex(d => d.id === doc.id);
    if (idx !== -1) _cachedDocs[idx] = doc;
  }

  // Firestore 업데이트
  if (typeof db !== 'undefined') {
    try {
      await db.collection('documents').doc(doc.id).set(doc);
    } catch (err) {
      console.error('[EduAtlas] Firestore update failed:', err);
    }
  }

  return doc;
}

async function deleteDocument(id) {
  // 캐시에서 제거
  if (_cachedDocs) {
    _cachedDocs = _cachedDocs.filter(d => d.id !== id);
  }

  // Firestore에서 삭제
  if (typeof db !== 'undefined') {
    try {
      await db.collection('documents').doc(id).delete();
    } catch (err) {
      console.error('[EduAtlas] Firestore delete failed:', err);
    }
  }

  return true;
}

/**
 * 여러 문서를 Firestore에 일괄 저장 (JSON 붙여넣기용)
 */
async function saveDocumentsBatch(docs) {
  const results = [];
  for (const doc of docs) {
    if (!doc.id) doc.id = 'doc-custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    if (!doc.createdAt) doc.createdAt = new Date().toISOString().slice(0, 10);
    if (!doc.updatedAt) doc.updatedAt = doc.createdAt;
    if (!doc.status) doc.status = 'published';

    // 캐시 업데이트
    if (_cachedDocs) {
      const existIdx = _cachedDocs.findIndex(d => d.id === doc.id);
      if (existIdx !== -1) {
        _cachedDocs[existIdx] = doc;
      } else {
        _cachedDocs.push(doc);
      }
    }

    // Firestore 저장
    if (typeof db !== 'undefined') {
      try {
        await db.collection('documents').doc(doc.id).set(doc);
        results.push({ id: doc.id, title: doc.title, success: true });
      } catch (err) {
        results.push({ id: doc.id, title: doc.title, success: false, error: err.message });
      }
    }
  }
  return results;
}

/**
 * 샘플 데이터를 Firestore에 마이그레이션 (1회성)
 */
async function migrateSampleToFirestore() {
  if (typeof db === 'undefined') {
    throw new Error('Firebase not connected');
  }

  const results = [];
  for (const doc of SAMPLE_DOCUMENTS) {
    try {
      await db.collection('documents').doc(doc.id).set(doc);
      results.push({ id: doc.id, title: doc.title, success: true });
    } catch (err) {
      results.push({ id: doc.id, title: doc.title, success: false, error: err.message });
    }
  }

  // localStorage 데이터도 마이그레이션
  try {
    const stored = localStorage.getItem('kp_documents');
    if (stored) {
      const custom = JSON.parse(stored);
      for (const doc of custom) {
        try {
          await db.collection('documents').doc(doc.id).set(doc);
          results.push({ id: doc.id, title: doc.title, success: true });
        } catch (err) {
          results.push({ id: doc.id, title: doc.title, success: false, error: err.message });
        }
      }
    }
  } catch(e) { /* ignore */ }

  return results;
}

function _saveToLocalStorage(doc) {
  try {
    const stored = localStorage.getItem('kp_documents');
    const custom = stored ? JSON.parse(stored) : [];
    custom.push(doc);
    localStorage.setItem('kp_documents', JSON.stringify(custom));
  } catch(e) { /* ignore */ }
}

function isCustomDocument(id) {
  return id && id.startsWith('doc-custom-');
}

// ============================================================
// AI / 추천 함수
// ============================================================

function getRecommendedDocs(doc, limit) {
  limit = limit || 5;
  const all = getAllDocuments().filter(d => d.id !== doc.id && d.status === 'published');
  const scored = all.map(d => {
    let score = 0;
    if (doc.tags && d.tags) {
      const tagOverlap = doc.tags.filter(t => d.tags.includes(t)).length;
      score += tagOverlap * 3;
    }
    if (d.categoryId === doc.categoryId) score += 2;
    if (d.docType === doc.docType) score += 1;
    if (doc.cluster && doc.cluster.relatedClusterSlugs && doc.cluster.relatedClusterSlugs.includes(d.slug)) score += 5;
    if (doc.entities && d.entities) {
      const entOverlap = doc.entities.filter(e => d.entities.includes(e)).length;
      score += entOverlap * 2;
    }
    return { doc: d, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(s => s.doc);
}

function autoLinkEntities(html, currentSlug) {
  const allDocs = getAllDocuments().filter(d => d.status === 'published' && d.slug !== currentSlug);
  const linkMap = [];
  allDocs.forEach(d => {
    linkMap.push({ text: d.title, slug: d.slug });
    if (d.entities) {
      d.entities.forEach(e => linkMap.push({ text: e, slug: d.slug }));
    }
  });
  linkMap.sort((a, b) => b.text.length - a.text.length);

  const linked = new Set();
  linkMap.forEach(({ text, slug }) => {
    if (linked.has(slug)) return;
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(?<!<[^>]*)\\b(' + escaped + ')\\b(?![^<]*>)', 'i');
    if (regex.test(html)) {
      html = html.replace(regex, '<a href="/documents/' + slug + '" class="entity-link">$1</a>');
      linked.add(slug);
    }
  });
  return html;
}

function generateDraftTemplate(docType, params) {
  const { title, subject, audience, categoryId } = params;
  const templates = {
    article: {
      summary: (subject || title) + '의 핵심 개념, 원리, 응용 분야를 구조화하여 설명합니다.',
      body: '## 정의\n\n' + title + '은(는) ...\n\n## 핵심 개념\n\n### 1. 기본 원리\n- \n- \n- \n\n### 2. 주요 특징\n- \n- \n\n## 적용 분야\n- \n- \n\n## 관련 기술\n- \n- ',
      keyInfo: { definition: '', importance: '', types: '' }
    },
    topic: {
      summary: (audience || '학생') + '을 위한 ' + (subject || title) + ' 관련 탐구 주제를 분야별로 정리했습니다.',
      body: '## 분야별 탐구 주제\n\n### 분야 1\n1. \n2. \n3. \n\n### 분야 2\n4. \n5. \n6. \n\n## 주제 선정 팁\n- 일상의 궁금증에서 출발\n- 측정 가능한 변인 설정\n- 반복 실험 가능한 주제\n\n## 주의사항\n- ',
      keyInfo: { definition: '', audience: audience || '', difficulty: '초급~중급' }
    },
    guide: {
      summary: title + '을 위한 효과적인 전략과 방법을 단계별로 정리합니다.',
      body: '## 개요\n\n...\n\n## 단계별 방법\n\n### 1단계\n- \n\n### 2단계\n- \n\n### 3단계\n- \n\n## 핵심 팁\n- \n- \n\n## 주의할 점\n- \n- ',
      keyInfo: { definition: '', types: '', audience: audience || '' }
    },
    academy: {
      summary: title + '의 교육 프로그램, 특징, 위치 정보를 안내합니다.',
      body: '## 기관 소개\n\n...\n\n## 교육 프로그램\n\n### 주요 과목\n- \n\n### 특징\n- \n\n## 위치 및 연락처\n- 주소: \n- 연락처: \n\n## 교육 방식\n- ',
      keyInfo: { name: title, location: '', subjects: '' }
    },
    company: {
      summary: title + '의 사업 분야, 기술력, 주요 제품 정보를 정리합니다.',
      body: '## 회사 소개\n\n...\n\n## 주요 사업 분야\n- \n- \n\n## 기술력\n- \n\n## 주요 제품/서비스\n- \n- ',
      keyInfo: { name: title, industry: '', headquarters: '' }
    },
    concept: {
      summary: title + '의 정의, 원리, 관련 개념을 체계적으로 정리합니다.',
      body: '## 정의\n\n...\n\n## 핵심 원리\n- \n- \n\n## 관련 개념\n- \n\n## 응용\n- \n\n## 참고 자료\n- ',
      keyInfo: { definition: '', importance: '' }
    }
  };
  return templates[docType] || templates.article;
}

// ============================================================
// 학원 문서 자동 생성 (폼 입력 → AI 친화 문서)
// ============================================================

/**
 * 학원 등록 폼 데이터 → 구조화된 GEO 문서로 변환
 * @param {Object} formData - 등록 폼에서 수집된 데이터
 * @returns {Object} - documents.js 형식의 문서 객체
 */
function generateAcademyDocument(formData) {
  const {
    name,                // 학원명
    regionId,            // 지역 ID (예: 'seoul')
    district,            // 구/시 (예: '강남구')
    address,             // 상세주소
    phone,               // 전화번호
    website,             // 웹사이트
    subjects,            // 과목 ID 배열 (예: ['math', 'science'])
    ageGroups,           // 대상 연령 (예: ['초등', '중등'])
    programs,            // 프로그램 목록 (문자열 배열)
    features,            // 학원 특징 (문자열 배열)
    description,         // 학원 소개 (자유 텍스트)
    monthlyFee,          // 월 수강료 범위 (예: '30만~50만원')
    classSize,           // 반 인원 (예: '5~10명')
    operatingHours,      // 운영시간 (예: '평일 14:00~22:00')
    establishedYear      // 설립년도
  } = formData;

  const region = REGIONS.find(r => r.id === regionId);
  const regionName = region ? region.name : '';
  const subjectNames = subjects.map(sid => {
    const s = SUBJECTS.find(x => x.id === sid);
    return s ? s.name : sid;
  });
  const subjectIcons = subjects.map(sid => {
    const s = SUBJECTS.find(x => x.id === sid);
    return s ? s.icon : '';
  }).filter(Boolean);

  const slug = 'academy-' + name.replace(/[^가-힣a-zA-Z0-9]/g, '-').toLowerCase() + '-' + district.replace(/[^가-힣a-zA-Z0-9]/g, '-').toLowerCase();
  const today = new Date().toISOString().slice(0, 10);
  const docId = 'doc-academy-' + Date.now();

  // 자동 생성 태그
  const tags = [
    name,
    ...subjectNames.map(s => s + '학원'),
    district + ' ' + subjectNames[0] + '학원',
    district + ' 학원',
    regionName + ' ' + district + ' 학원',
    ...ageGroups.map(a => a + ' 학원'),
    ...subjectNames,
    '학원 추천',
    district + ' 학원 추천'
  ];

  // directAnswer 자동 생성
  const directAnswer = [
    name + '은(는) ' + regionName + ' ' + district + '에 위치한 ' + subjectNames.join(', ') + ' 전문 학원입니다.' + (classSize ? ' 소수정예 ' + classSize + ' 수업을 운영합니다.' : ''),
    (features && features.length > 0) ? name + '의 특징: ' + features.slice(0, 3).join(', ') + '.' : '',
    (monthlyFee ? '월 수강료는 ' + monthlyFee + ' 수준이며, ' : '') + (ageGroups.join(', ') + ' 학생을 대상으로 합니다.')
  ].filter(Boolean);

  // contentBlocks 자동 생성
  const contentBlocks = [
    { type: 'heading', level: 2, text: '학원 소개' },
    { type: 'paragraph', text: description || (name + '은(는) ' + regionName + ' ' + district + '에서 ' + subjectNames.join(', ') + ' 교육을 제공하는 학원입니다.') },
    { type: 'heading', level: 2, text: '교육 과목' },
    { type: 'list', ordered: false, items: subjectNames.map((s, i) => (subjectIcons[i] || '') + ' ' + s) },
  ];

  if (programs && programs.length > 0) {
    var isDetailed = typeof programs[0] === 'object';
    if (isDetailed) {
      contentBlocks.push(
        { type: 'heading', level: 2, text: '프로그램 안내' },
        { type: 'table', headers: ['프로그램', '대상', '수준', '일정', '내용'], rows: programs.map(function(p) {
          return [p.name || '', p.target || '', p.level || '', p.schedule || '', p.desc || ''];
        })}
      );
    } else {
      contentBlocks.push(
        { type: 'heading', level: 2, text: '프로그램 안내' },
        { type: 'list', ordered: false, items: programs }
      );
    }
  }

  if (features && features.length > 0) {
    contentBlocks.push(
      { type: 'heading', level: 2, text: '학원 특징' },
      { type: 'list', ordered: false, items: features }
    );
  }

  contentBlocks.push(
    { type: 'heading', level: 2, text: '수업 정보' },
    { type: 'table', headers: ['항목', '내용'], rows: [
      ['대상', ageGroups.join(', ')],
      ['반 인원', classSize || '문의'],
      ['수강료', monthlyFee || '문의'],
      ['운영시간', operatingHours || '문의']
    ]}
  );

  contentBlocks.push(
    { type: 'heading', level: 2, text: '위치 및 연락처' },
    { type: 'table', headers: ['항목', '내용'], rows: [
      ['주소', regionName + ' ' + district + ' ' + (address || '')],
      ['전화', phone || '-'],
      ['웹사이트', website || '-']
    ].filter(row => row[1] !== '-') }
  );

  // FAQ 자동 생성
  var isDetailedPrograms = programs && programs.length > 0 && typeof programs[0] === 'object';
  var programFaqAnswer = '';
  if (isDetailedPrograms) {
    programFaqAnswer = programs.map(function(p) { return p.name + '(' + (p.target || '') + (p.schedule ? ', ' + p.schedule : '') + ')'; }).join(', ') + ' 등을 운영합니다.';
  } else if (programs && programs.length > 0) {
    programFaqAnswer = programs.join(', ') + ' 등을 운영합니다.';
  }

  const faqItems = [
    { question: name + '은(는) 어디에 있나요?', answer: regionName + ' ' + district + (address ? ' ' + address : '') + '에 위치해 있습니다.' },
    { question: name + '에서 어떤 과목을 가르치나요?', answer: subjectNames.join(', ') + ' 과목을 가르칩니다.' },
    { question: name + '에는 어떤 프로그램(반)이 있나요?', answer: programFaqAnswer || '프로그램 정보는 학원에 문의해주세요.' },
    { question: name + '의 수강료는 얼마인가요?', answer: monthlyFee ? '월 수강료는 ' + monthlyFee + ' 수준입니다. 정확한 금액은 학원에 직접 문의해주세요.' : '수강료는 학원에 직접 문의해주세요.' },
    { question: name + '은(는) 몇 명씩 수업하나요?', answer: classSize ? classSize + ' 규모로 수업합니다.' : '반 인원은 학원에 문의해주세요.' },
    { question: name + '의 운영시간은 어떻게 되나요?', answer: operatingHours || '운영시간은 학원에 문의해주세요.' }
  ];

  // keyInfo
  const keyInfo = {
    name: name,
    location: regionName + ' ' + district,
    subjects: subjectNames.join(', '),
    ageGroups: ageGroups.join(', '),
    classSize: classSize || '문의',
    monthlyFee: monthlyFee || '문의'
  };

  return {
    id: docId,
    slug: slug,
    title: name + ' - ' + district + ' ' + subjectNames[0] + ' 학원',
    summary: regionName + ' ' + district + '에 위치한 ' + subjectNames.join(', ') + ' 전문 학원 ' + name + '의 프로그램, 수강료, 특징, 위치 정보를 안내합니다.',
    docType: 'academy',
    categoryId: 'academy',
    tags: [...new Set(tags)],
    status: 'published',
    createdAt: today,
    updatedAt: today,
    directAnswer: directAnswer,
    targetAudience: ageGroups.map(a => a + ' 학생 및 학부모'),
    entities: [name, ...subjectNames.map(s => s + '학원'), district + ' 학원'],
    cluster: {
      pillarTopic: district + ' 학원 정보',
      subTopic: subjectNames[0] + ' 학원',
      intentType: 'local-business',
      relatedClusterSlugs: []
    },
    contentBlocks: contentBlocks,
    faqItems: faqItems,
    authorInfo: {
      name: name,
      role: '교육기관',
      expertise: subjectNames.join(', ') + ' 교육'
    },
    seoTitle: name + ' | ' + district + ' ' + subjectNames.join('/') + ' 학원 - 프로그램, 수강료, 위치',
    seoDescription: regionName + ' ' + district + ' ' + subjectNames.join(', ') + ' 학원 ' + name + '. ' + (features && features[0] ? features[0] + '. ' : '') + '프로그램, 수강료, 위치 정보를 확인하세요.',
    schemaTypes: ['LocalBusiness', 'EducationalOrganization', 'FAQPage'],
    technicalMeta: {
      canonicalPath: '/documents/' + slug,
      indexable: true
    },
    keyInfo: keyInfo,
    relatedDocs: [],
    relatedServices: [],
    // 학원 전용 필드
    academyInfo: {
      regionId: regionId,
      district: district,
      address: address || '',
      phone: phone || '',
      website: website || '',
      subjects: subjects,
      ageGroups: ageGroups,
      programs: programs || [],
      features: features || [],
      monthlyFee: monthlyFee || '',
      classSize: classSize || '',
      operatingHours: operatingHours || '',
      establishedYear: establishedYear || ''
    }
  };
}

// ============================================================
// 학원 전용 검색/필터 함수
// ============================================================

function getAcademyDocuments() {
  return getAllDocuments().filter(d => d.docType === 'academy' && d.status === 'published');
}

function searchAcademies(filters) {
  let results = getAcademyDocuments();

  if (filters.regionId) {
    results = results.filter(d => d.academyInfo && d.academyInfo.regionId === filters.regionId);
  }
  if (filters.district) {
    results = results.filter(d => d.academyInfo && d.academyInfo.district === filters.district);
  }
  if (filters.subject) {
    results = results.filter(d => d.academyInfo && d.academyInfo.subjects && d.academyInfo.subjects.includes(filters.subject));
  }
  if (filters.ageGroup) {
    results = results.filter(d => d.academyInfo && d.academyInfo.ageGroups && d.academyInfo.ageGroups.includes(filters.ageGroup));
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return results;
}

function getRegionById(id) {
  return REGIONS.find(r => r.id === id);
}

function getSubjectById(id) {
  return SUBJECTS.find(s => s.id === id);
}

// ============================================================
// 유틸리티 함수
// ============================================================

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

function renderContentBlocks(blocks) {
  if (!blocks || !blocks.length) return '';
  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
        const tag = 'h' + (block.level || 2);
        return '<' + tag + '>' + block.text + '</' + tag + '>';
      case 'paragraph':
        return '<p>' + block.text + '</p>';
      case 'list':
        const listTag = block.ordered ? 'ol' : 'ul';
        const items = block.items.map(item => '<li>' + item + '</li>').join('');
        return '<' + listTag + '>' + items + '</' + listTag + '>';
      case 'table':
        const ths = block.headers.map(h => '<th>' + h + '</th>').join('');
        const trs = block.rows.map(row =>
          '<tr>' + row.map(cell => '<td>' + cell + '</td>').join('') + '</tr>'
        ).join('');
        return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
      case 'quote':
        return '<blockquote>' + block.text + '</blockquote>';
      case 'note':
        return '<div class="content-note"><strong>' + (block.label || '참고') + '</strong> ' + block.text + '</div>';
      default:
        return '';
    }
  }).join('\n');
}

// ============================================================
// 초기화 — Firestore 데이터 로드 시작
// ============================================================

// Firebase SDK 로드 후 자동 실행
if (typeof firebase !== 'undefined' && typeof db !== 'undefined') {
  loadDocumentsFromFirestore();
} else {
  // Firebase 없으면 샘플 데이터로 즉시 시작
  _cachedDocs = [...SAMPLE_DOCUMENTS];
  _loadLocalStorageFallback();
  _firestoreReady = true;
}
