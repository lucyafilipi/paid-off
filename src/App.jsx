import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  olive:      "#4A5240",   // primary — dark olive green
  oliveLight: "#5C6650",   // hover state
  oliveMid:   "#7A8A6A",   // secondary text / icons
  olivePale:  "#A8B898",   // muted accents
  sage:       "#E8EDE0",   // light section bg
  parchment:  "#F5F2EC",   // main bg
  paper:      "#FDFAF5",   // card bg / hero
  linen:      "#EDE9E0",   // alternate section bg
  ink:        "#1C1F17",   // headings
  inkMid:     "#3A3D30",   // body text
  inkSoft:    "#6B7060",   // muted text
  white:      "#FFFFFF",
  border:     "rgba(74,82,64,0.12)",
  borderMid:  "rgba(74,82,64,0.2)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

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
    -webkit-appearance: none; width: 18px; height: 18px;
    background: ${T.olive}; border-radius: 50%; cursor: pointer;
    box-shadow: 0 0 0 4px rgba(74,82,64,0.12);
  }
  input[type=range]::-moz-range-thumb {
    width: 18px; height: 18px; background: ${T.olive};
    border-radius: 50%; cursor: pointer; border: none;
  }

  input[type=text], input[type=email], textarea, select {
    font-family: 'DM Sans', sans-serif;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fade-up { animation: fadeUp 0.65s ease both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.15s; }
  .d3 { animation-delay: 0.25s; }
  .d4 { animation-delay: 0.38s; }

  .section-reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .section-reveal.visible { opacity: 1; transform: translateY(0); }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: inherit; }
