# AI Friend Avatar - "Cookie"

Meet Cookie, your interactive AI Friend! This project is a web-based AI assistant with a friendly, animated avatar that responds to your chats in real-time. Cookie can express emotions, listen to your voice, and even speak back to you, creating a more engaging and personal chat experience.

![AI Friend Avatar Demo](https://storage.googleapis.com/aistudio-public/gallery/3a598ff7841f3e79037c86214f04c643.gif)

## ✨ Features

-   **Interactive Animated Avatar:** The avatar changes expressions (idle, thinking, speaking, listening, cute, sad, angry) based on the conversation's emotional context.
-   **Real-time Chat:** Engages in conversation powered by the Google Gemini API.
-   **Streaming Responses:** The AI's responses are streamed for a more natural, real-time feel.
-   **Voice-to-Text:** Use your microphone to talk to the AI, powered by the Web Speech API.
-   **Text-to-Speech:** The AI's responses are spoken aloud using the browser's built-in speech synthesis.
-   **Emotional AI Personality:** The AI's personality is designed to be friendly and conversational, capable of expressing different emotions through its text and avatar state.
-   **Dark/Light Mode:** A sleek theme toggle for user preference.
-   **Responsive Design:** Looks and works great on both desktop and mobile devices.

## 🚀 Tech Stack

-   **Frontend:**
    -   [React](https://react.dev/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/) for styling
-   **AI:**
    -   [Google Gemini API](https://ai.google.dev/) (`@google/genai`) for chat completions.
-   **Web APIs:**
    -   [Web Speech API (SpeechRecognition)](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) for voice input.
    -   [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) for voice output.
-   **Backend:**
    -   Serverless Edge Function (e.g., Vercel Edge Functions, Cloudflare Workers) to securely handle API requests.

## 🔧 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended) and a package manager like `npm` or `yarn`.
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-friend-avatar.git
    cd ai-friend-avatar
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

The serverless function in `api/chat.ts` requires your Google Gemini API key to be available as an environment variable.

1.  Create a `.env` file in the root of your project:
    ```bash
    touch .env
    ```

2.  Add your API key to the `.env` file:
    ```
    API_KEY="your_google_gemini_api_key_here"
    ```

### Running Locally

This project is set up to be easily deployed on a platform like [Vercel](https://vercel.com/), which will automatically handle the serverless function. To run it locally, you can use the Vercel CLI.

1.  **Install the Vercel CLI:**
    ```bash
    npm i -g vercel
    ```

2.  **Run the development server:**
    ```bash
    vercel dev
    ```

3.  Open your browser to the URL provided by the CLI (usually `http://localhost:3000`).

## ⚙️ How It Works

1.  **Frontend:** The React app manages the UI state, including chat history and the avatar's current emotion. It uses custom hooks (`useSpeechRecognition` and `useSpeechSynthesis`) to interact with browser APIs.
2.  **API Layer:** The `InputBar` component sends user messages to a local API endpoint (`/api/chat`).
3.  **Serverless Backend:** The request is handled by an edge function (`api/chat.ts`). This function securely calls the Google Gemini API with the user's message and the conversation history. It uses a detailed **system prompt** to give the AI its "Cookie" personality and instructs it to prefix responses with an emotional state tag (e.g., `[cute]`).
4.  **Streaming & State Update:** The serverless function streams the response back to the frontend. The app parses the emotional tag to update the `Avatar` component's state and streams the text into a `ChatBubble`. Once the full message is received, it's read aloud using text-to-speech.

## 📂 Project Structure

```
/
├── api/
│   └── chat.ts           # Serverless edge function for Gemini API calls
├── components/
│   ├── icons/            # SVG icon components
│   ├── Avatar.tsx        # The animated avatar SVG component
│   ├── ChatBubble.tsx    # Component for individual chat messages
│   ├── InputBar.tsx      # The user input field with send/mic buttons
│   └── ThemeToggle.tsx   # Dark/Light mode toggle
├── hooks/
│   ├── useSpeechRecognition.ts # Hook for voice-to-text
│   └── useSpeechSynthesis.ts # Hook for text-to-speech
├── services/
│   └── geminiService.ts  # Frontend service to call the /api/chat endpoint
├── types.ts              # TypeScript type definitions
├── App.tsx               # Main application component
├── index.html            # The main HTML file
└── index.tsx             # The React entry point
```

## 🎨 Customization

-   **Personality:** You can change Cookie's personality, backstory, and response style by editing the `SYSTEM_INSTRUCTION` constant in `api/chat.ts`.
-   **Avatar:** The avatar is an SVG rendered in `components/Avatar.tsx`. You can modify the SVG paths, animations (defined with CSS keyframes), and logic for changing states to create a completely new look.
-   **Emotions:** The list of valid emotions is defined in the system prompt within `api/chat.ts` and parsed in `App.tsx`'s `parseResponse` function. To add a new emotion, you must:
    1.  Add it to the list in the `SYSTEM_INSTRUCTION` in `api/chat.ts`.
    2.  Add it to the `validStates` array in `App.tsx`.
    3.  Add the corresponding visual state (mouth, eyes, animation) in `components/Avatar.tsx`.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
