'use client';

import React from 'react';
import { PerspectiveBrief } from '@/types/perspective';
import { X, History, ArrowRight, Trash2, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PerspectiveBrief[];
  onSelectBrief: (brief: PerspectiveBrief) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectBrief,
  onClearHistory,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 p-6 shadow-2xl border-l border-zinc-800 backdrop-blur-2xl flex flex-col justify-between"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30">
                    <History className="h-4 w-4" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-white">
                    Past Decision Rooms
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* History List */}
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                {history.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500 space-y-2 font-mono">
                    <Layers className="mx-auto h-8 w-8 text-zinc-700 stroke-1" />
                    <p className="text-zinc-400">No past decision rooms yet.</p>
                    <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                      Enter a problem statement and assemble a room to start uncovering blindspots.
                    </p>
                  </div>
                ) : (
                  history.map((brief) => (
                    <div
                      key={brief.id}
                      onClick={() => {
                        onSelectBrief(brief);
                        onClose();
                      }}
                      className="group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-purple-500/60 hover:bg-zinc-900 shadow-md space-y-2 backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="uppercase font-semibold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                          {brief.roomMode} Room
                        </span>
                        <span className="text-zinc-500">{brief.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-relaxed font-sans">
                        &quot;{brief.problemStatement}&quot;
                      </h4>
                      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[11px] text-zinc-400 font-mono">
                        <span className="text-red-400 font-semibold">{brief.blindspots.length} Blindspots Found</span>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Action */}
            {history.length > 0 && (
              <div className="border-t border-zinc-800 pt-4">
                <button
                  onClick={onClearHistory}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 py-2.5 text-xs font-medium text-zinc-400 hover:bg-red-950/50 hover:text-red-400 hover:border-red-800/50 transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Past Rooms</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

