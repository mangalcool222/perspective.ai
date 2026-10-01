import { NextResponse } from 'next/server';
import { generatePerspectiveBrief } from '@/lib/perspectiveEngine';
import { RoomMode } from '@/types/perspective';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problem, mode } = body;

    if (!problem || typeof problem !== 'string' || problem.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please enter a valid decision problem statement (at least 5 characters).' },
        { status: 400 }
      );
    }

    const roomMode: RoomMode = ['think', 'challenge', 'brainstorm'].includes(mode)
      ? mode
      : 'think';

    const brief = await generatePerspectiveBrief(problem.trim(), roomMode);

    return NextResponse.json({ success: true, brief });
  } catch (error: any) {
    console.error('Error in analyze API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assemble the decision room.' },
      { status: 500 }
    );
  }
}
