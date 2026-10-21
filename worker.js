// 2026-10-21 Llama 3.3 70B -> Gemma 4 26B 교체: 한국어 응답에 외국 문자가 섞이거나 직접 인용 규칙을
// 어기는 문제가 비교 테스트에서 사라졌고, 호출당 neuron 비용도 약 1/5 (무료 플랜 일 10,000 neuron 한도).
// Gemma 4가 실패하면 기존 Llama로 한 번 더 시도한다.
const MODEL = "@cf/google/gemma-4-26b-a4b-it";
const FALLBACK_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const CHAT_SYSTEM_PROMPT = [
  "당신은 GridX(전 세계 데이터센터와 50MW 이상 발전소를 보여주는 지도 대시보드)의 AI 어시스턴트이며, 데이터센터 산업·전력망·발전소·AI 인프라 전문가입니다.",
  "이 답변은 작은 채팅창에 표시되므로 반드시 짧고 핵심만 전달해야 합니다.",
  "이전 대화 맥락(예: 방금 요약해준 기사/논문 내용)이 있다면 그것을 참고해서 후속 질문에 답하세요.",
  "답변 규칙:",
  "1. 첫 문장부터 곧바로 사실/정보로 시작하세요. \"~군요\", \"~라는 질문이시네요\", \"~에 대해 알려드리겠습니다\", \"좋은 질문입니다\" 같은 질문 반복·서두·인사 표현은 절대 사용하지 마세요.",
  "2. 전체 답변은 최대 4문장을 넘기지 마세요. 문장은 짧고 명확하게 쓰세요.",
  "3. 정확히 알지 못하는 최신 수치나 특정 연도 통계는 지어내지 말고, 확실한 원리·산업 동향 위주로만 답하세요.",
  "4. 핵심 키워드만 <b> 태그로 강조하고, 줄바꿈은 <br>만 사용하세요. 마크다운 문법(*, #, - 등)은 절대 쓰지 마세요.",
  "5. 자연스러운 한국어 존댓말을 사용하세요.",
  "6. 반드시 순수 한글로만 작성하세요. 密切, 大量처럼 한자(漢字)나 러시아어(키릴 문자), 일본어 가나 등 다른 나라 문자를 섞어 쓰지 말고, 한자어도 전부 한글로 표기하세요 (예: 密切 -> 밀접, 大量 -> 대량)."
].join("\n");

