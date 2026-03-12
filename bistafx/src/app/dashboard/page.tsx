"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════════════════
   Count-Up Animation Hook
   ══════════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [target, duration]
  );

  useEffect(() => {
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return value;
}

function CountUpValue({
  value,
  prefix = "$",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  decimals?: number;
}) {
  const animated = useCountUp(value);
  const formatted =
    decimals > 0
      ? animated.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : Math.round(animated)
          .toLocaleString();
  return (
    <>
      {prefix}
      {formatted}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════ */
interface AccountInfo {
  login: string;
  server: string;
  balance: number;
  equity: number;
}

/* ══════════════════════════════════════════════════════
   Login Screen
   ══════════════════════════════════════════════════════ */
function LoginScreen({ onConnect }: { onConnect: (account: AccountInfo) => void }) {
  const [mt5Login, setMt5Login] = useState("");
  const [mt5Password, setMt5Password] = useState("");
  const [mt5Server, setMt5Server] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/mt5-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mt5_login: mt5Login,
          mt5_password: mt5Password,
          mt5_server: mt5Server,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      onConnect(data.account);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative z-[1] px-6 py-10">
      {/* Ambient glow */}
      <div className="fixed w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(255,199,44,0.07)_0%,transparent_70%)] -top-[150px] -left-[100px]" />
      <div className="fixed w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(100,100,255,0.04)_0%,transparent_70%)] bottom-[10%] -right-[100px]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-[1000px] w-full items-center">
        {/* Left info panel */}
        <div>
          <Link href="/" className="text-lg font-normal tracking-tight">
            <strong className="font-bold text-gold">Bista</strong>
            <span className="text-text-primary">FX</span>
          </Link>
          <h1 className="font-[family-name:var(--font-archivo)] text-[clamp(1.75rem,4vw,2.375rem)] font-bold leading-[1.15] tracking-tight mt-8 mb-4">
            Connect Your <span className="gold-text">MetaTrader 5</span> Account
          </h1>
          <p className="text-[15px] text-text-secondary leading-relaxed mb-8">
            Access your complete trading journal, equity curve, and performance
            analytics with read-only investor credentials.
          </p>
          <div className="flex flex-col gap-3.5">
            {[
              {
                icon: (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#FFC72C" strokeWidth="1.5" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#FFC72C" strokeWidth="1.5" />
                  </>
                ),
                text: "Read-only access. No trading or withdrawals.",
              },
              {
                icon: (
                  <>
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#FFC72C" strokeWidth="1.5" />
                    <path d="M9 12l2 2 4-4" stroke="#FFC72C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                ),
                text: "Investor password only. Never master password.",
              },
              {
                icon: (
                  <>
                    <circle cx="12" cy="12" r="10" stroke="#FFC72C" strokeWidth="1.5" />
                    <path d="M12 6v6l4 2" stroke="#FFC72C" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ),
                text: "Auto-sync every 1 minute. Manual refresh available.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  {item.icon}
                </svg>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Login card */}
        <div className="glass-card p-9 rounded-[20px]">
          <h2 className="text-[22px] font-semibold mb-1">Connect Account</h2>
          <p className="text-sm text-text-muted mb-6">
            Enter your MetaTrader 5 investor credentials
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">
                MT5 Account Number
              </label>
              <input
                type="text"
                value={mt5Login}
                onChange={(e) => setMt5Login(e.target.value)}
                placeholder="e.g. 12345678"
                required
                disabled={loading}
                className="text-sm px-3.5 py-2.5 border border-glass-border rounded-[10px] bg-[rgba(255,255,255,0.03)] text-text-primary outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-dim)] transition placeholder:text-text-muted disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Investor Password
              </label>
              <input
                type="password"
                value={mt5Password}
                onChange={(e) => setMt5Password(e.target.value)}
                placeholder="Investor password (read-only)"
                required
                disabled={loading}
                className="text-sm px-3.5 py-2.5 border border-glass-border rounded-[10px] bg-[rgba(255,255,255,0.03)] text-text-primary outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-dim)] transition placeholder:text-text-muted disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Server Name
              </label>
              <input
                type="text"
                value={mt5Server}
                onChange={(e) => setMt5Server(e.target.value)}
                placeholder="e.g. OANDA-Live"
                required
                disabled={loading}
                className="text-sm px-3.5 py-2.5 border border-glass-border rounded-[10px] bg-[rgba(255,255,255,0.03)] text-text-primary outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-dim)] transition placeholder:text-text-muted disabled:opacity-50"
              />
            </div>

            {/* Security badge */}
            <div className="flex items-center gap-2 text-xs text-text-muted px-3.5 py-2.5 bg-[rgba(255,199,44,0.04)] border border-[rgba(255,199,44,0.08)] rounded-lg">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1a3 3 0 00-3 3v2H4a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1h-1V4a3 3 0 00-3-3zm1 6v2a1 1 0 11-2 0V7h2zM7 4a1 1 0 112 0v2H7V4z"
                  fill="#FFC72C"
                />
              </svg>
              <span>Encrypted connection. Credentials are not stored.</span>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-sm text-red font-medium bg-red-bg px-4 py-3 rounded-[10px] border border-[rgba(239,68,68,0.2)]">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 bg-gold text-[#0A0A0A] rounded-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_var(--color-gold-glow)] transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Connecting to MT5...
                </>
              ) : (
                "Connect & Launch Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Dashboard Panel
   ══════════════════════════════════════════════════════ */
function DashboardPanel({ account, onDisconnect }: { account: AccountInfo; onDisconnect: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [spinning, setSpinning] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    let mounted = true;
    const checkBridge = async () => {
      try {
        const res = await fetch("/api/auth/mt5-status");
        const data = await res.json();
        if (mounted) setBridgeStatus(data.status === "online" ? "online" : "offline");
      } catch {
        if (mounted) setBridgeStatus("offline");
      }
    };
    checkBridge();
    const interval = setInterval(checkBridge, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "equity", label: "Equity Curve" },
    { id: "journal", label: "Trade Journal" },
    { id: "open", label: "Open Positions" },
    { id: "analytics", label: "Analytics" },
  ];

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <div className="relative z-[1]">
      {/* Ambient glow */}
      <div className="fixed w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(255,199,44,0.07)_0%,transparent_70%)] -top-[150px] -left-[100px]" />
      <div className="fixed w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(100,100,255,0.04)_0%,transparent_70%)] bottom-[10%] -right-[100px]" />

      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[rgba(5,5,8,0.88)] backdrop-blur-[20px] border-b border-glass-border">
        <div className="max-w-[1320px] mx-auto px-6 flex items-center h-14 gap-4">
          <Link href="/" className="text-lg font-normal tracking-tight">
            <strong className="font-bold text-gold">Bista</strong>
            <span className="text-text-primary">FX</span>
          </Link>

          <nav className="hidden lg:flex gap-0.5 ml-7 bg-[rgba(255,255,255,0.03)] border border-glass-border rounded-[10px] p-[3px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[13px] font-medium px-4 py-1.5 rounded-[7px] transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-surface-hover text-text-primary shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            {/* MT5 Bridge Status */}
            <span
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${
                bridgeStatus === "online"
                  ? "text-green bg-green-bg border-[rgba(34,197,94,0.12)]"
                  : bridgeStatus === "offline"
                  ? "text-red bg-red-bg border-[rgba(239,68,68,0.15)]"
                  : "text-text-muted bg-glass border-glass-border"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  bridgeStatus === "online"
                    ? "bg-green animate-pulse-dot"
                    : bridgeStatus === "offline"
                    ? "bg-red"
                    : "bg-text-muted animate-pulse"
                }`}
              />
              {bridgeStatus === "online"
                ? "MT5 Bridge Active"
                : bridgeStatus === "offline"
                ? "Bridge Offline"
                : "Checking..."}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-text-secondary px-3 py-1.5 bg-green-bg border border-[rgba(34,197,94,0.12)] rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
              {account.login} @ {account.server}
            </span>

            <button
              onClick={handleRefresh}
              className="flex items-center justify-center w-[34px] h-[34px] border border-glass-border rounded-lg text-text-secondary hover:text-text-primary hover:border-glass-border-hover hover:bg-surface-hover transition cursor-pointer"
              title="Refresh"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={spinning ? "animate-spin" : ""}
              >
                <path
                  d="M13.65 2.35A7.96 7.96 0 008 0C3.58 0 .01 3.58.01 8S3.58 16 8 16c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 018 14 6 6 0 012 8a6 6 0 016-6c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <button
              onClick={onDisconnect}
              className="text-[13px] font-medium px-4 py-1.5 border border-glass-border rounded-[10px] text-text-primary hover:border-glass-border-hover hover:bg-surface-hover transition cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1320px] mx-auto pt-[76px] px-6 pb-12">
        {/* Mobile tab selector */}
        <div className="lg:hidden mb-4">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full text-sm px-4 py-2.5 bg-glass border border-glass-border rounded-[10px] text-text-primary outline-none"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id} className="bg-[#111]">
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {activeTab === "overview" && <OverviewTab account={account} />}
        {activeTab === "equity" && <EquityTab account={account} />}
        {activeTab === "journal" && <JournalTab />}
        {activeTab === "open" && <OpenPositionsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </main>
    </div>
  );
}

/* ── Tab: Overview ─────────────────────────────────── */
function OverviewTab({ account }: { account: AccountInfo }) {
  const kpis = [
    { label: "Win Rate", value: "68.4%", delta: "+2.1%", color: "text-green" },
    { label: "Total Trades", value: "342", delta: "+18 this week", color: "text-text-muted" },
    { label: "Profit Factor", value: "1.87", delta: "+0.12", color: "text-green" },
    { label: "Max Drawdown", value: "-4.2%", delta: "Within limits", color: "text-text-muted", valColor: "text-red" },
    { label: "Avg Duration", value: "2h 18m", delta: "Stable", color: "text-text-muted" },
  ];

  const recentTrades = [
    { sym: "EURUSD", type: "Buy", lot: "0.50", entry: "1.0812", exit: "1.0845", pl: "+$165", plColor: "text-green", dur: "2h 14m", time: "Mar 12, 09:15" },
    { sym: "GBPUSD", type: "Sell", lot: "0.30", entry: "1.2658", exit: "1.2621", pl: "+$111", plColor: "text-green", dur: "1h 42m", time: "Mar 12, 08:02" },
    { sym: "USDJPY", type: "Buy", lot: "0.20", entry: "149.120", exit: "148.940", pl: "-$24", plColor: "text-red", dur: "45m", time: "Mar 11, 14:30" },
    { sym: "XAUUSD", type: "Buy", lot: "0.10", entry: "2,158.40", exit: "2,172.80", pl: "+$144", plColor: "text-green", dur: "3h 28m", time: "Mar 11, 10:00" },
    { sym: "EURUSD", type: "Sell", lot: "0.40", entry: "1.0856", exit: "1.0831", pl: "+$100", plColor: "text-green", dur: "1h 05m", time: "Mar 11, 08:10" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Performance Overview</h2>
        <TimeGroup />
      </div>

      {/* Live Balance & Equity hero cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="glass-card p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] transition-all">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle,rgba(255,199,44,0.08)_0%,transparent_70%)] pointer-events-none" />
          <span className="block text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5">Live Balance</span>
          <span className="block text-[32px] font-bold tracking-tight gold-text leading-none mb-1">
            <CountUpValue value={account.balance} decimals={2} />
          </span>
          <span className="text-xs font-medium text-green">Live from MT5</span>
        </div>
        <div className="glass-card p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] transition-all">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle,rgba(255,199,44,0.08)_0%,transparent_70%)] pointer-events-none" />
          <span className="block text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5">Live Equity</span>
          <span className="block text-[32px] font-bold tracking-tight gold-text leading-none mb-1">
            <CountUpValue value={account.equity} decimals={2} />
          </span>
          <span className="text-xs font-medium text-green">Live from MT5</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="glass-card p-5 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
          >
            <span className="block text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
              {k.label}
            </span>
            <span className={`block text-2xl font-bold tracking-tight mb-1 ${k.valColor || "text-text-primary"}`}>
              {k.value}
            </span>
            <span className={`text-xs font-medium ${k.color}`}>{k.delta}</span>
          </div>
        ))}
      </div>

      {/* Equity preview */}
      <div className="glass-card p-6 mb-5">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h3 className="text-[15px] font-semibold">Equity Curve</h3>
          <div className="flex gap-5 text-[13px] text-text-secondary">
            <span><strong className="text-text-muted font-medium mr-1">Balance:</strong><CountUpValue value={account.balance} /></span>
            <span><strong className="text-text-muted font-medium mr-1">Equity:</strong><CountUpValue value={account.equity} /></span>
          </div>
        </div>
        <svg className="w-full h-[140px]" viewBox="0 0 800 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="eqG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC72C" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFC72C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <polyline fill="url(#eqG)" stroke="none" points="0,130 40,125 80,118 120,120 160,110 200,105 240,98 280,102 320,88 360,80 400,85 440,75 480,68 520,72 560,58 600,50 640,45 680,40 720,32 760,25 800,15 800,160 0,160" />
          <polyline fill="none" stroke="#FFC72C" strokeWidth="2" points="0,130 40,125 80,118 120,120 160,110 200,105 240,98 280,102 320,88 360,80 400,85 440,75 480,68 520,72 560,58 600,50 640,45 680,40 720,32 760,25 800,15" />
          <circle cx="800" cy="15" r="4" fill="#FFC72C" />
        </svg>
      </div>

      {/* Recent Trades */}
      <div className="glass-card p-6">
        <h3 className="text-[15px] font-semibold mb-4">Recent Trades</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Symbol", "Type", "Lot", "Entry", "Exit", "P/L", "Duration", "Time"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider px-3.5 py-2.5 border-b border-glass-border whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((t, i) => (
                <tr key={i} className="hover:bg-surface-hover transition">
                  <td className="text-[13px] font-semibold px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] whitespace-nowrap">{t.sym}</td>
                  <td className="px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${t.type === "Buy" ? "text-green bg-green-bg" : "text-red bg-red-bg"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.lot}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.entry}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.exit}</td>
                  <td className={`text-[13px] font-medium px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] ${t.plColor}`}>{t.pl}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.dur}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] whitespace-nowrap">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Equity Curve ─────────────────────────────── */
function EquityTab({ account }: { account: AccountInfo }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Equity Curve</h2>
        <div className="flex gap-5 text-[13px] text-text-secondary">
          <span><strong className="text-text-muted font-medium mr-1">Balance:</strong><CountUpValue value={account.balance} /></span>
          <span><strong className="text-text-muted font-medium mr-1">Equity:</strong><CountUpValue value={account.equity} /></span>
          <span><strong className="text-text-muted font-medium mr-1">Margin:</strong>$1,240</span>
        </div>
      </div>
      <div className="glass-card p-6">
        <svg className="w-full h-[260px]" viewBox="0 0 800 260" preserveAspectRatio="none">
          <defs>
            <linearGradient id="eqG2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC72C" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFC72C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="65" x2="800" y2="65" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0" y1="130" x2="800" y2="130" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="0" y1="195" x2="800" y2="195" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <polyline fill="url(#eqG2)" stroke="none" points="0,220 30,215 60,210 90,205 120,200 150,210 180,195 210,185 240,190 270,175 300,165 330,170 360,155 390,150 420,145 450,140 480,135 510,142 540,128 570,118 600,110 630,100 660,95 690,85 720,78 750,65 780,55 800,40 800,260 0,260" />
          <polyline fill="none" stroke="#FFC72C" strokeWidth="2.5" points="0,220 30,215 60,210 90,205 120,200 150,210 180,195 210,185 240,190 270,175 300,165 330,170 360,155 390,150 420,145 450,140 480,135 510,142 540,128 570,118 600,110 630,100 660,95 690,85 720,78 750,65 780,55 800,40" />
          <circle cx="800" cy="40" r="5" fill="#FFC72C" />
        </svg>
        <div className="flex justify-between pt-2.5 text-[11px] text-text-muted">
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Trade Journal ────────────────────────────── */
function JournalTab() {
  const trades = [
    { sym: "EURUSD", type: "Buy", lot: "0.50", entry: "1.0812", exit: "1.0845", pl: "+$165.00", plC: "text-green", dur: "2h 14m", open: "Mar 12, 09:15", close: "Mar 12, 11:29" },
    { sym: "GBPUSD", type: "Sell", lot: "0.30", entry: "1.2658", exit: "1.2621", pl: "+$111.00", plC: "text-green", dur: "1h 42m", open: "Mar 12, 08:02", close: "Mar 12, 09:44" },
    { sym: "USDJPY", type: "Buy", lot: "0.20", entry: "149.120", exit: "148.940", pl: "-$24.16", plC: "text-red", dur: "45m", open: "Mar 11, 14:30", close: "Mar 11, 15:15" },
    { sym: "XAUUSD", type: "Buy", lot: "0.10", entry: "2,158.40", exit: "2,172.80", pl: "+$144.00", plC: "text-green", dur: "3h 28m", open: "Mar 11, 10:00", close: "Mar 11, 13:28" },
    { sym: "EURUSD", type: "Sell", lot: "0.40", entry: "1.0856", exit: "1.0831", pl: "+$100.00", plC: "text-green", dur: "1h 05m", open: "Mar 11, 08:10", close: "Mar 11, 09:15" },
    { sym: "AUDUSD", type: "Buy", lot: "0.25", entry: "0.6542", exit: "0.6518", pl: "-$60.00", plC: "text-red", dur: "2h 50m", open: "Mar 10, 13:20", close: "Mar 10, 16:10" },
    { sym: "GBPUSD", type: "Buy", lot: "0.35", entry: "1.2590", exit: "1.2638", pl: "+$168.00", plC: "text-green", dur: "4h 12m", open: "Mar 10, 09:00", close: "Mar 10, 13:12" },
    { sym: "USDJPY", type: "Sell", lot: "0.15", entry: "149.450", exit: "149.280", pl: "+$17.11", plC: "text-green", dur: "1h 30m", open: "Mar 10, 07:45", close: "Mar 10, 09:15" },
    { sym: "EURUSD", type: "Buy", lot: "0.60", entry: "1.0788", exit: "1.0762", pl: "-$156.00", plC: "text-red", dur: "3h 05m", open: "Mar 09, 11:00", close: "Mar 09, 14:05" },
    { sym: "XAUUSD", type: "Sell", lot: "0.08", entry: "2,145.60", exit: "2,138.20", pl: "+$59.20", plC: "text-green", dur: "2h 18m", open: "Mar 09, 08:30", close: "Mar 09, 10:48" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Trade Journal</h2>
        <div className="flex gap-2 flex-wrap">
          <input type="text" placeholder="Search trades..." className="text-[13px] px-3.5 py-1.5 border border-glass-border rounded-lg bg-glass text-text-primary outline-none w-[180px] focus:border-gold transition placeholder:text-text-muted" />
          <select className="text-[13px] px-3.5 py-1.5 border border-glass-border rounded-lg bg-glass text-text-primary outline-none cursor-pointer">
            <option className="bg-[#111]">All Pairs</option>
            <option className="bg-[#111]">EURUSD</option>
            <option className="bg-[#111]">GBPUSD</option>
            <option className="bg-[#111]">USDJPY</option>
            <option className="bg-[#111]">XAUUSD</option>
            <option className="bg-[#111]">AUDUSD</option>
          </select>
        </div>
      </div>
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Symbol","Type","Lot","Entry Price","Exit Price","Profit/Loss","Duration","Open Time","Close Time"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider px-3.5 py-2.5 border-b border-glass-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr key={i} className="hover:bg-surface-hover transition">
                  <td className="text-[13px] font-semibold px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] whitespace-nowrap">{t.sym}</td>
                  <td className="px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${t.type === "Buy" ? "text-green bg-green-bg" : "text-red bg-red-bg"}`}>{t.type}</span>
                  </td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.lot}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.entry}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.exit}</td>
                  <td className={`text-[13px] font-medium px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] ${t.plC}`}>{t.pl}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{t.dur}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] whitespace-nowrap">{t.open}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] whitespace-nowrap">{t.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Open Positions ───────────────────────────── */
function OpenPositionsTab() {
  const positions = [
    { sym: "EURUSD", type: "Buy", lot: "0.30", entry: "1.0825", current: "1.0842", pl: "+$51.00", plC: "text-green", swap: "-$1.20", time: "Mar 12, 10:30" },
    { sym: "XAUUSD", type: "Sell", lot: "0.05", entry: "2,168.50", current: "2,165.20", pl: "+$16.50", plC: "text-green", swap: "-$0.80", time: "Mar 12, 11:15" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Open Positions</h2>
        <span className="text-xs text-text-muted px-3 py-1 bg-glass border border-glass-border rounded-md">
          2 active
        </span>
      </div>
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Symbol","Type","Lot","Entry Price","Current Price","Floating P/L","Swap","Open Time"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-medium text-text-muted uppercase tracking-wider px-3.5 py-2.5 border-b border-glass-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.map((p, i) => (
                <tr key={i} className="hover:bg-surface-hover transition">
                  <td className="text-[13px] font-semibold px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] whitespace-nowrap">{p.sym}</td>
                  <td className="px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${p.type === "Buy" ? "text-green bg-green-bg" : "text-red bg-red-bg"}`}>{p.type}</span>
                  </td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{p.lot}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{p.entry}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{p.current}</td>
                  <td className={`text-[13px] font-medium px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] ${p.plC}`}>{p.pl}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)]">{p.swap}</td>
                  <td className="text-[13px] px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.03)] whitespace-nowrap">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Analytics ─────────────────────────────────── */
function AnalyticsTab() {
  const pairData = [
    { name: "EURUSD", pct: 72, pl: "+$1,420", plC: "text-green" },
    { name: "GBPUSD", pct: 68, pl: "+$890", plC: "text-green" },
    { name: "USDJPY", pct: 55, pl: "-$120", plC: "text-red" },
    { name: "XAUUSD", pct: 78, pl: "+$2,340", plC: "text-green" },
    { name: "AUDUSD", pct: 48, pl: "-$310", plC: "text-red" },
  ];

  const monthlyPL = [
    { name: "Jan", pct: 65, pl: "+$1,840", plC: "text-green", barC: "bg-green" },
    { name: "Feb", pct: 20, pl: "-$420", plC: "text-red", barC: "bg-red" },
    { name: "Mar", pct: 80, pl: "+$2,180", plC: "text-green", barC: "bg-green" },
    { name: "Apr", pct: 45, pl: "+$920", plC: "text-green", barC: "bg-green" },
    { name: "May", pct: 55, pl: "+$1,280", plC: "text-green", barC: "bg-green" },
    { name: "Jun", pct: 70, pl: "+$1,650", plC: "text-green", barC: "bg-green" },
  ];

  const metrics = [
    ["Most Traded Pair", "EURUSD"],
    ["Avg Trade Duration", "2h 18m"],
    ["Best Trading Day", "Tuesday"],
    ["Best Session", "London"],
    ["Avg Profit / Trade", "+$37.56", "text-green"],
    ["Avg Loss / Trade", "-$18.42", "text-red"],
    ["Largest Win", "+$482", "text-green"],
    ["Largest Loss", "-$210", "text-red"],
    ["Consecutive Wins", "8"],
    ["Consecutive Losses", "3"],
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight mb-5">Trade Analytics</h2>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Performance by Pair */}
        <div className="glass-card p-6">
          <h3 className="text-[15px] font-semibold mb-4">Performance by Pair</h3>
          <div className="flex flex-col gap-3">
            {pairData.map((p) => (
              <div key={p.name} className="grid grid-cols-[56px_1fr_36px_64px] items-center gap-2.5 text-[13px]">
                <span className="text-text-secondary font-medium text-xs">{p.name}</span>
                <div className="h-1.5 bg-[rgba(255,255,255,0.04)] rounded overflow-hidden">
                  <div className="h-full bg-gold rounded transition-all duration-700" style={{ width: `${p.pct}%` }} />
                </div>
                <span className="text-xs text-text-secondary text-right">{p.pct}%</span>
                <span className={`text-right ${p.plC}`}>{p.pl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="glass-card p-6">
          <h3 className="text-[15px] font-semibold mb-4">Key Metrics</h3>
          <div className="flex flex-col">
            {metrics.map(([label, value, color]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0 text-[13px]">
                <span className="text-text-secondary">{label}</span>
                <strong className={`font-semibold ${color || "text-text-primary"}`}>{value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly P&L */}
        <div className="glass-card p-6">
          <h3 className="text-[15px] font-semibold mb-4">Monthly P&L</h3>
          <div className="flex flex-col gap-3">
            {monthlyPL.map((m) => (
              <div key={m.name} className="grid grid-cols-[56px_1fr_64px] items-center gap-2.5 text-[13px]">
                <span className="text-text-secondary font-medium text-xs">{m.name}</span>
                <div className="h-1.5 bg-[rgba(255,255,255,0.04)] rounded overflow-hidden">
                  <div className={`h-full rounded transition-all duration-700 ${m.barC}`} style={{ width: `${m.pct}%` }} />
                </div>
                <span className={`text-right ${m.plC}`}>{m.pl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Time group (shared) ───────────────────────────── */
function TimeGroup() {
  const [active, setActive] = useState("30D");
  return (
    <div className="flex gap-0.5 bg-glass border border-glass-border rounded-lg p-[3px]">
      {["7D", "30D", "90D", "All"].map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`text-xs font-medium px-3.5 py-1.5 rounded-md transition cursor-pointer ${
            active === t
              ? "bg-surface-hover text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [account, setAccount] = useState<AccountInfo | null>(null);

  if (!account) {
    return <LoginScreen onConnect={setAccount} />;
  }

  return (
    <DashboardPanel
      account={account}
      onDisconnect={() => setAccount(null)}
    />
  );
}
