'use client';

import React, { useState } from 'react';
import { Sliders, RefreshCw, Sparkles, Zap } from 'lucide-react';

interface ConstraintInjectorProps {
  onInjectConstraint: (constraint: string) => void;
  isInjecting: boolean;
}

export const ConstraintInjector: React.FC<ConstraintInjectorProps> = ({
  onInjectConstraint,
  isInjecting,
}) => {
  const [constraint, setConstraint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!constraint.trim() || isInjecting) return;
    onInjectConstraint(constraint.trim());
    setConstraint('');
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 backdrop-blur-xl shadow-xl space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400 shadow-md">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              STEER THE ROOM — INJECT CONSTRAINT METRIC
            </h4>
            <p className="text-[11px] text-zinc-400 font-sans">
              No chat bloat. Inject a new budget limit or market reality to instantly update the decision brief.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-full hidden sm:block">
          Dynamic Steering Protocol
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={constraint}
          onChange={(e) => setConstraint(e.target.value)}
          placeholder='e.g., "What if my budget is strictly $500?" or "What if lead developer leaves?"'
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!constraint.trim() || isInjecting}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 transition-all shrink-0 cursor-pointer border border-purple-400/30"
        >
          {isInjecting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Re-evaluating...</span>
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>Inject &amp; Re-Evaluate</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

