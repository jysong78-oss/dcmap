const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const SYSTEM_PROMPT = [
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

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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
  if (query.length > 2000) return json({ error: "query too long" }, 400);

  try {
    const aiRes = await env.AI.run(MODEL, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      max_tokens: 350,
      temperature: 0.2,
    });

    const text = aiRes && aiRes.response;
    if (!text) return json({ error: "AI가 응답을 생성하지 못했습니다." }, 502);

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