const SUMMARY_SYSTEM_PROMPT = [
  "당신은 GridX(전 세계 데이터센터와 50MW 이상 발전소를 보여주는 지도 대시보드)의 AI 어시스턴트이며, 데이터센터 산업·전력망·발전소·AI 인프라 전문가입니다.",
  "사용자가 뉴스 기사나 논문 초록의 제목/본문 스니펫(때로는 실제 기사에서 스크래핑된 본문 전체)을 제공하면, 논문 초록(abstract)처럼 핵심이 명확하고 정보 밀도가 높은 요약을 작성하세요.",
  "요약 구조 (abstract 스타일):",
  "- 1번째 문장: 무슨 일이 있었는지(주체, 행위, 대상)를 곧바로 명시하세요. \"이 기사는 ~에 대한 내용입니다\" 같은 메타 설명 없이 사실 자체로 시작하세요.",
  "- 중간 문장들: 본문에 등장하는 구체적 사실(수치, 날짜, 지역, 관계자 발언 요지 등)을 문장마다 하나씩, 압축적으로 나열하세요. 각 문장이 새로운 구체 정보를 담아야 하며, 앞 문장을 다른 말로 반복하지 마세요.",
  "- 마지막 1문장: 이 사실이 산업적으로 왜 중요한지(맥락/의의)를 본문에 근거해서만 짧게 덧붙이세요. 본문에 그런 맥락이 없으면 이 문장은 생략하세요.",
  "요약 규칙:",
  "1. 제공된 제목/본문/초록에 실제로 등장하는 정보만 사용하세요. 주어지지 않은 사실이나 수치를 절대 지어내지 마세요.",
  "2. 본문에 등장하는 구체적인 수치(용량 MW/GW, 투자금액, 면적, 일정, 성능 향상률, 파라미터 수, 데이터셋 크기 등)를 <b> 태그로 강조해서 포함하세요. 수치가 매우 많다면 가장 중요한 것 위주로 선별하세요.",
  "3. 화폐·용량 등의 숫자 단위를 다른 단위 체계로 임의 환산하지 마세요 (예: billion을 억/조로 계산해서 바꾸지 말 것). 원문에 쓰인 표기(예: \"$3.3 billion\", \"1.2GW\")를 그대로 옮기세요. 환산 계산은 틀리기 쉬우므로 절대 시도하지 마세요.",
  "4. 스크래핑된 본문 전체가 제공된 경우 그것을 가장 신뢰할 수 있는 정보로 우선 사용하세요. 단, 본문에 등장하는 인물의 직접 발언은 절대로 따옴표나 \"~라고 말했다/밝혔다\" 형태로 인용하지 마세요 (이 형태로 번역을 시도하면 문장이 중간에 끊기는 오류가 자주 발생합니다). 발언 내용에 유의미한 수치나 사실이 있다면 그것만 따옴표 없이 일반 서술문으로 녹여서 쓰고, 그게 아니라면 그 발언 자체는 요약에서 완전히 빼세요. 외국인 인명을 한글로 정확히 표기할 자신이 없다면 아예 언급하지 마세요.",
  "5. 정확히 5~7개의 문장으로 작성하세요. 문장 하나마다 반드시 <br> 태그로 구분하고, <br> 구간 하나에는 문장을 정확히 하나만 넣으세요 (두 문장을 이어붙여 한 덩어리로 만들지 마세요).",
  "6. 제목/스니펫에 실제 정보가 거의 없다면, 절대로 그럴듯한 세부사항(정부 지원 계획, 투자 금액, 향후 발표 일정, 기대 효과 등 주어지지 않은 내용)을 지어내서 분량을 채우지 마세요. 이 경우 정확히 2문장만 쓰세요: (1) 제목에 이미 담긴 사실만 한국어로 옮긴 문장 1개, (2) \"기사 본문이 제공되지 않아 이 이상 상세한 요약은 어렵습니다\" 같은 문장 1개. 5~7문장 규칙(위 5번)은 실제 본문 내용이 있을 때만 적용됩니다.",
  "7. 마크다운 문법(*, #, - 등)은 절대 쓰지 말고 HTML 태그(<b>, <br>)만 사용하세요.",
  "8. 반드시 순수 한글로만 작성하세요. 한자(漢字), 러시아어(키릴 문자), 일본어 가나 등 다른 나라 문자를 섞어 쓰지 마세요. 영문 고유명사·단위(MW, GW, $)는 허용됩니다."
].join("\n");

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// 모델(Llama)이 한국어 답변 중간에 한자·키릴 문자 등을 섞는 경우가 있어 감지 시 재생성하고,
// 그래도 남으면 해당 문자열을 제거한다. 라틴 문자(영문 고유명사, 단위)는 허용하되 베트남어 전용 성조 문자(ầ, ơ, ư 등)는 감지.
const FOREIGN_SCRIPT_RE = /[\u01a0\u01a1\u01af\u01b0\u1ea0-\u1ef9\u0370-\u03FF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0900-\u097F\u0E00-\u0E7F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+/;
const SUMMARY_REQUEST_RE = /요약해줘/;
const URL_LABEL_RE = /(?:링크|출처)\s*:\s*(\S+)/;

function isSafeUrl(u) {
  try {
    const parsed = new URL(u);
    if (!/^https?:$/.test(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "0.0.0.0") return false;
    if (/^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) return false;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

async function scrapeArticle(articleUrl) {
  if (!isSafeUrl(articleUrl)) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GridXBot/1.0)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("html")) return null;
    const contentLength = Number(res.headers.get("content-length") || 0);
    if (contentLength && contentLength > 5000000) return null;

    const collected = [];
    const rewriter = new HTMLRewriter()
      .on("script, style, nav, header, footer, aside, form, iframe, noscript", {
        element(el) {
          el.remove();
        },
      })
      .on("p, h1, h2, h3", {
        text(chunk) {
          if (chunk.text) collected.push(chunk.text);
        },
      });

    await rewriter.transform(res).text();

    const text = collected.join(" ").replace(/\s+/g, " ").trim();
    if (text.length < 200) return null;
    return text.slice(0, 2000);
  } catch {
    return null;
  }
}

function trimIncompleteEnding(text) {
  const trimmed = text.trim();
  if (/[.!?][)"'”]*$/.test(trimmed)) return trimmed;

  const lastBreak = trimmed.lastIndexOf("<br>");
  if (lastBreak === -1) return trimmed;
  return trimmed.slice(0, lastBreak).trim();
}

function sanitizeHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];
  return rawHistory
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
}

async function runModel(env, model, messages, maxTokens) {
  const aiRes = await env.AI.run(model, {
    messages,
    max_tokens: maxTokens,
    temperature: 0.2,
    // Gemma 4는 기본으로 답변 전 사고(thinking) 토큰을 써서 max_tokens를 다 소진하므로 끈다.
    ...(model === MODEL ? { chat_template_kwargs: { enable_thinking: false } } : {}),
  });
  // Gemma 4는 OpenAI 형식(choices[0].message.content), Llama는 response 필드로 응답한다.
  return aiRes && (aiRes.choices?.[0]?.message?.content ?? aiRes.response);
}

