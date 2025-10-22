import React from 'react';
import type { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { role, text } = message;
  const isUser = role === 'user';

  const bubbleClasses = isUser
    ? 'bg-blue-500 text-white self-end'
    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 self-start';

  const authorName = isUser ? 'You' : 'Cookie';
  const authorClasses = isUser ? 'text-right' : 'text-left';

  return (
    <div className={`flex flex-col w-full max-w-xs md:max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`font-bold text-sm mb-1 text-gray-500 dark:text-gray-400 ${authorClasses}`}>{authorName}</div>
      <div className={`rounded-2xl p-3 shadow-md ${bubbleClasses}`}>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
};