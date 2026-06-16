import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  // Primary accent — brick red
  olive:       "#B84040",
  oliveLight:  "#C24A3A",
  oliveMid:    "#C87060",
  olivePale:   "#D4A090",
  oliveFaint:  "#F8ECEC",

  // Backgrounds — warm ivory / cream
  sage:        "#F2EDEA",
  parchment:   "#F7F3EF",
  paper:       "#FDFAF7",
  linen:       "#F0EAE4",
  warm:        "#EDE5DC",

  // Typography — warm charcoal
  ink:         "#1E1A18",
  inkMid:      "#3C3430",
  inkSoft:     "#7A6E68",
  white:       "#FFFFFF",

  // Status — warm-toned
  amber:       "#8A5A20",
  amberBg:     "#FBF2E4",
  rose:        "#9B2828",
  roseBg:      "#F7EDED",
  green:       "#3A5A40",
  greenBg:     "#EAF0EC",

  // Borders & shadows
  border:      "rgba(184,64,64,0.1)",
  borderMid:   "rgba(184,64,64,0.2)",
  shadow:      "0 2px 16px rgba(140,40,40,0.07)",
  shadowMd:    "0 4px 32px rgba(140,40,40,0.11)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.parchment}; color: ${T.ink}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  ::selection { background: ${T.olive}; color: ${T.white}; }

  .serif { font-family: 'Inter', -apple-system, 'Helvetica Neue', sans-serif; }
  .mono  { font-family: 'DM Mono', monospace; }

  input[type=range] {
    -webkit-appearance: none; width: 100%; height: 2px;
    background: ${T.border}; border-radius: 2px; outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 16px; height: 16px;
    background: ${T.olive}; border-radius: 50%; cursor: pointer;
    box-shadow: 0 0 0 3px rgba(184,64,64,0.14);
  }
  input[type=range]::-moz-range-thumb {
    width: 16px; height: 16px; background: ${T.olive};
    border-radius: 50%; cursor: pointer; border: none;
  }
  input, textarea, select { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.5; }
  }
  @keyframes uploadBounce {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .fade-up { animation: fadeUp 0.65s ease both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.15s; }
  .d3 { animation-delay: 0.28s; }
  .d4 { animation-delay: 0.42s; }

  .section-reveal {
    opacity: 0; transform: translateY(22px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .section-reveal.visible { opacity: 1; transform: translateY(0); }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: inherit; }

  .upload-zone-active {
    border-color: ${T.olive} !important;
    background: ${T.oliveFaint} !important;
  }
`;

function injectGlobalStyles() {
  if (document.getElementById("po-global")) return;
  const s = document.createElement("style");
  s.id = "po-global";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const fmt  = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtPct = (n) => `${n.toFixed(1)}%`;

// ─── INLINE SVG ICONS ─────────────────────────────────────────────────────────
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4v16M10 10l6-6 6 6" stroke={T.olive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 22v4a2 2 0 002 2h16a2 2 0 002-2v-4" stroke={T.oliveMid} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 2h8l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={T.olive} strokeWidth="1.3"/>
    <path d="M12 2v4h4" stroke={T.olive} strokeWidth="1.3"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill={T.green} fillOpacity="0.15" stroke={T.green} strokeWidth="1"/>
    <path d="M5 8l2 2 4-4" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L14 13H2L8 2z" fill={T.amber} fillOpacity="0.15" stroke={T.amber} strokeWidth="1"/>
    <line x1="8" y1="6" x2="8" y2="9.5" stroke={T.amber} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="8" cy="11.5" r="0.75" fill={T.amber}/>
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill={T.rose} fillOpacity="0.12" stroke={T.rose} strokeWidth="1"/>
    <line x1="8" y1="5" x2="8" y2="9" stroke={T.rose} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8" cy="11.5" r="0.75" fill={T.rose}/>
  </svg>
);

const IconGrid = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={T.olive} strokeWidth="1.3"/>
    <rect x="13" y="3" width="8" height="8" rx="1.5" stroke={T.olive} strokeWidth="1.3"/>
    <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={T.olive} strokeWidth="1.3"/>
    <rect x="13" y="13" width="8" height="8" rx="1.5" stroke={T.olive} strokeWidth="1.3"/>
  </svg>
);
const IconDoc = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="12" height="18" rx="2" stroke={T.olive} strokeWidth="1.3"/>
    <path d="M16 6h4l-4-4v4z" stroke={T.olive} strokeWidth="1.1"/>
    <rect x="16" y="6" width="4" height="14" rx="0 2 2 0" stroke={T.olive} strokeWidth="1.1"/>
    <line x1="7" y1="8" x2="13" y2="8" stroke={T.olive} strokeWidth="1.1"/>
    <line x1="7" y1="11" x2="13" y2="11" stroke={T.olive} strokeWidth="1.1"/>
    <line x1="7" y1="14" x2="10" y2="14" stroke={T.olive} strokeWidth="1.1"/>
  </svg>
);
const IconChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="4" height="7" rx="1" stroke={T.olive} strokeWidth="1.3"/>
    <rect x="10" y="9" width="4" height="12" rx="1" stroke={T.olive} strokeWidth="1.3"/>
    <rect x="17" y="4" width="4" height="17" rx="1" stroke={T.olive} strokeWidth="1.3"/>
  </svg>
);
const IconPeople = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3.5" stroke={T.olive} strokeWidth="1.3"/>
    <path d="M2 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={T.olive} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="18" cy="8" r="2.5" stroke={T.olive} strokeWidth="1.1"/>
    <path d="M17 17c.326-.043.657-.065.993-.065 2.485 0 4.507 2.022 4.507 4.507" stroke={T.olive} strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);

// ─── NAV (Homepage) ───────────────────────────────────────────────────────────
function HomeNav({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const anchorLinks = [
    { label: "Simulator",      href: "#simulator" },
    { label: "Compare Costs",  href: "#compare" },
    { label: "Career Outlook", href: "#career-outlook" },
    { label: "Aid Translator", href: "#translator" },
    { label: "Contact",        href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 2.5rem",
      background: scrolled ? "rgba(253,250,247,0.96)" : "transparent",
      borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.35s ease",
    }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <svg width="32" height="32" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="12" fill="#B84040"/>
          <text x="5" y="42" fontFamily="-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="38" fontWeight="700" fill="#FDFAF7" letterSpacing="-1">P</text>
          <circle cx="41" cy="41" r="11" fill="#1E1A18"/>
          <circle cx="41" cy="41" r="8.5" fill="#B84040"/>
          <path d="M36.5 41.5 L39.5 44.5 L46 36.5" stroke="#FDFAF7" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: "'Inter',-apple-system,'Helvetica Neue',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: T.ink, letterSpacing: "-0.01em" }}>Paid Off.</span>
      </a>
      <div className="nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {anchorLinks.map(l => (
          <a key={l.label} href={l.href}
            style={{ fontSize: "0.82rem", color: T.inkSoft, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.olive}
            onMouseLeave={e => e.target.style.color = T.inkSoft}
          >{l.label}</a>
        ))}
        {/* About navigates to page */}
        <button onClick={() => navigate("about")}
          style={{ background: "none", border: "none", fontSize: "0.82rem", color: T.inkSoft, cursor: "pointer", padding: 0, transition: "color 0.2s", fontFamily: "'DM Sans',sans-serif" }}
          onMouseEnter={e => e.target.style.color = T.olive}
          onMouseLeave={e => e.target.style.color = T.inkSoft}
        >About</button>
        {/* Survey navigates to page */}
        <button onClick={() => navigate("survey")}
          style={{ background: "none", border: "none", fontSize: "0.82rem", color: T.inkSoft, cursor: "pointer", padding: 0, transition: "color 0.2s", fontFamily: "'DM Sans',sans-serif" }}
          onMouseEnter={e => e.target.style.color = T.olive}
          onMouseLeave={e => e.target.style.color = T.inkSoft}
        >Survey</button>
        <a href="#waitlist" style={{
          background: T.olive, color: T.white, padding: "0.5rem 1.35rem",
          borderRadius: "100px", fontSize: "0.82rem", fontWeight: 500,
          transition: "background 0.2s, transform 0.15s",
        }}
        >Become an Early Tester</a>
      </div>
      <button id="mob-menu" onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none", background: "none", border: "none", fontSize: "1.3rem", color: T.ink }}>
        {menuOpen ? "✕" : "☰"}
      </button>
      <style>{`
        @media(max-width:768px){
          .nav-links { display: none !important; }
          #mob-menu { display: block !important; }
        }
      `}</style>
      {menuOpen && (
        <div style={{ position: "fixed", top: "57px", left: 0, right: 0, background: T.paper, borderBottom: `1px solid ${T.border}`, padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 199 }}>
          {anchorLinks.map(l => (<a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontSize: "1rem", color: T.inkMid }}>{l.label}</a>))}
          <button onClick={() => { setMenuOpen(false); navigate("about"); }} style={{ background: "none", border: "none", fontSize: "1rem", color: T.inkMid, textAlign: "left", cursor: "pointer", padding: 0 }}>About</button>
          <button onClick={() => { setMenuOpen(false); navigate("survey"); }} style={{ background: "none", border: "none", fontSize: "1rem", color: T.inkMid, textAlign: "left", cursor: "pointer", padding: 0 }}>Survey</button>
          <a href="#waitlist" onClick={() => setMenuOpen(false)} style={{ background: T.olive, color: T.white, padding: "0.75rem", borderRadius: "100px", textAlign: "center", fontWeight: 500 }}>Become an Early Tester</a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" style={{
      background: T.paper,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "7rem 2rem 5rem",
      textAlign: "center",
    }}>
      {/* Painterly background */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "55vw", height: "55vw", borderRadius: "50%", background: "radial-gradient(ellipse at 60% 40%, rgba(200,170,160,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "45vw", height: "45vw", borderRadius: "50%", background: "radial-gradient(ellipse at 40% 60%, rgba(180,110,100,0.12) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "40vw", background: "radial-gradient(ellipse at 50% 50%, rgba(230,215,205,0.35) 0%, transparent 60%)", borderRadius: "50%" }} />
        {/* Ghosted wordmark — atmospheric only, not the headline */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "'Inter',-apple-system,'Helvetica Neue',sans-serif", fontSize: "clamp(10rem, 26vw, 26rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "2px rgba(184,64,64,0.13)", userSelect: "none", whiteSpace: "nowrap" }}>Paid Off.</div>
      </div>

      {/* Foreground content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
        <h1 className="fade-up d1 serif" style={{
          fontSize: "clamp(2.6rem, 6vw, 5.5rem)",
          fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em",
          color: T.ink, marginBottom: "1.5rem",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          <span style={{ display: "block" }}>Know the Cost.</span>
          <span style={{ display: "block" }}>Own the Decision.</span>
        </h1>

        {/* Two equal primary CTAs */}
        <div className="fade-up d3" style={{ display: "flex", gap: "0.85rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="fade-up d4" style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.olivePale }}>
        <div style={{ width: "1px", height: "28px", background: T.olivePale, animation: "pulse 2.5s ease infinite" }} />
        Scroll
      </div>
    </section>
  );
}

// ─── FEATURE STRIP ────────────────────────────────────────────────────────────
// ─── TOOLS ECOSYSTEM ──────────────────────────────────────────────────────────
function ToolsEcosystem() {
  const [ref, visible] = useReveal();

  const tools = [
    {
      icon: <IconChart />,
      title: "Compare College Costs",
      body: "Compare schools side by side and see your real out-of-pocket cost after scholarships and aid — and what that adds up to over four years.",
      href: "#compare",
    },
    {
      icon: <IconDoc />,
      title: "Financial Aid Translator",
      body: "Upload or enter a financial aid offer and see what's free money, what must be repaid, your estimated net cost, and questions to ask before accepting.",
      href: "#translator",
    },
    {
      icon: <IconGrid />,
      title: "Borrowing Impact Simulator",
      body: "See how loan amount, interest rate, and repayment term affect your monthly payment, total interest, and payoff timeline.",
      href: "#simulator",
    },
  ];

  return (
    <div ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.linen, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {tools.map((t, i) => (
          <a key={i} href={t.href} style={{
            display: "block", padding: "1.75rem 2rem",
            borderRight: i < tools.length - 1 ? `1px solid ${T.border}` : "none",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = T.warm}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
              <div style={{ opacity: 0.85 }}>{t.icon}</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: T.ink }}>{t.title}</div>
            </div>
            <p style={{ fontSize: "0.8rem", color: T.inkSoft, lineHeight: 1.6, margin: 0 }}>{t.body}</p>
          </a>
        ))}
      </div>
      <style>{`@media(max-width:768px){ #tools-strip > div { grid-template-columns: 1fr !important; } #tools-strip a { border-right: none !important; border-bottom: 1px solid ${T.border}; } }`}</style>
    </div>
  );
}

// ─── LOAN SIMULATOR ───────────────────────────────────────────────────────────
function Simulator() {
  const [ref, visible] = useReveal();
  const [loan, setLoan] = useState(40000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(10);
  const [salary, setSalary] = useState(50000);
  const [partTime, setPartTime] = useState(0);          // monthly part-time income during school
  const schoolYears = 4;

  const monthlyRate = rate / 100 / 12;
  const n = years * 12;

  // Part-time income reduces principal before repayment starts
  const partTimeContribution = partTime * 12 * schoolYears;
  const effectiveLoan = Math.max(0, loan - partTimeContribution);

  const monthly = monthlyRate === 0 ? effectiveLoan / n
    : (effectiveLoan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalRepay = monthly * n;
  const totalInterest = totalRepay - effectiveLoan;

  // Without part-time work
  const monthlyBase = monthlyRate === 0 ? loan / n
    : (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalRepayBase = monthlyBase * n;

  const savings = totalRepayBase - totalRepay;
  const hasPartTime = partTime > 0;

  const monthlyTakeHome = (salary * 0.72) / 12;
  const pctIncome = (monthly / monthlyTakeHome) * 100;
  const statusColor = pctIncome <= 10 ? T.green : pctIncome <= 20 ? T.amber : T.rose;
  const statusLabel = pctIncome <= 10 ? "Manageable" : pctIncome <= 20 ? "Strained" : "High Risk";
  const statusBg = pctIncome <= 10 ? T.greenBg : pctIncome <= 20 ? T.amberBg : T.roseBg;

  const points = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    if (monthlyRate === 0) return effectiveLoan * (1 - t);
    const remaining = effectiveLoan * Math.pow(1 + monthlyRate, t * n) - monthly * (Math.pow(1 + monthlyRate, t * n) - 1) / monthlyRate;
    return Math.max(0, remaining);
  });
  const H = 56, W = 220;
  const sparkPath = points.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / 23) * W} ${H - (v / Math.max(loan, 1)) * (H - 6)}`).join(" ");

  const field = {
    width: "100%", padding: "0.6rem 0.85rem",
    border: `1px solid ${T.border}`, borderRadius: "7px",
    background: T.parchment, fontSize: "0.88rem", color: T.ink, outline: "none",
  };

  return (
    <section id="simulator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.sage, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: "5rem", alignItems: "center" }}>

        <div>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Borrowing Impact Simulator</span>
          <h2 className="serif" style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
            What happens if I borrow this much?
          </h2>
          <p style={{ fontSize: "0.93rem", color: T.inkSoft, lineHeight: 1.75, marginBottom: "2rem" }}>
            Model different loan amounts, interest rates, and repayment plans to see your monthly payment, total interest, and payoff timeline.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: T.white, borderRadius: "14px", border: `1px solid ${T.border}`, padding: "2rem", boxShadow: T.shadowMd }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: T.ink, marginBottom: "1.5rem" }}>Loan Simulator</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.68rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Loan Amount</label>
              <input readOnly value={fmt(loan)} style={field} />
            </div>
            <div>
              <label style={{ fontSize: "0.68rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Total Repaid</label>
              <div className="serif" style={{ fontSize: "1.65rem", fontWeight: 700, color: T.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{fmt(Math.round(totalRepay))}</div>
              <div style={{ fontSize: "0.75rem", color: T.inkSoft, marginTop: "0.2rem" }}>+{fmt(Math.round(totalInterest))} interest</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.68rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Interest Rate</label>
              <input readOnly value={`${rate.toFixed(2)}%`} style={field} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <svg width="100%" height={H + 8} viewBox={`0 0 ${W} ${H + 8}`} preserveAspectRatio="none" style={{ opacity: 0.55 }}>
                <path d={sparkPath} fill="none" stroke={T.olive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="2" y={H + 7} fontSize="7" fill={T.inkSoft} fontFamily="'DM Mono',monospace">$0</text>
                <text x={W - 28} y={H + 7} fontSize="7" fill={T.inkSoft} fontFamily="'DM Mono',monospace">{years} yrs</text>
              </svg>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.68rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Repayment Plan</label>
            <div style={{ ...field, display: "flex", justifyContent: "space-between" }}>
              <span>Standard ({years} years)</span><span style={{ color: T.olivePale }}>▾</span>
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "1.25rem" }}>
            {[
              { label: "Loan Amount",    value: loan,     min: 5000,  max: 150000, step: 1000, onChange: setLoan,     display: fmt(loan) },
              { label: "Interest Rate",  value: rate,     min: 3,     max: 12,     step: 0.1,  onChange: setRate,     display: `${rate.toFixed(1)}%` },
              { label: "Repayment Term", value: years,    min: 5,     max: 30,     step: 1,    onChange: setYears,    display: `${years} yrs` },
              { label: "Starting Salary",value: salary,   min: 25000, max: 150000, step: 1000, onChange: setSalary,   display: fmt(salary) },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.68rem", color: T.inkSoft }}>{s.label}</span>
                  <span className="mono" style={{ fontSize: "0.68rem", color: T.olive }}>{s.display}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.onChange(Number(e.target.value))} />
              </div>
            ))}
          </div>

          {/* Part-time income — separated with label */}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: T.oliveMid, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Working while in school?
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.68rem", color: T.inkSoft }}>Monthly Part-Time Income</span>
                <span className="mono" style={{ fontSize: "0.68rem", color: partTime > 0 ? T.green : T.inkSoft }}>{partTime > 0 ? fmt(partTime) + "/mo" : "Not working"}</span>
              </div>
              <input type="range" min={0} max={2000} step={50} value={partTime} onChange={e => setPartTime(Number(e.target.value))} />
            </div>

            {/* Part-time impact callout */}
            {hasPartTime && (
              <div style={{ marginTop: "0.85rem", padding: "0.85rem 1rem", background: T.greenBg, borderRadius: "8px", borderLeft: `3px solid ${T.green}` }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: T.green, marginBottom: "0.2rem" }}>
                  Working reduces your loan by {fmt(partTimeContribution)}
                </div>
                <div style={{ fontSize: "0.72rem", color: T.inkSoft, lineHeight: 1.5 }}>
                  Saving {fmt(partTime)}/mo over {schoolYears} years of school → <strong style={{ color: T.green }}>{fmt(Math.round(savings))} less</strong> repaid total
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", borderTop: `1px solid ${T.border}`, paddingTop: "1.25rem" }}>
            {[
              { label: "Monthly Payment", val: fmt(Math.round(monthly)) },
              { label: "Total Interest",  val: fmt(Math.round(totalInterest)) },
              { label: "% of Income",     val: fmtPct(Math.min(pctIncome, 99.9)), colored: true },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: "0.65rem", color: T.inkSoft, marginBottom: "0.2rem" }}>{r.label}</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: r.colored ? statusColor : T.ink }}>{r.val}</div>
                {r.colored && <div style={{ fontSize: "0.62rem", background: statusBg, color: statusColor, padding: "0.1rem 0.4rem", borderRadius: "4px", display: "inline-block", marginTop: "0.2rem" }}>{statusLabel}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #simulator > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }`}</style>
    </section>
  );
}

