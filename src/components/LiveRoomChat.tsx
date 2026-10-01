'use client';

import React, { useState } from 'react';
import { PersonaType, RoomChatMessage } from '@/types/perspective';
import { PERSONAS } from '@/lib/constants';
import { Send, AtSign, Loader2, MessageSquare, Bot } from 'lucide-react';
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
    <div className="w-full rounded-2xl border border-neutral-200 bg-white shadow-2xs overflow-hidden flex flex-col h-[600px]">
      {/* Room Chat Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-2xs">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="font-serif font-medium text-sm text-neutral-900">
              Live Advisory Room Discussion
            </h3>
            <p className="text-[11px] text-neutral-500 truncate max-w-md">
              Target: &quot;{problemStatement}&quot;
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>4 Advisors Active</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fcfcfc]">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-neutral-400">
            <Bot className="h-8 w-8 text-neutral-300 stroke-1" />
            <p className="text-xs font-medium text-neutral-600">
              Start the round-table conversation with your advisors
            </p>
            <p className="text-[11px] text-neutral-400 max-w-sm">
              Ask a question or tag specific advisors like <code className="bg-neutral-100 px-1 py-0.5 rounded">@Skeptic</code> or <code className="bg-neutral-100 px-1 py-0.5 rounded">@Customer</code>.
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-lg shadow-2xs">
                    {personaInfo?.avatar || '🤖'}
                  </div>
                )}

                <div className={`max-w-xl space-y-1 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                    <span className="font-semibold text-neutral-700">
                      {isUser ? 'You (Founder)' : personaInfo?.name}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-neutral-900 text-white rounded-br-xs'
                        : 'bg-white border border-neutral-200/90 text-neutral-800 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-2xs">
                    YOU
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono italic">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-700" />
            <span>Advisors are debating your question...</span>
          </div>
        )}
      </div>

      {/* Mention Bar & Input Footer */}
      <div className="border-t border-neutral-200 bg-white p-3 sm:p-4 space-y-2.5">
        {/* Mention Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-neutral-400 flex items-center gap-1 pr-1">
            <AtSign className="h-3 w-3" /> Tag:
          </span>
          {['all', 'skeptic', 'customer', 'operator', 'strategist'].map((pKey) => {
            const label = pKey === 'all' ? '@Room' : `@${PERSONAS[pKey]?.name}`;
            return (
              <button
                key={pKey}
                type="button"
                onClick={() => handleMentionChip(pKey)}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
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
            placeholder="Ask your advisors... (e.g. '@Skeptic and @Customer: What if we offer 100% money-back guarantee?')"
            className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-neutral-900 text-white shadow-2xs hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
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
