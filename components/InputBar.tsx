import React, { useState, useRef, useEffect } from 'react';
import { MicIcon } from './icons/MicIcon';
import { SendIcon } from './icons/SendIcon';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  onToggleListening: () => void;
  isListening: boolean;
  isLoading: boolean;
  isMicSupported: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  onToggleListening,
  isListening,
  isLoading,
  isMicSupported,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const micButtonClasses = isListening
    ? 'bg-red-500 text-white animate-pulse'
    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500';

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-colors duration-300">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isListening ? "Listening..." : "Say something..."}
        className="flex-grow bg-transparent px-4 py-2 text-gray-700 dark:text-gray-200 outline-none disabled:opacity-50 dark:placeholder:text-gray-400"
        disabled={isLoading || isListening}
      />
      {isMicSupported && (
        <button
          type="button"
          onClick={onToggleListening}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${micButtonClasses}`}
          disabled={isLoading}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          <MicIcon className="w-5 h-5" />
        </button>
      )}
      <button
        type="submit"
        className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 disabled:bg-blue-300 dark:disabled:bg-blue-800/50"
        disabled={isLoading || !text.trim()}
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};