'use client';

import React from 'react';
import { PRESET_EXAMPLES } from '@/lib/constants';
import { PresetExample } from '@/types/perspective';
import { ArrowUpRight } from 'lucide-react';

interface PresetExamplesProps {
  onSelect: (preset: PresetExample) => void;
}

export const PresetExamples: React.FC<PresetExamplesProps> = ({ onSelect }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
        <span>Try a real decision problem:</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {PRESET_EXAMPLES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="group flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-3.5 text-left shadow-2xs transition-all hover:border-neutral-400 hover:shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 border border-neutral-200/60 font-mono">
                {preset.category}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900" />
            </div>
            <p className="mt-2 text-xs font-medium text-neutral-800 line-clamp-2 leading-relaxed">
              &quot;{preset.problem}&quot;
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};


