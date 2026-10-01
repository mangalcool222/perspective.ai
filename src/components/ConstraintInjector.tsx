'use client';

import React, { useState } from 'react';
import { Sliders, RefreshCw, Sparkles } from 'lucide-react';

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
    <div className="rounded-2xl border border-neutral-300/80 bg-white p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
            <Sliders className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 font-mono">
              Steer The Room — Inject A New Constraint
            </h4>
            <p className="text-[11px] text-neutral-500 font-sans">
              No chat bloat. Inject a new fact or limit to re-evaluate the Decision Brief.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md hidden sm:block">
          Single Report Paradigm
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={constraint}
          onChange={(e) => setConstraint(e.target.value)}
          placeholder='e.g., "What if my budget is strictly $500?" or "What if our engineer quits?"'
          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!constraint.trim() || isInjecting}
          className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-medium text-white shadow-2xs hover:bg-neutral-800 disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
        >
          {isInjecting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Re-evaluating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Re-Evaluate Brief</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};


