'use client';

import React, { useState } from 'react';
import { PerspectiveBrief } from '@/types/perspective';
import { PERSONAS } from '@/lib/constants';
import { ConstraintInjector } from '@/components/ConstraintInjector';
import { 
  CheckCircle2, 
  Flame, 
  AlertTriangle, 
  Target, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles,
  Zap
} from 'lucide-react';

interface PerspectiveBriefViewProps {
  brief: PerspectiveBrief;
  onRunAnother: () => void;
  onInjectConstraint: (constraint: string) => void;
  isInjecting: boolean;
}

export const PerspectiveBriefView: React.FC<PerspectiveBriefViewProps> = ({
  brief,
  onRunAnother,
  onInjectConstraint,
  isInjecting,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `PERSPECTIVE BRIEF: "${brief.problemStatement}"\n\n` +
      `🤝 CONSENSUS:\n${brief.consensus.map(c => `• ${c}`).join('\n')}\n\n` +
      `⚔️ DISAGREEMENTS:\n${brief.disagreements.map(d => `• ${d.topic}: ${d.perspectiveA.point} VS ${d.perspectiveB.point}`).join('\n')}\n\n` +
      `⚠️ BLINDSPOTS:\n${brief.blindspots.map(b => `• [${b.impact}] ${b.title}: ${b.description}`).join('\n')}\n\n` +
      `🎯 NEXT MOVE:\n${brief.nextMove.title}\nExperiment: ${brief.nextMove.experiment}\nMetric: ${brief.nextMove.validationMetric}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-950/80 px-3 py-0.5 text-[10px] font-mono font-semibold text-purple-300 uppercase tracking-wider border border-purple-500/40">
              {brief.roomMode} Room Synthesis
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Generated {brief.createdAt}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-white leading-snug tracking-tight">
            &quot;{brief.problemStatement}&quot;
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs font-medium text-zinc-300 shadow-sm hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied Brief' : 'Copy Brief'}</span>
          </button>
          <button
            onClick={onRunAnother}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer border border-purple-400/30"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Test Another Decision</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Consensus & Disagreements (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Consensus */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3 mb-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                Consensus — What They Broadly Agree On
              </h3>
            </div>
            <ul className="space-y-3">
              {brief.consensus.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-zinc-200 leading-relaxed font-sans">
                  <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Disagreements */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3 mb-4">
              <Flame className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
                Where Perspectives Differ &amp; Conflict
              </h3>
            </div>
            <div className="space-y-4">
              {brief.disagreements.map((dis, idx) => {
                const personaA = PERSONAS[dis.perspectiveA.persona];
                const personaB = PERSONAS[dis.perspectiveB.persona];

                return (
                  <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 text-xs space-y-2.5">
                    <h4 className="font-semibold text-white border-b border-zinc-800/80 pb-2 flex items-center justify-between">
                      <span className="font-sans text-xs">{dis.topic}</span>
                      <span className="text-[10px] font-mono text-amber-400/80">CONFLICT NODE #{idx + 1}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="rounded-xl bg-zinc-900/90 p-3 border border-zinc-800">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
                          <span>{personaA?.avatar}</span>
                          <span>{personaA?.name}</span>
                        </div>
                        <p className="mt-1.5 text-zinc-300 leading-snug font-sans">
                          {dis.perspectiveA.point}
                        </p>
                      </div>
                      <div className="rounded-xl bg-zinc-900/90 p-3 border border-zinc-800">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300">
                          <span>{personaB?.avatar}</span>
                          <span>{personaB?.name}</span>
                        </div>
                        <p className="mt-1.5 text-zinc-300 leading-snug font-sans">
                          {dis.perspectiveB.point}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Blindspots & Next Move (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Section 3: Blindspots */}
          <div className="rounded-2xl border border-red-500/40 bg-red-950/20 p-6 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 border-b border-red-500/20 pb-3 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-red-400">
                Blindspots &amp; Fatal Flaws
              </h3>
            </div>
            <div className="space-y-3.5">
              {brief.blindspots.map((spot, idx) => (
                <div key={idx} className="rounded-xl bg-zinc-950/90 p-4 border border-red-900/40 shadow-inner space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white font-sans">
                      {spot.title}
                    </h4>
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                      spot.impact === 'Critical' ? 'bg-red-950 text-red-400 border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                    }`}>
                      {spot.impact}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {spot.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Recommended Next Move (Target) */}
          <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-950/50 via-zinc-950 to-indigo-950/50 p-6 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-32 w-32 text-purple-400" />
            </div>
            <div className="flex items-center gap-2 border-b border-purple-500/30 pb-3 mb-4">
              <Target className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Recommended 7-Day Action Plan
              </h3>
            </div>
            <div className="space-y-3.5 relative z-10">
              <h4 className="font-bold font-sans text-base text-white tracking-tight">
                {brief.nextMove.title}
              </h4>
              <div className="rounded-xl bg-zinc-900/90 p-3.5 text-xs space-y-1.5 border border-zinc-800">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">
                  Experiment Protocol
                </span>
                <p className="text-zinc-200 leading-relaxed font-sans">
                  {brief.nextMove.experiment}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-950/40 p-3.5 text-xs space-y-1.5 border border-emerald-500/30 text-emerald-200">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Validation Metric
                </span>
                <p className="leading-relaxed font-sans">
                  {brief.nextMove.validationMetric}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Constraint Injector (Steer the Room without chat pollution) */}
      <ConstraintInjector
        onInjectConstraint={onInjectConstraint}
        isInjecting={isInjecting}
      />

      {/* Post-Brief CTA for Repeat Usage Signal */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 text-center backdrop-blur-md">
        <Sparkles className="h-5 w-5 text-purple-400 mb-2 animate-pulse" />
        <h4 className="text-sm font-bold text-white font-sans">
          Have another decision on your mind?
        </h4>
        <p className="mt-1 text-xs text-zinc-400 max-w-md font-sans">
          Perspective works best as a routine thinking environment. Test another strategy, pricing, or career decision.
        </p>
        <button
          onClick={onRunAnother}
          className="mt-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-cyan-500 transition-all cursor-pointer border border-purple-400/30"
        >
          Assemble Another Room
        </button>
      </div>
    </div>
  );
};

