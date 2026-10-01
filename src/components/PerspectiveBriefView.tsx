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
  Sparkles 
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase font-mono tracking-wider">
              {brief.roomMode} Room Brief
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Generated {brief.createdAt}
            </span>
          </div>
          <h2 className="mt-2 text-lg sm:text-xl font-medium font-serif text-neutral-900 leading-snug">
            &quot;{brief.problemStatement}&quot;
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-neutral-500" />}
            <span>{copied ? 'Copied Brief' : 'Copy Brief'}</span>
          </button>
          <button
            onClick={onRunAnother}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-neutral-800 transition-colors"
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
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                Consensus — What They Broadly Agree On
              </h3>
            </div>
            <ul className="space-y-3">
              {brief.consensus.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed">
                  <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Disagreements */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-4">
              <Flame className="h-4 w-4 text-amber-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                Where Perspectives Differ &amp; Conflict
              </h3>
            </div>
            <div className="space-y-4">
              {brief.disagreements.map((dis, idx) => {
                const personaA = PERSONAS[dis.perspectiveA.persona];
                const personaB = PERSONAS[dis.perspectiveB.persona];

                return (
                  <div key={idx} className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3.5 text-xs space-y-2">
                    <h4 className="font-semibold text-neutral-900 border-b border-neutral-200/60 pb-1.5">
                      {dis.topic}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="rounded-lg bg-white p-2.5 border border-neutral-200">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-700">
                          <span>{personaA?.avatar}</span>
                          <span>{personaA?.name}</span>
                        </div>
                        <p className="mt-1 text-neutral-600 leading-snug">
                          {dis.perspectiveA.point}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-2.5 border border-neutral-200">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-700">
                          <span>{personaB?.avatar}</span>
                          <span>{personaB?.name}</span>
                        </div>
                        <p className="mt-1 text-neutral-600 leading-snug">
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
          <div className="rounded-2xl border border-red-200/80 bg-red-50/30 p-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-red-100 pb-3 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-red-900 font-mono">
                Blindspots &amp; Fatal Flaws
              </h3>
            </div>
            <div className="space-y-3">
              {brief.blindspots.map((spot, idx) => (
                <div key={idx} className="rounded-xl bg-white p-3.5 border border-red-100 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-neutral-900">
                      {spot.title}
                    </h4>
                    <span className={`rounded-full px-2 py-0.2 text-[9px] font-semibold uppercase font-mono ${
                      spot.impact === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {spot.impact}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Recommended Next Move (Target) */}
          <div className="rounded-2xl border border-neutral-900 bg-neutral-900 p-5 text-white shadow-md">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4">
              <Target className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                Recommended 7-Day Experiment
              </h3>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium font-serif text-base text-white">
                {brief.nextMove.title}
              </h4>
              <div className="rounded-xl bg-neutral-800/80 p-3 text-xs space-y-1.5 border border-neutral-700">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                  Experiment Setup
                </span>
                <p className="text-neutral-200 leading-relaxed">
                  {brief.nextMove.experiment}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-950/60 p-3 text-xs space-y-1.5 border border-emerald-800/60 text-emerald-200">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Validation Metric
                </span>
                <p className="leading-relaxed">
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
        <Sparkles className="h-5 w-5 text-neutral-500 mb-2" />
        <h4 className="text-sm font-semibold text-neutral-900">
          Have another decision on your mind?
        </h4>
        <p className="mt-1 text-xs text-neutral-500 max-w-md">
          Perspective works best as a routine thinking environment. Test another strategy, pricing, or career decision.
        </p>
        <button
          onClick={onRunAnother}
          className="mt-4 rounded-xl bg-neutral-900 px-5 py-2 text-xs font-medium text-white shadow-2xs hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Assemble Another Room
        </button>
      </div>
    </div>
  );
};