`;

function injectGlobalStyles() {
  if (document.getElementById("po-global")) return;
  const s = document.createElement("style");
  s.id = "po-global";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
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

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtPct = (n) => `${n.toFixed(1)}%`;

// ─── ICON COMPONENTS ─────────────────────────────────────────────────────────
const IconSimulator = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="22" height="22" rx="3" stroke={T.olive} strokeWidth="1.5"/>
    <rect x="7" y="7" width="5" height="5" rx="1" stroke={T.olive} strokeWidth="1.2"/>
    <rect x="16" y="7" width="5" height="5" rx="1" stroke={T.olive} strokeWidth="1.2"/>
    <rect x="7" y="16" width="5" height="5" rx="1" stroke={T.olive} strokeWidth="1.2"/>
    <rect x="16" y="16" width="5" height="5" rx="1" stroke={T.olive} strokeWidth="1.2"/>
  </svg>
);
const IconTranslator = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="16" height="20" rx="2" stroke={T.olive} strokeWidth="1.5"/>
    <line x1="7" y1="9" x2="15" y2="9" stroke={T.olive} strokeWidth="1.2"/>
    <line x1="7" y1="13" x2="15" y2="13" stroke={T.olive} strokeWidth="1.2"/>
    <line x1="7" y1="17" x2="11" y2="17" stroke={T.olive} strokeWidth="1.2"/>
    <path d="M19 15 L25 15 M22 12 L22 18" stroke={T.olive} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IconReality = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="18" width="5" height="7" rx="1" stroke={T.olive} strokeWidth="1.3"/>
    <rect x="11" y="12" width="5" height="13" rx="1" stroke={T.olive} strokeWidth="1.3"/>
    <rect x="19" y="6" width="5" height="19" rx="1" stroke={T.olive} strokeWidth="1.3"/>
    <path d="M4 17 L12 11 L20 6" stroke={T.olive} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IconStudents = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="9" r="4" stroke={T.olive} strokeWidth="1.3"/>
    <circle cx="20" cy="9" r="3" stroke={T.olive} strokeWidth="1.3"/>
    <path d="M3 23c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={T.olive} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M20 16c2.761 0 5 2.239 5 5" stroke={T.olive} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
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

  const navBg = scrolled ? "rgba(253,250,245,0.97)" : T.paper;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.9rem 2.5rem",
      background: navBg,
      borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    }}>
      <a href="#" style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.25rem", fontWeight: 700, color: T.ink, letterSpacing: "-0.01em" }}>
        Paid Off.
      </a>

      <div className="nav-desktop" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {links.map(l => (
          <a key={l.label} href={l.href}
            style={{ fontSize: "0.82rem", fontWeight: 400, color: T.inkSoft, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.olive}
            onMouseLeave={e => e.target.style.color = T.inkSoft}
          >{l.label}</a>
        ))}
        <a href="#waitlist"
          style={{
            background: T.olive, color: T.white, padding: "0.55rem 1.4rem",
            borderRadius: "100px", fontSize: "0.82rem", fontWeight: 500,
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
        >Join Waitlist</a>
      </div>

      <button id="hamburger" onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none", background: "none", border: "none", fontSize: "1.3rem", color: T.ink, cursor: "pointer" }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      <style>{`
        @media(max-width:768px){
          .nav-desktop { display: none !important; }
          #hamburger { display: block !important; }
        }
      `}</style>

      {menuOpen && (
        <div style={{ position: "fixed", top: "57px", left: 0, right: 0, background: T.paper, borderBottom: `1px solid ${T.border}`, padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 199 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontSize: "1rem", color: T.inkMid }}>{l.label}</a>
          ))}
          <a href="#waitlist" onClick={() => setMenuOpen(false)} style={{ background: T.olive, color: T.white, padding: "0.75rem 1.5rem", borderRadius: "100px", textAlign: "center", fontWeight: 500 }}>Join Waitlist</a>
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
      paddingTop: "8rem",
      paddingBottom: "5rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative large wordmark behind hero text */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -52%)",
        fontFamily: "'Playfair Display',serif",
        fontSize: "clamp(8rem, 22vw, 20rem)",
        fontWeight: 900, lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: `1px rgba(74,82,64,0.06)`,
        userSelect: "none", pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 0,
      }}>Paid Off.</div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", padding: "0 2rem" }}>
        <h1 className="fade-up d1 serif" style={{
          fontSize: "clamp(5rem, 14vw, 13rem)",
          fontWeight: 900, lineHeight: 0.92,
          letterSpacing: "-0.03em",
          color: T.olive,
          marginBottom: "2rem",
        }}>
          Paid Off.
        </h1>

        <div style={{ width: "48px", height: "1px", background: T.olivePale, margin: "0 auto 1.75rem" }} />

        <p className="fade-up d2" style={{
          fontSize: "1.15rem", color: T.inkMid, lineHeight: 1.65,
          maxWidth: "420px", margin: "0 auto 2.5rem",
        }}>
          Understand your loans. Plan your future.<br />Take control of what comes next.
        </p>

        <div className="fade-up d3" style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <a href="#simulator"
            style={{
              background: T.olive, color: T.white,
              padding: "0.85rem 2rem", borderRadius: "100px",
              fontSize: "0.9rem", fontWeight: 500,
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.oliveLight; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.transform = "translateY(0)"; }}
          >Try the Simulator</a>
          <a href="#translator"
            style={{ color: T.inkMid, fontSize: "0.9rem", fontWeight: 400, borderBottom: `1px solid ${T.borderMid}`, paddingBottom: "2px", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = T.olive}
            onMouseLeave={e => e.currentTarget.style.color = T.inkMid}
          >Translate My Aid Letter →</a>
        </div>
      </div>
      <style>{`@media(max-width:600px){ #hero h1 { font-size: clamp(4rem, 18vw, 8rem) !important; } }`}</style>
    </section>
  );
}

