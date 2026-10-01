'use client';

import React, { useState } from 'react';
import { PERSONAS } from '@/lib/constants';
import { PersonaOpinion, PersonaType } from '@/types/perspective';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Radio, Cpu, Sparkles } from 'lucide-react';

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

  const getPersonaGlow = (key: PersonaType, isSelected: boolean) => {
    if (key === 'strategist') return isSelected ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/50' : 'border-zinc-800 bg-zinc-900/60 hover:border-cyan-500/50';
    if (key === 'skeptic') return isSelected ? 'border-red-500 bg-red-950/40 shadow-[0_0_20px_-3px_rgba(239,68,68,0.3)] ring-1 ring-red-500/50' : 'border-zinc-800 bg-zinc-900/60 hover:border-red-500/50';
    if (key === 'customer') return isSelected ? 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50' : 'border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/50';
    return isSelected ? 'border-amber-500 bg-amber-950/40 shadow-[0_0_20px_-3px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/50' : 'border-zinc-800 bg-zinc-900/60 hover:border-amber-500/50';
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Cpu className="h-4 w-4" /> DIALECTIC ADVISORY MATRIX — 4 AI NODES ACTIVE
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
          Click any advisor node to inspect raw blind take
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
              whileHover={{ y: -3 }}
              onClick={() => setActivePersona(isSelected ? null : key)}
              className={`cursor-pointer rounded-xl border p-4.5 transition-all relative backdrop-blur-md ${getPersonaGlow(
                key,
                isSelected
              )}`}
            >
              {/* Top Persona Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 text-2xl shadow-inner">
                    {info.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-sans">
                      {info.name}
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-400 font-medium">
                      {info.role}
                    </p>
                  </div>
                </div>
                {isSelected ? (
                  <ChevronUp className="h-4 w-4 text-zinc-300" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                )}
              </div>

              {/* Title & Key Snippet */}
              <div className="mt-3.5">
                <p className="text-xs font-medium text-zinc-200 leading-snug line-clamp-2">
                  {opinion ? opinion.title : info.description}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[11px] font-mono text-zinc-400">
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
                    className="mt-3.5 overflow-hidden border-t border-zinc-800 pt-3 text-xs text-zinc-200 space-y-2"
                  >
                    <div className="rounded-xl bg-zinc-950 p-3 border border-zinc-800/90 shadow-inner">
                      <span className="block text-[10px] font-mono font-semibold text-purple-400 uppercase tracking-wider">
                        Independent Blind Take
                      </span>
                      <p className="mt-1.5 leading-relaxed text-zinc-300 font-sans">
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-4 text-center backdrop-blur-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-300">
          <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>ROUND-2 CROSS-EXAMINATION ENGINE COMPLETED</span>
        </div>
        <p className="mt-1 text-xs text-zinc-400 max-w-xl font-sans">
          Personas independently evaluated your statement, challenged each other&apos;s blindspots, and generated the synthesized Perspective Brief below.
        </p>
      </div>
    </div>
  );
};

