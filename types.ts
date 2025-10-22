export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
  id: string;
}

export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'cute' | 'sad' | 'sobbing' | 'excited' | 'error' | 'angry';