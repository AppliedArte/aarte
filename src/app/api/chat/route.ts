import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const response = await fetch("https://api.aarte.co/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { reply: "Connection issue — please try again." },
      { status: 500 }
    );
  }
}
