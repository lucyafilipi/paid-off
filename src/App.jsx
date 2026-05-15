import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  olive:       "#4A5240",
  oliveLight:  "#5C6650",
  oliveMid:    "#7A8A6A",
  olivePale:   "#B8C4A8",
  oliveFaint:  "#E4EAD8",
  sage:        "#ECF0E4",
  parchment:   "#F6F3ED",
  paper:       "#FDFAF5",
  linen:       "#F0ECE3",
  warm:        "#EDE8DF",
  ink:         "#1C1F17",
  inkMid:      "#3A3D30",
  inkSoft:     "#6B7060",
  white:       "#FFFFFF",
  amber:       "#8A6020",
  amberBg:     "#FDF4E3",
  rose:        "#8B3A2A",
  roseBg:      "#FDF0ED",
  green:       "#3A6040",
  greenBg:     "#EAF2EC",
  border:      "rgba(74,82,64,0.11)",
  borderMid:   "rgba(74,82,64,0.22)",
  shadow:      "0 2px 16px rgba(74,82,64,0.07)",
  shadowMd:    "0 4px 32px rgba(74,82,64,0.1)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.parchment}; color: ${T.ink}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  ::selection { background: ${T.olive}; color: ${T.white}; }

  .serif { font-family: 'Playfair Display', Georgia, serif; }
  .mono  { font-family: 'DM Mono', monospace; }

  input[type=range] {
    -webkit-appearance: none; width: 100%; height: 2px;
    background: ${T.border}; border-radius: 2px; outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 16px; height: 16px;
    background: ${T.olive}; border-radius: 50%; cursor: pointer;
    box-shadow: 0 0 0 3px rgba(74,82,64,0.14);
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

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Simulator",      href: "#simulator" },
    { label: "Aid Translator", href: "#translator" },
    { label: "Reality Check",  href: "#reality" },
    { label: "About",          href: "#about" },
    { label: "Contact",        href: "#contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 2.5rem",
      background: scrolled ? "rgba(253,250,245,0.96)" : "transparent",
      borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.35s ease",
    }}>
      <a href="#" style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 700, color: T.ink, letterSpacing: "-0.01em" }}>
        Paid Off.
      </a>
      <div className="nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {links.map(l => (
          <a key={l.label} href={l.href}
            style={{ fontSize: "0.82rem", color: T.inkSoft, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.olive}
            onMouseLeave={e => e.target.style.color = T.inkSoft}
          >{l.label}</a>
        ))}
        <a href="#waitlist" style={{
          background: T.olive, color: T.white, padding: "0.5rem 1.35rem",
          borderRadius: "100px", fontSize: "0.82rem", fontWeight: 500,
          transition: "background 0.2s, transform 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
        >Join Waitlist</a>
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
          {links.map(l => (<a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontSize: "1rem", color: T.inkMid }}>{l.label}</a>))}
          <a href="#waitlist" onClick={() => setMenuOpen(false)} style={{ background: T.olive, color: T.white, padding: "0.75rem", borderRadius: "100px", textAlign: "center", fontWeight: 500 }}>Join Waitlist</a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  // Soft abstract SVG backdrop — no photography, but painterly and warm
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

      {/* Painterly background — warm abstract gradient shapes, no photo */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      }}>
        {/* Large warm blob top-right */}
        <div style={{
          position: "absolute", top: "-10%", right: "-8%",
          width: "55vw", height: "55vw", borderRadius: "50%",
          background: "radial-gradient(ellipse at 60% 40%, rgba(212,204,188,0.45) 0%, transparent 70%)",
        }} />
        {/* Soft sage bloom bottom-left */}
        <div style={{
          position: "absolute", bottom: "-5%", left: "-5%",
          width: "45vw", height: "45vw", borderRadius: "50%",
          background: "radial-gradient(ellipse at 40% 60%, rgba(168,184,152,0.22) 0%, transparent 65%)",
        }} />
        {/* Center warm wash */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: "80vw", height: "40vw",
          background: "radial-gradient(ellipse at 50% 50%, rgba(230,222,208,0.3) 0%, transparent 60%)",
          borderRadius: "50%",
        }} />
        {/* Ghosted oversized wordmark */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(10rem, 26vw, 26rem)",
          fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(74,82,64,0.055)",
          userSelect: "none", whiteSpace: "nowrap",
        }}>Paid Off.</div>
      </div>

      {/* Foreground content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "640px" }}>
        {/* Small eyebrow */}
        <div className="fade-up d1" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: T.sage, borderRadius: "100px",
          padding: "0.35rem 1rem", marginBottom: "2.5rem",
          fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em",
          textTransform: "uppercase", color: T.oliveMid,
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.olive, display: "inline-block" }} />
          Student debt clarity
        </div>

        {/* Main headline */}
        <h1 className="fade-up d2 serif" style={{
          fontSize: "clamp(4.5rem, 13vw, 11.5rem)",
          fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em",
          color: T.olive, marginBottom: "2rem",
        }}>
          Paid Off.
        </h1>

        {/* Thin rule */}
        <div className="fade-up d2" style={{
          width: "40px", height: "1px",
          background: T.olivePale,
          margin: "0 auto 1.75rem",
        }} />

        {/* Subheadline */}
        <p className="fade-up d3" style={{
          fontSize: "1.15rem", color: T.inkMid, lineHeight: 1.7,
          maxWidth: "380px", margin: "0 auto 2.75rem",
          fontWeight: 300,
        }}>
          Understand your loans.<br />Plan your future.<br />Take control of what comes next.
        </p>

        {/* CTAs */}
        <div className="fade-up d4" style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <a href="#simulator" style={{
            background: T.olive, color: T.white,
            padding: "0.88rem 2.25rem", borderRadius: "100px",
            fontSize: "0.9rem", fontWeight: 500,
            boxShadow: "0 4px 20px rgba(74,82,64,0.22)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(74,82,64,0.28)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(74,82,64,0.22)"; }}
          >Try the Simulator</a>
          <a href="#translator" style={{
            color: T.inkMid, fontSize: "0.9rem", fontWeight: 400,
            borderBottom: `1px solid ${T.borderMid}`, paddingBottom: "2px",
            transition: "color 0.2s, border-color 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = T.olive; e.currentTarget.style.borderColor = T.olive; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.inkMid; e.currentTarget.style.borderColor = T.borderMid; }}
          >Translate My Aid Letter →</a>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="fade-up d4" style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.olivePale,
      }}>
        <div style={{ width: "1px", height: "28px", background: T.olivePale, animation: "pulse 2.5s ease infinite" }} />
        Scroll
      </div>
    </section>
  );
}

