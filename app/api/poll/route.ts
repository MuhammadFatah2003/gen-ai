import { NextRequest, NextResponse } from 'next/server';

const N8N_POLL_URL = process.env.N8N_POLL_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(N8N_POLL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    const text = await response.text();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: true, message: 'No response from poll' }, { status: 500 });
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: true, message: `Invalid poll response` }, { status: 500 });
    }

    if (!response.ok || data.error) {
      return NextResponse.json(
        { error: true, message: (data.message as string) ?? 'Poll failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}
