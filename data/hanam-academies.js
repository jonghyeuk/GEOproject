/**
 * 하남시 학원 씨앗 데이터
 * 최소 정보만 저장 → generateAcademyDocument()로 풀 문서 자동 생성
 */
const HANAM_SEED = [
  {
    name: '김현정수학학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 일대',
    phone: '', website: 'https://khjsuhak.co.kr',
    subjects: ['math'],
    ageGroups: ['초등', '중등', '고등'],
    programs: ['초등 4GO 분석수학', '중등 내신 심화반', '고등 수능 대비반', '겨울학기 특강'],
    features: ['체계적 분석 수학', '수준별 반 편성', '온라인 설명회 운영'],
    description: '하남시에서 초등부터 고등까지 체계적인 수학 교육을 제공하는 전문 학원입니다.',
    monthlyFee: '30만~50만원', classSize: '10~15명',
    operatingHours: '평일 14:00~22:00', establishedYear: ''
  },
  {
    name: '케이킬수학과학학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '망월동 1117 미사강변노블레스 3층',
    phone: '031-8027-0627', website: 'http://www.kkilledu.com',
    subjects: ['math', 'science'],
    ageGroups: ['중등', '고등'],
    programs: ['중등 수학 개념+심화', '고등 수학 정규반', '물리/화학 내신 대비', '이공계 입시 컨설팅'],
    features: ['수학+과학 통합 관리', '이공계 특화', '미사역 9번출구 95m'],
    description: '하남 미사에서 이공계 교육을 전문으로 하는 수학·과학 학원입니다.',
    monthlyFee: '35만~55만원', classSize: '8~12명',
    operatingHours: '평일 14:00~22:00, 토 10:00~18:00', establishedYear: ''
  },
  {
    name: 'CMS에듀 강일영재교육센터',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 80 그린프라자 6층',
    phone: '', website: '',
    subjects: ['math'],
    ageGroups: ['유아', '초등'],
    programs: ['사고력 수학', '영재 수학 탐구', '수학 창의력 캠프', 'CMS 정규 커리큘럼'],
    features: ['사고력 수학 전문', '영재교육원 대비', '소수정예 탐구 수업'],
    description: '사고력 수학 전문 교육기관으로, 유아·초등 대상 영재 수학 프로그램을 운영합니다.',
    monthlyFee: '25만~40만원', classSize: '6~10명',
    operatingHours: '평일 14:00~20:00, 토 10:00~17:00', establishedYear: ''
  },
  {
    name: '대치성공스토리학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 76 미사베스트프라자 403·404·706·707호',
    phone: '', website: '',
    subjects: ['math', 'english', 'science', 'korean'],
    ageGroups: ['중등', '고등'],
    programs: ['수학 내신+수능반', '영어 독해·문법반', '과학탐구 대비', '국어 비문학 특강', '입시 컨설팅'],
    features: ['전과목 통합 관리', '대치동 출신 강사진', '입시 컨설팅 제공', '자습실 상시 운영'],
    description: '대치동 노하우를 미사에 적용한 종합 입시학원. 수학·영어·과학·국어 전과목 관리.',
    monthlyFee: '40만~60만원', classSize: '10~15명',
    operatingHours: '평일 13:00~22:00, 토 09:00~18:00', establishedYear: ''
  },
  {
    name: '더 클래스 영어학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로226번안길 21 파인빌딩 201호',
    phone: '010-5201-1792', website: '',
    subjects: ['english'],
    ageGroups: ['중등', '고등'],
    programs: ['고등 내신+수능 통합 대비', '문장 구조 분석 훈련', '중등 문법·독해반', '수능 영어 실전반'],
    features: ['문장 구조 분석 중심 교육', '소수정예 수업', '서울대 의예과 합격생 배출'],
    description: '고등 영어 문장 구조 분석력 중심으로 지도하며, 내신과 수능을 동시에 대비합니다.',
    monthlyFee: '35만~50만원', classSize: '6~10명',
    operatingHours: '평일 15:00~22:00', establishedYear: ''
  },
  {
    name: '미사국제정상어학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '망월동 일대',
    phone: '', website: '',
    subjects: ['english'],
    ageGroups: ['초등', '중등'],
    programs: ['초등 파닉스+리딩', '초등 영어 토론', '중등 내신 영어', '영어 에세이 클래스'],
    features: ['하남시 리뷰 최다 영어학원', '레벨별 체계적 커리큘럼', '원어민 수업 병행'],
    description: '하남시에서 학부모 리뷰가 가장 많은 영어학원. 초등·중등 영어를 체계적으로 가르칩니다.',
    monthlyFee: '30만~45만원', classSize: '8~12명',
    operatingHours: '평일 14:00~21:00, 토 10:00~17:00', establishedYear: ''
  },
  {
    name: '국풀국어전문학원 하남미사',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로64 제일아이조움 3층',
    phone: '031-791-3868', website: '',
    subjects: ['korean'],
    ageGroups: ['중등', '고등'],
    programs: ['수능 국어 정규반', '내신 국어 대비', '비문학 독해 특강', '문학 작품 분석반'],
    features: ['국어 전문 학원', '수능+내신 병행', '비문학 독해력 강화'],
    description: '수능 국어와 내신을 전문으로 하는 국어 학원. 비문학 독해력과 문학 분석력을 키웁니다.',
    monthlyFee: '30만~45만원', classSize: '10~15명',
    operatingHours: '평일 14:00~22:00', establishedYear: ''
  },
  {
    name: '열강영어전문학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 226번길 34 애플빌딩 2~5층',
    phone: '', website: '',
    subjects: ['english'],
    ageGroups: ['초등', '중등', '고등'],
    programs: ['초등 기초 영어', '중등 내신 완성', '고등 수능 영어', '토플/토익 대비반'],
    features: ['4개 층 대형 학원', '초등~고등 전 학년', '체계적 레벨 시스템'],
    description: '미사 지역 대형 영어 전문학원. 애플빌딩 4개 층을 사용하며 초등~고등 전 학년을 교육합니다.',
    monthlyFee: '30만~50만원', classSize: '10~15명',
    operatingHours: '평일 13:00~22:00, 토 10:00~18:00', establishedYear: ''
  },
  {
    name: '신동철의생각의차이 미사학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 62 바토프라자 401~403호',
    phone: '', website: '',
    subjects: ['math', 'english', 'korean', 'science'],
    ageGroups: ['중등', '고등'],
    programs: ['전과목 내신 대비', '수능 통합반', '논술 대비', '입시 전략 컨설팅'],
    features: ['중고등 전과목 입시학원', '입시 전략 컨설팅', '내신+수능 통합 관리'],
    description: '하남 미사 중고등 전과목 내신·수능 대비 입시학원. 입시 전략 컨설팅을 함께 제공합니다.',
    monthlyFee: '40만~60만원', classSize: '10~15명',
    operatingHours: '평일 13:00~22:00, 토 09:00~18:00', establishedYear: ''
  },
  {
    name: '어린이미술관 하루 미술학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 34번길 100 미사타워 5F',
    phone: '031-795-7111', website: '',
    subjects: ['art'],
    ageGroups: ['유아', '초등'],
    programs: ['유아 창의미술', '아동 드로잉', '초등 수채화·아크릴', '미술 포트폴리오'],
    features: ['미술관 컨셉 공간', '다양한 재료 체험', '전시 프로그램 운영'],
    description: '미술관 컨셉의 공간에서 유아·초등 대상 창의 미술 교육을 진행합니다.',
    monthlyFee: '15만~25만원', classSize: '8~12명',
    operatingHours: '평일 14:00~19:00, 토 10:00~17:00', establishedYear: ''
  }
];

// 즉시 실행: generateAcademyDocument()로 풀 문서 자동 생성하여 SAMPLE_DOCUMENTS에 추가
(function() {
  if (typeof generateAcademyDocument !== 'function') return;
  HANAM_SEED.forEach(function(seed, i) {
    var doc = generateAcademyDocument(seed);
    doc.id = 'doc-academy-hanam-' + String(i + 1).padStart(3, '0');
    doc.createdAt = '2026-03-27';
    doc.updatedAt = '2026-03-27';
    SAMPLE_DOCUMENTS.push(doc);
  });
  // 캐시가 이미 생성됐으면 갱신
  if (typeof _cachedDocs !== 'undefined' && _cachedDocs !== null) {
    _cachedDocs = [].concat(SAMPLE_DOCUMENTS);
  }
})();
