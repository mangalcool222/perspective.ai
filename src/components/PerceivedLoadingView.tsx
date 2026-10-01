'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Shield, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: '🧠',
    text: 'Strategist is finding your unfair positioning & growth leverage...',
  },
  {
    icon: '🔴',
    text: 'Skeptic is calculating unit economic risks & failure modes...',
  },
  {
    icon: '👤',
    text: 'Customer is testing switching friction & trust barriers...',
  },
  {
    icon: '⚙️',
    text: 'Operator is evaluating execution complexity & bandwidth...',
  },
  {
    icon: '⚡',
    text: 'Moderator is synthesizing cross-persona Disagreements & Blindspots...',
  },
];

export const PerceivedLoadingView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center backdrop-blur-xl shadow-2xl max-w-xl">
      {/* Holographic Glowing Central Node */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-900/50 via-zinc-900 to-cyan-900/50 text-white border border-purple-500/40 shadow-lg shadow-purple-500/20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-1.5 rounded-2xl border border-dashed border-cyan-400/50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 rounded-2xl border border-dotted border-purple-400/30"
        />
        <span className="text-3xl">{STEPS[currentStep].icon}</span>
      </div>

      <h3 className="font-sans text-xl font-bold tracking-tight text-white flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
        Assembling The Executive War Room
      </h3>
      <p className="mt-1 text-xs text-zinc-400 font-mono">
        4 AI Personas are conducting blind analysis &amp; dialectic cross-examination...
      </p>

      {/* Step List */}
      <div className="mt-6 w-full space-y-2.5 text-left border-t border-zinc-800/80 pt-5">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs transition-all border ${
                isCurrent
                  ? 'bg-purple-950/40 border-purple-500/50 font-medium text-white shadow-xs'
                  : isDone
                  ? 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400'
                  : 'bg-zinc-900/20 border-zinc-900 text-zinc-600'
              }`}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-zinc-700" />
                )}
              </div>
              <span className="truncate font-sans">{step.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