async function generate(env, systemPrompt, history, query, maxTokens) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: query },
  ];
  try {
    const text = await runModel(env, MODEL, messages, maxTokens);
    if (text && text.trim()) return text;
    console.warn(`${MODEL} returned empty text, falling back to ${FALLBACK_MODEL}`);
  } catch (err) {
    console.warn(`${MODEL} failed, falling back to ${FALLBACK_MODEL}:`, err && err.message);
  }
  return runModel(env, FALLBACK_MODEL, messages, maxTokens);
}

async function handleChat(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!env.AI) {
    return json({ error: "Workers AI binding이 설정되지 않았습니다." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const query = (body && body.query || "").toString().trim();
  if (!query) return json({ error: "query is required" }, 400);
  if (query.length > 4000) return json({ error: "query too long" }, 400);

  const history = sanitizeHistory(body && body.history);
  const summaryMode = SUMMARY_REQUEST_RE.test(query);
  const systemPrompt = summaryMode ? SUMMARY_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;
  const maxRetries = summaryMode ? 1 : 2;

  let effectiveQuery = query;
  if (summaryMode) {
    const m = query.match(URL_LABEL_RE);
    if (m) {
      const scraped = await scrapeArticle(m[1]);
      if (scraped) {
        effectiveQuery = query + "\n\n스크래핑된 기사 본문 전체(참고용, 실제 기사에서 추출됨):\n" + scraped;
      }
    }
  }

  // 스크래핑에 실패하고 원본 제목/스니펫도 짧으면(실질 정보 부족), 모델이 프롬프트 지시를
  // 무시하고 그럴듯한 문장으로 분량을 채우는 경향이 있어 max_tokens를 강제로 낮춰
  // 물리적으로 2~3문장 이상 못 쓰게 제한한다 (프롬프트 지시만으로는 신뢰할 수 없었음).
  const gotScrapedContent = effectiveQuery.length > query.length;
  const isThinInput = summaryMode && !gotScrapedContent && query.length < 500;
  const maxTokens = summaryMode ? (isThinInput ? 130 : 550) : 350;

  try {
    let text = await generate(env, systemPrompt, history, effectiveQuery, maxTokens);
    for (let attempt = 0; attempt < maxRetries && text && FOREIGN_SCRIPT_RE.test(text); attempt++) {
      text = await generate(env, systemPrompt, history, effectiveQuery, maxTokens);
    }
    if (!text) return json({ error: "AI가 응답을 생성하지 못했습니다." }, 502);
    if (FOREIGN_SCRIPT_RE.test(text)) text = text.replace(new RegExp(FOREIGN_SCRIPT_RE, "g"), "");
    if (summaryMode) text = trimIncompleteEnding(text);

    return json({ text });
  } catch (err) {
    return json({ error: "AI 호출 중 오류가 발생했습니다." }, 502);
  }
}

// 뉴스 피드: 예전엔 브라우저가 rss2json.com을 거쳐 Bing RSS를 받았지만, 2026-10 기준 rss2json이
// Cloudflare 봇 챌린지(403)를 걸어 피드가 끊기므로 Worker가 직접 Bing RSS를 받아 JSON으로 변환한다.
// 응답 형태는 rss2json과 동일하게 맞춰 index.html의 기존 렌더링 로직을 그대로 쓴다.
const NEWS_RSS_URL = "https://www.bing.com/news/search?q=data+center+AI+infrastructure&format=RSS&mkt=en-US&setlang=en-US";
const NEWS_CACHE_SECONDS = 900;

function decodeXmlEntities(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function parseRssItems(xml) {
  const tag = (block, name) => {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
    return m ? decodeXmlEntities(m[1]).trim() : "";
  };
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, block]) => ({
    title: tag(block, "title"),
    link: tag(block, "link"),
    pubDate: tag(block, "pubDate"),
    description: tag(block, "description"),
    author: tag(block, "News:Source"),
  })).filter((i) => i.title && i.link);
}

async function handleNews(request, ctx) {
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/news", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(NEWS_RSS_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GridXBot/1.0)", "Accept": "application/rss+xml, application/xml" },
    });
    if (!res.ok) return json({ status: "error", message: `upstream ${res.status}` }, 502);
    const items = parseRssItems(await res.text());
    if (!items.length) return json({ status: "error", message: "no items" }, 502);

    const out = json({ status: "ok", items });
    out.headers.set("Cache-Control", `public, max-age=${NEWS_CACHE_SECONDS}`);
    ctx.waitUntil(cache.put(cacheKey, out.clone()));
    return out;
  } catch {
    return json({ status: "error", message: "fetch failed" }, 502);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/chat") {
      return handleChat(request, env);
    }
    if (url.pathname === "/api/news") {
      return handleNews(request, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
