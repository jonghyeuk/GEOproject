/**
 * 하남시 학원 씨앗 데이터
 * 최소 정보만 저장 → generateAcademyDocument()로 풀 문서 자동 생성
 */
const HANAM_SEED = [
  {
    name: '케이킬수학과학학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '망월동 1117 미사강변노블레스 3층',
    phone: '031-8027-0627', website: 'http://www.kkilledu.com',
    subjects: ['math', 'science'],
    ageGroups: ['초등', '중등', '고등'],
    programs: [
      { name: '초등 수학 기초·심화반', target: '초3~초6', level: '기초~심화', schedule: '주2~3회', desc: '교과 수학 개념 정리 및 사고력 확장' },
      { name: '중등 수학 내신 대비', target: '중1~중3', level: '개념~심화', schedule: '주3회', desc: '내신 기출 분석 + 심화 문제풀이' },
      { name: '고등 수학 정규반', target: '고1~고3', level: '심화', schedule: '주3회', desc: '수학I·II, 미적분 수능 대비' },
      { name: '물리·화학 내신 대비', target: '고1~고3', level: '개념~심화', schedule: '주2회', desc: '물리학I·II, 화학I·II 내신+수능' },
      { name: '이공계 입시 컨설팅', target: '고2~고3', level: '상위권', schedule: '수시', desc: '이공계 대학 입시 전략 상담' }
    ],
    features: ['수학+과학 통합 관리', '이공계 특화 커리큘럼', '미사역 9번출구 95m', '고등수학 성적 상승 실적'],
    description: '하남 미사에서 이공계 교육을 전문으로 하는 수학·과학 학원. 초등부터 고등까지 체계적인 수학·과학 커리큘럼과 이공계 입시 컨설팅을 제공합니다.',
    monthlyFee: '35만~55만원', classSize: '8~12명',
    operatingHours: '평일 14:00~22:00, 토 10:00~18:00', establishedYear: ''
  },
  {
    name: 'CMS에듀 강일영재교육센터',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 80 그린프라자 6층',
    phone: '02-442-3737', website: 'https://www.creverse.com/mt/gangil/',
    subjects: ['math'],
    ageGroups: ['유아', '초등'],
    programs: [
      { name: 'WHY 사고력 수학', target: '7세~초6 (W1~W15 레벨)', level: '사고력', schedule: '주1회', desc: '500여 개 사고력 테마, 발문·토론식 수업, 게임·퍼즐 활용' },
      { name: '올라 교과연계 수학', target: '초1~초6', level: '교과+사고력', schedule: '주1회', desc: '교과 수학을 사고력 활동(교구·게임)으로 연계, 워크북+동영상 해설' },
      { name: 'ConNEC ConFUS 융합', target: '초3 이상 (WHY 5레벨+)', level: '심화·융합', schedule: '주1회', desc: '수학 기반 융합교육, 호기심에서 사고 확장' },
      { name: '영재교육원 대비', target: '초3~초6', level: '최상위', schedule: '특강', desc: '창의·수학·과학 융합 기출 탐구, 자기소개서+면접 대비, 실전 모의고사' }
    ],
    features: ['사고력 수학 전문 (27년 전통 CMS)', '레벨 테스트 필수 입학', '나선형 학습법', '개인 맞춤형 로드맵(마이커리큘럼)', '3개월 단위 학기 운영', '카카오톡 상담 가능'],
    description: 'CMS사고력수학 하남 강일센터. 7세~초등 대상 발문·토론식 사고력 수학 전문 교육. 500여 개 테마 수업으로 수학적 직관력과 창의력을 기르며, 영재교육원 대비 프로그램도 운영합니다.',
    monthlyFee: '약 24.5만원 (주1회 기준)', classSize: '소수정예',
    operatingHours: '13:00~21:00', establishedYear: ''
  },
  {
    name: '대치성공스토리학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 76 미사베스트프라자 403·404·706·707호',
    phone: '', website: '',
    subjects: ['math', 'english', 'science', 'korean'],
    ageGroups: ['중등', '고등'],
    programs: [
      { name: '중등 수학 내신반', target: '중1~중3', level: '개념~심화', schedule: '주3회', desc: '교과 내신 대비 + 심화 문제풀이' },
      { name: '고등 수학 수능반', target: '고1~고3', level: '심화', schedule: '주3회', desc: '수능 수학 기출 분석 + 킬러문항' },
      { name: '영어 독해·문법반', target: '중1~고3', level: '수준별', schedule: '주2~3회', desc: '내신 독해+문법, 수능 영어 대비' },
      { name: '과학탐구 대비', target: '고1~고3', level: '개념~심화', schedule: '주2회', desc: '물리·화학·생물 내신+수능' },
      { name: '국어 비문학 특강', target: '고1~고3', level: '심화', schedule: '주1~2회', desc: '수능 국어 비문학 독해력 강화' },
      { name: '입시 컨설팅', target: '고2~고3', level: '-', schedule: '수시', desc: '수시·정시 입시 전략 1:1 상담' }
    ],
    features: ['전과목 통합 관리', '대치동 출신 강사진', '입시 컨설팅 제공', '자습실 상시 운영'],
    description: '대치동 노하우를 하남 미사에 적용한 종합 입시학원. 중고등 수학·영어·과학·국어 전과목을 관리하며, 입시 컨설팅도 제공합니다.',
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
    programs: [
      { name: '예비고1 내신+수능 통합반', target: '중3~예비고1', level: '기본~심화', schedule: '주3회', desc: '핵심 어휘·문법·독해력 3축 중심 맞춤형 학습, 고등 영어 전환 대비' },
      { name: '고등 문장 구조 분석반', target: '고1~고3', level: '심화', schedule: '주2~3회', desc: '문장 구조 분석력 훈련, 스스로 해석하는 힘 기르기' },
      { name: '수능 영어 실전반', target: '고2~고3', level: '상위권', schedule: '주3회', desc: '수능 실전 모의고사 + 기출 분석' },
      { name: '중등 문법·독해반', target: '중1~중3', level: '기본~중급', schedule: '주2회', desc: '중등 내신 영어 문법+독해 기초 완성' }
    ],
    features: ['문장 구조 분석 중심 교육', '소수정예 수업', '개별 피드백 시스템', 'SKY·의치한 합격생 배출 (원장 목동 지도 경력)', '예비고1 설명회 운영 (하남고·미사고·미강고 진학 현황 안내)'],
    description: '하남 미사 중고등 영어 전문학원. 홍재영 원장이 문장 구조 분석력 중심으로 지도하며, 내신과 수능을 동시에 대비합니다. 예비고1 대상 고등 전환 프로그램과 개별 피드백 시스템이 강점입니다.',
    monthlyFee: '', classSize: '소수정예',
    operatingHours: '평일 15:00~22:00', establishedYear: ''
  },
  {
    name: '미사국제정상어학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '망월동 일대',
    phone: '', website: '',
    subjects: ['english'],
    ageGroups: ['초등', '중등'],
    programs: [
      { name: '초등 파닉스+리딩', target: '초1~초3', level: '기초', schedule: '주3회', desc: '파닉스 완성 및 기초 리딩 훈련' },
      { name: '초등 영어 토론', target: '초4~초6', level: '중급~심화', schedule: '주2회', desc: '영어 토론·발표 수업' },
      { name: '중등 내신 영어', target: '중1~중3', level: '개념~심화', schedule: '주3회', desc: '내신 문법·독해·듣기 대비' }
    ],
    features: ['하남시 학부모 리뷰 최다 영어학원', '레벨별 체계적 커리큘럼', '원어민 수업 병행'],
    description: '하남시 망월동에 위치한 영어학원. 학부모 리뷰가 가장 많으며, 초등·중등 영어를 레벨별로 체계적으로 가르칩니다.',
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
    programs: [
      { name: '수능 국어 정규반', target: '고1~고3', level: '개념~심화', schedule: '주2~3회', desc: '수능 국어 독서+문학+언어매체 체계적 대비' },
      { name: '내신 국어 대비', target: '중1~고3', level: '수준별', schedule: '시험기간 집중', desc: '학교별 내신 기출 분석+시험 대비' },
      { name: '비문학 독해 특강', target: '고1~고3', level: '심화', schedule: '주1회', desc: '수능 비문학 지문 분석력 집중 훈련' },
      { name: '문학 작품 분석반', target: '중3~고3', level: '중급~심화', schedule: '주1회', desc: '교과+수능 필수 작품 분석·감상' }
    ],
    features: ['국어 전문 학원', '수능+내신 병행 커리큘럼', '비문학 독해력 강화 특화'],
    description: '하남 미사 국어 전문학원. 수능 국어와 내신을 전문으로 하며, 비문학 독해력과 문학 분석력을 체계적으로 키웁니다.',
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
    programs: [
      { name: '초등 파닉스·기초 영어', target: '초1~초3', level: '기초', schedule: '주3회', desc: '알파벳·파닉스부터 기초 리딩' },
      { name: '초등 리딩·문법반', target: '초4~초6', level: '기본~중급', schedule: '주3회', desc: '리딩 훈련 + 기초 문법 정리' },
      { name: '중등 내신 영어 완성', target: '중1~중3', level: '개념~심화', schedule: '주3회', desc: '내신 문법·독해·서술형 대비' },
      { name: '고등 수능 영어', target: '고1~고3', level: '심화', schedule: '주3회', desc: '수능 독해+듣기+어휘 통합 대비' }
    ],
    features: ['애플빌딩 4개 층 대형 학원', '초등~고등 전 학년 커버', '체계적 레벨 시스템'],
    description: '하남 미사 대형 영어 전문학원. 애플빌딩 4개 층(2~5층)을 사용하며 초등부터 고등까지 전 학년 영어를 체계적으로 교육합니다.',
    monthlyFee: '30만~50만원', classSize: '10~15명',
    operatingHours: '평일 13:00~22:00, 토 10:00~18:00', establishedYear: ''
  },
  {
    name: '에듀플렉스 하남미사',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로226번안길 21 3층',
    phone: '', website: 'https://www.eduplex.net',
    subjects: ['all-subjects'],
    ageGroups: ['초등', '중등', '고등'],
    programs: [
      { name: '자기주도학습 코칭', target: '초5~고2', level: '전체', schedule: '주5일 상시', desc: 'VLT 4G 진단검사 후 개인별 학습 동기부여·시간관리 코칭' },
      { name: '에듀코치 개별지도 (초등)', target: '초5~초6', level: '수준별', schedule: '주1~3회', desc: '매니저 1:1 개별 튜터링, 메타인지 기반 학습' },
      { name: '에듀코치 개별지도 (중등)', target: '중1~중3', level: '수준별', schedule: '주1~3회', desc: '전과목 개별지도, 내신 대비 전략 수립' },
      { name: '에듀코치 개별지도 (고등)', target: '고1~고2', level: '수준별', schedule: '주1~3회', desc: '수능+내신 병행, 입시 전략 코칭' }
    ],
    features: ['자기주도학습 전문 (20년 노하우)', 'VLT 4G 과학적 학습 진단', '매니저 1:1 코칭', '등원 시 핸드폰 반납 (집중 환경)', '셀프리더 학습 다이어리', '에듀큐브 앱으로 학습 관리', '전국 200여 지점'],
    description: '에듀플렉스 하남미사점. 20년 노하우의 자기주도학습 전문 교육기관. VLT 4G 진단검사로 학생 특성을 과학적으로 분석하고, 매니저 1:1 코칭으로 전과목 학습 관리를 제공합니다.',
    monthlyFee: '초등 9.6만원/중등 10.8만원/고등 12만원 (주1회 기준, 지점별 상이)', classSize: '1:1~1:4',
    operatingHours: '평일 14:00~22:00, 토 10:00~18:00', establishedYear: ''
  },
  {
    name: '어린이미술관 하루 미술학원',
    regionId: 'gyeonggi', district: '하남시',
    address: '미사강변대로 34번길 100 미사타워 5F',
    phone: '031-795-7111', website: '',
    subjects: ['art'],
    ageGroups: ['유아', '초등'],
    programs: [
      { name: '유아 창의미술', target: '5~7세', level: '기초', schedule: '주2회', desc: '다양한 재료 탐색, 감각 놀이, 표현력 키우기' },
      { name: '아동 드로잉', target: '초1~초3', level: '기본', schedule: '주2회', desc: '관찰 드로잉, 기초 소묘, 색채 학습' },
      { name: '초등 수채화·아크릴', target: '초3~초6', level: '중급', schedule: '주2회', desc: '수채화·아크릴 기법, 작품 완성' },
      { name: '미술 포트폴리오', target: '초4~초6', level: '심화', schedule: '주1~2회', desc: '미술 특목고·영재원 대비 포트폴리오 제작' }
    ],
    features: ['미술관 컨셉 공간', '다양한 재료 체험 (수채화·아크릴·도예·공예)', '전시 프로그램 운영'],
    description: '하남 미사 미술관 컨셉의 유아·초등 미술학원. 5세~초등 대상으로 창의미술, 드로잉, 수채화·아크릴 등 다양한 프로그램을 운영합니다.',
    monthlyFee: '15만~25만원', classSize: '8~12명',
    operatingHours: '평일 14:00~19:00, 토 10:00~17:00', establishedYear: ''
  },
  // --- 11~20: 수학/영어/종합 ---
  { name: '구주이배 수학 미사본원', regionId: 'gyeonggi', district: '하남시', address: '미사강변대로54번길 83 워너비프라자 3층', phone: '', website: '', subjects: ['math'], ageGroups: ['초등', '중등', '고등'], programs: ['초등 연산+사고력', '중등 내신 심화', '고등 수능 킬러문항반', '겨울/여름 특강'], features: ['초중고 전학년', '워너비프라자 3층 전체 사용', '레벨 테스트 후 반 배정'], description: '초등부터 고등까지 수학 전 과정을 가르치는 미사 지역 대형 수학학원.', monthlyFee: '30만~55만원', classSize: '10~15명', operatingHours: '평일 14:00~22:00, 토 10:00~18:00', establishedYear: '' },
  { name: '고수학학원', regionId: 'gyeonggi', district: '하남시', address: '미사강변대로 216', phone: '', website: '', subjects: ['math'], ageGroups: ['중등', '고등'], programs: ['중등 수학 정규반', '고등 수학I·II', '수능 수학 실전반'], features: ['개념+문풀 병행', '주간 테스트', '오답 클리닉'], description: '미사 지역 중고등 수학 전문학원. 개념 이해와 문제 풀이를 균형 있게 가르칩니다.', monthlyFee: '35만~50만원', classSize: '10~12명', operatingHours: '평일 15:00~22:00', establishedYear: '' },
  { name: 'PTM수학학원', regionId: 'gyeonggi', district: '하남시', address: '신장동 일대', phone: '', website: '', subjects: ['math'], ageGroups: ['중등', '고등'], programs: ['중등 내신 완벽 대비', '고등 수학 정규반', '1:4 개별 지도'], features: ['소수정예 개별 관리', '신장동 위치', '학생별 맞춤 진도'], description: '하남시 신장동에 위치한 소수정예 수학학원. 학생별 맞춤 진도로 운영합니다.', monthlyFee: '35만~50만원', classSize: '4~8명', operatingHours: '평일 15:00~22:00', establishedYear: '' },
  { name: '담헌수학학원', regionId: 'gyeonggi', district: '하남시', address: '신장동 일대', phone: '', website: '', subjects: ['math'], ageGroups: ['중등', '고등'], programs: ['중등 개념+심화', '고등 내신 대비', '수능 수학 파이널'], features: ['신장동 위치', '내신 집중 관리', '주간 성적 피드백'], description: '하남시 신장동 수학 전문학원. 중고등 내신과 수능을 동시에 대비합니다.', monthlyFee: '30만~45만원', classSize: '8~12명', operatingHours: '평일 14:00~22:00', establishedYear: '' },
  { name: '올패스영어학원', regionId: 'gyeonggi', district: '하남시', address: '신장동 일대', phone: '', website: '', subjects: ['english'], ageGroups: ['중등', '고등'], programs: ['수능 영어 정규반', '내신 영어 완성', '영어 독해 특강', '듣기 집중반'], features: ['수능+내신 영어 전문', '소수정예 수업', '신장동 위치'], description: '하남시 신장동에서 수능과 내신 영어를 전문으로 가르치는 소수정예 학원.', monthlyFee: '30만~45만원', classSize: '8~12명', operatingHours: '평일 14:00~22:00', establishedYear: '' },
  { name: '하남삼성영어학원', regionId: 'gyeonggi', district: '하남시', address: '덕풍동 346', phone: '', website: '', subjects: ['english', 'math'], ageGroups: ['초등', '중등', '고등'], programs: ['초등 영어 기초', '중등 내신 영어', '고등 수능 영어', '수학 내신반'], features: ['영어+수학 통합', '덕풍동 위치', '초등~고등 전학년'], description: '하남시 덕풍동에서 영어와 수학을 함께 가르치는 종합학원.', monthlyFee: '25만~40만원', classSize: '10~15명', operatingHours: '평일 14:00~21:00', establishedYear: '' },
  { name: '이안학원', regionId: 'gyeonggi', district: '하남시', address: '미사강변대로 일대', phone: '', website: 'https://www.iannonsul.com', subjects: ['math', 'english', 'korean', 'science'], ageGroups: ['초등', '중등', '고등'], programs: ['초등 4GO 분석수학', '중등 수학 시간표', '고등 국영수탐 정규반', '입시 컨설팅'], features: ['전과목 종합관리', '국영수탐 통합', '체계적 시간표 관리'], description: '하남시에서 초등부터 고등까지 국영수탐 전과목을 체계적으로 관리하는 종합학원.', monthlyFee: '35만~60만원', classSize: '10~15명', operatingHours: '평일 13:00~22:00, 토 09:00~18:00', establishedYear: '' },
  { name: '미사유투엠학원', regionId: 'gyeonggi', district: '하남시', address: '미사강변대로 일대', phone: '', website: '', subjects: ['math', 'english'], ageGroups: ['초등', '중등'], programs: ['초등 수학 기본+심화', '초등 영어 파닉스+리딩', '중등 내신 대비', '방학 특강'], features: ['초등·중등 전문', '수학+영어 통합', '학부모 상담 정기 운영'], description: '초등·중등 학생 대상 수학·영어 전문 학원. 기본부터 심화까지 체계적으로 가르칩니다.', monthlyFee: '25만~40만원', classSize: '8~12명', operatingHours: '평일 14:00~21:00', establishedYear: '' },
  { name: '인스카이학원', regionId: 'gyeonggi', district: '하남시', address: '덕풍동 일대', phone: '', website: '', subjects: ['math'], ageGroups: ['초등', '중등', '고등'], programs: ['초등 수학 루틴반', '중등 내신 수학', '고등 수학 정규반', '개인 맞춤형 관리'], features: ['개인 맞춤형 루틴 관리', '덕풍동 위치', '학습 습관 형성 중시'], description: '초중고 수학을 개인 맞춤형 루틴으로 관리하는 수학 전문학원.', monthlyFee: '30만~45만원', classSize: '6~10명', operatingHours: '평일 15:00~22:00', establishedYear: '' },
  // --- 21~30: 영어/국어/종합/예체능 ---
  { name: '뛰어날영어학원', regionId: 'gyeonggi', district: '하남시', address: '신장동 일대', phone: '', website: '', subjects: ['english'], ageGroups: ['초등', '중등'], programs: ['초등 영어 회화', '중등 내신 영어', '영어 독서 프로그램', '방학 영어캠프'], features: ['영어 몰입 환경', '리딩 프로그램 운영', '신장동 위치'], description: '하남시 신장동에서 초등·중등 영어를 전문으로 가르치는 학원.', monthlyFee: '25만~40만원', classSize: '8~12명', operatingHours: '평일 14:00~21:00', establishedYear: '' },
  { name: '더찬란영어학원', regionId: 'gyeonggi', district: '하남시', address: '신장동 일대', phone: '', website: '', subjects: ['english'], ageGroups: ['중등', '고등'], programs: ['중등 문법·독해', '고등 내신 영어', '수능 영어 실전', '어휘 마스터반'], features: ['내신+수능 병행', '어휘 관리 시스템', '신장동 위치'], description: '하남시 신장동 중고등 영어 전문학원. 내신과 수능을 동시에 대비합니다.', monthlyFee: '30만~45만원', classSize: '8~12명', operatingHours: '평일 15:00~22:00', establishedYear: '' },
  { name: '공감국어영어전문학원', regionId: 'gyeonggi', district: '하남시', address: '신장동 일대', phone: '', website: '', subjects: ['korean', 'english'], ageGroups: ['중등', '고등'], programs: ['국어 비문학 독해', '국어 문학 분석', '영어 내신 완성', '수능 국영 통합반'], features: ['국어+영어 전문', '비문학 독해 특화', '신장동 위치'], description: '국어와 영어를 전문으로 가르치는 학원. 비문학 독해와 문학 분석에 강합니다.', monthlyFee: '30만~45만원', classSize: '10~15명', operatingHours: '평일 14:00~22:00', establishedYear: '' },
  { name: '꿈이룸영수학원', regionId: 'gyeonggi', district: '하남시', address: '신장동 일대', phone: '', website: '', subjects: ['math', 'english'], ageGroups: ['초등', '중등'], programs: ['초등 수학 기본', '초등 영어 파닉스', '중등 수학·영어 내신', '방학 집중반'], features: ['수학+영어 통합', '초등·중등 전문', '학부모 상담 정기 운영'], description: '하남시 신장동 초등·중등 대상 수학·영어 종합학원.', monthlyFee: '20만~35만원', classSize: '10~15명', operatingHours: '평일 14:00~21:00', establishedYear: '' },
  { name: '감일프라임영수학원', regionId: 'gyeonggi', district: '하남시', address: '감이동 일대', phone: '', website: '', subjects: ['math', 'english'], ageGroups: ['초등', '중등'], programs: ['초등 수학 심화', '초등 영어 리딩', '중등 내신 수학', '중등 내신 영어'], features: ['감일동 위치', '영수 통합 관리', '신도시 학부모 선호'], description: '감일동에 위치한 초등·중등 영어·수학 전문학원.', monthlyFee: '25만~40만원', classSize: '8~12명', operatingHours: '평일 14:00~21:00', establishedYear: '' },
  { name: '사이언스메카 과학학원', regionId: 'gyeonggi', district: '하남시', address: '망월동 979-1', phone: '', website: '', subjects: ['science'], ageGroups: ['중등', '고등'], programs: ['중등 과학 개념+실험', '고등 물리·화학·생물', '과학탐구 대회 준비', '수능 과탐 대비'], features: ['실험 중심 수업', '과학 대회 지도', '망월동 위치'], description: '하남시 망월동 과학 전문학원. 실험 중심 수업과 과학탐구 대회를 지도합니다.', monthlyFee: '30만~50만원', classSize: '8~12명', operatingHours: '평일 15:00~22:00, 토 10:00~18:00', establishedYear: '' },
  { name: '스토리가든어학원', regionId: 'gyeonggi', district: '하남시', address: '미사강변대로 일대', phone: '', website: '', subjects: ['english'], ageGroups: ['유아', '초등'], programs: ['유아 영어 놀이', '초등 스토리 리딩', '파닉스 기초반', '영어 그림책 클래스'], features: ['스토리 기반 영어교육', '유아·초등 전문', '놀이+학습 병행'], description: '스토리와 그림책 기반으로 유아·초등 영어를 가르치는 어학원.', monthlyFee: '20만~30만원', classSize: '6~10명', operatingHours: '평일 14:00~19:00', establishedYear: '' },
  { name: '용인대 청아 태권도장', regionId: 'gyeonggi', district: '하남시', address: '미사강변동로 47-1 브라운스톤 201~204호', phone: '', website: '', subjects: ['sports'], ageGroups: ['유아', '초등', '중등'], programs: ['유아 태권도 놀이', '초등 태권도 품새+겨루기', '중등 태권도 단증반', '체력 훈련 프로그램'], features: ['용인대 출신 사범', '셔틀버스 운행', '인성교육 병행'], description: '용인대 출신 사범이 지도하는 태권도장. 인성교육과 체력 훈련을 병행합니다.', monthlyFee: '10만~15만원', classSize: '15~25명', operatingHours: '평일 14:00~20:00, 토 10:00~14:00', establishedYear: '' },
  { name: '봉봉아르떼미술학원', regionId: 'gyeonggi', district: '하남시', address: '미사강변대로 일대', phone: '', website: '', subjects: ['art'], ageGroups: ['유아', '초등'], programs: ['유아 감성 미술', '초등 드로잉', '수채화·아크릴 기법', '도예·공예 체험'], features: ['다양한 재료 체험', '창의력 중심 교육', '소수정예 수업'], description: '유아·초등 대상 창의 미술 학원. 다양한 재료와 기법을 체험합니다.', monthlyFee: '15만~25만원', classSize: '6~10명', operatingHours: '평일 14:00~19:00, 토 10:00~16:00', establishedYear: '' },
  { name: '아워뮤직', regionId: 'gyeonggi', district: '하남시', address: '미사강변남로 91 르보아파크2차 228호', phone: '', website: '', subjects: ['music'], ageGroups: ['초등', '중등', '고등', '성인'], programs: ['피아노 개인레슨', '바이올린 레슨', '성인 취미 피아노', '음대 입시 준비'], features: ['개인레슨 전문', '전 연령 대상', '다양한 악기 수업'], description: '하남 미사 개인레슨 전문 음악학원. 피아노, 바이올린 등 다양한 악기를 배울 수 있습니다.', monthlyFee: '15만~30만원', classSize: '1:1', operatingHours: '평일 12:00~21:00, 토 10:00~18:00', establishedYear: '' }
];

