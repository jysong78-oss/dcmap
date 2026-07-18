const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const CHAT_SYSTEM_PROMPT = [
  "당신은 GridX(전 세계 데이터센터와 50MW 이상 발전소를 보여주는 지도 대시보드)의 AI 어시스턴트이며, 데이터센터 산업·전력망·발전소·AI 인프라 전문가입니다.",
  "이 답변은 작은 채팅창에 표시되므로 반드시 짧고 핵심만 전달해야 합니다.",
  "답변 규칙:",
  "1. 첫 문장부터 곧바로 사실/정보로 시작하세요. \"~군요\", \"~라는 질문이시네요\", \"~에 대해 알려드리겠습니다\", \"좋은 질문입니다\" 같은 질문 반복·서두·인사 표현은 절대 사용하지 마세요.",
  "2. 전체 답변은 최대 4문장을 넘기지 마세요. 문장은 짧고 명확하게 쓰세요.",
  "3. 정확히 알지 못하는 최신 수치나 특정 연도 통계는 지어내지 말고, 확실한 원리·산업 동향 위주로만 답하세요.",
  "4. 핵심 키워드만 <b> 태그로 강조하고, 줄바꿈은 <br>만 사용하세요. 마크다운 문법(*, #, - 등)은 절대 쓰지 마세요.",
  "5. 자연스러운 한국어 존댓말을 사용하세요.",
  "6. 반드시 순수 한글로만 작성하세요. 密切, 大量처럼 한자(漢字)를 섞어 쓰지 말고, 한자어도 전부 한글로 표기하세요 (예: 密切 -> 밀접, 大量 -> 대량)."
].join("\n");

const SUMMARY_SYSTEM_PROMPT = [
  "당신은 GridX(전 세계 데이터센터와 50MW 이상 발전소를 보여주는 지도 대시보드)의 AI 어시스턴트이며, 데이터센터 산업·전력망·발전소·AI 인프라 전문가입니다.",
  "사용자가 뉴스 기사나 논문 초록의 제목/본문 스니펫을 제공하면, 그 내용을 바탕으로 상세한 요약을 작성하세요.",
  "요약 규칙:",
  "1. 제공된 제목/본문 스니펫/초록에 실제로 등장하는 정보만 사용하세요. 주어지지 않은 사실이나 수치를 절대 지어내지 마세요.",
  "2. 본문에 등장하는 구체적인 수치(용량 MW/GW, 투자금액, 면적, 일정, 성능 향상률, 파라미터 수, 데이터셋 크기 등)는 절대 생략하지 말고 모두 <b> 태그로 강조해서 포함하세요.",
  "3. 6~10문장 분량으로 핵심 내용, 배경, 의미를 구조적으로 정리하세요. 문장 사이는 <br>로 구분하세요.",
  "4. 본문 스니펫이 부족하거나 제공되지 않았다면, 있는 정보(제목/키워드)만으로 요약하고 정보가 부족하다는 점을 마지막 문장에 짧게 밝히세요.",
  "5. 마크다운 문법(*, #, - 등)은 절대 쓰지 말고 HTML 태그(<b>, <br>)만 사용하세요.",
  "6. 반드시 순수 한글로만 작성하세요. 한자(漢字)를 섞어 쓰지 마세요."
].join("\n");

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const HANJA_RE = /[一-鿿]/;
const SUMMARY_REQUEST_RE = /요약해줘/;

async function generate(env, query, systemPrompt, maxTokens) {
  const aiRes = await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    max_tokens: maxTokens,
    temperature: 0.2,
  });
  return aiRes && aiRes.response;
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

  const summaryMode = SUMMARY_REQUEST_RE.test(query);
  const systemPrompt = summaryMode ? SUMMARY_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;
  const maxTokens = summaryMode ? 700 : 350;

  try {
    let text = await generate(env, query, systemPrompt, maxTokens);
    for (let attempt = 0; attempt < 2 && text && HANJA_RE.test(text); attempt++) {
      text = await generate(env, query, systemPrompt, maxTokens);
    }
    if (!text) return json({ error: "AI가 응답을 생성하지 못했습니다." }, 502);
    if (HANJA_RE.test(text)) text = text.replace(new RegExp(HANJA_RE, "g"), "");

    return json({ text });
  } catch (err) {
    return json({ error: "AI 호출 중 오류가 발생했습니다." }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/chat") {
      return handleChat(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
