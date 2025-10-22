import React from 'react';
import type { AvatarState } from '../types';

interface AvatarProps {
  state: AvatarState;
  isSpeaking: boolean;
}

const Eye: React.FC<{ cx: number; cy: number; state: AvatarState }> = ({ cx, cy, state }) => {
    const isBlinking = state === 'idle' || state === 'cute';
    const eyeTransform = {
        sad: 'scaleY(0.7) translateY(10px)',
        sobbing: 'scaleY(0.7) translateY(10px)',
        excited: 'scaleY(1.1)',
        cute: 'scaleY(1)',
        angry: 'rotate(-15deg) scaleY(0.9) translateY(5px)',
    }[state] || 'scaleY(1)';

    return (
      <ellipse
        cx={cx}
        cy={cy}
        rx="12"
        ry="18"
        className={`fill-black transition-transform duration-300 ${isBlinking ? 'animate-blink' : ''}`}
        style={{ transform: eyeTransform, transformOrigin: `${cx}px ${cy}px` }}
      />
    );
};

const Tear: React.FC<{ x: number, y: number }> = ({ x, y }) => (
    <path
      d={`M ${x} ${y} q -10 10, 0 20 q 10 10, 0 -20 Z`}
      className="fill-cyan-600 animate-drip"
    />
);

const CoquetteBow: React.FC = () => (
    <g transform="translate(104, 5)" className="transition-opacity duration-300">
        <path d="M0 12 C10 0, 30 0, 40 12 L20 20 Z" fill="#FFC0CB" stroke="black" strokeWidth="6" strokeLinejoin="round" />
        <path d="M48 12 C38 0, 18 0, 8 12 L28 20 Z" fill="#FFC0CB" stroke="black" strokeWidth="6" strokeLinejoin="round" transform="scale(-1, 1) translate(-48, 0)" />
        <circle cx="24" cy="16" r="6" fill="#FFC0CB" stroke="black" strokeWidth="5" />
    </g>
);

const Mouth: React.FC<{ state: AvatarState; isSpeaking: boolean }> = ({ state, isSpeaking }) => {
    const currentState = isSpeaking ? 'speaking' : state;

    const mouthPaths: Partial<Record<AvatarState | 'speaking', string>> = {
        idle: "M 100 160 Q 128 175 156 160",
        thinking: "M 100 165 H 156",
        speaking: "M 110 155 Q 128 180 146 155 Z",
        listening: "M 100 160 Q 128 165 156 160",
        excited: "M 100 155 A 28 35 0 0 0 156 155 Z",
        cute: "M 115 160 C 121.5 170, 134.5 170, 141 160",
        sad: "M 100 170 Q 128 155 156 170",
        sobbing: "M 105 170 C 115 160, 141 160, 151 170 Q 128 185 105 170 Z",
        angry: "M 100 175 Q 128 140 156 175",
    };

    const d = mouthPaths[currentState] || mouthPaths.idle!;

    return (
        <path
        d={d}
        className="fill-none stroke-black stroke-[8px] transition-all duration-300 ease-in-out"
        strokeLinecap="round"
        />
    );
};

export const Avatar: React.FC<AvatarProps> = ({ state, isSpeaking }) => {
    const bodyAnimationClass = {
        thinking: 'animate-thinking-strong',
        listening: 'animate-listening-sway',
        excited: 'animate-excited-bounce',
        sad: 'animate-sad-droop',
        sobbing: 'animate-sad-droop',
        angry: 'animate-angry-shake',
    }[state] || '';

    return (
        <div className="relative w-48 h-48">
        <style>{`
            @keyframes blink {
            0%, 95%, 100% { transform: scaleY(1); }
            97.5% { transform: scaleY(0.1); }
            }
            .animate-blink {
            animation: blink 5s infinite;
            }
            @keyframes thinking-pulse-strong {
                0%, 100% { transform: scale(1, 1); }
                50% { transform: scale(1.05, 0.95) translateY(5px); }
            }
            .animate-thinking-strong {
                animation: thinking-pulse-strong 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes listening-sway {
                0%, 100% { transform: rotate(-1deg) translateX(-2px); }
                50% { transform: rotate(1deg) translateX(2px); }
            }
            .animate-listening-sway {
                animation: listening-sway 3s ease-in-out infinite;
            }
            @keyframes excited-bounce {
                0%, 100% { transform: translateY(0) rotate(0); }
                25% { transform: translateY(-8px) rotate(3deg); }
                50% { transform: translateY(0) rotate(-3deg); }
                75% { transform: translateY(-4px) rotate(2deg); }
            }
            .animate-excited-bounce {
                animation: excited-bounce 0.8s ease-in-out;
            }
            @keyframes sad-droop {
                0% { transform: translateY(0) scale(1); }
                100% { transform: translateY(5px) scale(0.98, 1.02); }
            }
            .animate-sad-droop {
                transform-origin: bottom center;
                animation: sad-droop 0.5s ease-out forwards;
            }
            @keyframes drip {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(40px); opacity: 0; }
            }
            .animate-drip {
                animation: drip 1.5s linear infinite;
                animation-delay: 0.5s;
            }
            @keyframes angry-shake {
                0%, 100% { transform: translateX(0) rotate(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-2px) rotate(-1deg); }
                20%, 40%, 60%, 80% { transform: translateX(2px) rotate(1deg); }
            }
            .animate-angry-shake {
                animation: angry-shake 0.5s linear infinite;
            }
        `}</style>
        <svg viewBox="0 0 256 256" className="w-full h-full" style={{ overflow: 'visible' }}>
            {/* Shadow */}
            <ellipse cx="128" cy="235" rx="70" ry="15" className="fill-gray-300 dark:fill-gray-900/50 transition-colors duration-300" />

            {/* Body */}
            <g className={bodyAnimationClass}>
                <ellipse
                cx="128"
                cy="128"
                rx="90"
                ry="110"
                className="fill-cyan-400 transition-all duration-300"
                />
            </g>
            
            {/* Face */}
            {state === 'cute' && <CoquetteBow />}
            <Eye cx={100} cy={120} state={state} />
            <Eye cx={156} cy={120} state={state} />
            {(state === 'sad' || state === 'sobbing') && <Tear x={110} y={140} />}
            <Mouth state={state} isSpeaking={isSpeaking} />
        </svg>
        </div>
    );
};