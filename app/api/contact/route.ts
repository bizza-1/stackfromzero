import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactMessage = {
  name: string;
  email: string;
  message: string;
  sentAt: string;
};

async function readMessages(): Promise<ContactMessage[]> {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeMessages(messages: ContactMessage[]): Promise<void> {
  await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
}

export async function POST(request: Request) {
  let name: unknown;
  let email: unknown;
  let message: unknown;
  try {
    const body = await request.json();
    name = body?.name;
    email = body?.email;
    message = body?.message;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Validate each field with a specific, user-friendly message.
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 400 }
    );
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json(
      { error: "Please enter a message of at least 10 characters." },
      { status: 400 }
    );
  }

  const entry: ContactMessage = {
    name: name.trim().slice(0, 200),
    email: email.trim().toLowerCase(),
    message: message.trim().slice(0, 5000),
    sentAt: new Date().toISOString(),
  };

  try {
    const messages = await readMessages();
    messages.push(entry);
    await writeMessages(messages);

    return NextResponse.json(
      { message: "Thanks for reaching out! We'll get back to you soon." },
      { status: 201 }
    );
  } catch {
    // On read-only hosting persistence may fail — don't leak internals.
    return NextResponse.json(
      { error: "Could not send your message right now. Please email us directly." },
      { status: 500 }
    );
  }
}
