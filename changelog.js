const APP_CHANGELOG = {
  version: "v1.3.0",
  date: "2026-06-14",
  features: [
    "🌍 글로벌 데이터센터(DC) 및 주요 발전소 공간 시각화 (D3.js 기반)",
    "🔬 Analysis Lab (데이터 융합 분석): 전력 자립도, 친환경 혼합률, 파이프라인 밀도, 수자원 리스크 분석",
    "📰 실시간 뉴스 티커 및 AI 챗봇 기사 요약 기능",
    "🤖 GitHub Actions 기반 데이터 자동 수집 파이프라인 구축 (arXiv 학술 논문 연동)"
  ],
  latestUpdates: [
    "[데이터] DC 데이터 83개 → 111개로 확장: CoreWeave, Alibaba, Tencent, Baidu, Apple, NTT, Kakao 등 신규 추가",
    "[데이터] city 필드 오류 전면 수정 (Meta, Google, Digital Realty 등 다수 잘못된 도시명 수정)",
    "[데이터] 모든 DC에 status 필드 추가 (운영중 / 건설중 / 계획)",
    "[데이터] AI 특화 DC ai_focus 필드 추가 (xAI, Stargate, CoreWeave, AWS Rainier 등 16개소)",
    "[UI] 버블 시각 인코딩 개선: 건설중=점선 펄스, 계획=빈원, AI 특화=보라 글로우",
    "[UI] DC 상태 필터 슬라이드 추가 (운영중/건설중/계획/AI 특화만 보기)",
    "[UI] KPI 바에 AI 특화 DC 카운트 추가",
    "[UI] 우측 대시보드 카드 개편: PUE 바 차트, status/AI 배지, 위치 정보 강화",
    "[UI] 챗봇 국가별 질의 응답 강화 (건설중/AI 특화 통계 지원)"
  ]
};