// 즉시 실행: generateAcademyDocument()로 풀 문서 자동 생성하여 SAMPLE_DOCUMENTS에 추가
(function() {
  try {
    if (typeof generateAcademyDocument !== 'function') { console.warn('[hanam] generateAcademyDocument not found'); return; }
    if (typeof SAMPLE_DOCUMENTS === 'undefined') { console.warn('[hanam] SAMPLE_DOCUMENTS not found'); return; }
    HANAM_SEED.forEach(function(seed, i) {
      try {
        var doc = generateAcademyDocument(seed);
        doc.id = 'doc-academy-hanam-' + String(i + 1).padStart(3, '0');
        doc.createdAt = '2026-03-27';
        doc.updatedAt = '2026-03-27';
        SAMPLE_DOCUMENTS.push(doc);
      } catch(e) {
        console.error('[hanam] Failed to generate doc for:', seed.name, e);
      }
    });
    // 캐시가 이미 생성됐으면 갱신
    if (typeof _cachedDocs !== 'undefined' && _cachedDocs !== null) {
      _cachedDocs = [].concat(SAMPLE_DOCUMENTS);
    }
    console.log('[hanam] Loaded', HANAM_SEED.length, 'academies');
  } catch(e) {
    console.error('[hanam] Failed to load seed data:', e);
  }
})();
