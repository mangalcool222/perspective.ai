'use client';

import React from 'react';
import { History, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex cursor-pointer items-center gap-3 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm transition-transform group-hover:scale-105">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-neutral-900 text-base font-serif">
                Perspective<span className="text-neutral-400 font-mono">.ai</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600 border border-neutral-200 font-mono">
                1-Week MVP
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Don&apos;t get answers. Find your blindspots.
            </p>
          </div>
        </div>

        {/* Center Tagline for Founders */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100/70 px-3 py-1 rounded-full border border-neutral-200/80 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-neutral-700" />
          <span>Founders &amp; Builders Decision Engine</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-neutral-500" />
            <span>Past Rooms</span>
            {historyCount > 0 && (
              <span className="ml-1 rounded-full bg-neutral-900 px-1.5 py-0.2 text-[10px] font-semibold text-white font-mono">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


