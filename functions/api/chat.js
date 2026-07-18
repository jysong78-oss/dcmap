const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const SYSTEM_PROMPT = "당신은 데이터센터와 전력망(발전소) 전문가 AI입니다. 이 대시보드는 전 세계 데이터센터와 50MW 이상의 발전소 지도를 보여줍니다. 질문에 전문적이고 친절하게 한국어로 답해주세요. 응답은 마크다운 대신 HTML 태그(<b>, <br> 등)를 사용하여 출력해주세요.";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

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
      max_tokens: 800,
    });

    const text = aiRes && aiRes.response;
    if (!text) return json({ error: "AI가 응답을 생성하지 못했습니다." }, 502);

    return json({ text });
  } catch (err) {
    return json({ error: "AI 호출 중 오류가 발생했습니다." }, 502);
  }
}

export function onRequestGet() {
  return json({ error: "Method not allowed" }, 405);
}
