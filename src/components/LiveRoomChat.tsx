'use client';

import React, { useState } from 'react';
import { PersonaType, RoomChatMessage } from '@/types/perspective';
import { PERSONAS } from '@/lib/constants';
import { Send, AtSign, Loader2, MessageSquare, Bot, Terminal, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveRoomChatProps {
  problemStatement: string;
  chatHistory: RoomChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
}

export const LiveRoomChat: React.FC<LiveRoomChatProps> = ({
  problemStatement,
  chatHistory,
  onSendMessage,
  isSending,
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleMentionChip = (personaId: string) => {
    const prefix = personaId === 'all' ? '@Room ' : `@${PERSONAS[personaId]?.name} `;
    if (!inputMessage.includes(prefix)) {
      setInputMessage((prev) => `${prefix}${prev}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;
    const msg = inputMessage;
    setInputMessage('');
    await onSendMessage(msg);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-[620px]">
      {/* Room Chat Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/90 bg-zinc-900/60 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-md border border-purple-400/30">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
              Live Advisory Discussion Terminal
            </h3>
            <p className="text-[11px] text-zinc-400 truncate max-w-md font-mono">
              Target: &quot;{problemStatement}&quot;
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
          <span>4 ADVISORS CONNECTED</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-950/60">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-zinc-500">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <Bot className="h-8 w-8 text-cyan-400 stroke-1" />
            </div>
            <p className="text-xs font-semibold text-zinc-300 font-sans">
              Start the live round-table debate with your AI advisors
            </p>
            <p className="text-[11px] text-zinc-400 max-w-sm font-mono">
              Tag specific advisors using <code className="bg-zinc-800 text-purple-300 px-1.5 py-0.5 rounded border border-zinc-700">@Skeptic</code> or <code className="bg-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded border border-zinc-700">@Customer</code>.
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            const personaInfo = !isUser ? PERSONAS[msg.sender] : null;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-xl shadow-inner">
                    {personaInfo?.avatar || '🤖'}
                  </div>
                )}

                <div className={`max-w-xl space-y-1.5 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                    <span className="font-bold text-zinc-200">
                      {isUser ? 'You (Founder)' : personaInfo?.name}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-4 leading-relaxed shadow-lg ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-tr-xs border border-purple-400/30'
                        : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-xs backdrop-blur-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans text-xs">{msg.content}</p>
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white text-xs font-mono font-bold shadow-md border border-purple-400/30">
                    YOU
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono italic">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Advisors are actively deliberating...</span>
          </div>
        )}
      </div>

      {/* Mention Bar & Input Footer */}
      <div className="border-t border-zinc-800/90 bg-zinc-900/80 p-4 space-y-3 backdrop-blur-md">
        {/* Mention Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-zinc-400 flex items-center gap-1 pr-1">
            <AtSign className="h-3 w-3 text-cyan-400" /> Mention:
          </span>
          {['all', 'skeptic', 'customer', 'operator', 'strategist'].map((pKey) => {
            const label = pKey === 'all' ? '@Room' : `@${PERSONAS[pKey]?.name}`;
            return (
              <button
                key={pKey}
                type="button"
                onClick={() => handleMentionChip(pKey)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-zinc-300 hover:border-purple-500/60 hover:text-purple-300 transition-all cursor-pointer font-mono shadow-xs"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Direct your query... (e.g. '@Skeptic & @Customer: What if we offer a 100% money-back guarantee?')"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 transition-all cursor-pointer shrink-0 border border-purple-400/30"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

