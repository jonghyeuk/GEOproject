# EduAtlas contentBlocks 스펙

## 용도
`body`(Markdown) 대신 구조화된 블록으로 본문을 정의할 때 사용합니다.
렌더링 함수 `renderContentBlocks()`가 이 타입을 처리합니다.

---

## 지원 블록 타입

### 1. heading
제목 블록.

```json
{
  "type": "heading",
  "level": 2,
  "text": "핵심 개념"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `level` | number | 1~3. 기본값 2. h1은 문서 제목이므로 h2부터 사용 권장. |
| `text` | string | 제목 텍스트 |

렌더링 결과: `<h2>핵심 개념</h2>`

### 2. paragraph
본문 단락.

```json
{
  "type": "paragraph",
  "text": "실험 설계는 가설을 검증하기 위해..."
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `text` | string | 단락 텍스트. HTML 태그 사용 가능 (`<strong>`, `<a>` 등). |

렌더링 결과: `<p>실험 설계는 가설을 검증하기 위해...</p>`

### 3. list
목록 블록 (순서 있음/없음).

```json
{
  "type": "list",
  "ordered": false,
  "items": [
    "독립변인: 연구자가 의도적으로 변화시키는 요인",
    "종속변인: 독립변인에 의해 변화하는 결과",
    "통제변인: 일정하게 유지해야 하는 조건"
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `ordered` | boolean | `true`면 `<ol>`, `false`면 `<ul>` |
| `items` | string[] | 목록 항목들 |

렌더링 결과:
```html
<ul>
  <li>독립변인: 연구자가 의도적으로 변화시키는 요인</li>
  <li>종속변인: 독립변인에 의해 변화하는 결과</li>
  <li>통제변인: 일정하게 유지해야 하는 조건</li>
</ul>
```

### 4. table
표 블록.

```json
{
  "type": "table",
  "headers": ["변인 유형", "설명", "예시"],
  "rows": [
    ["독립변인", "의도적으로 변화시키는 요인", "빛의 색깔"],
    ["종속변인", "측정하는 결과", "식물 성장 길이"],
    ["통제변인", "일정하게 유지하는 조건", "물의 양, 온도"]
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `headers` | string[] | 열 제목 |
| `rows` | string[][] | 행 데이터 (2차원 배열) |

렌더링 결과:
```html
<table>
  <thead><tr><th>변인 유형</th><th>설명</th><th>예시</th></tr></thead>
  <tbody>
    <tr><td>독립변인</td><td>의도적으로 변화시키는 요인</td><td>빛의 색깔</td></tr>
    ...
  </tbody>
</table>
```

### 5. quote
인용 블록.

```json
{
  "type": "quote",
  "text": "과학에서 가설 기각도 중요한 결과입니다."
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `text` | string | 인용 텍스트 |

렌더링 결과: `<blockquote>과학에서 가설 기각도 중요한 결과입니다.</blockquote>`

### 6. note
참고/주의 박스.

```json
{
  "type": "note",
  "label": "주의",
  "text": "이 실험은 반드시 지도교사 감독 하에 진행해야 합니다."
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `label` | string | 레이블. 기본값 `"참고"`. 다른 값: `"주의"`, `"팁"`, `"중요"` |
| `text` | string | 내용 |

렌더링 결과:
```html
<div class="content-note">
  <strong>주의</strong> 이 실험은 반드시 지도교사 감독 하에 진행해야 합니다.
</div>
```

## body vs contentBlocks

| 항목 | body | contentBlocks |
|------|------|---------------|
| 형식 | Markdown 문자열 | JSON 블록 배열 |
| 장점 | 작성 편리, 사람이 읽기 쉬움 | 구조화, AI 파싱 최적 |
| 단점 | 파싱 한계 (복잡한 표 등) | 작성 복잡, 분량 큼 |
| 우선순위 | fallback | 우선 렌더링 |
| 언제 쓰나 | 간단한 문서, 초안 | GEO 최적화 문서, 정밀 구조 필요 시 |

렌더링 로직:
```
contentBlocks가 있으면 → renderContentBlocks()
없으면 → renderMarkdown(body)
```

## 작성 규칙

1. h1은 사용하지 않음 (문서 제목이 h1)
2. h2로 대주제, h3로 소주제
3. heading 다음에 바로 heading이 오지 않도록 (사이에 paragraph나 list)
4. list 항목은 1문장~2문장 이내
5. table은 열 5개 이하 권장
6. note는 문서당 1~3개 이내
