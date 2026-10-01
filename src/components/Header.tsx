'use client';

import React from 'react';
import { History, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex cursor-pointer items-center gap-3 group"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105 border border-purple-400/30">
            <Layers className="h-5 w-5" />
            <div className="absolute inset-0 rounded-xl bg-purple-500/20 blur-xs -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-base font-sans">
                Perspective<span className="text-purple-400 font-mono">.ai</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-950/80 px-2 py-0.5 text-[10px] font-mono font-medium text-purple-300 border border-purple-500/30 shadow-xs">
                <Zap className="h-2.5 w-2.5 text-cyan-400" /> WAR ROOM v1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block font-mono">
              Don&apos;t get answers. Find your blindspots.
            </p>
          </div>
        </div>

        {/* Center Tagline for Founders */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800 shadow-inner">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] tracking-wide">Dialectic Executive Decision Engine</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-1.5 text-xs font-medium text-zinc-300 shadow-sm hover:border-purple-500/50 hover:bg-zinc-800/90 hover:text-white transition-all cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-purple-400" />
            <span>Past Rooms</span>
            {historyCount > 0 && (
              <span className="ml-1 rounded-full bg-purple-600 px-1.5 py-0.2 text-[10px] font-mono font-bold text-white shadow-xs">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

