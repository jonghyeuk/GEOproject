# EduAtlas LLM 문서 생성 파이프라인

## 전체 사용 순서

```
기획 확인 → 생성 → 검증 → 수정 → 업로드 → 개발 반영
```

## 파일 목록

### 기본 규칙
| 파일 | 용도 | 언제 쓰나 |
|------|------|-----------|
| `00_global_rules.md` | 모든 작업의 공통 기준 | 항상 먼저 로드 |

### 카테고리별 생성기
| 파일 | 카테고리 | 예시 |
|------|----------|------|
| `01_topics_generator.md` | Topics (탐구주제) | 중학생 과학 탐구 주제 20선 |
| `02_research_generator.md` | Research (연구) | 소논문 작성법, 연구 설계 |
| `03_experiments_generator.md` | Experiments (실험) | 실험 설계, 변인 통제 |
| `04_engineering_generator.md` | Engineering (공학) | 반도체 공정, 기술 원리 |
| `05_study_generator.md` | Study (학습법) | 공부법, 수행평가 준비 |
| `06_academies_generator.md` | Academies (교육기관) | 학원 소개, 교육 방법론 |

### 서비스 연결
| 파일 | 용도 | 언제 쓰나 |
|------|------|-----------|
| `10_service_bridge_planner.md` | 서비스 분석 → 카테고리 연결 전략 | 새 서비스 연결 시 먼저 |
| `11_service_bridge_writer.md` | Bridge 문서 실제 생성 | planner 결과 받은 후 |

### 검증/수정
| 파일 | 용도 | 언제 쓰나 |
|------|------|-----------|
| `20_document_validator.md` | 생성 결과 체크리스트 검증 | 모든 문서 생성 직후 |
| `21_document_rewriter.md` | 검증 결과 반영 수정 | validator가 REVISE 판정 시 |

### 참조/기준
| 파일 | 용도 | 언제 쓰나 |
|------|------|-----------|
| `30_json_schema_reference.md` | JSON 필드 레퍼런스 | 필드 구조 확인 시 |
| `31_contentblocks_spec.md` | contentBlocks 타입 정의 | 블록 구조 맞출 때 |
| `32_workflow_and_phase_plan.md` | Phase별 작업 계획 | 진행 순서 확인 시 |
| `33_trust_pages_and_legal_checklist.md` | 신뢰 페이지 체크리스트 | 법적/신뢰 페이지 관리 시 |

### 개발자 전달
| 파일 | 용도 | 언제 쓰나 |
|------|------|-----------|
| `90_coding_handoff_v2.md` | 코딩 담당자 최종 전달 문서 | 개발 착수 전 |

## 실제 사용 예시

### Core 문서 만들기
```
00_global_rules.md → 카테고리 generator → 20_validator → (21_rewriter) → 업로드
```

### Bridge 문서 만들기
```
00_global_rules.md → 10_planner → 11_writer → 20_validator → (21_rewriter) → 업로드
```

### 개발자 전달
```
README.md → 32_workflow → 30_json_schema → 31_contentblocks → 90_coding_handoff
```
