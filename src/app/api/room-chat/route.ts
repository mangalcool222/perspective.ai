import { NextResponse } from 'next/server';
import { PersonaType, RoomChatMessage } from '@/types/perspective';
import { PERSONAS } from '@/lib/constants';

function cleanJsonResponse(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  const match = cleaned.match(/\[[\s\S]*\]/) || cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    return JSON.parse(match[0]);
  }
  return JSON.parse(cleaned);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, problemStatement, newPrompt } = body;

    if (!newPrompt || typeof newPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid message for the advisory room.' },
        { status: 400 }
      );
    }

    const lowerPrompt = newPrompt.toLowerCase();
    const mentions: PersonaType[] = [];

    if (lowerPrompt.includes('skeptic')) mentions.push('skeptic');
    if (lowerPrompt.includes('customer')) mentions.push('customer');
    if (lowerPrompt.includes('operator')) mentions.push('operator');
    if (lowerPrompt.includes('strategist')) mentions.push('strategist');

    const targetPersonas: PersonaType[] = mentions.length > 0
      ? mentions
      : ['strategist', 'skeptic'];

    // Check environment keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        console.log('Using Live Gemini 3.8 Flash API for room chat...');
        const responses = await generateGeminiRoomChat(problemStatement, messages || [], newPrompt, targetPersonas, geminiKey);
        if (responses && responses.length > 0) return NextResponse.json({ success: true, responses });
      } catch (err) {
        console.error('Gemini room chat error:', err);
      }
    }

    if (anthropicKey) {
      try {
        console.log('Using Live Anthropic API for room chat...');
        const responses = await generateAnthropicRoomChat(problemStatement, messages || [], newPrompt, targetPersonas, anthropicKey);
        if (responses && responses.length > 0) return NextResponse.json({ success: true, responses });
      } catch (err) {
        console.error('Anthropic room chat error:', err);
      }
    }

    if (openaiKey) {
      try {
        console.log('Using Live OpenAI API for room chat...');
        const responses = await generateOpenAIRoomChat(problemStatement, messages || [], newPrompt, targetPersonas, openaiKey);
        if (responses && responses.length > 0) return NextResponse.json({ success: true, responses });
      } catch (err) {
        console.error('OpenAI room chat error:', err);
      }
    }

    throw new Error('No LLM API key configured for room chat.');
  } catch (error: any) {
    console.error('Room chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch room chat.' },
      { status: 500 }
    );
  }
}

async function generateGeminiRoomChat(
  problemStatement: string,
  history: RoomChatMessage[],
  newPrompt: string,
  targetPersonas: PersonaType[],
  apiKey: string
): Promise<RoomChatMessage[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const personaListStr = targetPersonas.map(p => `${PERSONAS[p].name} (${PERSONAS[p].role})`).join(', ');

  const promptText = `You are Perspective.ai's Live Board Room Engine.
CORE DECISION PROBLEM BEING DISCUSSED IN THE ROOM: "${problemStatement}".
The user (Founder) just asked in chat: "${newPrompt}".

CRITICAL MANDATE:
- Generate deep, natural, 1st person advisory responses ONLY for: ${personaListStr}.
- Every persona MUST explicitly bind their answer to the INITIAL CORE DECISION STATEMENT ("${problemStatement}") and directly answer the user's new question ("${newPrompt}").
- Speak like a battle-tested YC founder or operator sitting in a room with them.
- DO NOT use corporate MBA fluff ("operational complexity", "strategic positioning").

Return valid JSON array:
[
  { "persona": "${targetPersonas[0]}", "content": "Deep 2-3 paragraph response addressing their exact prompt..." }
]`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'Gemini API failed');
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const parsed = cleanJsonResponse(text);
  const items = Array.isArray(parsed) ? parsed : (parsed.responses || [parsed]);

  return items.map((item: any) => {
    const info = PERSONAS[item.persona] || PERSONAS.strategist;
    return {
      id: `chat-${Date.now()}-${item.persona}`,
      sender: item.persona as PersonaType,
      senderName: info.name,
      avatar: info.avatar,
      content: item.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mentions: targetPersonas
    };
  });
}

async function generateAnthropicRoomChat(
  problemStatement: string,
  history: RoomChatMessage[],
  newPrompt: string,
  targetPersonas: PersonaType[],
  apiKey: string
): Promise<RoomChatMessage[]> {
  const personaListStr = targetPersonas.map(p => `${PERSONAS[p].name} (${PERSONAS[p].role})`).join(', ');

  const systemPrompt = `You are Perspective.ai's Live Advisory Room Engine.
You are simulating a live board meeting for: "${problemStatement}".
The user just sent: "${newPrompt}".

CRITICAL INSTRUCTIONS:
- You MUST generate natural, deep, first-person advisory responses ONLY for: ${personaListStr}.
- Address the user's EXACT words, industry, products, companies, or assignments mentioned in their prompt.
- DO NOT use corporate MBA fluff.
- Output MUST be a valid JSON array:
[
  { "persona": "${targetPersonas[0]}", "content": "Deep 2-3 paragraph response addressing their exact prompt..." }
]`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: newPrompt }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || '[]';
  const parsed = cleanJsonResponse(text);
  return parsed.map((item: any) => {
    const info = PERSONAS[item.persona] || PERSONAS.strategist;
    return {
      id: `chat-${Date.now()}-${item.persona}`,
      sender: item.persona as PersonaType,
      senderName: info.name,
      avatar: info.avatar,
      content: item.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mentions: targetPersonas
    };
  });
}

async function generateOpenAIRoomChat(
  problemStatement: string,
  history: RoomChatMessage[],
  newPrompt: string,
  targetPersonas: PersonaType[],
  apiKey: string
): Promise<RoomChatMessage[]> {
  const personaListStr = targetPersonas.map(p => `${PERSONAS[p].name} (${PERSONAS[p].role})`).join(', ');

  const systemPrompt = `You are Perspective.ai's Live Advisory Room Engine for: "${problemStatement}".
Generate natural, deep, first-person advisory responses for: ${personaListStr}.
Address the exact details in the user's prompt.
Return JSON format: { "responses": [ { "persona": "${targetPersonas[0]}", "content": "..." } ] }`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: newPrompt }
      ]
    })
  });

  const data = await res.json();
  const parsed = cleanJsonResponse(data.choices[0].message.content);
  const items = parsed.responses || parsed;

  return items.map((item: any) => {
    const info = PERSONAS[item.persona] || PERSONAS.strategist;
    return {
      id: `chat-${Date.now()}-${item.persona}`,
      sender: item.persona as PersonaType,
      senderName: info.name,
      avatar: info.avatar,
      content: item.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mentions: targetPersonas
    };
  });
}
