'use client';

import React from 'react';
import { ROOM_MODES } from '@/lib/constants';
import { RoomMode } from '@/types/perspective';
import { Check } from 'lucide-react';

interface RoomModeSelectorProps {
  selectedMode: RoomMode;
  onSelectMode: (mode: RoomMode) => void;
}

export const RoomModeSelector: React.FC<RoomModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  const modes: RoomMode[] = ['think', 'challenge', 'brainstorm'];

  const getGlowStyle = (modeKey: RoomMode, isSelected: boolean) => {
    if (!isSelected) return 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50 text-zinc-300';
    if (modeKey === 'think') return 'border-cyan-500/80 bg-cyan-950/40 text-cyan-100 shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/50';
    if (modeKey === 'challenge') return 'border-red-500/80 bg-red-950/40 text-red-100 shadow-[0_0_20px_-3px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50';
    return 'border-emerald-500/80 bg-emerald-950/40 text-emerald-100 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50';
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 w-full">
      {modes.map((modeKey) => {
        const mode = ROOM_MODES[modeKey];
        const isSelected = selectedMode === modeKey;

        return (
          <button
            key={modeKey}
            type="button"
            onClick={() => onSelectMode(modeKey)}
            className={`relative flex flex-col justify-between rounded-xl p-4 text-left transition-all border backdrop-blur-md cursor-pointer ${getGlowStyle(
              modeKey,
              isSelected
            )}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{mode.icon}</span>
                {isSelected ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-zinc-950 font-bold">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.2">
                    {mode.badge}
                  </span>
                )}
              </div>
              <h4 className={`mt-2 font-medium text-xs sm:text-sm font-sans ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                {mode.title}
              </h4>
              <p className={`mt-1 text-[11px] leading-snug font-sans ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                {mode.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

