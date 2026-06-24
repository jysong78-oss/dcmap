# GridX: Watt & Byte — 프로젝트 인수인계 문서

> **버전:** v1.3.1 | **기준일:** 2026-06-24 | **작성:** Claude Sonnet 4.6 (Claude Code)

---

## 1. 프로젝트 개요

### 앱 이름
**GridX: Watt & Byte (2026)**

### 한 줄 설명
글로벌 데이터센터(DC)·발전소(PP)를 D3.js 기반 인터랙티브 세계지도 위에 시각화하고, AI 챗봇·자동 뉴스 수집·분석 리포트를 통합한 **단일 HTML 웹 대시보드**

### 배포 환경
- **Cloudflare Pages** (정적 호스팅) — 루트 디렉터리 전체를 publish
- `netlify.toml`도 존재 (과거 Netlify 사용 흔적, 현재 비활성)
- GitHub Actions로 매주 일요일 자동 데이터 수집 → `dc_data.js` 갱신 후 자동 커밋

---

## 2. 기술 스택

| 항목 | 내용 |
|------|------|
| **언어** | HTML5 / CSS3 / Vanilla JavaScript (프레임워크 없음) |
| **지도 렌더링** | [D3.js v7](https://d3js.org/) (SVG 기반 세계지도 버블/코로플레스) |
| **지형 데이터** | TopoJSON (world_topo.js / world_topo.json) — `topojson-client@3` unpkg CDN |
| **자동화 파이프라인** | Python 3 (`auto_scraper.py`) + GitHub Actions |
| **Python 의존성** | pandas, requests, beautifulsoup4, feedparser (`requirements.txt`) |
| **빌드 도구** | 없음 (순수 정적 파일, 번들러/트랜스파일러 불필요) |

---

## 3. 디렉터리 구조 및 파일 설명

```
dcmap_backup_extracted/
│
├── index.html              ← 앱 본체 (UI, 전체 로직 포함, ~1,600줄)
│
├── [데이터 파일]
│   ├── dc_data.js          ← 데이터센터 111개소 + 뉴스 인텔 데이터 (자동 갱신 대상)
│   ├── water_risk_data.js  ← WRI Aqueduct 3.0 국가별 물부족 리스크 등급
│   ├── pp_data.js          ← 발전소 데이터 (WRI GPPD v1.3.0 기반, 지연 로딩)
│   ├── pp_data.json        ← pp_data.js의 JSON 원본
│   ├── map_data.js         ← 지도 렌더링용 보조 데이터
│   ├── world_topo.js       ← 세계지도 TopoJSON (스크립트 형태)
│   ├── world_topo.json     ← 세계지도 TopoJSON 원본
│   └── continent_map.js    ← 국가→대륙 매핑 테이블
│
├── [UI 보조]
│   └── changelog.js        ← 버전·기능·업데이트 목록 (웰컴 모달에 주입)
│
├── [자동화]
│   └── auto_scraper.py     ← GitHub Actions용 데이터 파이프라인 스크립트
│
├── [데이터 가공 스크립트 (개발용, 배포 불필요)]
│   ├── extract.py
│   ├── extract_colors.py
│   ├── convert_to_json.py
│   ├── prepare_map_data.py
│   ├── merge_dc_data.py
│   ├── convert_poster.py
│   ├── convert_topo.py
│   └── fix_dc_data.py
│
├── [배포 설정]
│   ├── netlify.toml        ← Cloudflare/Netlify 배포 설정 (publish = ".")
│   └── .gitignore
│
├── [문서·기타]
│   ├── requirements.txt    ← Python 의존성
│   ├── GridX_Beta_Tester_Guide.docx ← 베타 테스터 가이드
│   └── PROJECT_HANDOVER.md ← 이 문서
│
└── [원본 데이터 소스 파일 — 참고용]
    ├── global_datacenter_2026.xlsx
    ├── Global_DataCenter_PowerPlant_Dashboard_2026_v3.xlsx
    ├── global_power_plants_merged.csv
    └── old_dc.json
```

---

## 4. 핵심 기능 상세

### 4-1. 세계지도 (메인 화면)

- **SVG 기반 D3.js Mercator 투영** 지도 렌더링
- 마우스 **줌·패닝** 지원 (터치 포함)
- 상단 **[DC 지도 / 발전소 / Info]** 토글 버튼으로 3가지 뷰 전환
- 국가 영역 클릭 시 → **국가 DC 목록 팝업** 표시 (해당 국가 DC 리스트)
- 버블(마커) 클릭 시 → **우측 대시보드** 카드에 상세 정보 렌더링

### 4-2. 데이터센터(DC) 뷰

| 기능 | 설명 |
|------|------|
| **버블 시각화** | 용량(cap) 비례 원형 마커. 운영중=실선, 건설중=점선+펄스 애니메이션, 계획=빈원 |
| **AI 특화 강조** | ai_focus=true인 DC는 보라색 글로우 효과 |
| **상태 필터** | 운영중 / 건설중 / 계획 / AI 특화만 보기 슬라이드 필터 |
| **물 리스크 오버레이** | 우상단 💧 버튼 → 국가별 물부족 등급 코로플레스 (5단계 색상) |
| **마우스오버 툴팁** | DC명, 운영사, 용량(MW), PUE, WUE, 상태 배지 |

### 4-3. 발전소(PP) 뷰

- 연료 유형별 색상 분류: Coal(회색), Gas(빨강), Nuclear(보라), Solar(노랑), Wind(파랑), Hydro(하늘), 기타
- 체크박스 필터로 에너지원 선택
- WRI GPPD v1.3.0 데이터 기반, 50 MW 이상 상업용 발전소

### 4-4. 상단 KPI 바

4개 글로벌 스탯 카드 (클릭 시 드롭다운 상세 펼침):

| 카드 | 내용 |
|------|------|
| DC 수 | 현재 필터 기준 데이터센터 개수, 클릭 시 대륙별 바 차트 |
| DC 용량 | 누적 MW, 클릭 시 대륙별 바 차트 |
| AI 특화 DC | ai_focus 개수, 클릭 시 상태별 목록 + 파이프라인 전망 |
| 발전소 용량 | 총 GW, 클릭 시 대륙별·에너지원별 다단 바 차트 |

### 4-5. 우측 대시보드

- 클릭 이전: "지도에서 클릭하세요" 빈 상태
- DC 클릭 후: PUE 바 차트, WUE, 냉각 방식, 위치, status/AI 배지, notes
- PP 클릭 후: 발전 용량, 연료 유형, 국가 정보
- 국가 클릭 후: 해당 국가 DC 팝업

### 4-6. AI 챗봇 (우측 하단)

- **2가지 AI 백엔드 선택:** Groq (Gemma2) / Gemini 2.5
- API 키는 브라우저 `localStorage`에 저장 (최초 사용 시 입력 모달)
- 키 초기화 버튼으로 재설정 가능
- **세션 컨텍스트 자동 주입:** DC_DATA 요약, 현재 필터 상태, 뉴스 데이터를 시스템 프롬프트에 포함
- 지원 질의 예시: "미국 건설중 DC 몇 개야?", "PUE 가장 낮은 데이터센터는?", "AI 특화 DC 현황 알려줘"
- **뉴스 요약 버튼** (보라색): Info 탭 뉴스 항목별로 AI 요약 요청
- 챗봇 높이 **드래그 리사이즈** 지원 (chat-resize-handle)

### 4-7. 뉴스 티커 (상단 띠)

- 상단 가로 스크롤 뉴스 자동 흐름 (animation: 140s)
- 마우스오버 시 일시정지 + 원문 요약 툴팁 표시
- 데이터 소스: dc_data.js 내 `INTEL_DATA` 배열

### 4-8. Info 탭

3가지 서브섹션:
1. **데이터 출처 현황 테이블** — 정적(수동)/자동/LIVE 배지 구분
2. **실시간 뉴스 목록** — Google News RSS (한국어 번역) + AI 요약 버튼 + PDF 출력
3. **학술/연구 리포트 목록** — arXiv 자동 수집 인텔 + PDF 출력
4. **빅테크 KPI 카드** — Microsoft, AWS, Google, Meta 주요 지표
5. **용어 사전** — PUE/WUE/Hyperscale/Colocation 개념 설명
6. **냉각 기술 트렌드** — 공랭/D2C 수랭/액침냉각 비교

### 4-9. Analysis Lab (분석 실험실)

지도 하단 드로어(Drawer) 방식으로 펼쳐지는 4개 분석 탭:

| 탭 | 내용 |
|----|------|
| 전력 자립도 | DC 집적 지역의 발전소 용량 대비 전력 수요 비율 분석 |
| 친환경 혼합률 | 재생에너지 발전소 비중 히트맵 |
| 파이프라인 밀도 | 대륙별 건설중+계획 DC 파이프라인 밀도 |
| 수자원 리스크 | Water Risk와 DC 위치 교차 분석 |

### 4-10. 웰컴 모달 (접속 시 자동)

- 첫 방문 시 표시 (localStorage 기반 하루 1회)
- 좌측: GridX 포스터 이미지 (WebP/PNG)
- 우측: changelog.js에서 주입된 주요 기능 + 최신 업데이트 목록

### 4-11. 로딩 화면

- 앱 초기화 중 진행률 바 + 상태 메시지 표시
- 최소 5초 유지 후 페이드아웃

---

## 5. 데이터 스키마

### 5-1. DC_DATA (dc_data.js)

```javascript
{
  name: string,           // 데이터센터 명칭
  country: string,        // 국가명 (대륙명 포함 가능, "North America" 등)
  op: string,             // 운영사 (예: "Google", "AWS")
  lat: number,            // 위도
  lng: number,            // 경도
  cap: number,            // IT 부하 용량 (MW)
  cooling: string,        // 냉각 방식 (예: "Evaporative", "Liquid/Air")
  city: string,           // 도시명
  type: string,           // "Hyperscale" | "Colocation" | "Enterprise" | "Regional Hub (Aggregate)"
  pue: string,            // Power Usage Effectiveness (예: "1.08")
  wue: string,            // Water Usage Effectiveness (L/kWh)
  notes: string,          // 특이사항 메모
  status: string,         // "Operational" | "Under Construction" | "Planned"
  ai_focus: boolean       // AI 특화 DC 여부
}
```

현재 데이터: **111개소** (운영중 + 건설중 + 계획 포함)

### 5-2. INTEL_DATA (dc_data.js 하단)

```javascript
{
  title: string,    // 뉴스/논문 제목
  link: string,     // 원문 URL
  date: string,     // 날짜
  summary: string,  // 요약 (200자 내외)
  source: string    // "arXiv" | "DC Knowledge" | "DC Dynamics" | "The Register"
}
```

### 5-3. WATER_RISK_DATA (water_risk_data.js)

```javascript
"국가명": {
  level: number,   // 1(Low) ~ 5(Extremely High)
  ws: number,      // Water Stress 수치 (%)
  label: string,   // 등급 레이블
  note: string     // DC 맥락에서의 설명
}
```

데이터 출처: WRI Aqueduct 3.0 (세계자원연구소)

---

## 6. 자동화 파이프라인 (auto_scraper.py)

### 역할
GitHub Actions Workflow에서 실행되어 최신 데이터를 수집하고 `dc_data.js`의 `INTEL_DATA` 배열을 자동 갱신

### 실행 주기
매주 일요일 (GitHub Actions cron)

### 수집 소스

**arXiv 논문 (4개 쿼리, 각 최대 4건):**
- `datacenter AND energy`
- `datacenter AND cooling`
- `datacenter AND AI`
- `datacenter AND renewable`

**업계 뉴스 RSS (feedparser 사용 시):**
- Data Center Dynamics RSS
- Data Center Knowledge RSS
- The Register (Data Centre) RSS

### 출력
`dc_data.js` — `INTEL_DATA` 배열 갱신 후 git commit

### 로컬 실행 방법
```bash
pip install feedparser
python auto_scraper.py
```

---

## 7. 반응형 레이아웃 브레이크포인트

| 해상도 | 레이아웃 |
|--------|---------|
| > 1280px | 기본: 지도 70% + 대시보드 30% |
| 1024~1280px | 대시보드 35% |
| 900~1024px | 대시보드 42% |
| < 900px | 세로 스택: 지도(55vh) + 대시보드 + 챗봇 순 |
| < 480px | KPI 카드 세로 정렬, 모든 컴포넌트 전폭 |

---

## 8. 전체 작업 이력 (Git 커밋 순서)

### v1.3.1 (2026-06-24)
- **발전소(PP) 데이터 갱신** — WRI GPPD v1.3.0 원본 데이터(2021-06 cutoff) 이후 가동 시작한 전세계 주요 발전소 109건 추가/정리
  - 동아시아·남아시아/중동·미주·유럽-아프리카-오세아니아 4개 권역 웹 리서치로 신규 87건 발굴(원자력 17·가스 17·석탄 11·수력 6·태양광 30·풍력 22·기타 6)
  - 2027년 이후 가동 예정(미가동) 항목은 제외, 실제 가동 확인된 것만 반영
  - 기존에 있던 pp_data.json/js 간 동기화 어긋남(중복 22건) 및 한국 발전소 일부 항목의 한글 인코딩 깨짐(복구 불가, 영문명으로 정리) 수정
- **데이터센터(DC) 신규 시설 추가** — Microsoft Alviso, CloudBurst Central Texas, QTS Van Wert, Nebius Pennsylvania, AWS Montgomery County, TAC Wythe County, DayOne Aragon 등 최근 발표된 신규 DC 7곳 반영
- **베타 테스터 모집 포스터(poster.html) 전면 리디자인** — 960×1200 캔버스로 확장, 헤더 2단 구성, Analysis Lab/실시간 뉴스/AI 챗봇 카드 강조 색상 구분, 로드맵(단기/중기/장기) + 운영 정보(자동 업데이트/인프라) 섹션 신설

### v1.3.0 (2026-06-14)
- `54ab29f` **Water Risk 오버레이 추가** — WRI Aqueduct 3.0 국가별 물 스트레스 코로플레스 레이어. 💧 버튼으로 토글. 5단계 색상(Low/Low-Med/Med-High/High/Extremely High)
- `cba6052` **데이터 출처 및 업데이트 현황 테이블** — Info 탭 상단에 정적/자동/LIVE 배지 구분 테이블 추가

### v1.2.x (2026-06 초)
- `1ffd739` **auto_scraper 개선** — arXiv 쿼리 확대 + RSS 소스 강화
- `0ed2511` **챗봇 드래그 리사이즈 + 로딩 개선** — 챗봇 상단 핸들 드래그로 높이 조절. 로딩 최소 5초. 토글 전환 시 국가 팝업 자동 닫기
- `c5cdcc6` **로딩 진행률 화면** — 초기 렌더링 중 진행률 바 + 단계별 메시지 표시

### v1.2.0 (2026-06)
- `3784caa` **성능 최적화 + UI 개선** — 발전소 데이터 JSON 분리(지연 로딩), AI 특화 DC KPI 위치 재배치, 포스터 WebP 변환
- `744c5e3` **웰컴 팝업 추가** — 접속 시 자동 표시. 포스터 이미지(좌) + 업데이트 내역(우) 2단 구성

### v1.1.x
- `4ffc7ca` **반응형 여백 수정** + 토글 버튼 이름 변경
- `6aea326` **반응형 레이아웃 전면 개선** — 900px/1024px/480px 모든 해상도 대응
- `46e10c7` **GitHub Pages 워크플로우 제거** — Cloudflare Pages로 배포 일원화
- `6b37b1f` **Automated data fetch** (GitHub Actions 최초 자동 커밋)

### v1.0.x (초기 구조)
- `c4c1887` **DC 필터 + 국가 DC 팝업 + KPI 카드 개편** — 상태 필터(운영중/건설중/계획/AI특화), 국가 클릭 팝업, KPI 바 재설계
- `88ec13d` Analysis Lab 깨진 백업 되돌리기 (revert)
- `fed079c` **Analysis Lab 탭 구현** — 2026 데이터 + map_data.js 통합
- `923797b` Analysis Lab 문법 오류 수정
- `ea89fc2` 스크래치 파일 정리
- `184786c` 지도 레이아웃 깨뜨리는 div 태그 수정
- `ad11387` Infra & Grid 탭 로직 구현
- `9c381fe` **Analysis Lab UI 탭 프레임워크** 추가
- `34c6f69` Analysis Lab 레이블 수정
- `71302f6` Unified_DC_Power_Map.html과 index.html 동기화
- `7533c91` **PDF 출력 버튼 + 챗봇 요약** 추가
- `898a19b` PR #1 머지 (gemini-analysis-lab 브랜치)
- `4233340` Analysis Lab 최초 추가 + 실시간 업데이트 방법 추가
- `6a38c9f` **최초 커밋** — DC Map 초기 세팅

---

## 9. 현재 데이터 현황

| 데이터 | 수량 | 최종 갱신 |
|--------|------|-----------|
| 데이터센터 | **118개소** | 2026-06-24 |
| AI 특화 DC | **16개소** | 2026-06-14 |
| 물 리스크 (국가) | ~160개국 | 2026-06-14 (정적) |
| 인텔/뉴스 | ~16건 | 자동 갱신 (매주 일요일) |
| 발전소 | WRI GPPD v1.3.0 + 2021-2026 신규 109건 수동 보강 | 2026-06-24 |

---

## 10. 개발 예정 / 미완성 기능

아래는 코드 내 흔적 또는 논의된 다음 단계 기능입니다:

1. **Analysis Lab 고도화** — 현재 탭 UI 프레임만 있고 일부 탭 분석 로직이 미완성. 전력 자립도, 친환경 혼합률 계산 로직 보완 필요
2. **뉴스 실시간 로딩** — 현재 Google News RSS를 페이지 로드 시 fetch하는 방식. 현재 CORS 제한으로 클라이언트 직접 호출이 막혀 있어 프록시 또는 서버사이드 처리 필요
3. **DC 데이터 자동 갱신** — 현재 auto_scraper는 뉴스/논문만 수집. DC 시설 데이터 자체는 수동 편집 중. 크롤러 기반 자동화 검토 필요
4. **국가 드릴다운** — 국가 클릭 시 해당 국가 DC 목록 팝업은 구현됨. 국가별 분석 페이지로 이동하는 기능 미구현
5. **3D 지구본 뷰** — Globe 투영 모드 (Orthographic) 실험 논의됨, 미구현
6. **다크/라이트 테마** — 현재 다크 모드 전용

---

## 11. 로컬 개발 방법

별도 빌드 과정 없음. 정적 HTML 파일이므로:

```bash
# 1. 로컬 HTTP 서버 실행 (직접 파일 열기 시 CORS 문제 발생 가능)
python -m http.server 8080
# 또는
npx serve .

# 2. 브라우저에서 접속
# http://localhost:8080
```

> **주의:** `world_topo.js`는 용량이 크므로 (수 MB), 파일 직접 열기(`file://`)는 권장하지 않음. 반드시 로컬 서버를 통해 접속할 것.

---

## 12. 외부 의존성 (CDN)

```html
<!-- index.html 하단 스크립트 태그 -->
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://unpkg.com/topojson-client@3"></script>
```

이 두 라이브러리만 CDN 사용. 나머지는 모두 로컬 파일.

---

## 13. 보안 설정 (netlify.toml)

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

*이 문서는 Claude Sonnet 4.6 (Claude Code)가 2026-06-15 기준으로 프로젝트 코드 및 Git 히스토리 전체를 분석하여 자동 생성했습니다.*
