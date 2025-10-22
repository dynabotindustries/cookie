
import React from 'react';

interface MicIconProps {
  className?: string;
}

export const MicIcon: React.FC<MicIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM11 5a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V5z" />
    <path d="M12 14a5 5 0 0 0-5 5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a5 5 0 0 0-5-5zM19 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1a1 1 0 0 1 2 0v1a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1a1 1 0 0 1 2 0v1z" />
  </svg>
);
