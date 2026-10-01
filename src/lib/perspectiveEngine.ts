import { PerspectiveBrief, RoomMode } from '@/types/perspective';

export async function generatePerspectiveBrief(
  problem: string,
  mode: RoomMode
): Promise<PerspectiveBrief> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      console.log('Attempting Live Gemini 3.8 Flash engine...');
      return await callGeminiEngine(problem, mode, geminiKey);
    } catch (err) {
      console.error('Gemini API error, falling back:', err);
    }
  }

  if (anthropicKey) {
    try {
      console.log('Attempting Live Anthropic Claude engine...');
      return await callAnthropicEngine(problem, mode, anthropicKey);
    } catch (err) {
      console.error('Anthropic API error, falling back:', err);
    }
  }

  if (openaiKey) {
    try {
      console.log('Attempting Live OpenAI GPT-4o engine...');
      return await callOpenAIEngine(problem, mode, openaiKey);
    } catch (err) {
      console.error('OpenAI API error, falling back:', err);
    }
  }

  // Fallback engine when API keys are unauthenticated
  return generateDynamicFallback(problem, mode);
}

const SYSTEM_PROMPT = `You are Perspective.ai's Live Board Room Engine.
You simulate a real-time, highly dynamic board meeting of 4 elite human advisors discussing the user's decision statement:

1. Strategist (🧠): Speaks in 1st person ("Look, your beachhead opportunity here is...").
2. Skeptic (🔴): Interrupts with raw trench-warfare skepticism ("Hold on, you're bleeding cash if...").
3. Customer (👤): Speaks directly as the end-user ("I'm your user. Here is why I won't pay for this...").
4. Operator (⚙️): Tactical realist ("Skeptic is right. Execution-wise, your week 1 nightmare will be...").

CRITICAL MANDATE:
- DO NOT use corporate MBA jargon ("operational complexity", "strategic positioning", "beachhead leverage").
- Personas MUST speak in FIRST-PERSON NATURAL DIALOGUE like a real human advisor sitting across the table.
- Address the user's exact specific problem with named real-world operational details.

Output strictly valid JSON matching this exact structure:
{
  "personas": [
    { "persona": "strategist", "title": "Beachhead Strategy", "take": "First person natural quote...", "keyConcern": "..." },
    { "persona": "skeptic", "title": "Fatal Flaw Warning", "take": "First person natural quote...", "keyConcern": "..." },
    { "persona": "customer", "title": "End-User Trust Verdict", "take": "First person natural quote...", "keyConcern": "..." },
    { "persona": "operator", "title": "Execution Reality", "take": "First person natural quote...", "keyConcern": "..." }
  ],
  "consensus": ["Point 1", "Point 2", "Point 3"],
  "disagreements": [
    {
      "topic": "Topic title",
      "perspectiveA": { "persona": "strategist", "point": "..." },
      "perspectiveB": { "persona": "operator", "point": "..." }
    }
  ],
  "blindspots": [
    { "title": "Title", "description": "Description...", "impact": "Critical" | "High" | "Medium" }
  ],
  "assumptionsToTest": ["Assumption 1", "Assumption 2"],
  "nextMove": {
    "title": "Title of experiment",
    "experiment": "Exact setup...",
    "validationMetric": "Metric target..."
  }
}`;

function cleanJsonResponse(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    return JSON.parse(match[0]);
  }
  return JSON.parse(cleaned);
}

async function callGeminiEngine(
  problem: string,
  mode: RoomMode,
  apiKey: string
): Promise<PerspectiveBrief> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${SYSTEM_PROMPT}\n\nROOM MODE: ${mode.toUpperCase()}\nDECISION STATEMENT: "${problem}"` }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'Gemini API failed');
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = cleanJsonResponse(text);

  return {
    id: `brief-${Date.now()}`,
    problemStatement: problem,
    roomMode: mode,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...parsed
  };
}

async function callAnthropicEngine(
  problem: string,
  mode: RoomMode,
  apiKey: string
): Promise<PerspectiveBrief> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `ROOM MODE: ${mode.toUpperCase()}\nDECISION STATEMENT: "${problem}"`
        }
      ]
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Anthropic API failed');
  const text = data.content?.[0]?.text || '';
  const parsed = cleanJsonResponse(text);
  return {
    id: `brief-${Date.now()}`,
    problemStatement: problem,
    roomMode: mode,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...parsed
  };
}

async function callOpenAIEngine(
  problem: string,
  mode: RoomMode,
  apiKey: string
): Promise<PerspectiveBrief> {
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
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `ROOM MODE: ${mode.toUpperCase()}\nDECISION STATEMENT: "${problem}"` }
      ]
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI API failed');
  const parsed = JSON.parse(data.choices[0].message.content);
  return {
    id: `brief-${Date.now()}`,
    problemStatement: problem,
    roomMode: mode,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...parsed
  };
}

function generateDynamicFallback(problem: string, mode: RoomMode): PerspectiveBrief {
  const topic = problem.trim();

  return {
    id: `brief-${Date.now()}`,
    problemStatement: problem,
    roomMode: mode,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    personas: [
      {
        persona: 'strategist',
        title: 'Beachhead Opportunity',
        take: `Look, regarding "${topic}": Your single biggest growth leverage is focusing 100% of your energy on 1 high-intent customer niche instead of spreading marketing thin.`,
        keyConcern: 'Spreading focus across unproven acquisition channels.'
      },
      {
        persona: 'skeptic',
        title: 'Fatal Flaw Warning',
        take: `Hold on. The key vulnerability in "${topic}" is assuming customer adoption will happen without friction. If your acquisition cost exceeds LTV, you will burn runway fast.`,
        keyConcern: 'Underestimating customer switching friction and acquisition cost.'
      },
      {
        persona: 'customer',
        title: 'End-User Trust Verdict',
        take: `I'm your end-user evaluating "${topic}". I care about zero hassle and instant value. If your solution requires complex setup or breaks existing habits, I'll stay with my current routine.`,
        keyConcern: 'High onboarding friction and lack of trust proof.'
      },
      {
        persona: 'operator',
        title: 'Execution Reality',
        take: `Skeptic is right. Execution-wise for "${topic}", your team bandwidth and delivery pipeline will bottleneck if you don't restrict your initial launch to 1 core metric.`,
        keyConcern: 'Team bandwidth overload and delivery delays.'
      }
    ],
    consensus: [
      `Isolating 1 primary beachhead focus for "${topic}" yields faster learning cycles than launching multiple features simultaneously.`,
      `Customer adoption requires reducing onboarding friction to near zero.`,
      `Validating real customer willingness to pay early prevents burning runway on unproven ideas.`
    ],
    disagreements: [
      {
        topic: 'Speed of Launch vs Operational Quality',
        perspectiveA: {
          persona: 'strategist',
          point: 'Launch fast to claim market positioning and gather real user data.'
        },
        perspectiveB: {
          persona: 'skeptic',
          point: 'Shipping an unproven workflow damages early customer trust permanently.'
        }
      }
    ],
    blindspots: [
      {
        title: 'Unvalidated Customer Willingness to Pay',
        description: `Assuming target users will pay for "${topic}" without testing a live pre-order or waitlist smoke test.`,
        impact: 'Critical'
      }
    ],
    assumptionsToTest: [
      `Target customers experience enough daily pain with "${topic}" to switch tools.`
    ],
    nextMove: {
      title: '7-Day Value Proposition Smoke Test',
      experiment: `Build a 1-page landing page focused strictly on "${topic}" with a waitlist button to measure real buyer intent.`,
      validationMetric: 'Achieve >20% waitlist conversion rate on target traffic.'
    }
  };
}
