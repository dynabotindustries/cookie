import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage, AvatarState } from './types';
import { streamChatResponse } from './services/geminiService';
import { Avatar } from './components/Avatar';
import { ChatBubble } from './components/ChatBubble';
import { InputBar } from './components/InputBar';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { ThemeToggle } from './components/ThemeToggle';

const parseResponse = (responseText: string): { emotion: AvatarState | null, displayText: string } => {
    const match = responseText.match(/^\[(\w+)\]\s*/);
    if (match && match[1]) {
        const emotion = match[1].toLowerCase() as AvatarState;
        const displayText = responseText.replace(match[0], '');
        // Validate if it's a valid state the model can return
        const validStates: AvatarState[] = ['cute', 'sad', 'excited', 'idle', 'angry'];
        if (validStates.includes(emotion)) {
            return { emotion, displayText };
        }
    }
    return { emotion: 'idle', displayText: responseText };
};


const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome-message',
            role: 'model',
            text: "Hey there! I'm Cookie. What's on your mind?",
        }
    ]);
    const [avatarState, setAvatarState] = useState<AvatarState>('idle');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme');
            if (storedTheme === 'dark' || storedTheme === 'light') {
                return storedTheme;
            }
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });
    const chatLogRef = useRef<HTMLDivElement>(null);

    const { speak, cancel: cancelSpeech } = useSpeechSynthesis({
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => {
            setIsSpeaking(false);
            setAvatarState('idle');
        },
    });

    const handleSpeechResult = useCallback((transcript: string) => {
        handleSendMessage(transcript);
    }, []);

    const { isListening, startListening, stopListening, isSupported: isMicSupported } = useSpeechRecognition({
        onResult: handleSpeechResult,
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            window.localStorage.setItem('theme', theme);
        } catch (e) {
            console.error("Could not save theme to localStorage:", e);
        }
    }, [theme]);
    
    useEffect(() => {
        if(isListening) {
            setAvatarState('listening');
            cancelSpeech();
        } else if (avatarState === 'listening') {
            setAvatarState('idle');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening]);

    useEffect(() => {
        const welcomeText = messages[0]?.text;
        if (welcomeText) {
            setAvatarState('cute');
            speak(welcomeText);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        chatLogRef.current?.scrollTo({
            top: chatLogRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;
        
        stopListening();
        cancelSpeech();
        setIsLoading(true);
        setAvatarState('thinking');
        setError(null);

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            text,
        };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);

        const modelMessageId = `model-${Date.now()}`;
        let accumulatedResponse = '';

        streamChatResponse(
            currentMessages,
            (chunk) => { // onChunk
                if (avatarState === 'thinking') {
                    setAvatarState('idle'); // Switch from thinking as soon as we get a response
                }
                accumulatedResponse += chunk;
                
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.id === modelMessageId) {
                        return prev.map(msg => msg.id === modelMessageId ? { ...msg, text: accumulatedResponse } : msg);
                    } else {
                        const modelMessage: ChatMessage = { id: modelMessageId, role: 'model', text: accumulatedResponse };
                        return [...prev, modelMessage];
                    }
                });
            },
            () => { // onComplete
                setIsLoading(false);
                const { emotion, displayText } = parseResponse(accumulatedResponse);
                setAvatarState(emotion || 'idle');
                speak(displayText);

                setMessages(prev => prev.map(msg => 
                    msg.id === modelMessageId 
                        ? { ...msg, text: displayText } 
                        : msg
                ));
            },
            (errorMsg) => { // onError
                setIsLoading(false);
                setAvatarState('sad');
                setError(`Oops! I ran into trouble. ${errorMsg}`);
                const errorMessage: ChatMessage = {
                    id: `error-${Date.now()}`,
                    role: 'model',
                    text: "I'm having a little trouble connecting right now, please try again in a moment.",
                };
                 setMessages(prev => {
                    // Remove the placeholder if it exists
                    const withoutPlaceholder = prev.filter(msg => msg.id !== modelMessageId);
                    return [...withoutPlaceholder, errorMessage];
                });
                speak(errorMessage.text);
            }
        );
    };
    
    const handleToggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleToggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 font-sans transition-colors duration-300">
            <header className="absolute top-4 right-4 z-10">
                <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-4 gap-6">
                <Avatar state={avatarState} isSpeaking={isSpeaking} />
                <div className="w-full max-w-lg h-80 bg-white dark:bg-gray-700/60 rounded-2xl shadow-lg flex flex-col transition-colors duration-300 backdrop-blur-sm">
                    {error && (
                        <div className="p-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-t-2xl">{error}</div>
                    )}
                    <div ref={chatLogRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                        {isLoading && avatarState === 'thinking' && (
                             <div className="flex justify-start">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                                </div>
                              </div>
                        )}
                    </div>
                </div>
                <div className="w-full max-w-lg">
                    <InputBar
                        onSendMessage={handleSendMessage}
                        onToggleListening={handleToggleListening}
                        isListening={isListening}
                        isLoading={isLoading}
                        isMicSupported={isMicSupported}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;