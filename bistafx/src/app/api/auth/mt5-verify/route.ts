import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Live MT5 Bridge on VPS
const VPS_URL = process.env.VPS_ENDPOINT || "http://207.148.75.109:5000";
const VPS_ENDPOINT = `${VPS_URL}/auth`;

export async function POST(req: NextRequest) {
  try {
    const { mt5_login, mt5_password, mt5_server } = await req.json();

    if (!mt5_login || !mt5_password || !mt5_server) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // ── Step 1: Call live VPS bridge to verify MT5 credentials ─────
    let vpsData: { success: boolean; balance?: number; equity?: number; error?: string };

    try {
      const vpsRes = await fetch(VPS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: mt5_login,
          password: mt5_password,
          server: mt5_server,
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (!vpsRes.ok) {
        const text = await vpsRes.text();
        console.error("[mt5-verify] VPS returned HTTP", vpsRes.status, text);
        return NextResponse.json(
          { success: false, error: "MT5 bridge returned an error. Please try again." },
          { status: 502 }
        );
      }

      vpsData = await vpsRes.json();
    } catch (fetchErr) {
      console.error("[mt5-verify] VPS fetch failed:", fetchErr);
      return NextResponse.json(
        { success: false, error: "Could not reach MT5 server. Please try again later." },
        { status: 503 }
      );
    }

    if (!vpsData.success) {
      return NextResponse.json(
        { success: false, error: vpsData.error || "MT5 authentication failed. Check your credentials." },
        { status: 401 }
      );
    }

    // ── Step 2: Upsert into Supabase trading_accounts ─────────────
    const userId = `mt5_${mt5_login}`;

    const { error: dbError } = await supabase
      .from("trading_accounts")
      .upsert(
        {
          user_id: userId,
          mt5_login,
          mt5_server,
          last_balance: vpsData.balance ?? 0,
          equity: vpsData.equity ?? 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "mt5_login" }
      );

    if (dbError) {
      console.error("[mt5-verify] Supabase error:", dbError);
      // Don't block login if DB write fails — log and continue
    }

    return NextResponse.json({
      success: true,
      account: {
        login: mt5_login,
        server: mt5_server,
        balance: vpsData.balance,
        equity: vpsData.equity,
      },
    });
  } catch (err) {
    console.error("[mt5-verify] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
