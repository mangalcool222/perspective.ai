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

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 w-full">
      {modes.map((modeKey) => {
        const mode = ROOM_MODES[modeKey];
        const isSelected = selectedMode === modeKey;

        return (
          <button
            key={modeKey}
            type="button"
            onClick={() => onSelectMode(modeKey)}
            className={`relative flex flex-col justify-between rounded-xl p-3.5 text-left transition-all border ${
              isSelected
                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                : 'border-neutral-200/90 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl">{mode.icon}</span>
                {isSelected ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-neutral-900">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.2">
                    {mode.badge}
                  </span>
                )}
              </div>
              <h4 className={`mt-2 font-medium text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                {mode.title}
              </h4>
              <p className={`mt-1 text-[11px] leading-snug ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                {mode.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
