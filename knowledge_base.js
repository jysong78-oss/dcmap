// knowledge_base.js  ·  DC Power Intelligence Hub
// ─────────────────────────────────────────────────────
// 이 파일의 KB_SECTIONS 배열만 수정하면 화면에 자동 반영됩니다.
// 섹션 추가: KB_SECTIONS 배열에 객체 하나 추가
// 섹션 삭제: 해당 객체 제거 또는 { ..., hidden: true } 추가
// 데이터 수정: 각 items / rows / categories 내부 값만 변경
// ─────────────────────────────────────────────────────

const KB_SECTIONS = [

  /* ═══════════════════════════════════════════════════
     1. 글로벌 빅테크 DC 주요 지표
     type: "company-cards"
     items[].stats = [[라벨, 값], ...]
  ═══════════════════════════════════════════════════ */
  {
    id: "bigtech",
    title: "1. 글로벌 빅테크 데이터센터 주요 지표 (2026년 기준)",
    type: "company-cards",
    updated: "2026-06",
    ref: "Microsoft·Amazon·Google·Meta 연간 지속가능성 보고서 2024–2025; Synergy Research Group Q1 2026",
    items: [
      {
        name: "Microsoft Azure",
        color: "#58a6ff",
        abbr: "MS",
        stats: [
          ["투자 계획 (2025년)", "$80B"],
          ["운영 리전", "60+ 리전 (전 세계)"],
          ["대표 PUE", "1.12 – 1.18"],
          ["대표 WUE (L/kWh)", "0.40 – 0.55"],
          ["연간 물사용량", "약 6.4M ㎥"],
          ["탄소중립 목표", "2030 탄소 네거티브"],
        ]
      },
      {
        name: "Amazon (AWS)",
        color: "#f97316",
        abbr: "AWS",
        stats: [
          ["투자 계획 (2025년)", "$100B+"],
          ["운영 리전", "33 리전 / 108 AZ"],
          ["대표 PUE", "1.11 – 1.15"],
          ["대표 WUE (L/kWh)", "0.13 – 0.89"],
          ["연간 물사용량", "약 5.0M ㎥"],
          ["탄소중립 목표", "2025 RE100 달성"],
        ]
      },
      {
        name: "Google Cloud",
        color: "#22c55e",
        abbr: "GC",
        stats: [
          ["투자 계획 (2025년)", "$75B"],
          ["운영 리전", "42 리전"],
          ["대표 PUE", "1.08 – 1.10"],
          ["대표 WUE (L/kWh)", "0.05 – 1.80"],
          ["연간 물사용량", "약 5.7M ㎥"],
          ["탄소중립 목표", "2030 24/7 CFE"],
        ]
      },
      {
        name: "Meta",
        color: "#3b82f6",
        abbr: "META",
        stats: [
          ["투자 계획 (2025년)", "$60 – 65B"],
          ["운영 시설", "21+ 개소"],
          ["대표 PUE", "1.07 – 1.11"],
          ["대표 WUE (L/kWh)", "0.03 – 1.40"],
          ["연간 물사용량", "약 2.6M ㎥"],
          ["탄소중립 목표", "2030 넷제로"],
        ]
      },
    ]
  },

  /* ═══════════════════════════════════════════════════
     2. 데이터센터 유형 분류
     type: "info-cards"
     items[].body = HTML 문자열 (또는 tableHtml)
     items[].extra = 회색 보조 텍스트
  ═══════════════════════════════════════════════════ */
  {
    id: "dc-types",
    title: "2. 데이터센터 유형 분류",
    type: "info-cards",
    updated: "2026-06",
    ref: "Gartner Data Center Taxonomy 2025; Uptime Institute Annual Global Survey 2025; Structure Research 2025",
    items: [
      {
        title: "하이퍼스케일 (Hyperscale)",
        color: "#3b82f6",
        emoji: "🏭",
        body: "클라우드 서비스 제공자(CSP)가 자체 설계·구축한 초대형 시설. 모듈형 아키텍처로 수만 대 서버를 빠르게 확장(Scale-out). AI 클러스터 수요로 캠퍼스 단위 GW 계획 급증.",
        extra: "예: AWS, Microsoft Azure, Google Cloud, Meta, Alibaba Cloud · 규모: 통상 100MW 이상"
      },
      {
        title: "코로케이션 (Colocation)",
        color: "#a855f7",
        emoji: "🏢",
        body: "공간·전력·냉각·네트워크를 기업 고객에게 임대하는 상업용 시설. 입지(금융·통신 허브)와 중립 네트워크 연결이 핵심 경쟁력.",
        extra: "예: Equinix, Digital Realty, NTT, Iron Mountain, KT IDC · 규모: 10 – 100MW"
      },
      {
        title: "엣지 (Edge DC)",
        color: "#f59e0b",
        emoji: "📡",
        body: "사용자·디바이스에 물리적으로 가까운 위치에 배치해 지연(Latency)을 최소화. 자율주행·AR/VR·스마트팩토리 등 실시간 처리에 필수.",
        extra: "예: AWS Outposts, Azure Edge Zones, EdgeConneX, Vapor IO · 규모: 수백kW – 수MW"
      },
      {
        title: "엔터프라이즈 (Enterprise)",
        color: "#8b949e",
        emoji: "🏦",
        body: "금융·공공·의료 등 기업·기관이 자체 운영하는 전산실. 보안·규제 준수 목적으로 온프레미스 유지. 클라우드 전환으로 점유 비중 감소 추세.",
        extra: "예: 시중은행 전산센터, 정부 IDC, 병원 데이터센터 · 규모: 수kW – 수MW"
      },
    ]
  },

  /* ═══════════════════════════════════════════════════
     3. 핵심 효율 지표 (KPI)
     type: "metric-cards"
     items[].benchmarks = [[구분, 수치, 색상코드], ...]
  ═══════════════════════════════════════════════════ */
  {
    id: "kpi-metrics",
    title: "3. 핵심 효율 지표 (KPI)",
    type: "metric-cards",
    updated: "2026-06",
    items: [
      {
        name: "PUE",
        fullName: "Power Usage Effectiveness · 전력 사용 효율",
        formula: "PUE = 시설 총 소비 전력 ÷ IT 장비 소비 전력",
        description: "1.0에 가까울수록 냉각·조명 등 오버헤드 없이 전력이 IT 장비에만 쓰임. 1.0 미만은 물리적으로 불가능.",
        benchmarks: [
          ["글로벌 평균 (2024)", "1.58", "#8b949e"],
          ["하이퍼스케일 평균", "1.10 – 1.20", "#58a6ff"],
          ["AI 특화 DC 목표", "1.03 – 1.10", "#22c55e"],
          ["이상적 최솟값", "1.0", "#a855f7"],
        ],
        ref: "Uptime Institute Global Data Center Survey 2024"
      },
      {
        name: "WUE",
        fullName: "Water Usage Effectiveness · 물 사용 효율",
        formula: "WUE = 냉각 연간 총 물 사용량(L) ÷ IT 연간 소비 전력(kWh)",
        description: "숫자가 낮을수록 물 절약. AI DC 확산으로 WUE 악화 우려. 사막·물 부족 지역은 건식 냉각으로 WUE → 0 추구.",
        benchmarks: [
          ["글로벌 평균", "1.8 L/kWh", "#8b949e"],
          ["선진 하이퍼스케일", "0.1 – 0.5 L/kWh", "#58a6ff"],
          ["건식(공기) 냉각 DC", "~0 L/kWh", "#22c55e"],
        ],
        ref: "The Green Grid WUE Metrics 2024; Uptime Institute Water Survey 2024"
      },
      {
        name: "CUE",
        fullName: "Carbon Usage Effectiveness · 탄소 사용 효율",
        formula: "CUE = 총 CO₂ 배출량(kgCO₂eq) ÷ IT 소비 전력(kWh)",
        description: "전력 그리드의 탄소 집약도에 따라 크게 달라짐. 재생에너지 100% 사용 시 CUE → 0.",
        benchmarks: [
          ["글로벌 평균", "0.4 – 0.8 kgCO₂/kWh", "#8b949e"],
          ["RE100 달성 DC", "~0 kgCO₂/kWh", "#22c55e"],
        ],
        ref: "The Green Grid CUE Metrics White Paper; IEA Data Centres Report 2024"
      },
      {
        name: "Tier 등급",
        fullName: "Uptime Institute Tier Classification · 가용성 등급",
        formula: "Tier I (99.671%) → II (99.741%) → III (99.982%) → IV (99.995%)",
        description: "연간 허용 다운타임: Tier I 28.8시간 / Tier II 22시간 / Tier III 1.6시간 / Tier IV 26.3분. 국내 금융·통신은 Tier III 이상 요구.",
        benchmarks: [
          ["금융·통신 요구 수준", "Tier III – IV", "#3b82f6"],
          ["국내 대형 IDC 평균", "주로 Tier III", "#f97316"],
          ["하이퍼스케일 자체 기준", "자체 N+1 / 2N 이중화", "#8b949e"],
        ],
        ref: "Uptime Institute Tier Standard: Topology 2024"
      },
      {
        name: "Rack 밀도",
        fullName: "Rack Power Density · 랙 전력 밀도 (kW/rack)",
        formula: "랙 1개에 공급 가능한 최대 전력 = IT 장비 발열 처리 한계",
        description: "AI GPU 서버 확산으로 기존 공랭 설계 한계(~20kW)를 수 배 초과. 기존 DC 전면 교체 또는 리노베이션 이슈.",
        benchmarks: [
          ["일반 서버 (CPU 기반)", "5 – 15 kW/rack", "#8b949e"],
          ["AI 서버 (H100 기준)", "30 – 60 kW/rack", "#f97316"],
          ["차세대 AI (B200/GB200)", "60 – 120 kW/rack", "#a855f7"],
          ["공랭 한계선 (기준치)", "~20 kW/rack", "#ef4444"],
        ],
        ref: "NVIDIA GB200 NVL72 System Design Guide; Vertiv AI Infrastructure Survey 2025"
      },
    ]
  },

  /* ═══════════════════════════════════════════════════
     4. 냉각 기술 비교
     type: "comparison-table"
     columns[].label / color
     rows[].label / values[] (columns 수와 일치)
  ═══════════════════════════════════════════════════ */
  {
    id: "cooling",
    title: "4. 냉각 기술 비교",
    type: "comparison-table",
    updated: "2026-06",
    ref: "Gartner & Vertiv AI Infrastructure Report 2025; Uptime Institute Cooling Survey 2024; Global Market Insights Immersion Cooling Market 2025",
    columns: [
      { label: "공랭식 (Air Cooling)", color: "#38bdf8" },
      { label: "D2C 수랭식 (Liquid-to-Chip)", color: "#3b82f6" },
      { label: "액침 냉각 (Immersion)", color: "#a855f7" },
    ],
    rows: [
      { label: "지원 랙 밀도",       values: ["~20 kW",            "30 – 100 kW",                    "100 kW+"] },
      { label: "대표 PUE",           values: ["1.3 – 1.6",         "1.05 – 1.15",                    "1.02 – 1.05"] },
      { label: "냉각수 사용",         values: ["중간 (증발 냉각탑)", "적음",                            "거의 없음"] },
      { label: "구축 비용",           values: ["낮음",              "중간",                            "높음"] },
      { label: "레거시 호환",         values: ["용이",              "부분 개조 필요",                  "기존 설계와 완전 상이"] },
      { label: "AI GPU 적합성",       values: ["제한적 (한계 20kW)","적합 (현재 주류 전환 중)",        "최적 (밀도 제한 없음)"] },
      { label: "채택 비중 (2025)",    values: ["전체 ~70%",         "빠르게 확대 중",                  "실증·파일럿 단계"] },
      { label: "주요 채택 기업",      values: ["대부분 레거시 DC",  "NVIDIA, AWS, MS Azure",           "MS Project Natick, Meta, Submer"] },
    ]
  },

  /* ═══════════════════════════════════════════════════
     5. 발전소 기초 지식
     type: "info-cards"
     tableHtml: 카드 내부에 직접 삽입할 테이블 HTML
  ═══════════════════════════════════════════════════ */
  {
    id: "power-plants",
    title: "5. 발전소 기초 지식",
    type: "info-cards",
    updated: "2026-06",
    ref: "IEA World Energy Outlook 2025; IRENA Renewable Capacity Statistics 2025; WRI Global Power Plant Database v1.3",
    items: [
      {
        title: "발전 유형별 설비이용률 비교",
        color: "#f97316",
        emoji: "⚡",
        tableHtml: `<table style="width:100%;border-collapse:collapse;font-size:0.83rem;margin-top:8px">
<thead><tr>
  <th style="padding:7px 8px;border-bottom:2px solid #30363d;color:#8b949e;text-align:left;font-weight:700">유형</th>
  <th style="padding:7px 8px;border-bottom:2px solid #30363d;color:#8b949e;text-align:center;font-weight:700">설비이용률</th>
  <th style="padding:7px 8px;border-bottom:2px solid #30363d;color:#8b949e;text-align:left;font-weight:700">특징</th>
</tr></thead>
<tbody>
  <tr><td style="padding:6px 8px;border-bottom:1px solid #21262d">☢️ 원자력</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#22c55e;text-align:center;font-weight:700">90 – 95%</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#8b949e">무탄소 기저부하, AI DC용 SMR 관심 급증</td></tr>
  <tr><td style="padding:6px 8px;border-bottom:1px solid #21262d">🔥 석탄</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#22c55e;text-align:center;font-weight:700">60 – 85%</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#8b949e">탄소 다량 배출, 글로벌 퇴출 가속화</td></tr>
  <tr><td style="padding:6px 8px;border-bottom:1px solid #21262d">💨 천연가스</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#f97316;text-align:center;font-weight:700">40 – 60%</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#8b949e">빠른 출력 조절, AI DC 전력 수요로 재조명</td></tr>
  <tr><td style="padding:6px 8px;border-bottom:1px solid #21262d">💧 수력</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#f97316;text-align:center;font-weight:700">35 – 50%</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#8b949e">재생에너지, 가뭄·입지 제약</td></tr>
  <tr><td style="padding:6px 8px;border-bottom:1px solid #21262d">☀️ 태양광 (PV)</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#ef4444;text-align:center;font-weight:700">15 – 25%</td><td style="padding:6px 8px;border-bottom:1px solid #21262d;color:#8b949e">간헐성, 원가 급락, ESS 연계 필수</td></tr>
  <tr><td style="padding:6px 8px">🌬️ 풍력 (육상/해상)</td><td style="padding:6px 8px;color:#ef4444;text-align:center;font-weight:700">25 – 45%</td><td style="padding:6px 8px;color:#8b949e">간헐성, 해상풍력 성장세</td></tr>
</tbody></table>`
      },
      {
        title: "설비이용률 (Capacity Factor)",
        color: "#3b82f6",
        emoji: "📊",
        body: "<strong>설비이용률</strong> = 실제 연간 발전량 ÷ (설비 용량 × 8,760시간) × 100%<br><br>태양광·풍력은 날씨에 따라 발전량이 크게 변하는 <strong>간헐성(Intermittency)</strong> 문제가 있음. 이를 보완하기 위해 ① ESS(배터리저장시스템) 연계, ② 다른 전원과 혼합(믹스), ③ 수요반응(DR) 등이 필요하며, 데이터센터의 안정적 전력 공급에 직결되는 핵심 개념."
      },
      {
        title: "PPA / RE100 / 24/7 CFE",
        color: "#22c55e",
        emoji: "🌱",
        body: "<strong>PPA (전력구매계약, Power Purchase Agreement):</strong> 재생에너지 발전사업자와 장기 고정가격으로 직접 전력을 구매하는 계약. DC 운영사들의 탄소중립 핵심 수단.<br><br><strong>RE100:</strong> 사용 전력 100%를 재생에너지로 조달하겠다는 기업 자발적 이니셔티브 (Climate Group 주도).<br><br><strong>24/7 CFE (Carbon-Free Energy):</strong> RE100에서 진화한 개념. 시간 단위로 탄소 없는 전력만 매칭 사용. Google이 2030 목표로 선도."
      },
      {
        title: "SMR과 AI 데이터센터",
        color: "#a855f7",
        emoji: "⚛️",
        body: "<strong>SMR (소형 모듈 원자로, Small Modular Reactor):</strong> 출력 300MW 이하의 소형 원자로. 기존 대형 원전 대비 건설 기간이 짧고 부지 유연성이 높아, 안정적·무탄소 전력이 필요한 AI 데이터센터의 차세대 전원으로 급부상.<br><br>Microsoft·Google·Amazon이 SMR 개발사(TerraPower, Kairos, X-energy 등)와 전력 공급 계약을 체결하며 상업화에 속도."
      },
    ]
  },

  /* ═══════════════════════════════════════════════════
     6. AI DC vs 일반 DC 비교
     type: "comparison-table"  (2-column)
  ═══════════════════════════════════════════════════ */
  {
    id: "ai-dc",
    title: "6. AI 데이터센터 vs 일반 데이터센터",
    type: "comparison-table",
    updated: "2026-06",
    ref: "Goldman Sachs AI Infrastructure Report 2025; Dell'Oro DC Capex Forecast 2025; NVIDIA GB200 NVL72 Design Guide; McKinsey AI Infrastructure 2025",
    columns: [
      { label: "일반 DC (CPU 중심)", color: "#58a6ff" },
      { label: "AI DC (GPU 중심)", color: "#a855f7" },
    ],
    rows: [
      { label: "주요 칩",         values: ["CPU (Intel Xeon, AMD EPYC)", "GPU (NVIDIA H100/B200), Google TPU, AWS Trainium"] },
      { label: "랙 전력 밀도",   values: ["5 – 15 kW/rack", "60 – 120 kW/rack"] },
      { label: "냉각 방식",      values: ["공랭식 (Air Cooling) 주류", "D2C 수랭 / 액침 냉각 필수"] },
      { label: "네트워크",       values: ["이더넷 10 – 100G", "InfiniBand 400G, NVLink, RoCE v2"] },
      { label: "캠퍼스 전력 규모", values: ["10 – 100 MW", "100 MW – 1 GW+ (AI 클러스터)"] },
      { label: "전력 공급 전략", values: ["계통 전력 + 일부 PPA", "PPA + SMR·가스터빈 전용 계약"] },
      { label: "물 사용 이슈",   values: ["중간 수준", "냉각 수요 급증, WUE 악화 우려"] },
      { label: "건설 기간",      values: ["18 – 36개월", "24 – 48개월 (전력 인허가 병목)"] },
      { label: "단위 투자 비용", values: ["$5 – 10M / MW", "$15 – 30M / MW (GPU 포함)"] },
    ]
  },

  /* ═══════════════════════════════════════════════════
     7. 유용 사이트 모음
     type: "link-cards"
     categories[].label / color / links[]
     links[].name / url / desc
  ═══════════════════════════════════════════════════ */
  {
    id: "useful-sites",
    title: "7. 유용 사이트 모음",
    type: "link-cards",
    updated: "2026-06",
    categories: [
      {
        label: "DC 업계 뉴스·분석",
        color: "#58a6ff",
        links: [
          { name: "Datacenter Dynamics",    url: "https://www.datacenterdynamics.com",  desc: "글로벌 DC 뉴스·딜·기술 분석 (영문 전문지)" },
          { name: "Data Center Frontier",   url: "https://datacenterfrontier.com",      desc: "DC 트렌드·비즈니스 심층 리포트" },
          { name: "Data Center Knowledge",  url: "https://www.datacenterknowledge.com", desc: "운영·기술·비즈니스 분석 매거진" },
        ]
      },
      {
        label: "효율 기준·인증",
        color: "#22c55e",
        links: [
          { name: "Uptime Institute",   url: "https://uptimeinstitute.com",          desc: "Tier 인증, PUE/WUE 연간 글로벌 보고서 발행" },
          { name: "The Green Grid",     url: "https://www.thegreengrid.org",         desc: "PUE·WUE·CUE 지표 정의 및 산업 가이드라인" },
          { name: "ASHRAE TC 9.9",      url: "https://tc0909.ashraetcs.org",         desc: "DC 열환경·냉각 국제 표준 (A1–A4 분류)" },
        ]
      },
      {
        label: "전력·에너지 데이터",
        color: "#f97316",
        links: [
          { name: "IEA – Electricity",          url: "https://www.iea.org/energy-system/electricity", desc: "국가별 전력 믹스·에너지 전환 통계 (무료)" },
          { name: "EIA (미국 에너지정보청)",     url: "https://www.eia.gov",                           desc: "미국 발전·에너지 소비 상세 데이터" },
          { name: "IRENA",                       url: "https://www.irena.org",                          desc: "국제 재생에너지 설비·발전량 통계 (연간)" },
          { name: "WRI Global Power Plant DB",   url: "https://datasets.wri.org/dataset/globalpowerplantdatabase", desc: "이 앱 발전소 원본 데이터 (GPPD v1.3, 오픈소스)" },
        ]
      },
      {
        label: "물 리스크",
        color: "#38bdf8",
        links: [
          { name: "WRI Aqueduct",      url: "https://www.wri.org/aqueduct", desc: "이 앱 물 스트레스 레이어 원본 데이터 (Aqueduct 3.0)" },
          { name: "CDP Water Security", url: "https://www.cdp.net/en/water", desc: "기업 물 리스크 공시·평가 데이터" },
        ]
      },
      {
        label: "AI 인프라·시장 리서치",
        color: "#a855f7",
        links: [
          { name: "Synergy Research Group",        url: "https://www.srgresearch.com",                      desc: "클라우드 시장점유율·하이퍼스케일 DC 투자 분기 리포트" },
          { name: "Dell'Oro Group",                 url: "https://www.delloro.com",                          desc: "DC 네트워크·서버·전력 인프라 시장 예측" },
          { name: "Gartner Infrastructure",         url: "https://www.gartner.com/en/infrastructure-and-operations", desc: "DC·클라우드 기술 트렌드 분석" },
          { name: "arXiv cs.DC",                    url: "https://arxiv.org/list/cs.DC/recent",              desc: "분산컴퓨팅·DC 최신 논문 (이 앱 자동수집 원천)" },
        ]
      },
      {
        label: "국내 자료",
        color: "#3fb950",
        links: [
          { name: "한국데이터센터연합회 (KDCA)", url: "https://www.kdca.or.kr",      desc: "국내 DC 현황·정책·인증 정보" },
          { name: "한국전력 전력통계 (KEPCO)",   url: "https://home.kepco.co.kr",    desc: "국내 발전·송배전 통계" },
          { name: "에너지경제연구원 (KEEI)",     url: "https://www.keei.re.kr",      desc: "국내외 에너지 정책·수급 분석 보고서" },
          { name: "과학기술정보통신부 (MSIT)",   url: "https://www.msit.go.kr",      desc: "국내 데이터센터·클라우드 정책 공시" },
        ]
      },
    ]
  },

];
