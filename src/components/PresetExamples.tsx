'use client';

import React from 'react';
import { PRESET_EXAMPLES } from '@/lib/constants';
import { PresetExample } from '@/types/perspective';
import { ArrowUpRight, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface PresetExamplesProps {
  onSelect: (preset: PresetExample) => void;
}

export const PresetExamples: React.FC<PresetExamplesProps> = ({ onSelect }) => {
  // Duplicate list to create seamless infinite scroll loop
  const doublePresets = [...PRESET_EXAMPLES, ...PRESET_EXAMPLES];

  return (
    <div className="w-full space-y-2.5 overflow-hidden">
      <div className="flex items-center justify-between text-xs text-neutral-600 font-mono">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-neutral-900 animate-pulse" /> Live Scenarios Marquee — Click to Test:
        </span>
        <span className="text-[10px] text-neutral-400 font-mono">Auto-scrolling (Hover to pause)</span>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative w-full overflow-hidden py-1">
        {/* Gradient Fade Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-3 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {doublePresets.map((preset, idx) => (
            <motion.button
              key={`${preset.id}-${idx}`}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => onSelect(preset)}
              className="group flex flex-col justify-between w-[280px] shrink-0 rounded-xl border border-neutral-200/90 bg-neutral-50/60 p-3.5 text-left shadow-2xs transition-all hover:border-neutral-900 hover:bg-white hover:shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-700 border border-neutral-200/80 font-mono">
                  {preset.category}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900" />
              </div>
              <p className="mt-2 text-xs font-medium text-neutral-800 line-clamp-2 leading-relaxed font-sans">
                &quot;{preset.problem}&quot;
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};




