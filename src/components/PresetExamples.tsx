'use client';

import React from 'react';
import { PRESET_EXAMPLES } from '@/lib/constants';
import { PresetExample } from '@/types/perspective';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface PresetExamplesProps {
  onSelect: (preset: PresetExample) => void;
}

export const PresetExamples: React.FC<PresetExamplesProps> = ({ onSelect }) => {
  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-cyan-400" /> Or select a high-stakes scenario:
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {PRESET_EXAMPLES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="group flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 text-left backdrop-blur-md transition-all hover:border-purple-500/60 hover:bg-zinc-800/60 shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-zinc-700/60">
                {preset.category}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-400" />
            </div>
            <p className="mt-2 text-xs font-medium text-zinc-200 line-clamp-2 leading-relaxed font-sans">
              &quot;{preset.problem}&quot;
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

