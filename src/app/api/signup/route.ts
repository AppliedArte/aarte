import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, telegram, whatsapp } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Log signup data (replace with your preferred storage: database, CRM, etc.)
    console.log("New signup:", {
      email,
      telegram,
      whatsapp,
      timestamp: new Date().toISOString(),
    });

    // TODO: Add your preferred storage method here
    // Examples:
    // - Save to database (Supabase, Prisma, etc.)
    // - Send to email marketing service (Mailchimp, ConvertKit, etc.)
    // - Store in Google Sheets via API
    // - Send notification to Slack/Discord

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
