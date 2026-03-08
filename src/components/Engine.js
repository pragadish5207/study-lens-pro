import { CreateMLCEngine } from "@mlc-ai/web-llm";

let engine;

export const initEngine = async (onProgress) => {
  // Switching to Phi-3-mini: Smaller, faster, and officially supported
  const selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC";
  
  engine = await CreateMLCEngine(selectedModel, {
    initProgressCallback: onProgress,
  });
  return engine;
};

export const getAIResponse = async (messages, studyContext) => {
  const systemPrompt = `
    You are 'Study-Lens Pro'. Use this context: ${studyContext}
    
    STRICT RULES:
    1. Explain like teaching a fresher (simple).
    2. Prefer practical sums over theory.
    3. For sums, give 3 levels: Easy, Medium, Hard. Give ONE sum at a time.
    4. FOR THEORY: Provide a 'Very Hard' (detailed) level.
    5. NEXT RULE: Do NOT move to a new topic unless the user says 'Next'.
  `;

  const fullMessages = [
    { role: "system", content: systemPrompt },
    ...messages
  ];

  const reply = await engine.chat.completions.create({ messages: fullMessages });
  return reply.choices[0].message.content;
};