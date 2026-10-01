'use client';

import React, { useState, useEffect } from 'react';
import { PERSONAS } from '@/lib/constants';
import { PersonaOpinion, PersonaType } from '@/types/perspective';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronDown, ChevronUp, MessageSquare, Sparkles } from 'lucide-react';

interface RoomCanvasProps {
  opinions: PersonaOpinion[];
  problemStatement: string;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  opinions,
  problemStatement,
}) => {
  const order: PersonaType[] = ['strategist', 'skeptic', 'customer', 'operator'];
  const [activePersona, setActivePersona] = useState<PersonaType>(order[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [userLocked, setUserLocked] = useState(false);

  const personaMap = opinions.reduce<Record<string, PersonaOpinion>>((acc, curr) => {
    acc[curr.persona] = curr;
    return acc;
  }, {});

  // Auto slide personas every 3.5s unless user hovered or manually locked
  useEffect(() => {
    if (isPaused || userLocked) return;

    const timer = setInterval(() => {
      setActivePersona((prev) => {
        const currentIndex = order.indexOf(prev);
        const nextIndex = (currentIndex + 1) % order.length;
        return order[nextIndex];
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, userLocked]);

  const handleSelectPersona = (key: PersonaType) => {
    if (activePersona === key && userLocked) {
      setUserLocked(false);
    } else {
      setActivePersona(key);
      setUserLocked(true);
    }
  };

  return (
    <div 
      className="w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs space-y-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Badge & Auto-Slide Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-neutral-900 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 font-mono">
            The Advisory Board — 4 Persona Panel
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
          <button
            onClick={() => setUserLocked(!userLocked)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1 hover:bg-neutral-100 transition-colors cursor-pointer text-[11px]"
          >
            {userLocked ? (
              <>
                <Pause className="h-3 w-3 text-neutral-800" />
                <span>Auto-Slide Paused (Click to Resume)</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-emerald-600 animate-pulse" />
                <span>Auto-Rotating Deck</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of 4 Personas Surround */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((key) => {
          const info = PERSONAS[key];
          const opinion = personaMap[key];
          const isActive = activePersona === key;

          return (
            <motion.div
              key={key}
              whileHover={{ y: -2 }}
              onClick={() => handleSelectPersona(key)}
              className={`cursor-pointer rounded-xl border p-4 transition-all relative overflow-hidden ${
                isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                  : 'border-neutral-200 bg-neutral-50/50 text-neutral-800 hover:border-neutral-400 hover:bg-white'
              }`}
            >
              {/* Progress Line for Active Persona */}
              {isActive && !userLocked && !isPaused && (
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3.5, ease: 'linear' }}
                  className="absolute top-0 left-0 h-1 bg-white/80"
                />
              )}

              {/* Top Persona Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{info.avatar}</span>
                  <div>
                    <h4 className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-neutral-900'}`}>
                      {info.name}
                    </h4>
                    <p className={`text-[10px] font-medium ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {info.role}
                    </p>
                  </div>
                </div>
                {isActive ? (
                  <ChevronUp className="h-4 w-4 text-white shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                )}
              </div>

              {/* Title & Key Snippet */}
              <div className="mt-3.5">
                <p className={`text-xs font-medium leading-snug line-clamp-2 ${isActive ? 'text-neutral-100' : 'text-neutral-900'}`}>
                  {opinion ? opinion.title : info.description}
                </p>
                <div className={`mt-3 flex items-center justify-between border-t pt-2 text-[11px] font-mono ${
                  isActive ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200/80 text-neutral-500'
                }`}>
                  <span className="truncate max-w-[180px]">
                    {opinion ? `Key: ${opinion.keyConcern}` : info.badge}
                  </span>
                </div>
              </div>

              {/* Expanded Card Detail */}
              <AnimatePresence>
                {isActive && opinion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3.5 overflow-hidden border-t border-neutral-800 pt-3 text-xs space-y-2"
                  >
                    <div className="rounded-lg bg-neutral-800/90 p-3 border border-neutral-700">
                      <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
                        Independent Blind Take
                      </span>
                      <p className="mt-1.5 leading-relaxed text-neutral-200 font-sans">
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 p-4 text-center">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 font-mono">
          <MessageSquare className="h-4 w-4 text-neutral-700" />
          <span>Round 2 Dialectic Cross-Examination Complete</span>
        </div>
        <p className="mt-1 text-xs text-neutral-500 max-w-xl font-sans">
          Personas independently evaluated your statement, challenged each other&apos;s blindspots, and generated the synthesized Perspective Brief below.
        </p>
      </div>
    </div>
  );
};



