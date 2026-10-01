export type RoomMode = 'think' | 'challenge' | 'brainstorm';

export type PersonaType = 'strategist' | 'skeptic' | 'customer' | 'operator';

export interface PersonaInfo {
  id: PersonaType;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  color: string;
  description: string;
}

export interface PersonaOpinion {
  persona: PersonaType;
  title: string;
  take: string;
  keyConcern: string;
}

export interface Disagreement {
  topic: string;
  perspectiveA: {
    persona: PersonaType;
    point: string;
  };
  perspectiveB: {
    persona: PersonaType;
    point: string;
  };
}

export interface Blindspot {
  title: string;
  description: string;
  impact: 'Critical' | 'High' | 'Medium';
}

export interface NextMove {
  title: string;
  experiment: string;
  validationMetric: string;
}

export interface RoomChatMessage {
  id: string;
  sender: 'user' | PersonaType;
  senderName: string;
  avatar: string;
  content: string;
  timestamp: string;
  mentions?: PersonaType[];
}

export interface PerspectiveBrief {
  id: string;
  problemStatement: string;
  roomMode: RoomMode;
  createdAt: string;
  personas: PersonaOpinion[];
  consensus: string[];
  disagreements: Disagreement[];
  blindspots: Blindspot[];
  assumptionsToTest: string[];
  nextMove: NextMove;
  chatHistory?: RoomChatMessage[];
}

export interface PresetExample {
  id: string;
  title: string;
  problem: string;
  mode: RoomMode;
  category: string;
}
