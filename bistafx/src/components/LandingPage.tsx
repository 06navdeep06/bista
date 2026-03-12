"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DigitalGlobe = dynamic(() => import("@/components/DigitalGlobe"), {
  ssr: false,
});

/* ── Navbar ───────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2.5 bg-[rgba(5,5,8,0.85)] backdrop-blur-[20px] border-b border-glass-border"
          : "py-4"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-3">
        <Link href="/" className="text-lg font-normal tracking-tight mr-6">
          <strong className="font-bold text-gold">Bista</strong>
          <span className="text-text-primary">FX</span>
        </Link>

        <nav className="hidden md:flex gap-1">
          {[
            ["Home", "#home"],
            ["Features", "#features"],
            ["Services", "#services"],
            ["How It Works", "#how"],
            ["About", "#about"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[13px] font-medium text-text-secondary px-3.5 py-2 rounded-lg hover:text-text-primary hover:bg-surface-hover transition"
            >
              {label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="text-[13px] font-medium text-gold bg-gold-dim px-3.5 py-2 rounded-lg hover:bg-[rgba(255,199,44,0.22)] transition"
          >
            MT5 Dashboard
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <a
            href="#contact"
            className="inline-flex items-center text-sm font-medium px-5 py-2.5 border border-glass-border rounded-[10px] text-text-primary hover:border-glass-border-hover hover:bg-surface-hover transition"
          >
            Contact
          </a>
          <Link
            href="/dashboard"
            className="btn-gold inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 bg-gold text-[#0A0A0A] rounded-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_var(--color-gold-glow)] transition-all"
          >
            Launch Dashboard
          </Link>
        </div>

        <button
          className="md:hidden ml-auto flex flex-col gap-[5px] p-2 bg-transparent border-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span
            className={`block w-[22px] h-0.5 bg-text-primary rounded transition-all ${
              mobileOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-0.5 bg-text-primary rounded transition-all ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-0.5 bg-text-primary rounded transition-all ${
              mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden flex flex-col bg-[rgba(5,5,8,0.95)] backdrop-blur-[20px] px-6 py-4 border-b border-glass-border">
          {[
            ["Home", "#home"],
            ["Features", "#features"],
            ["Services", "#services"],
            ["How It Works", "#how"],
            ["About", "#about"],
            ["Dashboard", "/dashboard"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-text-secondary py-2 hover:text-text-primary transition"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ── Scroll reveal hook ───────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-up ${className}`}>
      {children}
    </div>
  );
}

/* ── Hero Section ─────────────────────────────────── */
function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      className="relative z-[1] min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Globe background */}
      <DigitalGlobe />

      {/* Ambient glow blobs */}
      <div className="fixed w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(255,199,44,0.07)_0%,transparent_70%)] -top-[200px] -left-[100px]" />
      <div className="fixed w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 bg-[radial-gradient(circle,rgba(255,199,44,0.04)_0%,transparent_70%)] top-1/2 -right-[150px]" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-36 pb-16 max-w-[760px] mx-auto">
        <span
          className={`inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-dim border border-[rgba(255,199,44,0.12)] px-4 py-1.5 rounded-full mb-7 transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Powered by OANDA
        </span>

        <h1
          className={`font-[family-name:var(--font-archivo)] text-[clamp(2rem,5.5vw,3.5rem)] font-bold leading-[1.08] tracking-[-2px] mb-6 transition-all duration-700 delay-100 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Professional Forex Trading
          <br />
          with <span className="gold-text">Institutional Precision</span>
        </h1>

        <p
          className={`text-lg text-text-secondary leading-relaxed max-w-[580px] mb-9 transition-all duration-700 delay-200 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          BistaFX combines disciplined trading strategies with the reliability
          of OANDA&apos;s global trading infrastructure.
        </p>

        <div
          className={`flex gap-3 flex-wrap justify-center transition-all duration-700 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/dashboard"
            className="btn-gold inline-flex items-center gap-2 text-[15px] font-semibold px-7 py-3.5 bg-gold text-[#0A0A0A] rounded-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_var(--color-gold-glow),0_0_60px_rgba(255,199,44,0.12)] transition-all"
          >
            Open MT5 Dashboard
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10m-4-4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center text-[15px] font-medium px-7 py-3.5 border border-glass-border rounded-[10px] text-text-primary hover:border-glass-border-hover hover:bg-surface-hover hover:-translate-y-px transition-all"
          >
            Explore Features
          </a>
        </div>

        {/* Scroll hint */}
        <div
          className={`mt-16 flex flex-col items-center gap-2.5 text-text-muted text-xs tracking-wide transition-all duration-700 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-6 h-[38px] border-2 border-text-muted rounded-xl relative">
            <div
              className="w-[3px] h-2 bg-gold rounded absolute left-1/2 -translate-x-1/2"
              style={{ animation: "mouseScroll 2s ease-in-out infinite", top: "6px" }}
            />
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

/* ── Features Section ─────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      num: "01",
      title: "OANDA Partnership",
      desc: "Exclusive partnership with one of the world's most trusted forex brokers. Access institutional-grade execution, deep liquidity pools, and transparent pricing across 70+ currency pairs.",
    },
    {
      num: "02",
      title: "Sub-Second Execution",
      desc: "Orders execute in under 50 milliseconds with minimal slippage. Our direct market access infrastructure ensures your trades hit the market at the price you see.",
    },
    {
      num: "03",
      title: "Security & Regulation",
      desc: "OANDA is regulated across major financial jurisdictions including the FCA, ASIC, and IIROC. Client funds are held in segregated accounts with tier-1 banks.",
    },
    {
      num: "04",
      title: "MT5 Trade Journal",
      desc: "Connect your MetaTrader 5 account with read-only investor credentials and access your complete trade journal — equity curves, trade history, and performance analytics.",
    },
  ];

  return (
    <section id="features" className="relative z-[1] py-20">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-16 items-start">
        <div className="lg:sticky lg:top-[120px]">
          <RevealSection>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-dim border border-[rgba(255,199,44,0.12)] px-4 py-1.5 rounded-full mb-5">
              Platform
            </span>
            <h2 className="font-[family-name:var(--font-archivo)] text-4xl font-bold tracking-tight leading-tight mb-4">
              Why Traders Choose <span className="gold-text">BistaFX</span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              Scroll through our key capabilities that set us apart from
              traditional retail brokers.
            </p>
          </RevealSection>
        </div>

        <div className="flex flex-col gap-6">
          {features.map((f) => (
            <RevealSection key={f.num}>
              <div className="glass-card p-9 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25),0_0_40px_rgba(255,199,44,0.03)]">
                <span className="block text-[13px] font-bold text-gold tracking-wider mb-3">
                  {f.num}
                </span>
                <h3 className="text-xl font-semibold tracking-tight mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.desc}
                </p>
                {f.num === "04" && (
                  <Link
                    href="/dashboard"
                    className="btn-gold inline-flex items-center gap-2 mt-4 text-sm font-semibold px-5 py-2.5 bg-gold text-[#0A0A0A] rounded-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_var(--color-gold-glow)] transition-all"
                  >
                    Open Dashboard
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8h10m-4-4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Services Section ─────────────────────────────── */
function ServicesSection() {
  const services = [
    {
      num: "01",
      title: "Forex Trading",
      desc: "Access global currency markets with competitive spreads and fast execution across major, minor, and exotic pairs.",
      tags: ["70+ Pairs", "Tight Spreads", "Fast Execution"],
    },
    {
      num: "02",
      title: "Managed Accounts",
      desc: "Professional traders manage client portfolios using proven risk management strategies and consistent execution.",
      tags: ["PAMM Accounts", "Risk Managed", "Transparent"],
    },
    {
      num: "03",
      title: "Trading Signals",
      desc: "Real-time market alerts and actionable trading strategies grounded in technical and fundamental analysis.",
      tags: ["Real-Time", "Technical", "Fundamental"],
    },
    {
      num: "04",
      title: "Market Analysis",
      desc: "Daily forex insights and market commentary from experienced analysts covering global macro trends.",
      tags: ["Daily Reports", "Macro Trends", "Expert Analysts"],
    },
  ];

  return (
    <section id="services" className="relative z-[1] py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <RevealSection className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-dim border border-[rgba(255,199,44,0.12)] px-4 py-1.5 rounded-full mb-5">
            What We Offer
          </span>
          <h2 className="font-[family-name:var(--font-archivo)] text-4xl font-bold tracking-tight mb-3.5">
            Trading Services
          </h2>
          <p className="text-base text-text-secondary max-w-[560px] mx-auto">
            Everything you need to trade forex professionally.
          </p>
        </RevealSection>

        <div className="flex flex-col gap-4">
          {services.map((s) => (
            <RevealSection key={s.num}>
              <div className="glass-card p-9 grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-8 items-center hover:-translate-y-1 hover:scale-[1.005] hover:shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
                <div>
                  <span className="block text-xs font-bold text-gold tracking-wider mb-2.5">
                    {s.num}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight mb-2.5">
                    {s.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-text-secondary px-4 py-2 bg-[rgba(255,255,255,0.03)] border border-glass-border rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works Section ─────────────────────────── */
function HowSection() {
  const steps = [
    {
      title: "Create Your MT5 Account",
      desc: "Open a MetaTrader 5 account through OANDA. Complete verification and fund your account to begin trading.",
    },
    {
      title: "Connect to BistaFX",
      desc: "Use your investor password (read-only) to connect your account to the BistaFX dashboard. Your credentials are encrypted and never stored.",
    },
    {
      title: "Trade & Track",
      desc: "Execute trades on MT5 and monitor your full performance — equity curve, trade journal, win rate, and profit analytics — all in one dashboard.",
    },
  ];

  return (
    <section id="how" className="relative z-[1] py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <RevealSection className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-dim border border-[rgba(255,199,44,0.12)] px-4 py-1.5 rounded-full mb-5">
            Process
          </span>
          <h2 className="font-[family-name:var(--font-archivo)] text-4xl font-bold tracking-tight mb-3.5">
            How It Works
          </h2>
          <p className="text-base text-text-secondary max-w-[560px] mx-auto">
            Get started in three simple steps.
          </p>
        </RevealSection>

        <div className="relative max-w-[640px] mx-auto pl-10">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[rgba(255,255,255,0.06)] rounded" />
          {steps.map((step, i) => (
            <RevealSection key={i} className="relative mb-8 last:mb-0">
              <div className="absolute -left-[34px] top-7 w-3 h-3 rounded-full bg-bg border-2 border-gold z-[2] shadow-[0_0_12px_rgba(255,199,44,0.2)]" />
              <div className="glass-card p-7">
                <span className="block text-[11px] font-semibold text-gold uppercase tracking-wider mb-2.5">
                  Step {i + 1}
                </span>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About Section ────────────────────────────────── */
function AboutSection() {
  return (
    <section id="about" className="relative z-[1] py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <RevealSection>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-dim border border-[rgba(255,199,44,0.12)] px-4 py-1.5 rounded-full mb-5">
              Who We Are
            </span>
            <h2 className="font-[family-name:var(--font-archivo)] text-4xl font-bold tracking-tight mb-5">
              About <span className="gold-text">BistaFX</span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed mb-3">
              BistaFX is a professional forex trading firm built on
              institutional discipline and transparency. We partner exclusively
              with OANDA to deliver reliable execution, deep liquidity, and a
              trading environment trusted worldwide.
            </p>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              Our team combines technical precision with rigorous risk
              management to deliver consistent results.
            </p>
          </RevealSection>

          <RevealSection>
            <div className="flex flex-col gap-3.5">
              {[
                {
                  title: "Institutional Grade",
                  desc: "Professional infrastructure and execution standards.",
                  icon: (
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      stroke="#FFC72C"
                      strokeWidth="1.5"
                    />
                  ),
                },
                {
                  title: "Transparency",
                  desc: "Clear pricing, honest reporting, no hidden fees.",
                  icon: (
                    <>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#FFC72C"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 12l3 3 5-5"
                        stroke="#FFC72C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ),
                },
                {
                  title: "Risk Discipline",
                  desc: "Proven strategies with strict risk management.",
                  icon: (
                    <path
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      stroke="#FFC72C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="glass-card flex gap-4 items-start p-5 hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 min-w-[40px] flex items-center justify-center bg-gold-dim border border-[rgba(255,199,44,0.12)] rounded-[10px]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      {v.icon}
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm mb-0.5">{v.title}</strong>
                    <span className="text-[13px] text-text-secondary">
                      {v.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ──────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative z-[1] py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <RevealSection>
          <div className="glass-card text-center p-16 rounded-3xl relative">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,199,44,0.04)_0%,transparent_50%)] pointer-events-none" />
            <h2 className="font-[family-name:var(--font-archivo)] text-4xl font-bold tracking-tight mb-3.5 relative z-[1]">
              Ready to Trade with{" "}
              <span className="gold-text">Precision?</span>
            </h2>
            <p className="text-base text-text-secondary max-w-[520px] mx-auto mb-7 relative z-[1]">
              Connect your MetaTrader 5 account and access your full trade
              journal, equity curve, and performance analytics.
            </p>
            <div className="flex justify-center gap-3 flex-wrap relative z-[1]">
              <Link
                href="/dashboard"
                className="btn-gold inline-flex items-center gap-2 text-[15px] font-semibold px-7 py-3.5 bg-gold text-[#0A0A0A] rounded-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_var(--color-gold-glow)] transition-all"
              >
                Open MT5 Dashboard
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10m-4-4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center text-[15px] font-medium px-7 py-3.5 border border-glass-border rounded-[10px] text-text-primary hover:border-glass-border-hover hover:bg-surface-hover transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ── Contact Section ──────────────────────────────── */
function ContactSection() {
  return (
    <section id="contact" className="relative z-[1] py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <RevealSection>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gold bg-gold-dim border border-[rgba(255,199,44,0.12)] px-4 py-1.5 rounded-full mb-5">
              Get in Touch
            </span>
            <h2 className="font-[family-name:var(--font-archivo)] text-[32px] font-bold tracking-tight mb-3.5">
              Contact Us
            </h2>
            <p className="text-[15px] text-text-secondary mb-7">
              Ready to start trading or have questions? Our team is here to
              help.
            </p>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M3 5l7 5 7-5"
                    stroke="#FFC72C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="2"
                    y="4"
                    width="16"
                    height="12"
                    rx="2"
                    stroke="#FFC72C"
                    strokeWidth="1.5"
                  />
                </svg>
                <span>support@bistafx.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="7"
                    stroke="#FFC72C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 6v4h3"
                    stroke="#FFC72C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Mon-Fri, 8AM-6PM UTC</span>
              </div>
            </div>
          </RevealSection>

          <RevealSection>
            <form
              className="glass-card flex flex-col gap-4 p-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-text-muted">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="text-sm px-3.5 py-2.5 border border-glass-border rounded-[10px] bg-[rgba(255,255,255,0.03)] text-text-primary outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-dim)] transition placeholder:text-text-muted"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-text-muted">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="text-sm px-3.5 py-2.5 border border-glass-border rounded-[10px] bg-[rgba(255,255,255,0.03)] text-text-primary outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-dim)] transition placeholder:text-text-muted"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-muted">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="text-sm px-3.5 py-2.5 border border-glass-border rounded-[10px] bg-[rgba(255,255,255,0.03)] text-text-primary outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-dim)] transition placeholder:text-text-muted"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-text-muted">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="text-sm px-3.5 py-2.5 border border-glass-border rounded-[10px] bg-[rgba(255,255,255,0.03)] text-text-primary outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-dim)] transition resize-y placeholder:text-text-muted"
                />
              </div>
              <button className="btn-gold inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 bg-gold text-[#0A0A0A] rounded-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_var(--color-gold-glow)] transition-all">
                Send Message
              </button>
            </form>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="relative z-[1] border-t border-glass-border pt-14">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 pb-10">
        <div>
          <Link href="/" className="text-lg font-normal tracking-tight">
            <strong className="font-bold text-gold">Bista</strong>
            <span className="text-text-primary">FX</span>
          </Link>
          <p className="text-sm text-text-muted mt-3 leading-relaxed">
            Professional forex trading backed by institutional infrastructure.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[13px] font-semibold text-text-primary mb-1.5 tracking-wide">
            Company
          </h4>
          <a
            href="#about"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            About
          </a>
          <a
            href="#services"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            Services
          </a>
          <a
            href="#contact"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            Contact
          </a>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[13px] font-semibold text-text-primary mb-1.5 tracking-wide">
            Trading
          </h4>
          <a
            href="#features"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            Platform
          </a>
          <a
            href="#how"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            How It Works
          </a>
          <Link
            href="/dashboard"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            MT5 Dashboard
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[13px] font-semibold text-text-primary mb-1.5 tracking-wide">
            Legal
          </h4>
          <a
            href="#"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            Risk Disclosure
          </a>
          <a
            href="#"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-text-muted hover:text-text-primary transition"
          >
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-5 border-t border-glass-border text-[13px] text-text-muted">
        &copy; 2026 BistaFX. All rights reserved.
      </div>
    </footer>
  );
}

/* ── Main Landing Page ────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <HowSection />
        <AboutSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