// ─── FEATURE STRIP ────────────────────────────────────────────────────────────
function FeatureStrip() {
  const [ref, visible] = useReveal();
  const features = [
    { icon: <IconSimulator />, title: "Loan Simulator", body: "See the real cost of borrowing and compare repayment outcomes.", cta: "Try it →", href: "#simulator" },
    { icon: <IconTranslator />, title: "Aid Translator", body: "Paste your financial aid letter and get clear, plain-English answers.", cta: "Try it →", href: "#translator" },
    { icon: <IconReality />, title: "Reality Check", body: "See how student debt can impact your future lifestyle and choices.", cta: "Explore →", href: "#reality" },
    { icon: <IconStudents />, title: "Built for Students", body: "Independent, unbiased, and designed to put you in control.", cta: "Learn More →", href: "#about" },
  ];

  return (
    <div ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.white, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {features.map((f, i) => (
          <div key={i} style={{
            padding: "2.25rem 2rem",
            borderRight: i < 3 ? `1px solid ${T.border}` : "none",
          }}>
            <div style={{ marginBottom: "1rem" }}>{f.icon}</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: T.ink, marginBottom: "0.5rem" }}>{f.title}</div>
            <p style={{ fontSize: "0.82rem", color: T.inkSoft, lineHeight: 1.6, marginBottom: "1rem" }}>{f.body}</p>
            <a href={f.href} style={{ fontSize: "0.8rem", color: T.olive, fontWeight: 500, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >{f.cta}</a>
          </div>
        ))}
      </div>
      <style>{`@media(max-width:900px){ .feature-strip-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
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
  const statusColor = pctIncome <= 10 ? "#4A6741" : pctIncome <= 20 ? "#8A6A20" : "#9B3520";
  const statusLabel = pctIncome <= 10 ? "Manageable" : pctIncome <= 20 ? "Strained" : "High Risk";

  // Sparkline path
  const points = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const remaining = loan * Math.pow(1 + monthlyRate, t * n) - monthly * (Math.pow(1 + monthlyRate, t * n) - 1) / monthlyRate;
    return Math.max(0, remaining);
  });
  const maxPt = loan;
  const sparkPath = points.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / 19) * 200} ${60 - (v / maxPt) * 55}`).join(" ");

  const inputFieldStyle = {
    width: "100%", padding: "0.65rem 0.85rem",
    border: `1px solid ${T.border}`, borderRadius: "6px",
    background: T.white, fontSize: "0.9rem", color: T.ink,
    outline: "none", fontFamily: "'DM Sans',sans-serif",
  };

  return (
    <section id="simulator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.parchment, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "5rem", alignItems: "center" }}>

        {/* Left: label + headline */}
        <div>
          <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Loan Simulator</span>
          <h2 className="serif" style={{ fontSize: "clamp(2.4rem,4vw,3.4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
            See the full picture.
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.7, marginBottom: "2rem" }}>
            Model different loan amounts, interest rates, and repayment plans to see what your future could really look like.
          </p>
          <a href="#simulator"
            style={{ display: "inline-block", padding: "0.7rem 1.6rem", border: `1px solid ${T.borderMid}`, borderRadius: "100px", fontSize: "0.82rem", color: T.inkMid, fontWeight: 500, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = T.olive; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.inkMid; e.currentTarget.style.borderColor = T.borderMid; }}
          >Try the Simulator</a>
        </div>

        {/* Right: simulator card */}
        <div style={{ background: T.white, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "2rem", boxShadow: "0 2px 20px rgba(74,82,64,0.06)" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: T.ink, marginBottom: "1.5rem" }}>Loan Simulator</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.72rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Loan Amount</label>
              <div style={{ position: "relative" }}>
                <input type="text" value={`$${loan.toLocaleString()}`} readOnly style={inputFieldStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Total Repaid</label>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: T.ink, letterSpacing: "-0.02em", fontFamily: "'Playfair Display',serif" }}>{fmt(Math.round(totalRepay))}</div>
              <div style={{ fontSize: "0.78rem", color: T.inkSoft, marginTop: "0.1rem" }}>Total Interest: {fmt(Math.round(totalInterest))}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.72rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Interest Rate</label>
              <input type="text" value={`${rate.toFixed(2)}%`} readOnly style={inputFieldStyle} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.5rem" }}>
              {/* Mini sparkline */}
              <svg width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none" style={{ opacity: 0.6 }}>
                <path d={sparkPath} fill="none" stroke={T.olive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="0" y="58" fontSize="8" fill={T.inkSoft}>$0</text>
                <text x="170" y="58" fontSize="8" fill={T.inkSoft}>10 yrs</text>
              </svg>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.72rem", color: T.inkSoft, display: "block", marginBottom: "0.4rem" }}>Repayment Plan</label>
            <div style={{ ...inputFieldStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Standard (10 years)</span>
              <span style={{ color: T.olivePale }}>▾</span>
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Loan Amount", value: loan, min: 5000, max: 150000, step: 1000, onChange: setLoan, display: fmt(loan) },
              { label: "Interest Rate", value: rate, min: 3, max: 12, step: 0.1, onChange: setRate, display: `${rate.toFixed(1)}%` },
              { label: "Starting Salary", value: salary, min: 25000, max: 150000, step: 1000, onChange: setSalary, display: fmt(salary) },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.7rem", color: T.inkSoft }}>{s.label}</span>
                  <span className="mono" style={{ fontSize: "0.7rem", color: T.olive }}>{s.display}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.onChange(Number(e.target.value))} />
              </div>
            ))}
          </div>

          {/* Summary row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", borderTop: `1px solid ${T.border}`, paddingTop: "1.25rem" }}>
            {[
              { label: "Monthly Payment", val: fmt(Math.round(monthly)) },
              { label: "Total Interest", val: fmt(Math.round(totalInterest)) },
              { label: "Payoff Time", val: `${years} years` },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: "0.68rem", color: T.inkSoft, marginBottom: "0.25rem" }}>{r.label}</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: T.ink }}>{r.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #simulator > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }`}</style>
    </section>
  );
}

// ─── AID TRANSLATOR BANNER ────────────────────────────────────────────────────
function TranslatorBanner() {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.sage, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "3rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "2.5rem", alignItems: "center" }}>
        <div style={{ color: T.oliveMid }}><IconTranslator /></div>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.oliveMid, marginBottom: "0.35rem" }}>Aid Translator</div>
          <h3 className="serif" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 700, color: T.ink, lineHeight: 1.1 }}>
            Confusing aid letters? We translate them.
          </h3>
        </div>
        <p style={{ fontSize: "0.88rem", color: T.inkSoft, maxWidth: "240px", lineHeight: 1.6 }}>
          Paste your financial aid award letter and get clear, plain-English answers.
        </p>
        <a href="#translator"
          style={{ background: T.white, color: T.ink, padding: "0.7rem 1.5rem", borderRadius: "100px", border: `1px solid ${T.borderMid}`, fontSize: "0.85rem", fontWeight: 500, whiteSpace: "nowrap", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = T.olive; e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = T.olive; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.color = T.ink; e.currentTarget.style.borderColor = T.borderMid; }}
        >Try the Translator</a>
      </div>
      <style>{`@media(max-width:768px){ .translator-banner-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

// ─── FULL TRANSLATOR SECTION ──────────────────────────────────────────────────
const SAMPLE_AID_TEXT = `Your financial aid package includes: Federal Direct Subsidized Loan ($3,500), Federal Direct Unsubsidized Loan ($2,000), Federal Work-Study ($2,500), Institutional Grant ($8,000), and Federal Pell Grant ($6,895). Your Expected Family Contribution (EFC) is $4,200. Net Price: $12,405.`;

const SAMPLE_TRANSLATION = [
  { term: "Institutional Grant ($8,000)", type: "free", plain: "Free money from your school. Never repaid." },
  { term: "Federal Pell Grant ($6,895)", type: "free", plain: "Free money from the government. Income-based eligibility." },
  { term: "Federal Work-Study ($2,500)", type: "work", plain: "A job offer, not a deposit. You earn this by working on campus." },
  { term: "Subsidized Loan ($3,500)", type: "debt", plain: "A loan. Must be repaid. Interest is covered while you're enrolled." },
  { term: "Unsubsidized Loan ($2,000)", type: "debt", plain: "A loan. Interest starts accruing immediately — even before you graduate." },
  { term: "Net Price: $12,405", type: "warning", plain: "Your remaining gap after grants. This must come from savings, work, or more loans." },
];

function Translator() {
  const [ref, visible] = useReveal();
  const [text, setText] = useState(SAMPLE_AID_TEXT);
  const [translated, setTranslated] = useState(false);
  const [loading, setLoading] = useState(false);

  const typeColors = {
    free:    { bg: "rgba(74,103,65,0.08)",  text: "#4A6741", tag: "Free Money" },
    work:    { bg: "rgba(138,106,32,0.08)", text: "#8A6A20", tag: "Work Required" },
    debt:    { bg: "rgba(155,53,32,0.08)",  text: "#9B3520", tag: "It's Debt" },
    warning: { bg: "rgba(74,82,64,0.06)",   text: T.inkMid,  tag: "Note" },
  };

  const handleTranslate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setTranslated(true); }, 1000);
  };

  return (
    <section id="translator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.linen, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Aid Translator</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "0.75rem" }}>
          Free money, or more debt?
        </h2>
        <p style={{ fontSize: "0.95rem", color: T.inkSoft, maxWidth: "460px", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Paste your award letter. We'll show you exactly what each line means.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ padding: "0.7rem 1rem", borderBottom: `1px solid ${T.border}`, fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft }}>
                Your award letter
              </div>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setTranslated(false); }}
                style={{ width: "100%", minHeight: "180px", padding: "1rem", border: "none", outline: "none", fontSize: "0.88rem", color: T.inkMid, lineHeight: 1.7, resize: "vertical", background: T.white }}
                placeholder="Paste your financial aid letter here..."
              />
            </div>
            <button
              onClick={handleTranslate} disabled={loading}
              style={{ marginTop: "0.85rem", width: "100%", background: loading ? T.olivePale : T.olive, color: T.white, padding: "0.85rem 2rem", borderRadius: "8px", fontSize: "0.88rem", fontWeight: 500, border: "none", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.oliveLight; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.olive; }}
            >
              {loading
                ? <><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Translating...</>
                : "Translate into Plain English →"}
            </button>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
              {[["free","Free Money"],["work","Work Required"],["debt","It's Debt"]].map(([type, lbl]) => (
                <span key={type} style={{ fontSize: "0.68rem", fontWeight: 500, padding: "0.2rem 0.55rem", borderRadius: "4px", background: typeColors[type].bg, color: typeColors[type].text }}>{lbl}</span>
              ))}
            </div>
          </div>

          <div style={{ background: T.olive, borderRadius: "8px", padding: "1.75rem", minHeight: "260px", display: "flex", flexDirection: "column" }}>
            {!translated ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.35, textAlign: "center", gap: "0.5rem" }}>
                <div style={{ width: "30px", height: "30px", border: "1px solid rgba(253,250,245,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: T.paper, fontSize: "0.85rem" }}>→</div>
                <p style={{ fontSize: "0.82rem", color: T.paper }}>Your plain-English breakdown appears here.</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", marginBottom: "1.25rem" }}>Plain English Breakdown</div>
                {SAMPLE_TRANSLATION.map((item, i) => (
                  <div key={i} style={{ borderBottom: i < SAMPLE_TRANSLATION.length - 1 ? "1px solid rgba(253,250,245,0.1)" : "none", padding: "0.8rem 0" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 600, padding: "0.18rem 0.45rem", borderRadius: "3px", background: typeColors[item.type].bg, color: typeColors[item.type].text, whiteSpace: "nowrap", flexShrink: 0, marginTop: "2px" }}>{typeColors[item.type].tag}</span>
                      <span className="mono" style={{ fontSize: "0.75rem", color: "rgba(253,250,245,0.7)" }}>{item.term}</span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "rgba(253,250,245,0.6)", lineHeight: 1.55 }}>{item.plain}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #translator > div > div:last-of-type { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─── REALITY CHECK ────────────────────────────────────────────────────────────
function RealityCheck() {
  const [ref, visible] = useReveal();
  const data = { totalBorrowed: 58000, monthlyPayment: 644, avgSalary: 45000, payoffYears: 10, dti: 17.1 };
  const rows = [
    { label: "Total borrowed",           val: fmt(data.totalBorrowed),            warn: false },
    { label: "Monthly payment",          val: fmt(data.monthlyPayment) + "/mo",   warn: true },
    { label: "Avg. starting salary",     val: fmt(data.avgSalary) + "/yr",        warn: false },
    { label: "Debt-to-income ratio",     val: fmtPct(data.dti),                   warn: true, note: "Exceeds recommended 15%" },
    { label: "Payoff timeline",          val: `${data.payoffYears} years`,         warn: false },
    { label: "Total repaid",             val: fmt(data.monthlyPayment * 120),      warn: true },
  ];

  return (
    <section id="reality" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.white, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Reality Check</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
            Every degree has a real cost.
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkSoft, lineHeight: 1.75 }}>
            This is what a typical 4-year degree actually looks like on paper. The full tool lets you enter your own school, major, and income.
          </p>
        </div>

        <div style={{ border: `1.5px solid ${T.ink}`, borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ background: T.ink, color: T.paper, padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", marginBottom: "0.25rem" }}>College Debt Facts</div>
            <div className="serif" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>State University</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(253,250,245,0.5)", marginTop: "0.25rem" }}>4-Year Degree · Sample Profile</div>
          </div>
          <div style={{ height: "6px", background: T.olive }} />
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.85rem 1.5rem",
              borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none",
              background: r.warn ? "rgba(74,82,64,0.03)" : T.white,
            }}>
              <div>
                <div style={{ fontSize: "0.86rem", color: T.inkMid }}>{r.label}</div>
                {r.note && <div style={{ fontSize: "0.66rem", color: "#9B3520", marginTop: "0.1rem" }}>{r.note}</div>}
              </div>
              <div className="mono" style={{ fontSize: "0.95rem", fontWeight: 600, color: r.warn ? "#9B3520" : T.ink }}>{r.val}</div>
            </div>
          ))}
          <div style={{ background: T.olive, color: T.white, padding: "1rem 1.5rem" }}>
            <div style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7, marginBottom: "0.2rem" }}>Bottom line</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 500, lineHeight: 1.5 }}>
              {fmtPct(data.dti)} of monthly take-home goes to loan payments — for a decade.
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
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  const fieldStyle = {
    width: "100%", padding: "0.75rem 1rem",
    border: `1px solid ${T.border}`, borderRadius: "6px",
    background: T.white, fontSize: "0.9rem", color: T.ink,
    outline: "none", marginBottom: "0.85rem", fontFamily: "'DM Sans',sans-serif",
  };

  const earlyAccess = [
    "AI financial aid translation",
    "Personalized loan impact projections",
    "College cost comparison tools",
    "Future debt payoff planning features",
  ];
  const earlyPerks = [
    "Free premium access during beta",
    "Personalized debt analysis",
    "Priority feature access",
  ];

  return (
    <section id="waitlist" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.parchment, padding: "6rem 2.5rem", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

        {/* Left: image placeholder + messaging */}
        <div>
          {/* Placeholder replacing the landscape photo */}
          <div style={{
            width: "100%", aspectRatio: "4/3", borderRadius: "8px", marginBottom: "2rem",
            background: `linear-gradient(135deg, ${T.sage} 0%, ${T.linen} 50%, ${T.sage} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ textAlign: "center", color: T.oliveMid }}>
              <div className="serif" style={{ fontSize: "2.5rem", fontWeight: 700, color: T.olive, opacity: 0.4 }}>Paid Off.</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginTop: "0.5rem" }}>Your future, clarified</div>
            </div>
          </div>

          <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.oliveMid, display: "block", marginBottom: "1rem" }}>Early Access</span>
          <h2 className="serif" style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.ink, marginBottom: "2rem" }}>
            Join the first group testing Paid Off's student debt tools.
          </h2>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: T.inkSoft, marginBottom: "0.75rem" }}>Early access includes:</div>
            {earlyAccess.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.45rem" }}>
                <span style={{ color: T.olive, marginTop: "2px", fontSize: "0.75rem" }}>•</span>
                <span style={{ fontSize: "0.88rem", color: T.inkMid, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: T.inkSoft, marginBottom: "0.75rem" }}>Early users will receive:</div>
            {earlyPerks.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.45rem" }}>
                <span style={{ color: T.olive, marginTop: "2px", fontSize: "0.75rem" }}>•</span>
                <span style={{ fontSize: "0.88rem", color: T.inkMid, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div style={{ paddingTop: "1rem" }}>
          {submitted ? (
            <div style={{ background: "rgba(74,103,65,0.08)", border: `1px solid rgba(74,103,65,0.2)`, borderRadius: "8px", padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "#4A6741", marginBottom: "0.5rem" }}>You're on the list.</div>
              <p style={{ fontSize: "0.88rem", color: T.inkSoft }}>We'll email <strong style={{ color: T.ink }}>{email}</strong> when Paid Off launches.</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "0.82rem", color: T.inkSoft, marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Spots are limited. Join now to secure early access.
              </p>
              <input style={fieldStyle} type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                onFocus={e => e.target.style.borderColor = T.olive}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              <input style={fieldStyle} type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = T.olive}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              {error && <p style={{ fontSize: "0.8rem", color: "#9B3520", marginBottom: "0.75rem", marginTop: "-0.4rem" }}>{error}</p>}
              <button
                onClick={handleSubmit} disabled={loading}
                style={{ width: "100%", background: loading ? T.olivePale : T.olive, color: T.white, padding: "0.9rem 2rem", borderRadius: "100px", fontSize: "0.9rem", fontWeight: 500, border: "none", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.oliveLight; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.olive; }}
              >
                {loading
                  ? <><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Joining...</>
                  : "Join the Waitlist"}
              </button>
              <p style={{ fontSize: "0.7rem", color: T.olivePale, marginTop: "0.75rem", textAlign: "center" }}>No spam. Unsubscribe anytime.</p>
            </div>
          )}

          <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${T.border}` }}>
            {[["$1.7T","US student debt"],["45M","Borrowers"],["Free","Always"]].map(([num, lbl]) => (
              <div key={lbl}>
                <div className="serif" style={{ fontSize: "1.6rem", fontWeight: 700, color: T.olive, lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: T.olivePale, marginTop: "0.2rem" }}>{lbl}</div>
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
          <div className="serif" style={{ fontSize: "1.2rem", fontWeight: 700, color: T.paper, marginBottom: "0.4rem" }}>Paid Off.</div>
          <p style={{ fontSize: "0.82rem", color: "rgba(253,250,245,0.45)", maxWidth: "240px", lineHeight: 1.6 }}>
            Helping students borrow smarter and graduate with less regret.
          </p>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { heading: "Tools", links: ["Loan Simulator", "Aid Translator", "Reality Check"] },
            { heading: "Company", links: ["About", "Contact", "Privacy"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(253,250,245,0.35)", marginBottom: "0.75rem" }}>{col.heading}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: "0.4rem" }}>
                  <a href="#" style={{ fontSize: "0.84rem", color: "rgba(253,250,245,0.55)", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = T.paper}
                    onMouseLeave={e => e.target.style.color = "rgba(253,250,245,0.55)"}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid rgba(253,250,245,0.08)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "rgba(253,250,245,0.3)" }}>© 2025 Paid Off. Not financial advice. For educational purposes only.</p>
        <p style={{ fontSize: "0.72rem", color: "rgba(253,250,245,0.3)" }}>paid-off.com</p>
      </div>
    </footer>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { injectGlobalStyles(); }, []);
  return (
    <div>
      <Nav />
      <Hero />
      <FeatureStrip />
      <Simulator />
      <TranslatorBanner />
      <Translator />
      <RealityCheck />
      <Waitlist />
      <Footer />
    </div>
  );
}
