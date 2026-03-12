import { NextResponse } from "next/server";

const VPS_URL = process.env.VPS_ENDPOINT || "http://207.148.75.109:5000";

export async function GET() {
  try {
    const res = await fetch(`${VPS_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      return NextResponse.json({ status: "online" });
    }

    return NextResponse.json({ status: "offline" }, { status: 502 });
  } catch {
    return NextResponse.json({ status: "offline" }, { status: 503 });
  }
}
