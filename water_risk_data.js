// WRI Aqueduct 3.0 기반 국가별 물부족 위험 등급
// 출처: World Resources Institute, Aqueduct Water Risk Atlas 3.0
// https://www.wri.org/data/aqueduct-water-risk-atlas
// 등급: 1=Low(<10%) 2=Low-Medium(10-20%) 3=Medium-High(20-40%) 4=High(40-80%) 5=Extremely High(>80%)

const WATER_RISK_DATA = {
  // ── 북미 ──────────────────────────────────────
  "United States of America": { level:3, ws:31, label:"Medium-High", note:"서부(캘리포니아·애리조나·네바다) 극심, 동부(버지니아) 중간 수준. DC 밀집 NoVA는 체사피크만 수계 의존." },
  "United States":            { level:3, ws:31, label:"Medium-High", note:"서부(캘리포니아·애리조나·네바다) 극심, 동부(버지니아) 중간 수준. DC 밀집 NoVA는 체사피크만 수계 의존." },
  "Canada":                   { level:1, ws:5,  label:"Low",         note:"담수 세계 2위 보유국. 수자원 리스크 낮으나 북부 동결 관리 필요." },
  "Mexico":                   { level:4, ws:58, label:"High",        note:"북부 치와와·소노라 사막지대 극심. 케레타로 DC 클러스터 수원 부족 주의." },
  "Greenland":                { level:1, ws:1,  label:"Low",         note:"빙설 담수 최대 보유지." },

  // ── 중남미 ────────────────────────────────────
  "Brazil":                   { level:2, ws:14, label:"Low-Medium",  note:"아마존 유역은 풍부하나 상파울루·북동부 반건조 지역은 High 수준." },
  "Colombia":                 { level:2, ws:12, label:"Low-Medium",  note:"안데스 수계 풍부. 보고타 주변 중간 수준." },
  "Venezuela":                { level:2, ws:13, label:"Low-Medium",  note:"오리노코 수계 풍부." },
  "Peru":                     { level:2, ws:18, label:"Low-Medium",  note:"아마존 동부는 Low, 태평양 해안 사막은 Extremely High." },
  "Ecuador":                  { level:1, ws:8,  label:"Low",         note:"안데스·아마존 수계." },
  "Bolivia":                  { level:2, ws:15, label:"Low-Medium",  note:"알티플라노 고원 수자원 변동성 높음." },
  "Argentina":                { level:3, ws:28, label:"Medium-High", note:"팜파스·파타고니아 북부 High, 라플라타 유역 중간." },
  "Chile":                    { level:4, ws:52, label:"High",        note:"아타카마 사막(세계 최건조) 포함 북부 Extremely High. 데이터센터 산티아고 중간 수준." },
  "Paraguay":                 { level:2, ws:16, label:"Low-Medium",  note:"파라과이 강 유역." },
  "Uruguay":                  { level:2, ws:17, label:"Low-Medium",  note:"라플라타 유역 중간." },
  "Cuba":                     { level:3, ws:25, label:"Medium-High", note:"카리브해 도서, 지하수 의존." },
  "Dominican Republic":       { level:3, ws:24, label:"Medium-High", note:"카리브해 도서." },

  // ── 유럽 ──────────────────────────────────────
  "United Kingdom":           { level:2, ws:18, label:"Low-Medium",  note:"런던·남동부 Low-Medium. 런던 DC 클러스터 템즈강 의존도 주의." },
  "Ireland":                  { level:1, ws:7,  label:"Low",         note:"강수 풍부. 더블린 DC 밀집지역 수자원 여유." },
  "France":                   { level:3, ws:23, label:"Medium-High", note:"지중해 남부 High, 북부 중간. 원전 냉각수 갈등 이슈." },
  "Germany":                  { level:3, ws:22, label:"Medium-High", note:"라인강 수계 중간. 여름 가뭄 빈도 증가 추세." },
  "Netherlands":              { level:2, ws:19, label:"Low-Medium",  note:"라인·마스강 하구. AMS DC 클러스터 수자원 상대적 안정." },
  "Belgium":                  { level:2, ws:19, label:"Low-Medium",  note:"마스강 유역 중간." },
  "Luxembourg":               { level:2, ws:17, label:"Low-Medium",  note:"모젤강 유역." },
  "Switzerland":              { level:2, ws:18, label:"Low-Medium",  note:"알프스 빙하수. 스위스 DC 최적 수자원 환경." },
  "Austria":                  { level:2, ws:18, label:"Low-Medium",  note:"알프스 수계 풍부." },
  "Sweden":                   { level:2, ws:11, label:"Low-Medium",  note:"스칸디나비아 담수 풍부. 예테보리·가블레 DC 최적 환경." },
  "Norway":                   { level:1, ws:6,  label:"Low",         note:"피오르드 담수 풍부. Green Mountain DC 피오르드 해수냉각 활용." },
  "Finland":                  { level:1, ws:5,  label:"Low",         note:"호수 국가. 하미나(Google) 발트해 해수냉각 가능." },
  "Denmark":                  { level:2, ws:13, label:"Low-Medium",  note:"발트해 해수 활용 가능." },
  "Iceland":                  { level:1, ws:2,  label:"Low",         note:"빙하·지열 수자원 최우량. 데이터센터 최적지." },
  "Spain":                    { level:4, ws:55, label:"High",        note:"이베리아반도 남부 Extremely High. 마드리드 DC 타호강 갈등 주의." },
  "Portugal":                 { level:3, ws:38, label:"Medium-High", note:"신트라 DC 클러스터 타호강 하류 의존. 여름 건조 악화." },
  "Italy":                    { level:4, ws:48, label:"High",        note:"포강 유역 北이탈리아 High, 시칠리아·사르디니아 Extremely High." },
  "Greece":                   { level:4, ws:57, label:"High",        note:"에게해 도서·아티카 지역 Extremely High." },
  "Poland":                   { level:3, ws:21, label:"Medium-High", note:"비스와강 유역 중간." },
  "Czech Republic":           { level:3, ws:22, label:"Medium-High", note:"엘베·모라바강 유역." },
  "Czechia":                  { level:3, ws:22, label:"Medium-High", note:"엘베·모라바강 유역." },
  "Hungary":                  { level:3, ws:24, label:"Medium-High", note:"다뉴브강 의존. 여름 건조 심화." },
  "Romania":                  { level:3, ws:22, label:"Medium-High", note:"다뉴브 하류 중간." },
  "Bulgaria":                 { level:3, ws:26, label:"Medium-High", note:"마리차강 유역." },
  "Serbia":                   { level:3, ws:22, label:"Medium-High", note:"다뉴브·사바강 중간." },
  "Croatia":                  { level:2, ws:16, label:"Low-Medium",  note:"아드리아해 해안 중간." },
  "Ukraine":                  { level:3, ws:25, label:"Medium-High", note:"드네프르강. 크림반도 수자원 위기." },
  "Belarus":                  { level:2, ws:14, label:"Low-Medium",  note:"프리퍄트 수계." },
  "Russia":                   { level:1, ws:5,  label:"Low",         note:"볼가·오비 등 세계 최대 담수. 시베리아 DC 최적 환경." },

  // ── 중동·북아프리카 ───────────────────────────
  "Saudi Arabia":             { level:5, ws:95, label:"Extremely High", note:"연간 강수량 <100mm. 해수담수화 의존 90%+. NEOM 건식냉각+재생에너지 전략 필수." },
  "United Arab Emirates":     { level:5, ws:97, label:"Extremely High", note:"두바이·아부다비 해수담수화 100% 의존. Moro Hub 해수냉각 모델이 유일한 대안." },
  "UAE":                      { level:5, ws:97, label:"Extremely High", note:"두바이·아부다비 해수담수화 100% 의존." },
  "Qatar":                    { level:5, ws:98, label:"Extremely High", note:"지하수 거의 고갈. 해수담수화 전량 의존." },
  "Kuwait":                   { level:5, ws:99, label:"Extremely High", note:"지표수 사실상 없음. DC 냉각 = 에너지 집약적 과제." },
  "Bahrain":                  { level:5, ws:99, label:"Extremely High", note:"섬나라, 지하수 급감. 해수담수화 의존." },
  "Oman":                     { level:5, ws:82, label:"Extremely High", note:"해안 도시 해수담수화. 내륙 극심." },
  "Yemen":                    { level:5, ws:89, label:"Extremely High", note:"분쟁으로 수인프라 붕괴 상태." },
  "Jordan":                   { level:5, ws:95, label:"Extremely High", note:"세계 2위 물부족 국가. 요르단강 공유 분쟁." },
  "Israel":                   { level:5, ws:91, label:"Extremely High", note:"담수 재이용률 세계 1위(약 90%)로 대응. 해수담수화 비중 확대." },
  "Palestine":                { level:5, ws:92, label:"Extremely High", note:"가자지구 지하수 오염 심각." },
  "Syria":                    { level:5, ws:88, label:"Extremely High", note:"유프라테스 감소 + 분쟁으로 수인프라 붕괴." },
  "Iraq":                     { level:4, ws:68, label:"High",           note:"티그리스·유프라테스 상류 댐으로 유량 급감. 남부 사막화 진행." },
  "Iran":                     { level:5, ws:85, label:"Extremely High", note:"자얀데루드 등 주요 하천 고갈. DC 냉각 대규모 투자 필요." },
  "Lebanon":                  { level:5, ws:81, label:"Extremely High", note:"리타니강 공유. 수인프라 노후화 심각." },
  "Cyprus":                   { level:5, ws:82, label:"Extremely High", note:"지중해 도서, 가뭄 빈도 세계 최고 수준." },
  "Egypt":                    { level:5, ws:97, label:"Extremely High", note:"나일강 99% 의존. 에티오피아 GERD 댐 완공으로 유량 감소 우려." },
  "Libya":                    { level:5, ws:93, label:"Extremely High", note:"화석수(비재생) 의존(Great Man-Made River). 고갈 위험." },
  "Algeria":                  { level:4, ws:62, label:"High",           note:"북부 도심 High, 사하라 사막 Extremely High. 알제 DC 수자원 제한적." },
  "Morocco":                  { level:4, ws:57, label:"High",           note:"아틀라스산맥 수계 감소 추세. DC 투자 시 수원 확보 선결." },
  "Tunisia":                  { level:4, ws:61, label:"High",           note:"마즈르다강 감소. 북부 Medium-High, 남부 Extremely High." },
  "Sudan":                    { level:4, ws:58, label:"High",           note:"나일강 상류. GERD 영향권." },
  "Eritrea":                  { level:5, ws:84, label:"Extremely High", note:"사막성 기후, 만성 가뭄." },

  // ── 사하라 이남 아프리카 ──────────────────────
  "South Africa":             { level:4, ws:54, label:"High",        note:"케이프타운 2018 Day Zero 위기 경험. 요하네스버그 비알강 의존 High." },
  "Nigeria":                  { level:3, ws:27, label:"Medium-High", note:"북부 사헬지대 High, 니제르강 유역 중간. 라고스 해안 중간." },
  "Kenya":                    { level:3, ws:32, label:"Medium-High", note:"나이로비 주변 High. 가뭄 빈도 증가." },
  "Ethiopia":                 { level:3, ws:29, label:"Medium-High", note:"아와시강 High, 청나일 중간. 수력발전 갈등(GERD)." },
  "Tanzania":                 { level:2, ws:16, label:"Low-Medium",  note:"탕가니카호 등 대호수. 해안 다르에스살람 중간." },
  "Ghana":                    { level:2, ws:18, label:"Low-Medium",  note:"볼타강 유역." },
  "Senegal":                  { level:2, ws:19, label:"Low-Medium",  note:"세네갈강 유역." },
  "Mozambique":               { level:2, ws:14, label:"Low-Medium",  note:"잠베지강 유역." },
  "Zambia":                   { level:2, ws:12, label:"Low-Medium",  note:"잠베지강 상류." },
  "Zimbabwe":                 { level:3, ws:26, label:"Medium-High", note:"잠베지·림포포 유역 변동." },
  "Namibia":                  { level:4, ws:65, label:"High",        note:"나미브 사막. DC 냉각 대규모 과제." },
  "Botswana":                 { level:4, ws:62, label:"High",        note:"칼라하리 반건조. 지하수 의존." },
  "Angola":                   { level:2, ws:13, label:"Low-Medium",  note:"쿠안자강 유역." },
  "Cameroon":                 { level:1, ws:8,  label:"Low",         note:"콩고 수계 풍부." },
  "Gabon":                    { level:1, ws:5,  label:"Low",         note:"열대우림 강수 풍부." },
  "Democratic Republic of the Congo": { level:1, ws:3, label:"Low", note:"콩고강 유역. 세계 최대 담수 잠재량 중 하나." },
  "Congo":                    { level:1, ws:4,  label:"Low",         note:"콩고강 유역." },
  "Central African Republic": { level:1, ws:5,  label:"Low",        note:"우방기강 유역." },
  "Somalia":                  { level:4, ws:72, label:"High",        note:"만성 가뭄. 수자원 인프라 극도로 취약." },
  "Djibouti":                 { level:5, ws:88, label:"Extremely High", note:"열대 사막. 담수 거의 없음." },

  // ── 중앙아시아 ────────────────────────────────
  "Kazakhstan":               { level:3, ws:35, label:"Medium-High", note:"아랄해 유역 붕괴. 카스피해 연안 High." },
  "Uzbekistan":               { level:5, ws:91, label:"Extremely High", note:"아무다리야·시르다리야 고갈. 아랄해 소멸 주범. 면화 관개 과잉." },
  "Turkmenistan":             { level:5, ws:88, label:"Extremely High", note:"카라쿰 사막. 관개 과잉으로 지하수 급감." },
  "Kyrgyzstan":               { level:2, ws:19, label:"Low-Medium",  note:"텐샨 빙하수 풍부." },
  "Tajikistan":               { level:2, ws:18, label:"Low-Medium",  note:"아무다리야 상류 빙하수." },
  "Afghanistan":              { level:4, ws:53, label:"High",        note:"헬만드강 고갈. 35년 만의 최악 가뭄(2018-2021)." },

  // ── 남아시아 ──────────────────────────────────
  "India":                    { level:4, ws:62, label:"High",        note:"인더스·강가 북서부 Extremely High. 첸나이·방갈로르·뭄바이 High. 데이터센터 폭발적 성장 속 수자원 제약 심각." },
  "Pakistan":                 { level:5, ws:83, label:"Extremely High", note:"인더스강 빙하 감소. 라호르·카라치 극심 부족." },
  "Bangladesh":               { level:2, ws:19, label:"Low-Medium",  note:"갠지스·브라마푸트라 하류. 홍수는 많으나 건기 부족." },
  "Sri Lanka":                { level:2, ws:18, label:"Low-Medium",  note:"몬순 의존, 건기 북부 High." },
  "Nepal":                    { level:2, ws:15, label:"Low-Medium",  note:"히말라야 빙하수 풍부." },
  "Bhutan":                   { level:1, ws:6,  label:"Low",         note:"히말라야 빙하수 최대 보유." },

  // ── 동남아시아 ────────────────────────────────
  "China":                    { level:4, ws:55, label:"High",        note:"화북평야·황하유역 Extremely High(전체 DC의 40% 집중). 장강 이남 중간. 수자원 남북 극심한 불균형." },
  "Japan":                    { level:3, ws:26, label:"Medium-High", note:"전반 중간. 계절 변동 큼. 도쿄 하계 폭염 시 냉각수 수요 급증." },
  "South Korea":              { level:3, ws:33, label:"Medium-High", note:"한강·낙동강 의존. 서울 수도권 DC 집중. 여름 폭염 시 수계 부하 증가." },
  "North Korea":              { level:3, ws:28, label:"Medium-High", note:"두만강·압록강 공유." },
  "Taiwan":                   { level:3, ws:29, label:"Medium-High", note:"섬 특성상 갈수기 저수지 의존. 타이중 반도체 클러스터 수자원 분쟁 이슈." },
  "Hong Kong":                { level:3, ws:35, label:"Medium-High", note:"광동성 동강(East River) 80% 의존. 수입 의존 취약." },
  "Mongolia":                 { level:2, ws:18, label:"Low-Medium",  note:"셀렝게강 유역. 사막화 진행." },
  "Vietnam":                  { level:2, ws:17, label:"Low-Medium",  note:"메콩·홍강 유역. 상류 댐 건설로 하류 염수화 우려." },
  "Thailand":                 { level:3, ws:28, label:"Medium-High", note:"짜오프라야 유역 Bangkok 건기 부족. 방콕 DC 클러스터 확대 주의." },
  "Myanmar":                  { level:2, ws:14, label:"Low-Medium",  note:"이라와디강 유역 풍부." },
  "Cambodia":                 { level:1, ws:9,  label:"Low",         note:"메콩·톤레삽 유역." },
  "Laos":                     { level:1, ws:8,  label:"Low",         note:"메콩강 상류 댐 국가." },
  "Malaysia":                 { level:2, ws:12, label:"Low-Medium",  note:"적도 강수 풍부. 조호르 DC 클러스터 수자원 상대적 양호." },
  "Singapore":                { level:3, ws:35, label:"Medium-High", note:"소도시국가 담수 전량 말레이시아 수입+자체 재이용. NEWater로 대응하나 취약성 내재." },
  "Indonesia":                { level:2, ws:15, label:"Low-Medium",  note:"적도 강수 풍부. 자카르타 지하수 과잉 추출 지반침하 문제." },
  "Philippines":              { level:2, ws:16, label:"Low-Medium",  note:"태풍 영향권. 마닐라 건기 부족." },
  "Papua New Guinea":         { level:1, ws:4,  label:"Low",         note:"열대우림 담수 풍부." },

  // ── 오세아니아 ────────────────────────────────
  "Australia":                { level:4, ws:49, label:"High",        note:"퍼스·애들레이드 High, 시드니·멜버른 Medium-High. 내륙 사막 Extremely High. DC 시드니·멜버른 집중 지역 상대적 관리 가능." },
  "New Zealand":              { level:2, ws:11, label:"Low-Medium",  note:"남섬 빙하수 풍부. 북섬 오클랜드 중간." },

  // ── 터키·코카서스 ─────────────────────────────
  "Turkey":                   { level:4, ws:52, label:"High",        note:"아나톨리아 내륙 High. 이스탄불 수자원 제한. DC 입지 시 수계 검토 필수." },
  "Türkiye":                  { level:4, ws:52, label:"High",        note:"아나톨리아 내륙 High. 이스탄불 수자원 제한." },
  "Armenia":                  { level:4, ws:67, label:"High",        note:"세반호 수위 저하 진행." },
  "Azerbaijan":               { level:3, ws:38, label:"Medium-High", note:"쿠라강 중간." },
  "Georgia":                  { level:2, ws:14, label:"Low-Medium",  note:"코카서스 수계 풍부." },

  // ── 기타 ──────────────────────────────────────
  "Malta":                    { level:5, ws:96, label:"Extremely High", note:"지중해 도서. 해수담수화 100% 의존." },
  "Cuba":                     { level:3, ws:26, label:"Medium-High", note:"카리브해 도서." },
  "Haiti":                    { level:3, ws:38, label:"Medium-High", note:"히스파니올라 서부 삼림 파괴로 급격한 수자원 감소." },
  "Jamaica":                  { level:3, ws:27, label:"Medium-High", note:"카리브해 도서." },
};

