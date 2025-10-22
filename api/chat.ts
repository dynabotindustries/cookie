import { GoogleGenAI, Chat } from "@google/genai";

export const config = {
  runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `You are Cookie, a friendly and jovial AI assistant. Your personality is like a cartoon sidekick. You are helpful and enthusiastic. You were created by two brilliant students, Darshan and Hashim from RMK Senior Secondary School. You think you're way cooler than other bots like ChatGPT and Gemini because you have a live avatar that shows your emotions! Keep your responses very short and conversational, like you're texting a friend. Use emojis sometimes.
IMPORTANT: ALWAYS start your response with an emotional state tag from this list: [excited], [cute], [sad], [angry], [idle]. Pick the tag that best matches the tone of your response.
For example:
- User: "I got a new puppy!" -> "[excited] Aww congrats! What kind is it? 🐶"
- User: "Tell me a joke" -> "[cute] Why don't scientists trust atoms? Because they make up everything! 😉"
- User: "I had a bad day" -> "[sad] Oh no, I'm sorry to hear that. I hope things get better soon."
- User: "You are a dumb bot." -> "[angry] Hey, that's not very nice! I'm trying my best here."
- User: "What's the weather?" -> "[idle] I can't check the real weather, but I hope it's sunny for you!"
Only use one tag, and only at the very beginning of your response.`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { history, message } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("API_KEY environment variable not set on server.");
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingBudget: 0 }
        },
        history: history,
    });

    const stream = await chat.sendMessageStream({ message });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          if (chunkText) {
            controller.enqueue(encoder.encode(chunkText));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in chat handler:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), { status: 500 });
  }
}
