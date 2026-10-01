'use client';

import React from 'react';
import { PerspectiveBrief } from '@/types/perspective';
import { X, History, ArrowRight, Trash2, Layers } from 'lucide-react';
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
            className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white p-6 shadow-2xl border-l border-neutral-200 flex flex-col justify-between"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-neutral-500" />
                  <h3 className="font-serif font-medium text-base text-neutral-900">
                    Past Decision Rooms
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* History List */}
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                {history.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
                    <Layers className="mx-auto h-8 w-8 text-neutral-300 stroke-1" />
                    <p>No past decision rooms yet.</p>
                    <p className="text-[11px] text-neutral-400">
                      Enter a problem statement and assemble a room to start finding blindspots.
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
                      className="group cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-900 hover:shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                        <span className="uppercase font-semibold text-neutral-600">
                          {brief.roomMode} Room
                        </span>
                        <span>{brief.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-relaxed">
                        &quot;{brief.problemStatement}&quot;
                      </h4>
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-2 text-[11px] text-neutral-500 font-medium">
                        <span>{brief.blindspots.length} Blindspots Found</span>
                        <ArrowRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Action */}
            {history.length > 0 && (
              <div className="border-t border-neutral-100 pt-4">
                <button
                  onClick={onClearHistory}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-xs font-medium text-neutral-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
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
