'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { RoomModeSelector } from '@/components/RoomModeSelector';
import { PresetExamples } from '@/components/PresetExamples';
import { RoomCanvas } from '@/components/RoomCanvas';
import { PerceivedLoadingView } from '@/components/PerceivedLoadingView';
import { PerspectiveBriefView } from '@/components/PerspectiveBriefView';
import { LiveRoomChat } from '@/components/LiveRoomChat';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { PerspectiveBrief, PresetExample, RoomMode, RoomChatMessage } from '@/types/perspective';
import { Sparkles, ArrowRight, FileText, Users, MessageSquare, Share2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

function HomePageContent() {
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState('');
  const [selectedMode, setSelectedMode] = useState<RoomMode>('think');
  const [isLoading, setIsLoading] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [currentBrief, setCurrentBrief] = useState<PerspectiveBrief | null>(null);
  const [activeTab, setActiveTab] = useState<'brief' | 'chat' | 'personas'>('brief');
  const [chatHistory, setChatHistory] = useState<RoomChatMessage[]>([]);
  const [history, setHistory] = useState<PerspectiveBrief[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Load history from localStorage on mount & handle URL query parameters
  useEffect(() => {
    try {
      const saved = localStorage.getItem('perspective_history_v1');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }

    const problemParam = searchParams.get('problem');
    const modeParam = searchParams.get('mode') as RoomMode;
    if (problemParam) {
      setProblem(problemParam);
      if (modeParam && ['think', 'challenge', 'brainstorm'].includes(modeParam)) {
        setSelectedMode(modeParam);
      }
    }
  }, [searchParams]);

  const saveToHistory = (newBrief: PerspectiveBrief) => {
    setHistory((prev) => {
      const updated = [newBrief, ...prev.filter((b) => b.id !== newBrief.id)];
      try {
        localStorage.setItem('perspective_history_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to local storage:', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('perspective_history_v1');
    } catch (e) {}
  };

  const handleSelectPreset = (preset: PresetExample) => {
    setProblem(preset.problem);
    setSelectedMode(preset.mode);
    setErrorMessage(null);
  };

  const handleAssembleRoom = async () => {
    if (!problem || problem.trim().length < 5) {
      setErrorMessage('Please enter a clear decision problem statement (at least 5 characters).');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setCurrentBrief(null);
    setChatHistory([]);
    setActiveTab('brief');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: problem.trim(), mode: selectedMode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to assemble room.');
      }

      setTimeout(() => {
        setCurrentBrief(data.brief);
        saveToHistory(data.brief);
        setIsLoading(false);
      }, 2500);
    } catch (err: any) {
      console.error('API Error:', err);
      setErrorMessage(err.message || 'Something went wrong while assembling the room.');
      setIsLoading(false);
    }
  };

  const handleInjectConstraint = async (constraint: string) => {
    if (!currentBrief) return;
    setIsInjecting(true);

    const updatedStatement = `${currentBrief.problemStatement} [New Constraint: ${constraint}]`;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: updatedStatement, mode: currentBrief.roomMode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to re-evaluate room.');
      }

      setTimeout(() => {
        setCurrentBrief(data.brief);
        saveToHistory(data.brief);
        setIsInjecting(false);
      }, 1500);
    } catch (err: any) {
      console.error('Inject Error:', err);
      setIsInjecting(false);
    }
  };

  const handleSendChatMessage = async (userPrompt: string) => {
    if (!currentBrief || !userPrompt.trim()) return;

    const userMsg: RoomChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'You (Founder)',
      avatar: '👤',
      content: userPrompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/room-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          problemStatement: currentBrief.problemStatement,
          newPrompt: userPrompt.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send room chat.');
      }

      setChatHistory([...updatedHistory, ...data.responses]);
      setIsSendingChat(false);
    } catch (err: any) {
      console.error('Room chat error:', err);
      setIsSendingChat(false);
    }
  };

  const handleShareLink = () => {
    if (!currentBrief) return;
    const shareUrl = `${window.location.origin}/?problem=${encodeURIComponent(currentBrief.problemStatement)}&mode=${currentBrief.roomMode}`;
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleReset = () => {
    setCurrentBrief(null);
    setIsLoading(false);
    setProblem('');
    setActiveTab('brief');
    setChatHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12 space-y-8">
        {!currentBrief && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl space-y-8 text-center"
          >
            {/* Hero Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-neutral-800" />
                <span>Perspective.ai — Dialectic Decision Environment</span>
              </div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-neutral-900 sm:text-5xl leading-tight">
                Don&apos;t get answers. <br />
                <span className="text-neutral-400 italic font-serif">Find your blindspots.</span>
              </h1>
              <p className="mx-auto max-w-xl text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Assemble an automated room of 4 AI advisors — <strong>Strategist 🧠</strong>, <strong>Skeptic 🔴</strong>, <strong>Customer 👤</strong>, and <strong>Operator ⚙️</strong> — to challenge your assumptions before you execute.
              </p>
            </div>

            {/* Input Card */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs text-left space-y-5">
              <div className="space-y-2">
                <label htmlFor="problem-input" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 font-mono">
                  What decision or strategy are you trying to figure out?
                </label>
                <textarea
                  id="problem-input"
                  rows={3}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. Should I launch UGhar with 3 services (AC, Plumbing, Cleaning) or start with AC repair only?"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all resize-none"
                />
                {errorMessage && (
                  <p className="text-xs font-medium text-red-600">{errorMessage}</p>
                )}
              </div>

              {/* Preset Examples */}
              <PresetExamples onSelect={handleSelectPreset} />

              {/* Room Mode Selector */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 font-mono">
                  Select Room Mode
                </label>
                <RoomModeSelector
                  selectedMode={selectedMode}
                  onSelectMode={setSelectedMode}
                />
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleAssembleRoom}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 px-6 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 transition-all cursor-pointer group"
              >
                <span>⚡ ASSEMBLE THE ROOM</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12"
          >
            <PerceivedLoadingView />
          </motion.div>
        )}

        {/* Results View with Progressive Disclosure Tabs & Share Button */}
        {currentBrief && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tab Bar & Share Action Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div className="flex flex-wrap items-center gap-1 rounded-xl bg-neutral-200/60 p-1 border border-neutral-200">
                <button
                  onClick={() => setActiveTab('brief')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeTab === 'brief'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-neutral-700" />
                  <span>📋 Decision Brief</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-neutral-700" />
                  <span>💬 Live Room Discussion (@Mentions)</span>
                  {chatHistory.length > 0 && (
                    <span className="rounded-full bg-neutral-900 px-1.5 py-0.2 text-[9px] text-white font-mono font-semibold">
                      {chatHistory.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('personas')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeTab === 'personas'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Users className="h-3.5 w-3.5 text-neutral-700" />
                  <span>🧠 Persona Room</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareLink}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors"
                >
                  {linkCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5 text-neutral-500" />}
                  <span>{linkCopied ? 'Share Link Copied!' : 'Share Room Link'}</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Clean Executive Decision Brief (Default) */}
            {activeTab === 'brief' && (
              <PerspectiveBriefView
                brief={currentBrief}
                onRunAnother={handleReset}
                onInjectConstraint={handleInjectConstraint}
                isInjecting={isInjecting}
              />
            )}

            {/* Tab 2: Live Advisory Room Discussion Chat */}
            {activeTab === 'chat' && (
              <LiveRoomChat
                problemStatement={currentBrief.problemStatement}
                chatHistory={chatHistory}
                onSendMessage={handleSendChatMessage}
                isSending={isSendingChat}
              />
            )}

            {/* Tab 3: Persona Room Canvas (Raw Takes) */}
            {activeTab === 'personas' && (
              <div className="space-y-6">
                <RoomCanvas
                  opinions={currentBrief.personas}
                  problemStatement={currentBrief.problemStatement}
                />
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectBrief={(brief) => setCurrentBrief(brief)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <HomePageContent />
    </Suspense>
  );
}
