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
    { label: "Compare",       href: "#compare" },
    { label: "Aid Translator", href: "#translator" },
    { label: "Simulator",     href: "#simulator" },
    { label: "Planner",       href: "#planner" },
    { label: "Contact",       href: "#contact" },
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
      <a href="#" style={{ fontFamily: "'Inter',-apple-system,'Helvetica Neue',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: T.ink, letterSpacing: "-0.01em" }}>
        Paid Off.
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
          onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
        >Become a Tester</a>
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
          <a href="#waitlist" onClick={() => setMenuOpen(false)} style={{ background: T.olive, color: T.white, padding: "0.75rem", borderRadius: "100px", textAlign: "center", fontWeight: 500 }}>Become a Tester</a>
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
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "'Inter',-apple-system,'Helvetica Neue',sans-serif", fontSize: "clamp(10rem, 26vw, 26rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1.5px rgba(184,64,64,0.04)", userSelect: "none", whiteSpace: "nowrap" }}>Paid Off.</div>
      </div>

      {/* Foreground content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px" }}>
        <h1 className="fade-up d1 serif" style={{
          fontSize: "clamp(2.6rem, 6vw, 5.5rem)",
          fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em",
          color: T.ink, marginBottom: "1.5rem",
          textTransform: "uppercase",
        }}>
          College Is an<br />Investment.<br />Let's Treat It<br />Like One.
        </h1>

        <p className="fade-up d2" style={{
          fontSize: "1.1rem", color: T.inkSoft, lineHeight: 1.7,
          maxWidth: "420px", margin: "0 auto 2.75rem",
          fontWeight: 300,
        }}>
          Compare costs, estimate future payments, and understand how today's decisions may impact tomorrow's opportunities.
        </p>

        {/* Two equal primary CTAs */}
        <div className="fade-up d3" style={{ display: "flex", gap: "0.85rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <a href="#simulator" style={{
            background: T.olive, color: T.white,
            padding: "0.88rem 2rem", borderRadius: "100px",
            fontSize: "0.9rem", fontWeight: 500,
            boxShadow: "0 4px 20px rgba(184,64,64,0.2)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(184,64,64,0.24)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(184,64,64,0.2)"; }}
          >Try the Simulator</a>
          <a href="#waitlist" style={{
            background: T.white, color: T.ink,
            padding: "0.88rem 2rem", borderRadius: "100px",
            fontSize: "0.9rem", fontWeight: 500,
            border: `1px solid ${T.borderMid}`,
            boxShadow: T.shadow,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.olive; e.currentTarget.style.color = T.olive; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.ink; e.currentTarget.style.transform = "translateY(0)"; }}
          >Join Early Access</a>
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
      tag: "Decision Tool",
      title: "Compare Your Future",
      question: "Which path gives me the best financial outcome?",
      body: "Compare schools, majors, scholarships, borrowing amounts, expected salaries, and career outlook side by side before making one of the biggest financial decisions of your life.",
      cta: "Compare Paths",
      href: "#compare",
    },
    {
      icon: <IconDoc />,
      tag: "Understanding Tool",
      title: "Financial Aid Translator",
      question: "What am I actually being offered?",
      body: "Upload or enter a financial aid offer and see what's free money, what must be repaid, your estimated net cost, and questions to ask before accepting.",
      cta: "Translate Aid Offer",
      href: "#translator",
    },
    {
      icon: <IconGrid />,
      tag: "Education Tool",
      title: "Borrowing Impact Simulator",
      question: "What happens if I borrow this amount?",
      body: "See how loan amount, interest rate, repayment term, and extra payments affect your monthly payment, total interest, and payoff timeline.",
      cta: "Simulate Borrowing",
      href: "#simulator",
    },
    {
      icon: <IconPeople />,
      tag: "Action Tool",
      title: "Paid Off Planner",
      question: "How can I reduce my debt before graduation?",
      body: "Build a plan to reduce debt before graduation using part-time income, summer work, employer contributions, and extra payments.",
      cta: "Build My Plan",
      href: "#planner",
    },
  ];

  return (
    <section id="tools" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.paper, padding: "7rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>The Paid Off System</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
            Tools built for every step of the college decision.
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75 }}>
            Four connected tools — each answering a different question, at a different stage of your decision.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
          {tools.map((t, i) => (
            <div key={i} style={{
              background: T.white, border: `1px solid ${T.border}`, borderRadius: "12px",
              padding: "2rem", boxShadow: T.shadow,
              display: "flex", flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = T.shadowMd; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.shadow; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ opacity: 0.85 }}>{t.icon}</div>
                <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.oliveMid, background: T.oliveFaint, padding: "0.2rem 0.65rem", borderRadius: "100px" }}>{t.tag}</span>
              </div>

              <div className="serif" style={{ fontSize: "1.3rem", fontWeight: 700, color: T.ink, marginBottom: "0.5rem", lineHeight: 1.2 }}>{t.title}</div>

              <div style={{ fontSize: "0.85rem", fontWeight: 500, color: T.olive, marginBottom: "0.75rem", fontStyle: "italic" }}>
                "{t.question}"
              </div>

              <p style={{ fontSize: "0.88rem", color: T.inkSoft, lineHeight: 1.7, marginBottom: "1.5rem", flex: 1 }}>{t.body}</p>

              <a href={t.href} style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.85rem", fontWeight: 500, color: T.olive,
                borderBottom: `1px solid ${T.olivePale}`, paddingBottom: "2px",
                alignSelf: "flex-start", transition: "color 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = T.oliveLight; e.currentTarget.style.borderColor = T.olive; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.olive; e.currentTarget.style.borderColor = T.olivePale; }}
              >
                {t.cta}
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){ #tools > div > div:last-of-type { grid-template-columns: 1fr !important; } }`}</style>
    </section>
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
          <a href="#simulator" style={{
            display: "inline-block", padding: "0.65rem 1.5rem",
            border: `1px solid ${T.borderMid}`, borderRadius: "100px",
            fontSize: "0.82rem", color: T.inkMid, fontWeight: 500, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = T.olive; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.inkMid; e.currentTarget.style.borderColor = T.borderMid; }}
          >Simulate Borrowing</a>
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
      style={{ background: T.sage, padding: "7rem 2.5rem" }}>
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
                <p style={{ fontSize: "0.88rem", color: T.inkSoft }}>Join early access and be first to use the full AI-powered translator.</p>
              </div>
              <a href="#waitlist" style={{
                background: T.olive, color: T.white, padding: "0.8rem 1.75rem",
                borderRadius: "100px", fontSize: "0.88rem", fontWeight: 500,
                whiteSpace: "nowrap", boxShadow: "0 2px 12px rgba(184,64,64,0.16)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
              >Join Early Access →</a>
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:900px){ #translator .upload-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── COMPARE YOUR FUTURE (Reality Check style, with school selector) ──────────
// PLACEHOLDER DATA — replace with real school/major/salary/AI-risk data sources.
// Each entry represents one "path": a school + major combination with its
// associated cost, aid, borrowing, salary, and career-risk figures.
const schoolPaths = [
  {
    school: "Marquette University",
    major: "Biomedical Sciences",
    yearlyCost: 58000,
    aidPerYear: 14895,
    borrowedTotal: 62000,
    startingSalary: 52000,
    aiRisk: 34, // 0-100, lower = safer — see riskColor()
  },
  {
    school: "University of Wisconsin",
    major: "Business Administration",
    yearlyCost: 28000,
    aidPerYear: 8000,
    borrowedTotal: 38000,
    startingSalary: 50000,
    aiRisk: 55,
  },
  {
    school: "Arizona State University",
    major: "Computer Science",
    yearlyCost: 34000,
    aidPerYear: 6000,
    borrowedTotal: 44000,
    startingSalary: 78000,
    aiRisk: 45,
  },
  {
    school: "Ohio State University",
    major: "Nursing",
    yearlyCost: 30000,
    aidPerYear: 9000,
    borrowedTotal: 36000,
    startingSalary: 68000,
    aiRisk: 18,
  },
];

// Derived output calculations — swap with real amortization / salary-API logic later
function computePathOutputs(path) {
  const rate = 0.065;
  const years = 10;
  const n = years * 12;
  const monthlyRate = rate / 12;
  const monthly = (path.borrowedTotal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalRepay = monthly * n;
  const totalInterest = totalRepay - path.borrowedTotal;
  const monthlyTakeHome = (path.startingSalary * 0.72) / 12;
  const dti = (monthly / monthlyTakeHome) * 100;

  // Simple composite "Future Score" — weights debt burden, salary, and AI risk
  // Replace with a more sophisticated model when real data is available
  const dtiScore = Math.max(0, 100 - dti * 2.2);
  const salaryScore = Math.min(100, (path.startingSalary / 1000));
  const aiScore = 100 - path.aiRisk;
  const futureScore = Math.round(dtiScore * 0.4 + salaryScore * 0.35 + aiScore * 0.25);

  return { monthly, totalInterest, dti, futureScore };
}

function dtiOutlook(dti) {
  if (dti <= 10) return { label: "Comfortable", color: T.green, bg: T.greenBg };
  if (dti <= 20) return { label: "Manageable", color: T.amber, bg: T.amberBg };
  return { label: "Tight", color: T.rose, bg: T.roseBg };
}

function CompareYourFuture() {
  const [ref, visible] = useReveal();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [compareIdx, setCompareIdx] = useState(null); // null = single-school view
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false);

  const selected = schoolPaths[selectedIdx];
  const out = computePathOutputs(selected);
  const dtiInfo = dtiOutlook(out.dti);
  const aiInfo = riskColor(selected.aiRisk);

  const comparePath = compareIdx !== null ? schoolPaths[compareIdx] : null;
  const compareOut = comparePath ? computePathOutputs(comparePath) : null;
  const compareDtiInfo = compareOut ? dtiOutlook(compareOut.dti) : null;
  const compareAiInfo = comparePath ? riskColor(comparePath.aiRisk) : null;

  // Single profile card — same visual language as the old "Reality Check" card
  const ProfileCard = ({ path, out, dtiInfo, aiInfo }) => {
    const rows = [
      { label: "Estimated yearly cost", val: fmt(path.yearlyCost), note: null },
      { label: "Scholarships / aid per year", val: fmt(path.aidPerYear), note: null },
      { label: "Estimated debt at graduation", val: fmt(path.borrowedTotal), warn: true },
      { label: "Estimated monthly payment", val: fmt(Math.round(out.monthly)) + "/mo", warn: true },
      { label: "Starting salary", val: fmt(path.startingSalary) + "/yr", note: null },
      { label: "Total estimated interest", val: fmt(Math.round(out.totalInterest)), warn: true },
    ];

    return (
      <div style={{ border: `1.5px solid ${T.borderMid}`, borderRadius: "10px", overflow: "hidden", boxShadow: T.shadow, background: T.white }}>
        <div style={{ background: T.warm, padding: "1.25rem 1.5rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.25rem" }}>Future Snapshot</div>
          <div className="serif" style={{ fontSize: "1.5rem", fontWeight: 700, color: T.ink, lineHeight: 1.2 }}>{path.school}</div>
          <div style={{ fontSize: "0.78rem", color: T.inkSoft, marginTop: "0.25rem" }}>{path.major}</div>
        </div>
        <div style={{ height: "4px", background: T.olive }} />
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.85rem 1.5rem",
            borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none",
            background: r.warn ? "rgba(184,64,64,0.02)" : T.white,
          }}>
            <div style={{ fontSize: "0.85rem", color: T.inkMid }}>{r.label}</div>
            <div className="mono" style={{ fontSize: "0.93rem", fontWeight: 600, color: r.warn ? T.rose : T.ink }}>{r.val}</div>
          </div>
        ))}
        {/* Outlook badges */}
        <div style={{ display: "flex", gap: "0.75rem", padding: "1rem 1.5rem", borderBottom: `1px solid ${T.border}`, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.35rem" }}>Debt-to-income</div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: dtiInfo.color, background: dtiInfo.bg, padding: "0.2rem 0.65rem", borderRadius: "100px" }}>{dtiInfo.label}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.35rem" }}>Career / AI outlook</div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: aiInfo.color, background: aiInfo.bg, padding: "0.2rem 0.65rem", borderRadius: "100px" }}>{aiInfo.label}</span>
          </div>
        </div>
        {/* Future Score bottom line */}
        <div style={{ background: T.olive, color: T.white, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.65, marginBottom: "0.2rem" }}>Future Score</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 500, lineHeight: 1.5 }}>Out of 100 — weighs debt, salary, and career outlook</div>
          </div>
          <div className="serif" style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1 }}>{out.futureScore}</div>
        </div>
      </div>
    );
  };

  // Reusable school selector dropdown
  const SchoolDropdown = ({ value, onChange, open, setOpen, excludeIdx, placeholder }) => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: T.white, border: `1px solid ${open ? T.olive : T.border}`,
          borderRadius: "10px", padding: "0.85rem 1.1rem",
          fontSize: "0.9rem", fontWeight: 500, color: value === null ? T.inkSoft : T.ink,
          cursor: "pointer", transition: "border-color 0.2s",
          boxShadow: T.shadow,
        }}
      >
        <span>{value === null ? placeholder : `${schoolPaths[value].school} — ${schoolPaths[value].major}`}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke={T.olive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 0.5rem)", left: 0, right: 0,
          background: T.white, border: `1px solid ${T.border}`, borderRadius: "10px",
          boxShadow: T.shadowMd, zIndex: 30, overflow: "hidden",
        }}>
          {placeholder && (
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              style={{ width: "100%", textAlign: "left", padding: "0.75rem 1.1rem", background: "transparent", border: "none", borderBottom: `1px solid ${T.border}`, fontSize: "0.85rem", color: T.inkSoft, cursor: "pointer" }}
            >{placeholder}</button>
          )}
          {schoolPaths.map((p, i) => i !== excludeIdx && (
            <button
              key={p.school + p.major}
              onClick={() => { onChange(i); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", padding: "0.75rem 1.1rem",
                background: value === i ? T.oliveFaint : "transparent",
                border: "none", borderBottom: `1px solid ${T.border}`,
                fontSize: "0.85rem", fontWeight: value === i ? 600 : 400,
                color: value === i ? T.olive : T.inkMid,
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (value !== i) e.currentTarget.style.background = T.parchment; }}
              onMouseLeave={e => { if (value !== i) e.currentTarget.style.background = "transparent"; }}
            >
              {p.school} — {p.major}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section id="compare" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.paper, padding: "7rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ maxWidth: "640px", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>The Main Tool</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
            Compare Your Future
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75 }}>
            See how different schools, majors, and borrowing decisions affect your debt, monthly payments, and financial freedom after graduation.
          </p>
        </div>

        {/* Selectors */}
        <div style={{ display: "grid", gridTemplateColumns: compareIdx === null ? "1fr auto" : "1fr 1fr", gap: "1rem", marginBottom: "2rem", alignItems: "start" }}>
          <SchoolDropdown
            value={selectedIdx}
            onChange={setSelectedIdx}
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            excludeIdx={compareIdx}
          />
          {compareIdx === null ? (
            <button
              onClick={() => setCompareIdx(schoolPaths.findIndex((_, i) => i !== selectedIdx))}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.85rem 1.25rem", borderRadius: "10px",
                border: `1px dashed ${T.borderMid}`, background: "transparent",
                fontSize: "0.85rem", fontWeight: 500, color: T.inkSoft,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.olive; e.currentTarget.style.color = T.olive; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderMid; e.currentTarget.style.color = T.inkSoft; }}
            >
              + Compare another school
            </button>
          ) : (
            <SchoolDropdown
              value={compareIdx}
              onChange={(i) => { if (i === null) setCompareIdx(null); else setCompareIdx(i); }}
              open={compareDropdownOpen}
              setOpen={setCompareDropdownOpen}
              excludeIdx={selectedIdx}
              placeholder="Remove comparison"
            />
          )}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: compareIdx === null ? "1fr" : "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem", maxWidth: compareIdx === null ? "560px" : "none", marginLeft: compareIdx === null ? "auto" : 0, marginRight: compareIdx === null ? "auto" : 0 }}>
          <ProfileCard path={selected} out={out} dtiInfo={dtiInfo} aiInfo={aiInfo} />
          {comparePath && <ProfileCard path={comparePath} out={compareOut} dtiInfo={compareDtiInfo} aiInfo={compareAiInfo} />}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a href="#tools" style={{
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
            Explore the Full Comparison Tool
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p style={{ fontSize: "0.82rem", color: T.inkSoft, lineHeight: 1.7, marginTop: "1.25rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            Compare schools, majors, aid packages, and repayment outcomes before making one of the biggest financial decisions of your life.
          </p>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: "0.75rem", color: T.olivePale, lineHeight: 1.65, marginTop: "2rem", textAlign: "center", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
          This preview uses sample data for a small set of schools. The full tool will let you enter any school, major, scholarship package, and borrowing scenario.
        </p>

      </div>
      <style>{`@media(max-width:768px){ #compare > div > div:nth-of-type(2), #compare > div > div:nth-of-type(3) { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── EARLY TESTER SIGNUP ─────────────────────────────────────────────────────
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
            Help build Paid Off.
          </h2>
          <p style={{ fontSize: "1rem", color: T.inkSoft, lineHeight: 1.75, marginTop: "1rem", maxWidth: "480px", fontWeight: 300 }}>
            Paid Off is being built in the open. Become an early tester and help shape the tools that students and families actually need.
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

            {/* Decorative panel */}
            <div style={{
              borderRadius: "10px", padding: "1.75rem",
              background: `linear-gradient(145deg, ${T.sage} 0%, ${T.warm} 60%, ${T.linen} 100%)`,
              border: `1px solid ${T.border}`,
              position: "relative", overflow: "hidden",
            }}>
              <div aria-hidden="true" style={{ position: "absolute", top: "-20%", right: "-10%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(180,130,120,0.2) 0%, transparent 65%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div className="serif" style={{ fontSize: "1rem", fontStyle: "italic", color: T.inkSoft, lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  "Every feature on Paid Off comes from a real situation students face. Testers help make sure we're solving the right problems."
                </div>
                <div style={{ fontSize: "0.75rem", fontWeight: 500, color: T.oliveMid }}>— Paid Off founder</div>
              </div>
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
          <div className="serif" style={{ fontSize: "1.15rem", fontWeight: 700, color: T.paper, marginBottom: "0.4rem" }}>Paid Off.</div>
          <p style={{ fontSize: "0.8rem", color: "rgba(253,250,245,0.4)", maxWidth: "230px", lineHeight: 1.65 }}>Helping students borrow smarter and graduate with less regret.</p>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { heading: "Tools",   links: [{ label: "Compare Your Future", href: "#compare" }, { label: "Aid Translator", href: "#translator" }, { label: "Borrowing Simulator", href: "#simulator" }, { label: "Paid Off Planner", href: "#planner" }] },
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
          >Become a Tester</button>
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
          >Become a Tester</button>
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

// ─── MAJOR FUTURE-PROOF EXPLORER ──────────────────────────────────────────────
const majorData = [
  {
    major: "Nursing",
    aiRisk: 18,
    startingSalary: "$68,000",
    midCareerSalary: "$92,000",
    outlook: "Strong",
    debtCaution: "Low to Moderate",
    snapshot: "Healthcare roles that require hands-on patient care are less likely to be fully automated, though AI may change documentation, monitoring, and workflow.",
  },
  {
    major: "Biomedical Sciences",
    aiRisk: 34,
    startingSalary: "$52,000",
    midCareerSalary: "$88,000",
    outlook: "Moderate",
    debtCaution: "High if graduate school is required",
    snapshot: "Strong foundation for research, healthcare, and biotech — but many higher-paying roles require an advanced degree. Weigh additional debt against expected income.",
  },
  {
    major: "Business Administration",
    aiRisk: 55,
    startingSalary: "$50,000",
    midCareerSalary: "$85,000",
    outlook: "Moderate",
    debtCaution: "Moderate",
    snapshot: "Broad and flexible, but many entry-level analysis and admin tasks are increasingly automatable. Specialization and leadership experience matter more over time.",
  },
  {
    major: "Computer Science",
    aiRisk: 45,
    startingSalary: "$78,000",
    midCareerSalary: "$125,000",
    outlook: "Strong",
    debtCaution: "Low",
    snapshot: "Technical skills remain valuable, but AI may change entry-level coding work. Students may need to focus on systems thinking, product knowledge, and applied problem-solving.",
  },
  {
    major: "Marketing",
    aiRisk: 62,
    startingSalary: "$48,000",
    midCareerSalary: "$82,000",
    outlook: "Moderate",
    debtCaution: "Moderate",
    snapshot: "Marketing careers may remain valuable, but AI is likely to automate content creation, analytics, and campaign support. Human strategy and creativity will matter more.",
  },
  {
    major: "Finance",
    aiRisk: 58,
    startingSalary: "$58,000",
    midCareerSalary: "$105,000",
    outlook: "Strong",
    debtCaution: "Low to Moderate",
    snapshot: "Core financial analysis is increasingly supported by automated tools, but advisory, judgment-heavy, and client-facing roles remain in demand.",
  },
  {
    major: "Psychology",
    aiRisk: 38,
    startingSalary: "$42,000",
    midCareerSalary: "$70,000",
    outlook: "Moderate",
    debtCaution: "High if graduate school is required",
    snapshot: "Psychology can lead to meaningful careers, but many higher-paying paths require graduate education. Students should compare debt levels with expected income.",
  },
  {
    major: "Education",
    aiRisk: 22,
    startingSalary: "$41,000",
    midCareerSalary: "$58,000",
    outlook: "Moderate",
    debtCaution: "High relative to salary",
    snapshot: "Teaching remains a human-centered profession with low automation risk, but salaries are often modest relative to the cost of the degree. Loan forgiveness programs may help.",
  },
  {
    major: "Communications",
    aiRisk: 60,
    startingSalary: "$44,000",
    midCareerSalary: "$72,000",
    outlook: "Moderate",
    debtCaution: "Moderate",
    snapshot: "Writing, editing, and content tasks are highly exposed to AI tools. Career growth often depends on building a specialized niche or moving into strategy and leadership.",
  },
  {
    major: "Biology",
    aiRisk: 30,
    startingSalary: "$45,000",
    midCareerSalary: "$75,000",
    outlook: "Moderate",
    debtCaution: "High if graduate school is required",
    snapshot: "A flexible science foundation, but many of the highest-paying paths (research, medicine, pharma) require additional degrees. Plan for that added cost.",
  },
  {
    major: "Engineering",
    aiRisk: 40,
    startingSalary: "$72,000",
    midCareerSalary: "$118,000",
    outlook: "Strong",
    debtCaution: "Low",
    snapshot: "Engineering disciplines generally offer strong salaries relative to debt. AI may assist design and analysis, but hands-on technical expertise remains in demand.",
  },
  {
    major: "Accounting",
    aiRisk: 64,
    startingSalary: "$54,000",
    midCareerSalary: "$88,000",
    outlook: "Moderate",
    debtCaution: "Low to Moderate",
    snapshot: "Routine bookkeeping and reporting tasks are highly automatable. Credentialed roles (CPA) and advisory-focused accounting remain more resilient.",
  },
  {
    major: "Graphic Design",
    aiRisk: 70,
    startingSalary: "$40,000",
    midCareerSalary: "$62,000",
    outlook: "Declining",
    debtCaution: "High relative to salary",
    snapshot: "Generative AI tools directly overlap with core design tasks. Designers who pair visual skills with strategy, branding, or motion/UX tend to fare better.",
  },
  {
    major: "Criminal Justice",
    aiRisk: 28,
    startingSalary: "$42,000",
    midCareerSalary: "$64,000",
    outlook: "Moderate",
    debtCaution: "Moderate",
    snapshot: "Many roles involve fieldwork and human judgment that's hard to automate, but salaries can be modest. Consider how debt compares to realistic starting pay.",
  },
  {
    major: "Political Science",
    aiRisk: 48,
    startingSalary: "$44,000",
    midCareerSalary: "$76,000",
    outlook: "Moderate",
    debtCaution: "High if graduate school is required",
    snapshot: "A flexible degree often used as a stepping stone to law, policy, or graduate study — each of which adds significant cost. Map out the full education path before borrowing.",
  },
];

// ─── PAID OFF PLANNER ─────────────────────────────────────────────────────────
function PaidOffPlanner() {
  const [ref, visible] = useReveal();

  // PLACEHOLDER BASELINE — replace with the user's actual projected loan figures
  const baseline = {
    projectedDebtAtGrad: 42000,
    rate: 6.5,
    years: 10,
  };

  const [partTimeMonthly, setPartTimeMonthly] = useState(300);
  const [summerEarnings, setSummerEarnings] = useState(2500);
  const [employerContribution, setEmployerContribution] = useState(0);
  const [extraMonthly, setExtraMonthly] = useState(50);

  const schoolYears = 4;
  const summersRemaining = 3;

  // Total reduction to principal before graduation
  const fromPartTime = partTimeMonthly * 12 * schoolYears;
  const fromSummers = summerEarnings * summersRemaining;
  const fromEmployer = employerContribution * 12 * schoolYears;
  const debtReducedBeforeGrad = fromPartTime + fromSummers + fromEmployer;

  const projectedGradDebt = Math.max(0, baseline.projectedDebtAtGrad - debtReducedBeforeGrad);

  // Repayment comparison: baseline vs reduced principal + extra monthly payments
  const monthlyRate = baseline.rate / 100 / 12;
  const n = baseline.years * 12;

  const calcTotalInterest = (principal, extraPmt) => {
    if (principal <= 0) return { totalInterest: 0, months: 0 };
    const basePmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const pmt = basePmt + extraPmt;
    let balance = principal;
    let totalInterest = 0;
    let months = 0;
    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance = balance + interest - pmt;
      months++;
    }
    return { totalInterest, months };
  };

  const baselineResult = calcTotalInterest(baseline.projectedDebtAtGrad, 0);
  const plannedResult = calcTotalInterest(projectedGradDebt, extraMonthly);

  const interestSaved = baselineResult.totalInterest - plannedResult.totalInterest;
  const monthsShaved = baselineResult.months - plannedResult.months;

  const SliderRow = ({ label, value, min, max, step, onChange, display, hint }) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.78rem", color: T.inkMid, fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: "0.78rem", color: T.olive, fontWeight: 600 }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
      {hint && <div style={{ fontSize: "0.7rem", color: T.inkSoft, marginTop: "0.3rem" }}>{hint}</div>}
    </div>
  );

  return (
    <section id="planner" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.paper, padding: "7rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Paid Off Planner</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
            How can I reduce my debt before graduation?
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75 }}>
            Build a plan using part-time income, summer work, employer contributions, and extra payments — and see how much it could shave off your future debt.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>

          {/* Inputs */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "2rem", boxShadow: T.shadow }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.ink, marginBottom: "1.5rem" }}>Your action plan</div>

            <SliderRow
              label="Part-time income while in school"
              value={partTimeMonthly} min={0} max={1500} step={50}
              onChange={setPartTimeMonthly} display={`${fmt(partTimeMonthly)}/mo`}
              hint={`Over ${schoolYears} years: ${fmt(fromPartTime)} toward your loans`}
            />
            <SliderRow
              label="Summer earnings (per summer)"
              value={summerEarnings} min={0} max={8000} step={250}
              onChange={setSummerEarnings} display={fmt(summerEarnings)}
              hint={`Over ${summersRemaining} summers: ${fmt(fromSummers)} toward your loans`}
            />
            <SliderRow
              label="Employer / co-op contribution"
              value={employerContribution} min={0} max={1000} step={50}
              onChange={setEmployerContribution} display={`${fmt(employerContribution)}/mo`}
              hint={fromEmployer > 0 ? `Over ${schoolYears} years: ${fmt(fromEmployer)} toward your loans` : "Some employers offer tuition or loan assistance"}
            />
            <SliderRow
              label="Extra monthly payment after graduation"
              value={extraMonthly} min={0} max={500} step={25}
              onChange={setExtraMonthly} display={`${fmt(extraMonthly)}/mo`}
              hint="Paid on top of your standard monthly payment"
            />
          </div>

          {/* Outputs */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "2rem", boxShadow: T.shadowMd }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: T.ink, marginBottom: "1.5rem" }}>Your projected results</div>

            {/* Headline metric */}
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.35rem" }}>Debt reduced before graduation</div>
              <div className="serif" style={{ fontSize: "2.5rem", fontWeight: 700, color: T.green, lineHeight: 1 }}>{fmt(debtReducedBeforeGrad)}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: T.inkSoft }}>Projected graduation debt</span>
                <span className="mono" style={{ fontSize: "0.95rem", fontWeight: 600, color: T.ink }}>{fmt(Math.round(projectedGradDebt))}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: T.inkSoft }}>Interest saved</span>
                <span className="mono" style={{ fontSize: "0.95rem", fontWeight: 600, color: T.green }}>{fmt(Math.round(Math.max(0, interestSaved)))}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: T.inkSoft }}>Months shaved off repayment</span>
                <span className="mono" style={{ fontSize: "0.95rem", fontWeight: 600, color: T.green }}>{Math.max(0, monthsShaved)} months</span>
              </div>
            </div>

            {/* Suggested action plan */}
            <div style={{ marginTop: "1.75rem", background: T.parchment, borderRadius: "10px", padding: "1.25rem 1.5rem" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.6rem" }}>Suggested next step</div>
              <p style={{ fontSize: "0.85rem", color: T.inkMid, lineHeight: 1.65 }}>
                {partTimeMonthly === 0 && summerEarnings === 0
                  ? "Try adding a modest part-time income or summer earnings goal to see how even small, consistent contributions add up before graduation."
                  : `Saving ${fmt(partTimeMonthly)}/mo during school and ${fmt(summerEarnings)} each summer could meaningfully lower what you owe at graduation — before you've made a single repayment.`}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: "0.75rem", color: T.olivePale, lineHeight: 1.65, marginTop: "2rem", textAlign: "center", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
          This planner uses a placeholder projected debt figure. The full tool will use your actual loan details from the Compare and Borrowing tools.
        </p>

      </div>
      <style>{`@media(max-width:900px){ #planner > div > div:nth-of-type(2) { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function riskColor(score) {
  if (score <= 35) return { color: T.green, bg: T.greenBg, label: "Low Risk" };
  if (score <= 65) return { color: T.amber, bg: T.amberBg, label: "Moderate Risk" };
  return { color: T.rose, bg: T.roseBg, label: "High Risk" };
}

function outlookColor(outlook) {
  if (outlook === "Strong") return T.green;
  if (outlook === "Declining") return T.rose;
  return T.amber;
}

function MajorExplorer() {
  const [ref, visible] = useReveal();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [animatedRisk, setAnimatedRisk] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selected = majorData[selectedIdx];
  const risk = riskColor(selected.aiRisk);

  // Animate the gauge whenever the selected major changes
  useEffect(() => {
    setAnimatedRisk(0);
    const target = selected.aiRisk;
    const duration = 700;
    const start = performance.now();

    let frame;
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedRisk(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [selectedIdx]);

  // Gauge geometry — circular arc, 270° sweep
  const R = 70;
  const CX = 90, CY = 90;
  const startAngle = 135; // degrees
  const sweepAngle = 270;
  const angle = startAngle + (animatedRisk / 100) * sweepAngle;

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
  };

  const describeArc = (cx, cy, r, startA, endA) => {
    const start = polarToCartesian(cx, cy, r, endA);
    const end = polarToCartesian(cx, cy, r, startA);
    const largeArc = endA - startA <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const trackPath = describeArc(CX, CY, R, startAngle, startAngle + sweepAngle);
  const valuePath = describeArc(CX, CY, R, startAngle, angle);

  return (
    <section id="major-explorer" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.sage, padding: "7rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ maxWidth: "620px", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Career Outlook</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
            Is Your Major Future-Proof?
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75 }}>
            Choose a major to see projected salary, job outlook, AI exposure, and how student debt could affect your future income.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "2.5rem", alignItems: "start" }}>

          {/* LEFT: major selector */}
          <div>
            <label style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft, display: "block", marginBottom: "0.6rem" }}>
              Choose a major
            </label>

            {/* Custom dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: T.white, border: `1px solid ${dropdownOpen ? T.olive : T.border}`,
                  borderRadius: "10px", padding: "0.95rem 1.25rem",
                  fontSize: "0.95rem", fontWeight: 500, color: T.ink,
                  cursor: "pointer", transition: "border-color 0.2s",
                  boxShadow: T.shadow,
                }}
              >
                <span>{selected.major}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                  <path d="M4 6l4 4 4-4" stroke={T.olive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 0.5rem)", left: 0, right: 0,
                  background: T.white, border: `1px solid ${T.border}`, borderRadius: "10px",
                  boxShadow: T.shadowMd, zIndex: 20, maxHeight: "320px", overflowY: "auto",
                }}>
                  {majorData.map((m, i) => (
                    <button
                      key={m.major}
                      onClick={() => { setSelectedIdx(i); setDropdownOpen(false); }}
                      style={{
                        width: "100%", textAlign: "left", padding: "0.8rem 1.25rem",
                        background: i === selectedIdx ? T.oliveFaint : "transparent",
                        border: "none", borderBottom: i < majorData.length - 1 ? `1px solid ${T.border}` : "none",
                        fontSize: "0.9rem", fontWeight: i === selectedIdx ? 600 : 400,
                        color: i === selectedIdx ? T.olive : T.inkMid,
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (i !== selectedIdx) e.currentTarget.style.background = T.parchment; }}
                      onMouseLeave={e => { if (i !== selectedIdx) e.currentTarget.style.background = "transparent"; }}
                    >
                      {m.major}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick chips for popular majors */}
            <div style={{ marginTop: "1.25rem" }}>
              <div style={{ fontSize: "0.7rem", color: T.inkSoft, marginBottom: "0.6rem" }}>Popular choices</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {[0, 3, 4, 6, 10].map(i => (
                  <button
                    key={majorData[i].major}
                    onClick={() => setSelectedIdx(i)}
                    style={{
                      padding: "0.35rem 0.85rem", borderRadius: "100px",
                      border: i === selectedIdx ? `1.5px solid ${T.olive}` : `1px solid ${T.border}`,
                      background: i === selectedIdx ? T.oliveFaint : T.white,
                      fontSize: "0.78rem", color: i === selectedIdx ? T.olive : T.inkSoft,
                      fontWeight: i === selectedIdx ? 500 : 400,
                      cursor: "pointer", transition: "all 0.18s",
                    }}
                  >{majorData[i].major}</button>
                ))}
              </div>
            </div>

            {/* Future snapshot */}
            <div style={{
              marginTop: "1.75rem", background: T.white, border: `1px solid ${T.border}`,
              borderRadius: "10px", padding: "1.5rem", boxShadow: T.shadow,
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.6rem" }}>Future Snapshot</div>
              <p style={{ fontSize: "0.88rem", color: T.inkMid, lineHeight: 1.7 }}>{selected.snapshot}</p>
            </div>
          </div>

          {/* RIGHT: dashboard */}
          <div style={{
            background: T.white, border: `1px solid ${T.border}`, borderRadius: "14px",
            padding: "2rem", boxShadow: T.shadowMd,
          }}>

            {/* Top row: gauge + key stats */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "center", marginBottom: "1.75rem" }}>

              {/* Gauge */}
              <div style={{ position: "relative", width: "180px", height: "180px" }}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  {/* Track */}
                  <path d={trackPath} fill="none" stroke={T.linen} strokeWidth="12" strokeLinecap="round" />
                  {/* Value arc */}
                  <path d={valuePath} fill="none" stroke={risk.color} strokeWidth="12" strokeLinecap="round"
                    style={{ transition: "stroke 0.3s ease" }} />
                </svg>
                {/* Center label */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <div className="serif" style={{ fontSize: "2.4rem", fontWeight: 700, color: risk.color, lineHeight: 1, transition: "color 0.3s ease" }}>
                    {animatedRisk}
                  </div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginTop: "0.25rem" }}>AI Exposure</div>
                  <div style={{
                    fontSize: "0.68rem", fontWeight: 600, color: risk.color, background: risk.bg,
                    padding: "0.15rem 0.6rem", borderRadius: "100px", marginTop: "0.4rem",
                    transition: "color 0.3s ease, background 0.3s ease",
                  }}>{risk.label}</div>
                </div>
              </div>

              {/* Salary + outlook stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.25rem" }}>Starting Salary</div>
                  <div className="serif" style={{ fontSize: "1.6rem", fontWeight: 700, color: T.ink, lineHeight: 1 }}>{selected.startingSalary}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.25rem" }}>Mid-Career Salary</div>
                  <div className="serif" style={{ fontSize: "1.6rem", fontWeight: 700, color: T.ink, lineHeight: 1 }}>{selected.midCareerSalary}</div>
                </div>
              </div>
            </div>

            {/* Bottom row: outlook + debt caution */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: T.parchment, borderRadius: "10px", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.4rem" }}>Job Outlook</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: outlookColor(selected.outlook), flexShrink: 0 }} />
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: T.ink }}>{selected.outlook}</span>
                </div>
              </div>
              <div style={{ background: T.parchment, borderRadius: "10px", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.4rem" }}>Debt Caution Level</div>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{selected.debtCaution}</span>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <a href="#simulator" style={{
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
            Compare this with your debt
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: "0.75rem", color: T.olivePale, lineHeight: 1.65, marginTop: "2rem", textAlign: "center", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
          These estimates are for educational purposes only and are based on general labor market trends. Actual outcomes vary by school, location, experience, and career path.
        </p>

      </div>
      <style>{`
        @media(max-width:900px){
          #major-explorer > div > div:nth-of-type(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
      <Simulator />
      <CompareYourFuture />
      <MajorExplorer />
      <ToolsEcosystem />
      <Translator />
      <PaidOffPlanner />
      <FounderIntro navigate={navigate} />
      <Contact />
      <Waitlist />
      <Footer />
    </div>
  );
}