// ─── FEATURE STRIP ────────────────────────────────────────────────────────────
function FeatureStrip() {
  const [ref, visible] = useReveal();
  const features = [
    { icon: <IconGrid />,   title: "Loan Simulator",  body: "See the real cost of borrowing and compare repayment outcomes.", cta: "Try it →", href: "#simulator" },
    { icon: <IconDoc />,    title: "Aid Translator",  body: "Upload your aid letter and get clear, plain-English answers.", cta: "Try it →", href: "#translator" },
    { icon: <IconChart />,  title: "Reality Check",   body: "See how student debt can impact your future lifestyle.", cta: "Explore →", href: "#reality" },
    { icon: <IconPeople />, title: "Built for Students", body: "Independent, unbiased, and designed to put you in control.", cta: "Learn more →", href: "#waitlist" },
  ];
  return (
    <div ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.white, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {features.map((f, i) => (
          <div key={i} style={{ padding: "2.25rem 2rem", borderRight: i < 3 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ marginBottom: "1rem", opacity: 0.85 }}>{f.icon}</div>
            <div style={{ fontSize: "0.93rem", fontWeight: 600, color: T.ink, marginBottom: "0.45rem" }}>{f.title}</div>
            <p style={{ fontSize: "0.8rem", color: T.inkSoft, lineHeight: 1.65, marginBottom: "1rem" }}>{f.body}</p>
            <a href={f.href} style={{ fontSize: "0.78rem", color: T.olive, fontWeight: 500, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >{f.cta}</a>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:900px){ .feature-grid { grid-template-columns: 1fr 1fr !important; } @media(max-width:600px){ .feature-grid { grid-template-columns: 1fr !important; } } }`}</style>
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

  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const monthly = monthlyRate === 0 ? loan / n
    : (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalRepay = monthly * n;
  const totalInterest = totalRepay - loan;
  const monthlyTakeHome = (salary * 0.72) / 12;
  const pctIncome = (monthly / monthlyTakeHome) * 100;
  const statusColor = pctIncome <= 10 ? T.green : pctIncome <= 20 ? T.amber : T.rose;
  const statusLabel = pctIncome <= 10 ? "Manageable" : pctIncome <= 20 ? "Strained" : "High Risk";
  const statusBg = pctIncome <= 10 ? T.greenBg : pctIncome <= 20 ? T.amberBg : T.roseBg;

  const points = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    if (monthlyRate === 0) return loan * (1 - t);
    const remaining = loan * Math.pow(1 + monthlyRate, t * n) - monthly * (Math.pow(1 + monthlyRate, t * n) - 1) / monthlyRate;
    return Math.max(0, remaining);
  });
  const H = 56, W = 220;
  const sparkPath = points.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / 23) * W} ${H - (v / loan) * (H - 6)}`).join(" ");

  const field = {
    width: "100%", padding: "0.6rem 0.85rem",
    border: `1px solid ${T.border}`, borderRadius: "7px",
    background: T.parchment, fontSize: "0.88rem", color: T.ink, outline: "none",
  };

  return (
    <section id="simulator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.parchment, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: "5rem", alignItems: "center" }}>

        <div>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Loan Simulator</span>
          <h2 className="serif" style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
            See the full picture.
          </h2>
          <p style={{ fontSize: "0.93rem", color: T.inkSoft, lineHeight: 1.75, marginBottom: "2rem" }}>
            Model different loan amounts, interest rates, and repayment plans to see what your future could really look like.
          </p>
          <a href="#simulator" style={{
            display: "inline-block", padding: "0.65rem 1.5rem",
            border: `1px solid ${T.borderMid}`, borderRadius: "100px",
            fontSize: "0.82rem", color: T.inkMid, fontWeight: 500, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = T.olive; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.inkMid; e.currentTarget.style.borderColor = T.borderMid; }}
          >Try the Simulator</a>
        </div>

        {/* Card — warm white, no dark backgrounds */}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Loan Amount",    value: loan,   min: 5000,  max: 150000, step: 1000, onChange: setLoan,   display: fmt(loan) },
              { label: "Interest Rate",  value: rate,   min: 3,     max: 12,     step: 0.1,  onChange: setRate,   display: `${rate.toFixed(1)}%` },
              { label: "Repayment Term", value: years,  min: 5,     max: 30,     step: 1,    onChange: setYears,  display: `${years} yrs` },
              { label: "Starting Salary",value: salary, min: 25000, max: 150000, step: 1000, onChange: setSalary, display: fmt(salary) },
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
      style={{ background: T.linen, padding: "7rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ maxWidth: "560px", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Aid Translator</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "0.85rem" }}>
            Upload your aid offer.<br />We'll translate it.
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75 }}>
            Upload your financial aid offer and Paid Off will translate it into plain English — showing what's free money, what's debt, and what to watch out for.
          </p>
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
                whiteSpace: "nowrap", boxShadow: "0 2px 12px rgba(74,82,64,0.2)",
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

// ─── REALITY CHECK ────────────────────────────────────────────────────────────
function RealityCheck() {
  const [ref, visible] = useReveal();
  const data = { totalBorrowed: 58000, monthlyPayment: 644, avgSalary: 45000, payoffYears: 10, dti: 17.1 };
  const rows = [
    { label: "Total borrowed",       val: fmt(data.totalBorrowed),          warn: false },
    { label: "Monthly payment",      val: fmt(data.monthlyPayment) + "/mo", warn: true },
    { label: "Avg. starting salary", val: fmt(data.avgSalary) + "/yr",      warn: false },
    { label: "Debt-to-income ratio", val: fmtPct(data.dti),                 warn: true, note: "Exceeds recommended 15%" },
    { label: "Payoff timeline",      val: `${data.payoffYears} years`,       warn: false },
    { label: "Total repaid",         val: fmt(data.monthlyPayment * 120),    warn: true },
  ];
  return (
    <section id="reality" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.white, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Reality Check</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
            Every degree has a real cost.
          </h2>
          <p style={{ fontSize: "0.93rem", color: T.inkSoft, lineHeight: 1.75 }}>
            This is what a typical 4-year degree actually looks like on paper. The full tool lets you enter your own school, major, and income.
          </p>
        </div>
        <div style={{ border: `1.5px solid ${T.borderMid}`, borderRadius: "10px", overflow: "hidden", boxShadow: T.shadow }}>
          <div style={{ background: T.warm, padding: "1.25rem 1.5rem", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.25rem" }}>College Debt Facts</div>
            <div className="serif" style={{ fontSize: "1.65rem", fontWeight: 700, color: T.ink, lineHeight: 1 }}>State University</div>
            <div style={{ fontSize: "0.73rem", color: T.inkSoft, marginTop: "0.25rem" }}>4-Year Degree · Sample Profile</div>
          </div>
          <div style={{ height: "4px", background: T.olive }} />
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.85rem 1.5rem",
              borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none",
              background: r.warn ? "rgba(74,82,64,0.025)" : T.white,
            }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: T.inkMid }}>{r.label}</div>
                {r.note && <div style={{ fontSize: "0.65rem", color: T.rose, marginTop: "0.1rem" }}>{r.note}</div>}
              </div>
              <div className="mono" style={{ fontSize: "0.93rem", fontWeight: 600, color: r.warn ? T.rose : T.ink }}>{r.val}</div>
            </div>
          ))}
          <div style={{ background: T.olive, color: T.white, padding: "1rem 1.5rem" }}>
            <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.65, marginBottom: "0.2rem" }}>Bottom line</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 500, lineHeight: 1.5 }}>
              {fmtPct(data.dti)} of monthly take-home goes to loans — for a decade.
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #reality > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }`}</style>
    </section>
  );
}

