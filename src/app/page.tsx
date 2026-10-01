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
import { Sparkles, ArrowRight, FileText, Users, MessageSquare, Share2, Check, Zap, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden bg-grid-pattern">
      {/* Ambient Glowing Orbs Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-950/30 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-950/30 blur-[130px] pointer-events-none animate-pulse-slow" />

      {/* Top Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12 space-y-8 relative z-10">
        {!currentBrief && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl space-y-8 text-center"
          >
            {/* Hero Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/60 px-4 py-1.5 text-xs font-mono font-medium text-purple-300 shadow-lg backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Perspective.ai — Dialectic AI Executive War Room</span>
              </div>
              <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-[1.1]">
                Don&apos;t get answers. <br />
                <span className="text-hologram">Find your blindspots.</span>
              </h1>
              <p className="mx-auto max-w-xl text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                Assemble an automated board of 4 AI advisors — <strong className="text-cyan-300">Strategist 🧠</strong>, <strong className="text-red-400">Skeptic 🔴</strong>, <strong className="text-emerald-400">Customer 👤</strong>, and <strong className="text-amber-400">Operator ⚙️</strong> — to pressure-test your strategy before execution.
              </p>
            </div>

            {/* Input Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 sm:p-7 shadow-2xl backdrop-blur-xl text-left space-y-6">
              <div className="space-y-2.5">
                <label htmlFor="problem-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" /> WHAT DECISION OR STRATEGY ARE YOU TRYING TO FIGURE OUT?
                </label>
                <textarea
                  id="problem-input"
                  rows={3}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. Should I launch UGhar with 3 services (AC, Plumbing, Cleaning) or start with AC repair only?"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all resize-none font-sans"
                />
                {errorMessage && (
                  <p className="text-xs font-semibold text-red-400">{errorMessage}</p>
                )}
              </div>

              {/* Preset Examples */}
              <PresetExamples onSelect={handleSelectPreset} />

              {/* Room Mode Selector */}
              <div className="space-y-2.5 pt-3 border-t border-zinc-800/80">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Select Advisory Room Mode
                </label>
                <RoomModeSelector
                  selectedMode={selectedMode}
                  onSelectMode={setSelectedMode}
                />
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleAssembleRoom}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-4 px-6 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-cyan-500 transition-all cursor-pointer group border border-purple-400/30"
              >
                <span>⚡ ASSEMBLE THE WAR ROOM</span>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-zinc-950 p-1.5 border border-zinc-800 backdrop-blur-xl">
                <button
                  onClick={() => setActiveTab('brief')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold font-mono transition-all cursor-pointer ${
                    activeTab === 'brief'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-cyan-400" />
                  <span>📋 Decision Brief</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold font-mono transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                  <span>💬 Live Room Discussion (@Mentions)</span>
                  {chatHistory.length > 0 && (
                    <span className="rounded-full bg-cyan-400 px-1.5 py-0.2 text-[9px] text-zinc-950 font-mono font-bold">
                      {chatHistory.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('personas')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold font-mono transition-all cursor-pointer ${
                    activeTab === 'personas'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  <span>🧠 Persona Room</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareLink}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs font-mono font-medium text-zinc-300 shadow-sm hover:border-purple-500/50 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
                >
                  {linkCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-zinc-400" />}
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
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <HomePageContent />
    </Suspense>
  );
}

