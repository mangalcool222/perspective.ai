import { PersonaInfo, PresetExample, RoomMode } from '@/types/perspective';

export const PERSONAS: Record<string, PersonaInfo> = {
  strategist: {
    id: 'strategist',
    name: 'Strategist',
    role: 'Opportunity & Scale',
    avatar: '🧠',
    badge: 'Growth & Positioning',
    color: 'border-blue-200 bg-blue-50/50 text-blue-900',
    description: 'Evaluates long-term vision, competitive moat, positioning, and scale leverage.'
  },
  skeptic: {
    id: 'skeptic',
    name: 'Skeptic',
    role: 'Failure Modes & Risk',
    avatar: '🔴',
    badge: 'Devil\'s Advocate',
    color: 'border-red-200 bg-red-50/50 text-red-900',
    description: 'Calculates unit economics breakdown, churn risks, operational traps, and fatal flaws.'
  },
  customer: {
    id: 'customer',
    name: 'Customer',
    role: 'User Pain & Trust',
    avatar: '👤',
    badge: 'End User Voice',
    color: 'border-amber-200 bg-amber-50/50 text-amber-900',
    description: 'Tests willingness to pay, switching friction, trust barriers, and habit change.'
  },
  operator: {
    id: 'operator',
    name: 'Operator',
    role: 'Execution Reality',
    avatar: '⚙️',
    badge: 'Tactical Realist',
    color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
    description: 'Measures implementation complexity, team bandwidth, tech logistics, and resource constraints.'
  }
};

export const ROOM_MODES: Record<RoomMode, { title: string; subtitle: string; icon: string; badge: string }> = {
  think: {
    title: 'Think Room',
    subtitle: 'Comprehensive 360° decision analysis across all perspectives',
    icon: '🧠',
    badge: 'Recommended V1'
  },
  challenge: {
    title: 'Challenge Room',
    subtitle: 'Stress-test mode — try to break and fatal-flaw your idea',
    icon: '⚡',
    badge: 'Stress Test'
  },
  brainstorm: {
    title: 'Brainstorm Room',
    subtitle: 'Divergent thinking — 4 distinct strategic angles to solve your problem',
    icon: '💡',
    badge: 'Idea Expansion'
  }
};

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: '1',
    title: 'UGhar Expansion',
    problem: 'Should I launch UGhar with 3 home services simultaneously (AC, Plumbing, Cleaning) or start with AC repair only?',
    mode: 'think',
    category: 'Startup Strategy'
  },
  {
    id: '2',
    title: 'Career & Startup',
    problem: 'Should I quit my senior dev job to go full-time on my bootstrapped AI productivity SaaS that currently makes $1.2k MRR?',
    mode: 'challenge',
    category: 'Career Decision'
  },
  {
    id: '3',
    title: 'Monetization Pivot',
    problem: 'Should we replace our free consumer app tier with a 14-day free trial that requires credit card upfront?',
    mode: 'think',
    category: 'Pricing Strategy'
  },
  {
    id: '4',
    title: 'Product Positioning',
    problem: 'We are building an AI video editor. Should we position it for TikTok creators or B2B marketing teams?',
    mode: 'brainstorm',
    category: 'Market Strategy'
  }
];