// ─── WAITLIST ─────────────────────────────────────────────────────────────────
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

  const earlyAccess = ["AI financial aid translation","Personalized loan impact projections","College cost comparison tools","Future debt payoff planning features"];
  const earlyPerks  = ["Free premium access during beta","Personalized debt analysis","Priority feature access"];

  return (
    <section id="waitlist" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.parchment, padding: "6rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

        <div>
          {/* Decorative soft panel replacing photo */}
          <div style={{
            width: "100%", aspectRatio: "4/3", borderRadius: "10px", marginBottom: "2.25rem",
            background: `linear-gradient(145deg, ${T.sage} 0%, ${T.warm} 55%, ${T.linen} 100%)`,
            border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Abstract inner decoration */}
            <div aria-hidden="true" style={{
              position: "absolute", top: "-20%", right: "-10%",
              width: "70%", height: "70%", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(168,184,152,0.3) 0%, transparent 65%)",
            }} />
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div className="serif" style={{ fontSize: "2.75rem", fontWeight: 700, color: T.olive, opacity: 0.35, letterSpacing: "-0.02em" }}>Paid Off.</div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: T.oliveMid, opacity: 0.5, marginTop: "0.35rem" }}>Your future, clarified</div>
            </div>
          </div>

          <span style={{ fontSize: "0.67rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Early Access</span>
          <h2 className="serif" style={{ fontSize: "clamp(1.75rem,3vw,2.4rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.ink, marginBottom: "2rem" }}>
            Join the first group testing Paid Off's student debt tools.
          </h2>

          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: T.inkSoft, marginBottom: "0.65rem" }}>Early access includes:</div>
            {earlyAccess.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.4rem" }}>
                <span style={{ color: T.olive, marginTop: "3px", fontSize: "0.7rem", flexShrink: 0 }}>•</span>
                <span style={{ fontSize: "0.86rem", color: T.inkMid, lineHeight: 1.45 }}>{item}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: T.inkSoft, marginBottom: "0.65rem" }}>Early users will receive:</div>
            {earlyPerks.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.4rem" }}>
                <span style={{ color: T.olive, marginTop: "3px", fontSize: "0.7rem", flexShrink: 0 }}>•</span>
                <span style={{ fontSize: "0.86rem", color: T.inkMid, lineHeight: 1.45 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: "0.5rem" }}>
          {submitted ? (
            <div style={{ background: T.greenBg, border: `1px solid rgba(58,96,64,0.2)`, borderRadius: "10px", padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: T.green, marginBottom: "0.5rem" }}>You're on the list.</div>
              <p style={{ fontSize: "0.88rem", color: T.inkSoft }}>We'll email <strong style={{ color: T.ink }}>{email}</strong> when Paid Off launches.</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "0.82rem", color: T.inkSoft, marginBottom: "1.5rem", lineHeight: 1.6 }}>Spots are limited. Join now to secure early access.</p>
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
                  ? <><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Joining...</>
                  : "Join the Waitlist"}
              </button>
              <p style={{ fontSize: "0.68rem", color: T.olivePale, marginTop: "0.75rem", textAlign: "center" }}>No spam. Unsubscribe anytime.</p>
            </div>
          )}
          <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${T.border}` }}>
            {[["$1.7T","US student debt"],["45M","Borrowers"],["Free","Always"]].map(([num, lbl]) => (
              <div key={lbl}>
                <div className="serif" style={{ fontSize: "1.55rem", fontWeight: 700, color: T.olive, lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.olivePale, marginTop: "0.2rem" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #waitlist > div { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
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
            { heading: "Tools",   links: ["Loan Simulator","Aid Translator","Reality Check"] },
            { heading: "Company", links: ["About","Contact","Privacy"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(253,250,245,0.3)", marginBottom: "0.75rem" }}>{col.heading}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: "0.4rem" }}>
                  <a href="#" style={{ fontSize: "0.82rem", color: "rgba(253,250,245,0.5)", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = T.paper}
                    onMouseLeave={e => e.target.style.color = "rgba(253,250,245,0.5)"}
                  >{l}</a>
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

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { injectGlobalStyles(); }, []);
  return (
    <div>
      <Nav />
      <Hero />
      <FeatureStrip />
      <Simulator />
      <Translator />
      <RealityCheck />
      <Waitlist />
      <Footer />
    </div>
  );
}
