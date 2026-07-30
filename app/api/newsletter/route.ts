import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

// Basic RFC-5322-ish email validation — good enough for MVP capture.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Subscriber = {
  email: string;
  subscribedAt: string;
};

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // File missing or invalid — start fresh.
    return [];
  }
}

async function writeSubscribers(subs: Subscriber[]): Promise<void> {
  await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2), "utf-8");
}

export async function POST(request: Request) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase();

  try {
    const subscribers = await readSubscribers();

    if (subscribers.some((s) => s.email === normalized)) {
      return NextResponse.json(
        { message: "You're already subscribed. Thanks for being here!" },
        { status: 200 }
      );
    }

    subscribers.push({ email: normalized, subscribedAt: new Date().toISOString() });
    await writeSubscribers(subscribers);

    return NextResponse.json(
      { message: "You're in! Watch your inbox for the next tutorial." },
      { status: 201 }
    );
  } catch {
    // On read-only hosting (e.g. serverless), persistence may fail —
    // don't leak internals to the client.
    return NextResponse.json(
      { error: "Could not save your subscription right now. Please try again later." },
      { status: 500 }
    );
  }
}