// ─── AID TRANSLATOR — UPLOAD EXPERIENCE ───────────────────────────────────────
const MOCK_RESULTS = [
  {
    term: "Institutional Merit Grant",
    original: "Institutional Merit Grant: $8,000 — Applied directly to tuition based on academic achievement.",
    simplified: "Free money from your school. You never repay this. It directly reduces what you owe.",
    type: "free",
    impact: null,
  },
  {
    term: "Federal Pell Grant",
    original: "Federal Pell Grant: $6,895 — Need-based federal grant. Award based on Expected Family Contribution.",
    simplified: "Free money from the federal government. Income-based. You keep this no matter what.",
    type: "free",
    impact: null,
  },
  {
    term: "Federal Work-Study",
    original: "Federal Work-Study: $2,500 — Federally subsidized part-time employment program.",
    simplified: "A job offer — not money in your account. You must find and work an approved campus job to earn this.",
    type: "work",
    impact: null,
  },
  {
    term: "Direct Subsidized Loan",
    original: "Federal Direct Subsidized Loan: $3,500 — 6.53% fixed interest. Government pays interest during enrollment.",
    simplified: "A loan you must repay. The one upside: no interest while you're in school. Still debt.",
    type: "debt",
    impact: "Estimated repayment: $471/mo over 10 years = $5,652 total interest.",
  },
  {
    term: "Direct Unsubsidized Loan",
    original: "Federal Direct Unsubsidized Loan: $2,000 — 6.53% fixed interest. Interest accrues from disbursement.",
    simplified: "A loan. Interest starts building the moment the money is sent — even before you graduate.",
    type: "debt",
    impact: "Begins accruing ~$11/month immediately. After 4 years of school: ~$528 in pre-repayment interest.",
  },
  {
    term: "Parent PLUS Loan Offer",
    original: "Federal Direct PLUS Loan: $15,000 — 9.08% fixed interest. Parent borrower. Repayment begins 60 days after disbursement.",
    simplified: "A high-interest loan taken out in your parent's name. At 9.08%, this is the most expensive federal loan available.",
    type: "warning",
    impact: "At 9.08% over 10 years: your parent repays ~$22,800 total on a $15,000 loan.",
  },
];