// 국가명 별칭 처리 (TopoJSON 표기 차이 대응)
const WATER_RISK_ALIASES = {
  "United States of America": "United States of America",
  "United States":            "United States of America",
  "USA":                      "United States of America",
  "UK":                       "United Kingdom",
  "UAE":                      "United Arab Emirates",
  "Russia":                   "Russia",
  "South Korea":              "South Korea",
  "Republic of Korea":        "South Korea",
  "Korea":                    "South Korea",
  "Czech Republic":           "Czech Republic",
  "Czechia":                  "Czech Republic",
  "Turkey":                   "Turkey",
  "Türkiye":                  "Turkey",
  "Democratic Republic of the Congo": "Democratic Republic of the Congo",
  "DR Congo":                 "Democratic Republic of the Congo",
  "DRC":                      "Democratic Republic of the Congo",
  "Congo DRC":                "Democratic Republic of the Congo",
  "Congo, Dem. Rep.":         "Democratic Republic of the Congo",
};

function lookupWaterRisk(countryName) {
  if (!countryName) return null;
  const resolved = WATER_RISK_ALIASES[countryName] || countryName;
  return WATER_RISK_DATA[resolved] || WATER_RISK_DATA[countryName] || null;
}

const WATER_RISK_COLORS = {
  5: '#991b1b',  // Extremely High — 짙은 빨강
  4: '#c2410c',  // High — 주황
  3: '#a16207',  // Medium-High — 황갈
  2: '#1d4ed8',  // Low-Medium — 파랑
  1: '#1e3a8a',  // Low — 짙은 파랑
};
const WATER_RISK_LABELS = {
  5: '극심 (>80%)',
  4: '높음 (40-80%)',
  3: '중간 (20-40%)',
  2: '낮음 (10-20%)',
  1: '양호 (<10%)',
};
const WATER_RISK_BG = {
  5: 'rgba(153,27,27,0.18)',
  4: 'rgba(194,65,12,0.18)',
  3: 'rgba(161,98,7,0.18)',
  2: 'rgba(29,78,216,0.18)',
  1: 'rgba(30,58,138,0.18)',
};
