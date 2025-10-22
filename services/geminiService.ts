import type { ChatMessage } from '../types';

// Map our app's message format to the Gemini API's history format.
const mapHistoryForGemini = (messages: ChatMessage[]) => {
    // Exclude the last message which is the current user prompt.
    const historyMessages = messages.slice(0, -1);
    
    // The very first message is the system's welcome message, which shouldn't be in the history.
    const startIndex = historyMessages[0]?.id === 'welcome-message' ? 1 : 0;

    return historyMessages.slice(startIndex).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
};

export async function streamChatResponse(
    // The full history including the latest user message
    messageHistory: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
) {
    const currentMessage = messageHistory[messageHistory.length - 1]?.text;
    if (!currentMessage) {
        onError("Cannot send an empty message.");
        return;
    }

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: mapHistoryForGemini(messageHistory),
                message: currentMessage,
            }),
        });

        if (!response.ok || !response.body) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.statusText} (${response.status}) - ${errorText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            onChunk(decoder.decode(value, { stream: true }));
        }
        onComplete();

    } catch (error) {
        console.error("Failed to stream chat response:", error);
        onError(error instanceof Error ? error.message : "An unknown error occurred while contacting the server.");
    }
}