const DOC_TYPES = [
  { label: "FAFSA Document",           icon: "📋" },
  { label: "University Aid Offer",     icon: "🎓" },
  { label: "Scholarship Letter",       icon: "🏆" },
  { label: "Private Loan Offer",       icon: "🏦" },
  { label: "Loan Disclosure",          icon: "📄" },
];

const TYPE_CONFIG = {
  free:    { label: "Free Money",    bg: T.greenBg, color: T.green,  icon: <CheckIcon /> },
  work:    { label: "Work Required", bg: T.amberBg, color: T.amber,  icon: <WarnIcon /> },
  debt:    { label: "Debt",          bg: T.roseBg,  color: T.rose,   icon: <AlertIcon /> },
  warning: { label: "High Interest", bg: "#FDE8E4",  color: "#7A2A1A", icon: <AlertIcon /> },
};

function Translator() {
  const [ref, visible] = useReveal();
  const [stage, setStage] = useState("upload"); // upload | processing | results
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const fileInputRef = useRef(null);

  const totalFree   = 14895;
  const totalDebt   = 20500;
  const totalWork   = 2500;
  const gap         = 12405;

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setStage("processing");
    setTimeout(() => setStage("results"), 2200);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);

  const handleDemoUpload = () => {
    setFileName("financial_aid_offer_2025.pdf");
    setStage("processing");
    setTimeout(() => setStage("results"), 2200);
  };

  const reset = () => { setStage("upload"); setFileName(null); setSelectedType(null); };

  return (
    <section id="translator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.paper, padding: "7rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ maxWidth: "560px", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Financial Aid Translator</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink }}>
            Upload your aid offer.<br />We'll translate it.
          </h2>
        </div>

        {/* ── STAGE: UPLOAD ── */}
        {stage === "upload" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2.5rem", alignItems: "start" }}>

            {/* Left: upload zone + doc type selector */}
            <div>
              {/* Document type chips */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.72rem", color: T.inkSoft, marginBottom: "0.65rem", letterSpacing: "0.04em" }}>What are you uploading?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {DOC_TYPES.map((d, i) => (
                    <button key={i} onClick={() => setSelectedType(i)}
                      style={{
                        padding: "0.38rem 0.85rem", borderRadius: "100px",
                        border: selectedType === i ? `1.5px solid ${T.olive}` : `1px solid ${T.border}`,
                        background: selectedType === i ? T.oliveFaint : T.white,
                        fontSize: "0.78rem", color: selectedType === i ? T.olive : T.inkSoft,
                        fontWeight: selectedType === i ? 500 : 400,
                        cursor: "pointer", transition: "all 0.18s",
                      }}
                    >{d.label}</button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div
                className={dragOver ? "upload-zone-active" : ""}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `1.5px dashed ${dragOver ? T.olive : T.borderMid}`,
                  borderRadius: "12px",
                  background: dragOver ? T.oliveFaint : T.white,
                  padding: "3rem 2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ animation: dragOver ? "uploadBounce 0.6s ease infinite" : "none", marginBottom: "1rem" }}>
                  <UploadIcon />
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 500, color: T.ink, marginBottom: "0.4rem" }}>
                  Drop your document here
                </div>
                <div style={{ fontSize: "0.8rem", color: T.inkSoft, marginBottom: "1.25rem" }}>
                  PDF or image — FAFSA, aid offers, loan disclosures, scholarship letters
                </div>
                <div style={{
                  display: "inline-block", padding: "0.55rem 1.4rem",
                  border: `1px solid ${T.borderMid}`, borderRadius: "100px",
                  fontSize: "0.8rem", color: T.inkMid, background: T.parchment,
                }}>Browse files</div>
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleInputChange} style={{ display: "none" }} />
              </div>

              {/* Demo shortcut */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.78rem", color: T.inkSoft }}>Don't have a document handy? </span>
                <button onClick={handleDemoUpload} style={{
                  background: "none", border: "none", fontSize: "0.78rem",
                  color: T.olive, fontWeight: 500, cursor: "pointer", textDecoration: "underline",
                  textDecorationColor: T.oliveFaint,
                }}>Try a sample aid letter →</button>
              </div>
            </div>

            {/* Right: what to expect card */}
            <div style={{ background: T.white, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "2rem", boxShadow: T.shadow }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.ink, marginBottom: "1.25rem" }}>What you'll get</div>
              {[
                { icon: <CheckIcon />, title: "Plain-English breakdown", body: "Every line decoded — what's free, what's a job, what's debt." },
                { icon: <WarnIcon />,  title: "Loan warnings",           body: "High-interest and unfavorable terms flagged clearly." },
                { icon: <AlertIcon />, title: "Repayment impact",        body: "Estimated monthly payments and total cost over time." },
                { icon: <CheckIcon />, title: "Your real gap",           body: "What you'll actually need to cover out of pocket." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", marginBottom: i < 3 ? "1.25rem" : 0 }}>
                  <div style={{ marginTop: "2px", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.83rem", fontWeight: 500, color: T.inkMid, marginBottom: "0.2rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.78rem", color: T.inkSoft, lineHeight: 1.5 }}>{item.body}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.border}`, marginTop: "1.5rem", paddingTop: "1.25rem" }}>
                <div style={{ fontSize: "0.72rem", color: T.inkSoft, lineHeight: 1.55 }}>
                  This tool is for educational purposes only. We never store your documents.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STAGE: PROCESSING ── */}
        {stage === "processing" && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", background: T.white, padding: "0.75rem 1.5rem", borderRadius: "100px", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.olive, animation: "pulse 1s ease infinite" }} />
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.olive, animation: "pulse 1s ease 0.2s infinite" }} />
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.olive, animation: "pulse 1s ease 0.4s infinite" }} />
              <span style={{ fontSize: "0.82rem", color: T.inkSoft }}>Reading your document</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ color: T.oliveMid }}><FileIcon /></div>
              <span className="mono" style={{ fontSize: "0.8rem", color: T.inkSoft }}>{fileName}</span>
            </div>
            <div className="serif" style={{ fontSize: "1.5rem", fontWeight: 700, color: T.ink, marginBottom: "0.5rem" }}>Translating your aid offer…</div>
            <p style={{ fontSize: "0.88rem", color: T.inkSoft }}>Identifying grants, loans, and terms that affect your future.</p>
          </div>
        )}

        {/* ── STAGE: RESULTS ── */}
        {stage === "results" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            {/* Summary bar */}
            <div style={{ background: T.white, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "1.5rem 2rem", marginBottom: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "1.5rem", alignItems: "center", boxShadow: T.shadow }}>
              {[
                { label: "Free Money",    val: fmt(totalFree),  color: T.green },
                { label: "Work-Study",    val: fmt(totalWork),  color: T.amber },
                { label: "Total Loans",   val: fmt(totalDebt),  color: T.rose },
                { label: "Your Gap",      val: fmt(gap),        color: T.inkMid },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.25rem" }}>{s.label}</div>
                  <div className="serif" style={{ fontSize: "1.4rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                </div>
              ))}
              <button onClick={reset} style={{
                background: "none", border: `1px solid ${T.border}`, borderRadius: "100px",
                padding: "0.45rem 1rem", fontSize: "0.75rem", color: T.inkSoft, cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.olive; e.currentTarget.style.color = T.olive; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.inkSoft; }}
              >Upload another</button>
            </div>

            {/* File badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <div style={{ color: T.oliveMid }}><FileIcon /></div>
              <span className="mono" style={{ fontSize: "0.75rem", color: T.inkSoft }}>{fileName}</span>
              <span style={{ fontSize: "0.68rem", background: T.greenBg, color: T.green, padding: "0.15rem 0.5rem", borderRadius: "4px", marginLeft: "0.25rem" }}>Translated</span>
            </div>

            {/* Result cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {MOCK_RESULTS.map((item, i) => {
                const cfg = TYPE_CONFIG[item.type];
                return (
                  <div key={i} style={{
                    background: T.white, borderRadius: "10px",
                    border: `1px solid ${T.border}`,
                    borderLeft: `3px solid ${cfg.color}`,
                    padding: "1.5rem",
                    boxShadow: T.shadow,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = T.shadowMd; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.shadow; }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start" }}>
                      <div>
                        {/* Badge row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
                          {cfg.icon}
                          <span style={{ fontSize: "0.68rem", fontWeight: 600, background: cfg.bg, color: cfg.color, padding: "0.18rem 0.55rem", borderRadius: "4px", letterSpacing: "0.04em" }}>{cfg.label}</span>
                          <span style={{ fontSize: "0.72rem", color: T.inkSoft, fontFamily: "'DM Mono',monospace" }}>{item.term}</span>
                        </div>

                        {/* Original text */}
                        <div style={{ fontSize: "0.78rem", color: T.inkSoft, fontStyle: "italic", lineHeight: 1.55, marginBottom: "0.65rem", padding: "0.65rem 0.85rem", background: T.parchment, borderRadius: "6px" }}>
                          "{item.original}"
                        </div>

                        {/* Plain English */}
                        <div style={{ fontSize: "0.9rem", color: T.inkMid, lineHeight: 1.6, fontWeight: 400 }}>
                          {item.simplified}
                        </div>

                        {/* Impact note */}
                        {item.impact && (
                          <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: cfg.color, background: cfg.bg, padding: "0.55rem 0.85rem", borderRadius: "6px", lineHeight: 1.5 }}>
                            {item.impact}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA to waitlist */}
            <div style={{ marginTop: "2.5rem", background: T.sage, borderRadius: "12px", padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
              <div>
                <div className="serif" style={{ fontSize: "1.3rem", fontWeight: 700, color: T.ink, marginBottom: "0.35rem" }}>
                  Want AI translation of your actual document?
                </div>
                <p style={{ fontSize: "0.88rem", color: T.inkSoft }}>This feature is currently being built and improved. Join as an early tester to get access before public launch and help shape the future of Paid Off.</p>
              </div>
              <a href="#waitlist" style={{
                background: T.olive, color: T.white, padding: "0.8rem 1.75rem",
                borderRadius: "100px", fontSize: "0.88rem", fontWeight: 500,
                whiteSpace: "nowrap", boxShadow: "0 2px 12px rgba(184,64,64,0.16)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
              >Become an Early Tester</a>
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:900px){ #translator .upload-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── COMPARE COLLEGE COSTS ────────────────────────────────────────────────────
// Cost-of-attendance figures sourced from each university's published 2024–25
// Cost of Attendance pages. All figures are annual.
//
// isPublic: true  → show in-state / out-of-state selector
// isPublic: false → hide selector, show private-institution note
const universityCostData = [
  { school: "Marquette University",           isPublic: false, tuition: 48620, housing: 10500, mealPlan: 5540, fees: 644  },
  { school: "University of Wisconsin–Madison", isPublic: true,  tuitionInState: 11205, tuitionOutOfState: 40369, housing: 9000,  mealPlan: 4600, fees: 1408 },
  { school: "University of Colorado Boulder",  isPublic: true,  tuitionInState: 13256, tuitionOutOfState: 40428, housing: 12400, mealPlan: 5400, fees: 2280 },
  { school: "Arizona State University",        isPublic: true,  tuitionInState: 12720, tuitionOutOfState: 34080, housing: 11196, mealPlan: 5260, fees: 878  },
  { school: "Ohio State University",           isPublic: true,  tuitionInState: 11936, tuitionOutOfState: 35019, housing: 12492, mealPlan: 5246, fees: 832  },
  { school: "University of Michigan",          isPublic: true,  tuitionInState: 17786, tuitionOutOfState: 57273, housing: 13400, mealPlan: 5600, fees: 390  },
  { school: "Penn State University",           isPublic: true,  tuitionInState: 20052, tuitionOutOfState: 38106, housing: 11620, mealPlan: 5590, fees: 244  },
  { school: "Indiana University",              isPublic: true,  tuitionInState: 11168, tuitionOutOfState: 37426, housing: 10796, mealPlan: 5160, fees: 2062 },
];

function costEfficiencyTier(outOfPocket) {
  if (outOfPocket < 15000) return { label: "Excellent Value", color: T.green,    bg: T.greenBg   };
  if (outOfPocket < 25000) return { label: "Good Value",      color: T.olive,    bg: T.oliveFaint };
  if (outOfPocket < 37000) return { label: "Average Value",   color: T.amber,    bg: T.amberBg   };
  return                          { label: "Higher Cost",     color: T.oliveMid, bg: T.oliveFaint };
}

function CompareYourFuture() {
  const [ref, visible] = useReveal();
  const [selectedIdx,  setSelectedIdx]  = useState(0);
  const [compareIdx,   setCompareIdx]   = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false);
  const [search,        setSearch]       = useState("");
  const [compareSearch, setCompareSearch] = useState("");

  const [scholarship1, setScholarship1] = useState(0);
  const [grant1,       setGrant1]       = useState(0);
  const [scholarship2, setScholarship2] = useState(0);
  const [grant2,       setGrant2]       = useState(0);

  const [residency1, setResidency1] = useState("in");
  const [residency2, setResidency2] = useState("in");

  const [incHousing1, setIncHousing1] = useState(true);
  const [incMeal1,    setIncMeal1]    = useState(true);
  const [incHousing2, setIncHousing2] = useState(true);
  const [incMeal2,    setIncMeal2]    = useState(true);

  const selected    = universityCostData[selectedIdx];
  const comparePath = compareIdx !== null ? universityCostData[compareIdx] : null;

  const effectiveTuition = (school, residency) =>
    school.isPublic
      ? (residency === "in" ? school.tuitionInState : school.tuitionOutOfState)
      : school.tuition;

  const SchoolDropdown = ({ value, onChange, open, setOpen, search, setSearch, excludeIdx, placeholder }) => {
    const filtered = universityCostData
      .map((p, i) => ({ ...p, idx: i }))
      .filter(p => p.idx !== excludeIdx && p.school.toLowerCase().includes(search.toLowerCase()));
    return (
      <div style={{ position: "relative" }}>
        <button onClick={() => setOpen(!open)} style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: T.white, border: `1px solid ${open ? T.olive : T.border}`,
          borderRadius: "10px", padding: "0.85rem 1.1rem",
          fontSize: "0.9rem", fontWeight: 500, color: value === null ? T.inkSoft : T.ink,
          cursor: "pointer", transition: "border-color 0.2s", boxShadow: T.shadow,
        }}>
          <span>{value === null ? placeholder : universityCostData[value].school}</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
            <path d="M4 6l4 4 4-4" stroke={T.olive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div style={{ position: "absolute", top: "calc(100% + 0.5rem)", left: 0, right: 0, background: T.white, border: `1px solid ${T.border}`, borderRadius: "10px", boxShadow: T.shadowMd, zIndex: 30, overflow: "hidden" }}>
            <div style={{ padding: "0.6rem", borderBottom: `1px solid ${T.border}` }}>
              <input autoFocus type="text" placeholder="Type a university name..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "0.55rem 0.75rem", border: `1px solid ${T.border}`, borderRadius: "7px", background: T.parchment, fontSize: "0.85rem", color: T.ink, outline: "none" }}
                onFocus={e => e.target.style.borderColor = T.olive}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
            <div style={{ maxHeight: "240px", overflowY: "auto" }}>
              {placeholder && (
                <button onClick={() => { onChange(null); setOpen(false); setSearch(""); }}
                  style={{ width: "100%", textAlign: "left", padding: "0.75rem 1.1rem", background: "transparent", border: "none", borderBottom: `1px solid ${T.border}`, fontSize: "0.85rem", color: T.inkSoft, cursor: "pointer" }}>
                  {placeholder}
                </button>
              )}
              {filtered.length === 0 && <div style={{ padding: "0.9rem 1.1rem", fontSize: "0.85rem", color: T.inkSoft }}>No universities found</div>}
              {filtered.map(p => (
                <button key={p.school} onClick={() => { onChange(p.idx); setOpen(false); setSearch(""); }}
                  style={{ width: "100%", textAlign: "left", padding: "0.75rem 1.1rem", background: value === p.idx ? T.oliveFaint : "transparent", border: "none", borderBottom: `1px solid ${T.border}`, fontSize: "0.85rem", fontWeight: value === p.idx ? 600 : 400, color: value === p.idx ? T.olive : T.inkMid, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (value !== p.idx) e.currentTarget.style.background = T.parchment; }}
                  onMouseLeave={e => { if (value !== p.idx) e.currentTarget.style.background = "transparent"; }}
                >{p.school}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AidInput = ({ label, value, onChange }) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: "0.7rem", color: T.inkSoft, marginBottom: "0.3rem" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.border}`, borderRadius: "7px", background: T.parchment, padding: "0.45rem 0.7rem" }}>
        <span style={{ fontSize: "0.85rem", color: T.inkSoft, marginRight: "0.3rem" }}>$</span>
        <input type="number" min="0" step="500" value={value === 0 ? "" : value} placeholder="0"
          onChange={e => onChange(Math.max(0, Number(e.target.value) || 0))}
          style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: "0.85rem", color: T.ink, fontFamily: "'DM Mono',monospace" }}
        />
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange, label }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.82rem", color: T.inkMid, userSelect: "none" }}>
      <div onClick={() => onChange(!checked)} style={{ width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0, border: `1.5px solid ${checked ? T.olive : T.border}`, background: checked ? T.olive : T.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
        {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      {label}
    </label>
  );

  const CostCard = ({ path, scholarship, grant, onScholarshipChange, onGrantChange, residency, onResidencyChange, incHousing, onHousingToggle, incMeal, onMealToggle }) => {
    const tuition     = effectiveTuition(path, residency);
    const housingAmt  = incHousing ? path.housing  : 0;
    const mealAmt     = incMeal    ? path.mealPlan : 0;
    const annual      = tuition + housingAmt + mealAmt + path.fees;
    const outOfPocket = Math.max(0, annual - scholarship - grant);
    const fourYear    = outOfPocket * 4;
    const tier        = costEfficiencyTier(outOfPocket);

    const rows = [
      { label: path.isPublic ? `Annual Tuition (${residency === "in" ? "In-State" : "Out-of-State"})` : "Annual Tuition", val: fmt(tuition) },
      incHousing && { label: "Annual Housing",   val: fmt(path.housing)   },
      incMeal    && { label: "Annual Meal Plan",  val: fmt(path.mealPlan)  },
      { label: "Required Fees", val: fmt(path.fees) },
    ].filter(Boolean);

    return (
      <div style={{ border: `1.5px solid ${T.borderMid}`, borderRadius: "10px", overflow: "hidden", boxShadow: T.shadow, background: T.white }}>
        {/* Header */}
        <div style={{ background: T.warm, padding: "1.25rem 1.5rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.25rem" }}>Estimated Cost of Attendance</div>
          <div className="serif" style={{ fontSize: "1.4rem", fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{path.school}</div>
        </div>
        <div style={{ height: "4px", background: T.olive }} />

        {/* Residency */}
        {path.isPublic ? (
          <div style={{ padding: "0.9rem 1.5rem", borderBottom: `1px solid ${T.border}`, background: T.parchment }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.5rem" }}>Residency Status</div>
            <div style={{ display: "flex", gap: "1.25rem" }}>
              {[["in", "In-State"], ["out", "Out-of-State"]].map(([val, lbl]) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.82rem", color: residency === val ? T.olive : T.inkMid, fontWeight: residency === val ? 600 : 400 }}>
                  <input type="radio" name={`res-${path.school}`} value={val} checked={residency === val} onChange={() => onResidencyChange(val)}
                    style={{ accentColor: T.olive, width: "14px", height: "14px" }} />
                  {lbl}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: "0.75rem 1.5rem", borderBottom: `1px solid ${T.border}`, background: T.parchment }}>
            <div style={{ fontSize: "0.75rem", color: T.inkSoft, fontStyle: "italic" }}>Private institutions charge the same tuition regardless of residency.</div>
          </div>
        )}

        {/* Housing & meal toggles */}
        <div style={{ padding: "0.85rem 1.5rem", borderBottom: `1px solid ${T.border}`, display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Toggle checked={incHousing} onChange={onHousingToggle} label="Include Housing" />
          <Toggle checked={incMeal}    onChange={onMealToggle}    label="Include Meal Plan" />
        </div>

        {/* Cost rows */}
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1.5rem", borderBottom: `1px solid ${T.border}`, background: T.white }}>
            <div style={{ fontSize: "0.85rem", color: T.inkMid }}>{r.label}</div>
            <div className="mono" style={{ fontSize: "0.93rem", fontWeight: 600, color: T.ink }}>{r.val}</div>
          </div>
        ))}

        {/* Subtotal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1.5rem", background: T.parchment, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: T.inkMid }}>Estimated Total Annual Cost</div>
          <div className="mono" style={{ fontSize: "1rem", fontWeight: 700, color: T.ink }}>{fmt(annual)}</div>
        </div>

        {/* Aid inputs */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.6rem" }}>Scholarships &amp; Grants (optional)</div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <AidInput label="Scholarships" value={scholarship} onChange={onScholarshipChange} />
            <AidInput label="Grants"       value={grant}       onChange={onGrantChange} />
          </div>
        </div>

        {/* Annual out-of-pocket */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.35rem" }}>Your Estimated Cost</div>
              <div className="serif" style={{ fontSize: "1.6rem", fontWeight: 700, color: T.ink, lineHeight: 1 }}>
                {fmt(outOfPocket)}<span style={{ fontSize: "0.85rem", fontWeight: 400, color: T.inkSoft }}> / year</span>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: tier.color, background: tier.bg, padding: "0.2rem 0.65rem", borderRadius: "100px", whiteSpace: "nowrap" }}>{tier.label}</span>
          </div>
        </div>

        {/* 4-year total — primary takeaway */}
        <div style={{ background: T.olive, color: T.white, padding: "1.25rem 1.5rem" }}>
          <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.65, marginBottom: "0.35rem" }}>Total Estimated Cost (4 Years)</div>
          <div className="serif" style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>{fmt(fourYear)}</div>
        </div>
      </div>
    );
  };

  return (
    <section id="compare" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.paper, padding: "7rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{ maxWidth: "640px", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>The Main Tool</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
            Compare College Costs
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75 }}>
            See what each school could really cost you after scholarships and financial aid — and what that adds up to over four years.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: compareIdx === null ? "1fr auto" : "1fr 1fr", gap: "1rem", marginBottom: "2rem", alignItems: "start" }}>
          <SchoolDropdown value={selectedIdx} onChange={v => { setSelectedIdx(v); setResidency1("in"); }} open={dropdownOpen} setOpen={setDropdownOpen} search={search} setSearch={setSearch} excludeIdx={compareIdx} />
          {compareIdx === null ? (
            <button onClick={() => setCompareIdx(universityCostData.findIndex((_, i) => i !== selectedIdx))}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.25rem", borderRadius: "10px", border: `1px dashed ${T.borderMid}`, background: "transparent", fontSize: "0.85rem", fontWeight: 500, color: T.inkSoft, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.olive; e.currentTarget.style.color = T.olive; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.inkSoft; }}
            >+ Compare another school</button>
          ) : (
            <SchoolDropdown value={compareIdx} onChange={v => { if (v === null) setCompareIdx(null); else { setCompareIdx(v); setResidency2("in"); }}} open={compareDropdownOpen} setOpen={setCompareDropdownOpen} search={compareSearch} setSearch={setCompareSearch} excludeIdx={selectedIdx} placeholder="Remove comparison" />
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: compareIdx === null ? "1fr" : "1fr 1fr", gap: "1.5rem", marginBottom: "2rem", maxWidth: compareIdx === null ? "560px" : "none", marginLeft: compareIdx === null ? "auto" : 0, marginRight: compareIdx === null ? "auto" : 0 }}>
          <CostCard path={selected} scholarship={scholarship1} grant={grant1} onScholarshipChange={setScholarship1} onGrantChange={setGrant1} residency={residency1} onResidencyChange={setResidency1} incHousing={incHousing1} onHousingToggle={setIncHousing1} incMeal={incMeal1} onMealToggle={setIncMeal1} />
          {comparePath && <CostCard path={comparePath} scholarship={scholarship2} grant={grant2} onScholarshipChange={setScholarship2} onGrantChange={setGrant2} residency={residency2} onResidencyChange={setResidency2} incHousing={incHousing2} onHousingToggle={setIncHousing2} incMeal={incMeal2} onMealToggle={setIncMeal2} />}
        </div>

        <p style={{ fontSize: "0.78rem", color: T.inkSoft, lineHeight: 1.7, maxWidth: "640px", marginBottom: "0.5rem", textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
          Estimates are based on publicly available university cost-of-attendance data and may vary based on housing choices, residency status, and individual financial aid packages.
        </p>
        <p style={{ fontSize: "0.75rem", color: T.olivePale, lineHeight: 1.65, maxWidth: "560px", textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
          This preview uses 2024–25 published cost-of-attendance figures for a small set of schools. The full tool will let you enter any school and your actual financial aid package.
        </p>

      </div>
      <style>{`@media(max-width:768px){ #compare > div > div:nth-of-type(2), #compare > div > div:nth-of-type(3) { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── DEEPER COMPARISON BANNER ─────────────────────────────────────────────────
// A bridging card on the seam between Compare College Costs and Future Career
// Outlook — floats over both section backgrounds via negative margin.
function DeeperComparisonBanner() {
  const comparisonItems = [
    "Universities", "Majors", "Scholarships", "Borrowing decisions",
    "Salary projections", "Career outlook", "Future-Proof Scores", "Monthly loan payments",
  ];

  return (
    <div style={{ position: "relative", zIndex: 5, maxWidth: "1000px", margin: "-3rem auto", padding: "0 2.5rem" }}>
      <div style={{
        background: T.white, border: `1px solid ${T.border}`, borderRadius: "14px",
        padding: "2.5rem", boxShadow: T.shadowMd, textAlign: "center",
      }}>
        <div className="serif" style={{ fontSize: "1.5rem", fontWeight: 700, color: T.ink, marginBottom: "0.6rem" }}>
          Want a Deeper Comparison?
        </div>
        <p style={{ fontSize: "0.88rem", color: T.inkSoft, lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 1.75rem" }}>
          Become an early tester and access the full Compare Your Future tool — which brings all of this together in one side-by-side experience:
        </p>

        <div className="deeper-comparison-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem 1.5rem", maxWidth: "640px", margin: "0 auto 2rem" }}>
          {comparisonItems.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: T.inkMid }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="7" fill={T.greenBg} stroke={T.green} strokeWidth="1"/>
                <path d="M5 8l2 2 4-4" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item}
            </div>
          ))}
        </div>

        <a href="#waitlist" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: T.olive, color: T.white,
          padding: "0.85rem 2.25rem", borderRadius: "100px",
          fontSize: "0.9rem", fontWeight: 500,
          boxShadow: "0 4px 20px rgba(184,64,64,0.18)",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Become an Early Tester
        </a>
      </div>
      <style>{`@media(max-width:640px){ .deeper-comparison-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </div>
  );
}
function Waitlist() {
  const [ref, visible] = useReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) { setError("Please fill in both fields."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  const field = {
    width: "100%", padding: "0.75rem 1rem",
    border: `1px solid ${T.border}`, borderRadius: "7px",
    background: T.white, fontSize: "0.9rem", color: T.ink,
    outline: "none", marginBottom: "0.85rem",
  };

  const testerRoles = [
    { num: "01", title: "Test new features", body: "Get hands-on access to tools before they're publicly released and help shape how they work." },
    { num: "02", title: "Provide feedback", body: "Your experience as a student, parent, or educator directly informs what gets built next." },
    { num: "03", title: "Receive early access", body: "Premium features free during beta. You'll get full access to everything Paid Off builds." },
  ];

  return (
    <section id="waitlist" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.sage, padding: "7rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ marginBottom: "4rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Early Testers</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, maxWidth: "580px" }}>
            Help Shape What's Next.
          </h2>
          <p style={{ fontSize: "1rem", color: T.inkSoft, lineHeight: 1.75, marginTop: "1rem", maxWidth: "520px", fontWeight: 300 }}>
            Paid Off is being built alongside students and families navigating these decisions in real time. If you'd like early access to upcoming tools and the opportunity to influence what gets built next, we'd love your input.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

          {/* Left: what testers do */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {testerRoles.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <div className="mono" style={{ fontSize: "0.65rem", color: T.olive, letterSpacing: "0.1em", flexShrink: 0, marginTop: "3px", opacity: 0.7 }}>{r.num}</div>
                  <div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 600, color: T.ink, marginBottom: "0.3rem" }}>{r.title}</div>
                    <p style={{ fontSize: "0.84rem", color: T.inkSoft, lineHeight: 1.65 }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div>
            {submitted ? (
              <div style={{ background: T.greenBg, border: `1px solid rgba(58,90,64,0.2)`, borderRadius: "10px", padding: "2.5rem" }}>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: T.green, marginBottom: "0.5rem" }}>You're in.</div>
                <p style={{ fontSize: "0.88rem", color: T.inkSoft, lineHeight: 1.6 }}>
                  We'll reach out to <strong style={{ color: T.ink }}>{email}</strong> when early testing begins. Thank you for helping build this.
                </p>
              </div>
            ) : (
              <div style={{ background: T.white, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "2.5rem", boxShadow: T.shadow }}>
                <div style={{ fontSize: "0.82rem", color: T.inkSoft, marginBottom: "1.75rem", lineHeight: 1.6 }}>
                  A small group of early testers will get hands-on access before Paid Off officially launches. Apply now.
                </div>
                <input style={field} type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                  onFocus={e => e.target.style.borderColor = T.olive}
                  onBlur={e => e.target.style.borderColor = T.border} />
                <input style={field} type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={e => e.target.style.borderColor = T.olive}
                  onBlur={e => e.target.style.borderColor = T.border} />
                {error && <p style={{ fontSize: "0.78rem", color: T.rose, marginBottom: "0.75rem", marginTop: "-0.4rem" }}>{error}</p>}
                <button onClick={handleSubmit} disabled={loading} style={{
                  width: "100%", background: loading ? T.olivePale : T.olive,
                  color: T.white, padding: "0.9rem", borderRadius: "100px",
                  fontSize: "0.9rem", fontWeight: 500, border: "none",
                  transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.oliveLight; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.olive; }}
                >
                  {loading
                    ? <><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Applying...</>
                    : "Become an Early Tester"}
                </button>
                <p style={{ fontSize: "0.68rem", color: T.olivePale, marginTop: "0.75rem", textAlign: "center" }}>No spam. Unsubscribe anytime.</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "2.5rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px solid ${T.border}` }}>
              {[["$1.7T","US student debt"],["45M","Borrowers"],["Free","Always"]].map(([num, lbl]) => (
                <div key={lbl}>
                  <div className="serif" style={{ fontSize: "1.55rem", fontWeight: 700, color: T.olive, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.olivePale, marginTop: "0.2rem" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #waitlist > div > div:last-of-type { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.ink, color: T.paper, padding: "3rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
            <svg width="30" height="30" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="56" height="56" rx="12" fill="#B84040"/>
              <text x="5" y="42" fontFamily="-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="38" fontWeight="700" fill="#FDFAF7" letterSpacing="-1">P</text>
              <circle cx="41" cy="41" r="11" fill="#1E1A18"/>
              <circle cx="41" cy="41" r="8.5" fill="#B84040"/>
              <path d="M36.5 41.5 L39.5 44.5 L46 36.5" stroke="#FDFAF7" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="serif" style={{ fontSize: "1.15rem", fontWeight: 700, color: T.paper }}>Paid Off.</div>
          </div>
          <p style={{ fontSize: "0.8rem", color: "rgba(253,250,245,0.4)", maxWidth: "230px", lineHeight: 1.65 }}>Helping students borrow smarter and graduate with less regret.</p>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { heading: "Tools",   links: [{ label: "Compare College Costs", href: "#compare" }, { label: "Aid Translator", href: "#translator" }, { label: "Borrowing Simulator", href: "#simulator" }] },
            { heading: "Company", links: [{ label: "About", href: "#about" }, { label: "Contact", href: "#contact" }, { label: "Privacy", href: "#" }] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(253,250,245,0.3)", marginBottom: "0.75rem" }}>{col.heading}</div>
              {col.links.map(l => (
                <div key={l.label} style={{ marginBottom: "0.4rem" }}>
                  <a href={l.href} style={{ fontSize: "0.82rem", color: "rgba(253,250,245,0.5)", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = T.paper}
                    onMouseLeave={e => e.target.style.color = "rgba(253,250,245,0.5)"}
                  >{l.label}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid rgba(253,250,245,0.07)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.7rem", color: "rgba(253,250,245,0.25)" }}>© 2025 Paid Off. Not financial advice. For educational purposes only.</p>
        <p style={{ fontSize: "0.7rem", color: "rgba(253,250,245,0.25)" }}>paid-off.com</p>
      </div>
    </footer>
  );
}

// ─── ABOUT / FOUNDER STORY ────────────────────────────────────────────────────
// About function removed — replaced by FounderIntro below

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, visible] = useReveal();

  return (
    <section id="contact" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.paper, padding: "7rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Contact</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
          Want to talk about Paid Off?
        </h2>
        <p style={{ fontSize: "1rem", color: T.inkMid, lineHeight: 1.8, fontWeight: 300, marginBottom: "2.25rem" }}>
          Whether you're a student, parent, educator, university leader, or potential partner, I'd love to hear from you.
        </p>
        <a href="mailto:YOUR-EMAIL-HERE"
          style={{
            display: "inline-block",
            background: T.olive, color: T.white,
            padding: "0.88rem 2.25rem", borderRadius: "100px",
            fontSize: "0.9rem", fontWeight: 500,
            boxShadow: "0 4px 20px rgba(184,64,64,0.14)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(184,64,64,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(184,64,64,0.14)"; }}
        >Contact Paid Off</a>
      </div>
    </section>
  );
}

// ─── FOUNDER INTRO ───────────────────────────────────────────────────────────
function FounderIntro({ navigate }) {
  const [ref, visible] = useReveal();

  return (
    <section id="about" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.sage, padding: "7rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Portrait + greeting + copy — two-column */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3.5rem", alignItems: "start" }}>

          {/* Left: portrait */}
          <div style={{ paddingTop: "0.5rem" }}>
            <div style={{
              width: "96px", height: "96px", borderRadius: "50%",
              background: `linear-gradient(145deg, ${T.warm} 0%, ${T.linen} 100%)`,
              border: `1.5px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", boxShadow: T.shadowMd,
            }}>
              {/* Replace with: <img src="lucy.jpg" alt="Lucy" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> */}
              <div className="serif" style={{ fontSize: "2.2rem", fontWeight: 700, color: T.olive, opacity: 0.4, lineHeight: 1 }}>L</div>
            </div>
          </div>

          {/* Right: headline + copy */}
          <div>
            <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "0.75rem" }}>Founder</span>
            <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "2rem" }}>
              Hi, I'm Lucy.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.25rem" }}>
              <p style={{ fontSize: "1rem", color: T.inkMid, lineHeight: 1.85, fontWeight: 300 }}>
                Throughout my four years in college, I signed loan documents simply to cover the bills, focused on one thing: earning my degree. I wasn't thinking about interest rates, repayment plans, or what those decisions would mean after graduation.
              </p>
              <p style={{ fontSize: "1rem", color: T.inkMid, lineHeight: 1.85, fontWeight: 300 }}>
                As graduation approached in 2025, reality started to set in. I wasn't just thinking about what career I wanted — I was thinking about how I was going to pay back my loans.
              </p>
              <p style={{ fontSize: "1rem", color: T.inkMid, lineHeight: 1.85, fontWeight: 300 }}>
                That realization led me to start Paid Off, with a mission to help prospective and current college students make informed financial decisions, understand the true cost of higher education, and take control of their student debt before graduation.
              </p>
              <p style={{ fontSize: "1rem", color: T.inkMid, lineHeight: 1.85, fontWeight: 400 }}>
                I'm building the resource I wish I had as a student.
              </p>
            </div>

            <button onClick={() => navigate("about")} style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontSize: "0.88rem", fontWeight: 500, color: T.olive,
              borderBottom: `1px solid ${T.olivePale}`, paddingBottom: "2px",
              transition: "color 0.2s, border-color 0.2s",
              fontFamily: "'DM Sans',sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = T.oliveLight; e.currentTarget.style.borderColor = T.olive; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.olive; e.currentTarget.style.borderColor = T.olivePale; }}
            >
              Read My Story
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
      <style>{`@media(max-width:768px){ #about > div > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    injectGlobalStyles();
  }, []);

  return (
    <div style={{ background: T.paper, minHeight: "100vh" }}>

      {/* Nav — simplified for About page */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem",
        background: "rgba(253,250,247,0.97)",
        borderBottom: `1px solid ${T.border}`,
        backdropFilter: "blur(12px)",
      }}>
        <button onClick={() => onNavigate("home")}
          style={{ fontFamily: "'Inter',-apple-system,'Helvetica Neue',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: T.ink, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}>
          Paid Off.
        </button>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <button onClick={() => onNavigate("home")}
            style={{ background: "none", border: "none", fontSize: "0.82rem", color: T.inkSoft, cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.olive}
            onMouseLeave={e => e.target.style.color = T.inkSoft}
          >← Back to Home</button>
          <button onClick={() => { onNavigate("home"); setTimeout(() => { document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
            style={{ background: T.olive, color: T.white, padding: "0.5rem 1.35rem", borderRadius: "100px", fontSize: "0.82rem", fontWeight: 500, border: "none", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.oliveLight}
            onMouseLeave={e => e.currentTarget.style.background = T.olive}
          >Become an Early Tester</button>
        </div>
      </nav>

      {/* Hero — large editorial header */}
      <div style={{
        padding: "6rem 2.5rem 5rem",
        borderBottom: `1px solid ${T.border}`,
        background: T.paper,
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle bg gradient blob */}
        <div aria-hidden="true" style={{ position: "absolute", top: "-20%", right: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(200,170,160,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="fade-up d1" style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1.25rem" }}>
            Founder Story
          </span>
          <h1 className="fade-up d2 serif" style={{
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
            color: T.ink, marginBottom: "0",
          }}>
            Why I Started<br />Paid Off.
          </h1>
        </div>
      </div>

      {/* Article body */}
      <article style={{ maxWidth: "680px", margin: "0 auto", padding: "5rem 2.5rem 3rem" }}>

        {/* Portrait + greeting */}
        <div className="fade-up d1" style={{ display: "flex", alignItems: "flex-start", gap: "2rem", marginBottom: "3.5rem", flexWrap: "wrap" }}>
          {/* Portrait — swap inner <div> for <img> when photo is ready */}
          <div style={{
            flexShrink: 0,
            width: "100px", height: "100px", borderRadius: "50%",
            background: `linear-gradient(145deg, ${T.sage} 0%, ${T.warm} 100%)`,
            border: `1.5px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", boxShadow: T.shadowMd,
          }}>
            {/* Replace this div with: <img src="lucy.jpg" alt="Lucy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
            <div className="serif" style={{ fontSize: "2.4rem", fontWeight: 700, color: T.olive, opacity: 0.4, lineHeight: 1 }}>L</div>
          </div>
          <div style={{ paddingTop: "0.5rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.5rem" }}>Founder, Paid Off</div>
            <div className="serif" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink }}>
              Hi, I'm Lucy.
            </div>
          </div>
        </div>

        {/* Thin rule */}
        <div style={{ width: "40px", height: "1px", background: T.olivePale, marginBottom: "3.5rem" }} />

        {/* Story paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          <p style={{ fontSize: "1.1rem", color: T.inkMid, lineHeight: 1.9, fontWeight: 300 }}>
            In 2021, I started college excited to earn a degree in Biomedical Sciences from Marquette University. Like many students, I signed loan documents and accepted financial aid without fully understanding the long-term financial impact of those decisions.
          </p>

          <p style={{ fontSize: "1.05rem", color: T.inkMid, lineHeight: 1.9, fontWeight: 300 }}>
            As graduation approached, reality started setting in. I wasn't just thinking about a career, I was thinking a lot about my loans. During my final semester, I developed a concept in my New Venture Creation class born out of that anxiety and uncertainty. I called it Paid Off.
          </p>

          {/* Pull quote */}
          <blockquote style={{
            margin: "1rem 0",
            paddingLeft: "1.75rem",
            borderLeft: `3px solid ${T.olive}`,
          }}>
            <p className="serif" style={{ fontSize: "1.25rem", fontStyle: "italic", fontWeight: 400, color: T.inkMid, lineHeight: 1.7, letterSpacing: "-0.01em" }}>
              The idea never left me.
            </p>
          </blockquote>

          <p style={{ fontSize: "1.05rem", color: T.inkMid, lineHeight: 1.9, fontWeight: 300 }}>
            The more I learned, the more I realized that millions of students face the same problem—very little education on the long-term consequences of borrowing and almost no resources for reducing debt before graduation.
          </p>

          {/* Emphasis line */}
          <p style={{ fontSize: "1.1rem", color: T.ink, lineHeight: 1.8, fontWeight: 500 }}>
            That's why I'm building Paid Off.
          </p>

          <p style={{ fontSize: "1.05rem", color: T.inkMid, lineHeight: 1.9, fontWeight: 300 }}>
            My mission is to help students better understand the true cost of college, make informed financial decisions, and reduce student loan debt while they're still in school. I believe every student deserves access to tools, opportunities, and information that make financial freedom more achievable after graduation.
          </p>

          <p style={{ fontSize: "1.05rem", color: T.inkMid, lineHeight: 1.9, fontWeight: 300 }}>
            Paid Off is still in its early stages, and I'm learning as I go. But if you're a student, parent, educator, employer, or someone who believes there should be a better path through higher education, I'd love to connect.
          </p>

          {/* Sign-off */}
          <div style={{ paddingTop: "1rem" }}>
            <p style={{ fontSize: "1.05rem", color: T.inkMid, lineHeight: 1.7, marginBottom: "0.5rem" }}>Thanks for being here.</p>
            <p className="serif" style={{ fontSize: "1.35rem", fontStyle: "italic", fontWeight: 400, color: T.ink, letterSpacing: "-0.01em" }}>— Lucy</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: T.border, margin: "4rem 0" }} />

        {/* Let's Connect */}
        <div style={{
          background: T.sage,
          borderRadius: "12px",
          padding: "3rem",
          border: `1px solid ${T.border}`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative blob */}
          <div aria-hidden="true" style={{ position: "absolute", top: "-30%", right: "-10%", width: "60%", height: "120%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(180,130,120,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "0.85rem" }}>Get in touch</span>
            <h3 className="serif" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
              Let's connect.
            </h3>
            <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75, marginBottom: "2rem", maxWidth: "400px" }}>
              Whether you're a student, parent, educator, university leader, or potential partner — I'd love to hear from you.
            </p>
            <button onClick={() => { onNavigate("home"); setTimeout(() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: T.olive, color: T.white,
                padding: "0.85rem 2rem", borderRadius: "100px",
                fontSize: "0.9rem", fontWeight: 500, border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(184,64,64,0.16)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Contact Paid Off
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ height: "4rem" }} />
      </article>

      {/* Footer */}
      <footer style={{ background: T.ink, color: T.paper, padding: "2.5rem 2.5rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div className="serif" style={{ fontSize: "1.1rem", fontWeight: 700, color: T.paper }}>Paid Off.</div>
          <p style={{ fontSize: "0.7rem", color: "rgba(253,250,245,0.3)" }}>© 2025 Paid Off. Not financial advice. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── SURVEY PAGE ──────────────────────────────────────────────────────────────
function SurveyPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    injectGlobalStyles();
  }, []);

  const navBtn = {
    background: "none", border: "none", fontSize: "0.82rem",
    color: T.inkSoft, cursor: "pointer", transition: "color 0.2s",
    fontFamily: "'DM Sans',sans-serif", padding: 0,
  };

  return (
    <div style={{ background: T.parchment, minHeight: "100vh" }}>

      {/* Sticky nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem",
        background: "rgba(253,250,247,0.97)",
        borderBottom: `1px solid ${T.border}`,
        backdropFilter: "blur(12px)",
      }}>
        <button onClick={() => onNavigate("home")}
          style={{ fontFamily: "'Inter',-apple-system,'Helvetica Neue',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: T.ink, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}>
          Paid Off.
        </button>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <button onClick={() => onNavigate("home")} style={navBtn}
            onMouseEnter={e => e.target.style.color = T.olive}
            onMouseLeave={e => e.target.style.color = T.inkSoft}
          >← Back to Home</button>
          <button
            onClick={() => { onNavigate("home"); setTimeout(() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            style={{ background: T.olive, color: T.white, padding: "0.5rem 1.35rem", borderRadius: "100px", fontSize: "0.82rem", fontWeight: 500, border: "none", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.oliveLight}
            onMouseLeave={e => e.currentTarget.style.background = T.olive}
          >Become an Early Tester</button>
        </div>
      </nav>

      {/* Page header */}
      <div style={{
        padding: "6rem 2.5rem 4rem",
        borderBottom: `1px solid ${T.border}`,
        background: T.paper,
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: "-20%", right: "-5%",
          width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(200,160,150,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="fade-up d1" style={{
            fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em",
            textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1.25rem",
          }}>Research</span>
          <h1 className="fade-up d2 serif" style={{
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
            color: T.ink, marginBottom: "1.25rem",
          }}>
            Student Debt<br />Experience Survey.
          </h1>
          <p className="fade-up d3" style={{
            fontSize: "1rem", color: T.inkSoft, lineHeight: 1.8,
            fontWeight: 300, maxWidth: "520px",
          }}>
            Help shape Paid Off. Share your experience with student loans — what you understood, what surprised you, and what you wish you'd known sooner. It takes about 3 minutes.
          </p>
        </div>
      </div>

      {/* Survey embed */}
      <div style={{
        maxWidth: "860px", margin: "0 auto",
        padding: "4rem 2.5rem 6rem",
      }}>

        {/* Context strip */}
        <div style={{
          display: "flex", gap: "2rem", marginBottom: "3rem",
          flexWrap: "wrap",
        }}>
          {[
            { label: "Time", val: "~3 minutes" },
            { label: "Questions", val: "10–12" },
            { label: "Purpose", val: "Improve Paid Off" },
            { label: "Your data", val: "Anonymous" },
          ].map((item, i) => (
            <div key={i} style={{
              flex: "1 1 120px",
              background: T.white,
              border: `1px solid ${T.border}`,
              borderRadius: "10px",
              padding: "1.25rem 1.5rem",
              boxShadow: T.shadow,
            }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.35rem" }}>{item.label}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: T.ink }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Tally embed */}
        <div style={{
          background: T.white,
          border: `1px solid ${T.border}`,
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: T.shadowMd,
        }}>
          <iframe
            src="https://tally.so/embed/PdrD7b?transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="700"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Help Shape the Future of Student Debt"
            style={{ display: "block", width: "100%", minHeight: "700px", border: "none" }}
          />
        </div>

        {/* Footer note */}
        <p style={{
          fontSize: "0.78rem", color: T.inkSoft, lineHeight: 1.65,
          marginTop: "1.75rem", maxWidth: "480px",
        }}>
          Your responses are anonymous and used only to improve Paid Off. By submitting, you agree that your answers may inform product decisions and future research.
        </p>
      </div>

      {/* Page footer */}
      <footer style={{ background: T.ink, color: T.paper, padding: "2.5rem 2.5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <button onClick={() => onNavigate("home")}
            style={{ fontFamily: "'Inter',-apple-system,'Helvetica Neue',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: T.paper, background: "none", border: "none", cursor: "pointer" }}>
            Paid Off.
          </button>
          <p style={{ fontSize: "0.7rem", color: "rgba(253,250,245,0.3)" }}>© 2025 Paid Off. Not financial advice. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}



// ─── IS YOUR CAREER CHOICE AI-RESILIENT? — DATA ──────────────────────────────
// Placeholder data — replace with research-backed figures from O*NET, OECD,
// World Economic Forum, Lightcast, or similar future-of-work datasets.
// resilienceScore: 0–100 (higher = more resilient to automation)
const aiResilienceData = [
  {
    career: "Registered Nurse",
    resilienceScore: 88,
    snapshot: "AI may assist with monitoring, documentation, and clinical decision support, but hands-on care, empathy, and patient advocacy remain deeply human.",
    humanStrengths: ["Empathy", "Communication", "Critical Thinking", "Adaptability", "Relationship Building"],
  },
  {
    career: "Physician",
    resilienceScore: 84,
    snapshot: "AI tools may support diagnosis and research, but the complexity of patient care, ethical judgment, and trust-based relationships keep this field firmly human-centered.",
    humanStrengths: ["Ethical Judgment", "Critical Thinking", "Empathy", "Communication", "Leadership"],
  },
  {
    career: "Physical Therapist",
    resilienceScore: 91,
    snapshot: "Hands-on rehabilitation, patient motivation, and real-time physical assessment are extremely difficult to automate. Growing demand keeps this field strong.",
    humanStrengths: ["Empathy", "Communication", "Problem Solving", "Adaptability", "Relationship Building"],
  },
  {
    career: "Teacher",
    resilienceScore: 85,
    snapshot: "AI may personalize curriculum delivery, but mentorship, classroom management, emotional attunement, and community trust remain irreplaceable human contributions.",
    humanStrengths: ["Communication", "Empathy", "Adaptability", "Leadership", "Creativity"],
  },
  {
    career: "Software Engineer",
    resilienceScore: 67,
    snapshot: "AI is already writing code—but engineers who understand systems architecture, product thinking, and complex problem-solving will remain highly valued as AI amplifies their output.",
    humanStrengths: ["Problem Solving", "Critical Thinking", "Adaptability", "Creativity", "Communication"],
  },
  {
    career: "Accountant",
    resilienceScore: 45,
    snapshot: "Routine reporting and data processing may become increasingly automated, shifting the profession toward interpretation, advisory work, and strategic thinking.",
    humanStrengths: ["Critical Thinking", "Communication", "Ethical Judgment", "Adaptability", "Problem Solving"],
  },
  {
    career: "Financial Advisor",
    resilienceScore: 72,
    snapshot: "Algorithmic tools can optimize portfolios, but trust, behavioral coaching, and navigating life's complexity keep human advisors central to long-term financial relationships.",
    humanStrengths: ["Relationship Building", "Communication", "Ethical Judgment", "Empathy", "Problem Solving"],
  },
  {
    career: "Marketing Manager",
    resilienceScore: 60,
    snapshot: "AI may streamline content generation and analytics, while creativity, brand strategy, and human insight become even more important in a crowded automated landscape.",
    humanStrengths: ["Creativity", "Communication", "Leadership", "Adaptability", "Critical Thinking"],
  },
  {
    career: "Graphic Designer",
    resilienceScore: 42,
    snapshot: "Generative AI tools are rapidly changing visual production. Designers who combine visual craft with strategic thinking, brand understanding, and direction will adapt best.",
    humanStrengths: ["Creativity", "Communication", "Adaptability", "Critical Thinking", "Problem Solving"],
  },
  {
    career: "Journalist",
    resilienceScore: 55,
    snapshot: "AI can produce routine reports, but investigative depth, source relationships, ethical judgment, and narrative storytelling remain distinctly human strengths.",
    humanStrengths: ["Critical Thinking", "Communication", "Ethical Judgment", "Adaptability", "Relationship Building"],
  },
  {
    career: "Human Resources Specialist",
    resilienceScore: 64,
    snapshot: "Recruiting tools and HR software are increasingly automated, but conflict resolution, cultural fit, employee wellbeing, and organizational trust require a human touch.",
    humanStrengths: ["Empathy", "Communication", "Ethical Judgment", "Relationship Building", "Problem Solving"],
  },
  {
    career: "Sales Representative",
    resilienceScore: 59,
    snapshot: "AI can optimize outreach and lead scoring, but persuasion, relationship-building, and reading interpersonal dynamics remain core to closing complex deals.",
    humanStrengths: ["Communication", "Relationship Building", "Negotiation", "Adaptability", "Problem Solving"],
  },
  {
    career: "Attorney",
    resilienceScore: 70,
    snapshot: "Legal research and document review are being automated, but courtroom advocacy, client counsel, ethical reasoning, and judicial strategy remain deeply human endeavors.",
    humanStrengths: ["Critical Thinking", "Communication", "Ethical Judgment", "Negotiation", "Problem Solving"],
  },
  {
    career: "Pharmacist",
    resilienceScore: 62,
    snapshot: "Automated dispensing is common and growing, but pharmacists who focus on patient counseling, medication therapy management, and clinical collaboration stay essential.",
    humanStrengths: ["Critical Thinking", "Communication", "Ethical Judgment", "Empathy", "Adaptability"],
  },
  {
    career: "Data Analyst",
    resilienceScore: 54,
    snapshot: "Routine analysis and reporting are increasingly handled by AI tools. Analysts who translate data into strategic decisions and business stories become exponentially more valuable.",
    humanStrengths: ["Critical Thinking", "Communication", "Problem Solving", "Adaptability", "Creativity"],
  },
  {
    career: "Psychologist",
    resilienceScore: 87,
    snapshot: "Therapeutic relationships, emotional attunement, and the nuanced process of human healing are profoundly difficult to replicate artificially. Demand for mental health care continues to grow.",
    humanStrengths: ["Empathy", "Communication", "Ethical Judgment", "Critical Thinking", "Relationship Building"],
  },
  {
    career: "Social Worker",
    resilienceScore: 89,
    snapshot: "Social work is grounded in human connection, community trust, and real-world navigation of complex systems—areas where human presence, empathy, and judgment are irreplaceable.",
    humanStrengths: ["Empathy", "Communication", "Problem Solving", "Adaptability", "Ethical Judgment"],
  },
  {
    career: "Mechanical Engineer",
    resilienceScore: 73,
    snapshot: "AI may assist with simulation and design, but hands-on problem-solving, cross-disciplinary collaboration, and physical systems thinking remain core engineering strengths.",
    humanStrengths: ["Problem Solving", "Critical Thinking", "Creativity", "Adaptability", "Communication"],
  },
  {
    career: "Occupational Therapist",
    resilienceScore: 92,
    snapshot: "The hands-on, personalized, and deeply relational nature of occupational therapy—helping people rebuild everyday independence—is exceptionally resistant to automation.",
    humanStrengths: ["Empathy", "Communication", "Adaptability", "Critical Thinking", "Problem Solving"],
  },
];

// Score category — empowering language only, no fear-based framing
function resilienceCategory(score) {
  if (score >= 80) return { label: "Highly AI-Resilient", color: T.green, bg: T.greenBg };
  if (score >= 50) return { label: "Evolving with AI",   color: T.olive, bg: T.oliveFaint };
  return                  { label: "High Transformation Potential", color: T.amber, bg: T.amberBg };
}

function AIResilienceSection() {
  const [ref, visible] = useReveal();
  const [selectedIdx,  setSelectedIdx]  = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search,       setSearch]       = useState("");
  const [animScore,    setAnimScore]    = useState(0);

  const selected = aiResilienceData[selectedIdx];
  const category = resilienceCategory(selected.resilienceScore);

  useEffect(() => {
    setAnimScore(0);
    const target = selected.resilienceScore;
    const duration = 700;
    const start = performance.now();
    let frame;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setAnimScore(Math.round(target * e));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [selectedIdx]);

  const CX = 90, CY = 90, R = 70;
  const startAngle = 135, sweepAngle = 270;
  const angle = startAngle + (animScore / 100) * sweepAngle;
  const polar = (cx, cy, r, deg) => {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arc = (startA, endA) => {
    const s = polar(CX, CY, R, endA);
    const e = polar(CX, CY, R, startA);
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${endA - startA <= 180 ? "0" : "1"} 0 ${e.x} ${e.y}`;
  };

  const filtered = aiResilienceData
    .map((m, i) => ({ ...m, idx: i }))
    .filter(m => m.career.toLowerCase().includes(search.toLowerCase()));

  const legend = [
    { range: "80–100", label: "Highly AI-Resilient",           color: T.green,    bg: T.greenBg,   tooltip: "Careers that rely heavily on human judgment, empathy, hands-on interaction, relationship-building, or complex decision-making. These roles are difficult to automate and are expected to remain in strong demand." },
    { range: "50–79",  label: "Evolving with AI",              color: T.olive,    bg: T.oliveFaint, tooltip: "Careers likely to incorporate AI into everyday workflows. Professionals in these fields who adapt and learn alongside technology will become more valuable — not less." },
    { range: "0–49",   label: "High Transformation Potential", color: T.amber,    bg: T.amberBg,   tooltip: "Careers where routine or repetitive tasks are increasingly automatable. These fields may change significantly, and continuous upskilling will be important for long-term success." },
  ];

  return (
    <section id="career-outlook" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.sage, padding: "5rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "0.75rem" }}>Career Intelligence</span>
          <h2 className="serif" style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.ink, marginBottom: "0.75rem" }}>
            Is Your Career Choice AI-Resilient?
          </h2>
          <p style={{ fontSize: "0.9rem", color: T.inkSoft, lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Explore how different career paths may evolve in an AI-driven world — and which uniquely human skills could keep you valuable in the future.
          </p>
        </div>

        {/* Dropdown — centered */}
        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft, display: "block", marginBottom: "0.5rem", textAlign: "center" }}>
            What career path interests you?
          </label>
          <div style={{ position: "relative" }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: T.white, border: `1px solid ${dropdownOpen ? T.olive : T.border}`,
              borderRadius: "10px", padding: "0.85rem 1.25rem",
              fontSize: "0.95rem", fontWeight: 500, color: T.ink,
              cursor: "pointer", transition: "border-color 0.2s", boxShadow: T.shadow,
            }}>
              <span>{selected.career}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
                <path d="M4 6l4 4 4-4" stroke={T.olive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 0.5rem)", left: 0, right: 0,
                background: T.white, border: `1px solid ${T.border}`, borderRadius: "10px",
                boxShadow: T.shadowMd, zIndex: 20, overflow: "hidden",
              }}>
                <div style={{ padding: "0.6rem", borderBottom: `1px solid ${T.border}` }}>
                  <input autoFocus type="text" placeholder="Search careers..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", border: `1px solid ${T.border}`, borderRadius: "7px", background: T.parchment, fontSize: "0.85rem", color: T.ink, outline: "none" }}
                    onFocus={e => e.target.style.borderColor = T.olive}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                </div>
                <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                  {filtered.length === 0 && <div style={{ padding: "0.9rem 1.25rem", fontSize: "0.85rem", color: T.inkSoft }}>No careers found</div>}
                  {filtered.map((m, i) => (
                    <button key={m.career} onClick={() => { setSelectedIdx(m.idx); setDropdownOpen(false); setSearch(""); }}
                      style={{
                        width: "100%", textAlign: "left", padding: "0.75rem 1.25rem",
                        background: m.idx === selectedIdx ? T.oliveFaint : "transparent",
                        border: "none", borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                        fontSize: "0.9rem", fontWeight: m.idx === selectedIdx ? 600 : 400,
                        color: m.idx === selectedIdx ? T.olive : T.inkMid,
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (m.idx !== selectedIdx) e.currentTarget.style.background = T.parchment; }}
                      onMouseLeave={e => { if (m.idx !== selectedIdx) e.currentTarget.style.background = "transparent"; }}
                    >{m.career}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score card — centered, compact */}
        <div key={selectedIdx} className="fade-up" style={{
          background: T.white, border: `1px solid ${T.border}`, borderRadius: "14px",
          padding: "2rem", boxShadow: T.shadowMd, marginBottom: "1.5rem",
        }}>
          {/* Gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ position: "relative", width: "180px", height: "155px" }}>
              <svg width="180" height="155" viewBox="0 0 180 180">
                <path d={arc(startAngle, startAngle + sweepAngle)} fill="none" stroke={T.linen} strokeWidth="14" strokeLinecap="round"/>
                <path d={arc(startAngle, angle)} fill="none" stroke={category.color} strokeWidth="14" strokeLinecap="round" style={{ transition: "stroke 0.4s ease" }}/>
              </svg>
              <div style={{ position: "absolute", top: "36%", left: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.3rem" }}>AI Resilience Score</div>
                <div className="serif" style={{ fontSize: "3rem", fontWeight: 700, color: category.color, lineHeight: 1, transition: "color 0.3s ease" }}>{animScore}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: category.color, background: category.bg, padding: "0.2rem 0.75rem", borderRadius: "100px", marginTop: "0.4rem", transition: "all 0.3s ease" }}>{category.label}</div>
              </div>
            </div>
          </div>

          {/* 2035 Snapshot */}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "1.1rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.5rem" }}>2035 Snapshot</div>
            <p style={{ fontSize: "0.88rem", color: T.inkMid, lineHeight: 1.7 }}>{selected.snapshot}</p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {legend.map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", background: T.white, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "0.6rem 0.85rem", flex: "1 1 180px", maxWidth: "210px" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: l.color, background: l.bg, padding: "0.1rem 0.5rem", borderRadius: "100px", whiteSpace: "nowrap", marginTop: "1px", flexShrink: 0 }}>{l.range}</span>
              <span style={{ fontSize: "0.78rem", color: T.inkSoft, lineHeight: 1.4, flex: 1 }}>{l.label}</span>
              <span className="io-tooltip" style={{ position: "relative", display: "inline-flex", marginTop: "2px", flexShrink: 0, cursor: "default" }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke={T.olivePale} strokeWidth="1.3"/>
                  <line x1="8" y1="7.2" x2="8" y2="11.5" stroke={T.olivePale} strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="8" cy="4.7" r="0.9" fill={T.olivePale}/>
                </svg>
                <span className="io-tooltip-box" style={{
                  position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                  background: T.ink, color: T.paper, fontSize: "0.72rem", lineHeight: 1.55,
                  padding: "0.65rem 0.85rem", borderRadius: "8px", width: "210px",
                  opacity: 0, visibility: "hidden", transition: "opacity 0.18s ease",
                  boxShadow: T.shadowMd, zIndex: 40, pointerEvents: "none",
                }}>{l.tooltip}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: "0.73rem", color: T.olivePale, lineHeight: 1.6, textAlign: "center", fontStyle: "italic" }}>
          These projections are intended for educational purposes and are based on emerging labor market and technology trends. The future of work is constantly evolving, and no career path can be predicted with certainty.
        </p>

      </div>
      <style>{`.io-tooltip:hover .io-tooltip-box { opacity: 1 !important; visibility: visible !important; }`}</style>
    </section>
  );
}

// ─── APP ROOT — simple state-based router ────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => { injectGlobalStyles(); }, []);

  // Scroll to top on page change
  useEffect(() => {
    if (page === "home") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const navigate = (dest) => setPage(dest);

  if (page === "about") return <AboutPage onNavigate={navigate} />;
  if (page === "survey") return <SurveyPage onNavigate={navigate} />;

  return (
    <div>
      <HomeNav navigate={navigate} />
      <Hero />
      <ToolsEcosystem />
      <Simulator />
      <CompareYourFuture />
      <DeeperComparisonBanner />
      <AIResilienceSection />
      <Translator />
      <FounderIntro navigate={navigate} />
      <Contact />
      <Waitlist />
      <Footer />
    </div>
  );
}
