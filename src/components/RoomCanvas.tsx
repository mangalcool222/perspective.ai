'use client';

import React, { useState } from 'react';
import { PERSONAS } from '@/lib/constants';
import { PersonaOpinion, PersonaType } from '@/types/perspective';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Sparkles, UserCheck, Settings, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface RoomCanvasProps {
  opinions: PersonaOpinion[];
  problemStatement: string;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  opinions,
  problemStatement,
}) => {
  const [activePersona, setActivePersona] = useState<PersonaType | null>(null);

  const personaMap = opinions.reduce<Record<string, PersonaOpinion>>((acc, curr) => {
    acc[curr.persona] = curr;
    return acc;
  }, {});

  const order: PersonaType[] = ['strategist', 'skeptic', 'customer', 'operator'];

  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50/80 to-white p-4 sm:p-6 shadow-2xs">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
            The Thinking Room — 4 Persona Panel
          </h3>
        </div>
        <span className="text-[11px] text-neutral-400">
          Click any persona to inspect their raw take
        </span>
      </div>

      {/* Grid of 4 Personas Surround */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((key) => {
          const info = PERSONAS[key];
          const opinion = personaMap[key];
          const isSelected = activePersona === key;

          return (
            <motion.div
              key={key}
              whileHover={{ y: -2 }}
              onClick={() => setActivePersona(isSelected ? null : key)}
              className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
                info.color
              } ${isSelected ? 'ring-2 ring-neutral-900 shadow-md' : 'shadow-2xs'}`}
            >
              {/* Top Persona Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{info.avatar}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">
                      {info.name}
                    </h4>
                    <p className="text-[10px] text-neutral-600 font-medium">
                      {info.role}
                    </p>
                  </div>
                </div>
                {isSelected ? (
                  <ChevronUp className="h-4 w-4 text-neutral-700" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                )}
              </div>

              {/* Title & Key Snippet */}
              <div className="mt-3">
                <p className="text-xs font-medium text-neutral-900 leading-snug line-clamp-2">
                  {opinion ? opinion.title : info.description}
                </p>
                <div className="mt-2.5 flex items-center justify-between border-t border-neutral-200/60 pt-2 text-[11px] font-medium text-neutral-600 font-mono">
                  <span className="truncate max-w-[180px]">
                    {opinion ? `Key: ${opinion.keyConcern}` : info.badge}
                  </span>
                </div>
              </div>

              {/* Expanded Card Detail */}
              <AnimatePresence>
                {isSelected && opinion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden border-t border-neutral-300/80 pt-3 text-xs text-neutral-800 space-y-2"
                  >
                    <div className="rounded-lg bg-white/90 p-2.5 border border-neutral-200">
                      <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
                        Independent Blind Take
                      </span>
                      <p className="mt-1 leading-relaxed text-neutral-800 font-sans">
                        {opinion.take}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Central Dialectic Connector Banner */}
      <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 p-4 text-center">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
          <MessageSquare className="h-4 w-4 text-neutral-500" />
          <span>Round 2 Cross-Examination Complete</span>
        </div>
        <p className="mt-1 text-xs text-neutral-500 max-w-xl">
          Personas independently evaluated your statement, challenged each other&apos;s blindspots, and generated the unified Perspective Brief below.
        </p>
      </div>
    </div>
  );
};


