'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

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
    <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-xs max-w-xl">
      <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-md">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-2xl border-2 border-dashed border-neutral-400"
        />
        <span className="text-2xl">{STEPS[currentStep].icon}</span>
      </div>

      <h3 className="font-serif text-lg font-medium text-neutral-900">
        Assembling The Room
      </h3>
      <p className="mt-1 text-xs text-neutral-500 font-sans">
        4 AI Personas are conducting blind analysis &amp; dialectic debate...
      </p>

      {/* Step List */}
      <div className="mt-6 w-full space-y-2.5 text-left border-t border-neutral-100 pt-5">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                isCurrent
                  ? 'bg-neutral-100 font-medium text-neutral-900 border border-neutral-200'
                  : isDone
                  ? 'text-neutral-500 opacity-80'
                  : 'text-neutral-300'
              }`}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-neutral-200" />
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


