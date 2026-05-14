import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  red: "#C8341A",
  redLight: "#E84D2E",
  redMuted: "#F5DDD8",
  cream: "#FAF7F2",
  creamDark: "#F0EBE1",
  ink: "#1A1208",
  inkMid: "#3D3022",
  inkSoft: "#7A6B55",
  white: "#FFFFFF",
  successBg: "rgba(42,122,78,0.1)",
  successText: "#2A7A4E",
};

// ─── GLOBAL STYLES (injected once) ───────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.cream}; color: ${T.ink}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  ::selection { background: ${T.red}; color: ${T.white}; }

  .serif { font-family: 'Playfair Display', Georgia, serif; }
  .mono  { font-family: 'DM Mono', monospace; }

  input[type=range] {
    -webkit-appearance: none; width: 100%; height: 3px;
    background: rgba(26,18,8,0.15); border-radius: 0; outline: none; cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 20px; height: 20px;
    background: ${T.red}; border-radius: 50%; cursor: pointer;
    box-shadow: 0 0 0 4px rgba(200,52,26,0.15);
  }
  input[type=range]::-moz-range-thumb {
    width: 20px; height: 20px; background: ${T.red};
    border-radius: 50%; cursor: pointer; border: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.4; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fade-up { animation: fadeUp 0.7s ease both; }
  .d1 { animation-delay: 0.1s; }
  .d2 { animation-delay: 0.25s; }
  .d3 { animation-delay: 0.4s; }
  .d4 { animation-delay: 0.55s; }
  .d5 { animation-delay: 0.7s; }

  .section-reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .section-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

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
function useReveal(threshold = 0.15) {
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

// ─── FORMATTERS ───────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtPct = (n) => `${n.toFixed(1)}%`;

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Aid Translator", href: "#translator" },
    { label: "Loan Simulator", href: "#simulator" },
    { label: "Reality Check", href: "#reality" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 2.5rem",
      background: scrolled ? "rgba(250,247,242,0.97)" : T.cream,
      borderBottom: `1px solid rgba(26,18,8,${scrolled ? 0.1 : 0.06})`,
      backdropFilter: "blur(8px)",
      transition: "all 0.3s ease",
    }}>
      <a href="#" style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: T.ink, letterSpacing: "-0.02em" }}>
        Paid <span style={{ color: T.red }}>Off</span>
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="nav-desktop">
        {links.map(l => (
          <a key={l.label} href={l.href} style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.red}
            onMouseLeave={e => e.target.style.color = T.inkSoft}
          >{l.label}</a>
        ))}
        <a href="#waitlist" style={{ background: T.red, color: T.white, padding: "0.5rem 1.25rem", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "background 0.2s" }}
          onMouseEnter={e => e.target.style.background = T.redLight}
          onMouseLeave={e => e.target.style.background = T.red}
        >Join Waitlist</a>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", fontSize: "1.4rem", color: T.ink }} id="hamburger">☰</button>

      <style>{`
        @media(max-width:768px){
          .nav-desktop { display: none !important; }
          #hamburger { display: block !important; }
        }
      `}</style>

      {menuOpen && (
        <div style={{ position: "fixed", top: "56px", left: 0, right: 0, background: T.cream, borderBottom: `1px solid rgba(26,18,8,0.1)`, padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 199 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontSize: "1rem", fontWeight: 500, color: T.inkMid }}>{l.label}</a>
          ))}
          <a href="#waitlist" onClick={() => setMenuOpen(false)} style={{ background: T.red, color: T.white, padding: "0.75rem 1.5rem", fontWeight: 500, textAlign: "center" }}>Join Waitlist</a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const stats = [
    { num: "$37,574", label: "Average student debt at graduation" },
    { num: "20 yrs", label: "How long the average borrower spends repaying" },
    { num: "43%", label: "Of borrowers not actively reducing principal" },
  ];

  return (
    <section id="hero" style={{
      minHeight: "100vh", padding: "8rem 2.5rem 5rem",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem",
      alignItems: "center", position: "relative", overflow: "hidden",
      background: T.cream,
    }}>
      {/* BG decorative text */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "-2rem", right: "-1rem",
        fontFamily: "'Playfair Display',serif", fontSize: "22vw", fontWeight: 900,
        color: "transparent", WebkitTextStroke: `1px rgba(200,52,26,0.07)`,
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>$</div>

      {/* Left */}
      <div>
        <span className="fade-up d1" style={{
          display: "inline-block", fontSize: "0.72rem", fontWeight: 500,
          letterSpacing: "0.16em", textTransform: "uppercase", color: T.red,
          border: `1px solid ${T.red}`, padding: "0.3rem 0.75rem", marginBottom: "1.5rem",
        }}>Student Debt Clarity — Free Tool</span>

        <h1 className="fade-up d2 serif" style={{
          fontSize: "clamp(2.8rem, 5vw, 5rem)", fontWeight: 900, lineHeight: 1.0,
          letterSpacing: "-0.03em", color: T.ink, marginBottom: "1.5rem",
        }}>
          Understand your<br />student loans<br /><em style={{ color: T.red, fontStyle: "italic" }}>before they own</em><br />your future.
        </h1>

        <p className="fade-up d3" style={{ fontSize: "1.05rem", color: T.inkSoft, lineHeight: 1.75, maxWidth: "440px", marginBottom: "2.5rem" }}>
          Paid Off helps students and families see the real cost of borrowing, compare repayment scenarios, and translate confusing financial aid language into plain English.
        </p>

        <div className="fade-up d4" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <a href="#simulator"
            style={{ background: T.red, color: T.white, padding: "0.9rem 2rem", fontSize: "0.9rem", fontWeight: 500, display: "inline-block", transition: "background 0.2s, transform 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.red; e.currentTarget.style.transform = "translateY(0)"; }}
          >Try the loan simulator</a>
          <a href="#waitlist"
            style={{ color: T.ink, fontSize: "0.9rem", fontWeight: 500, borderBottom: `1px solid ${T.ink}`, paddingBottom: "2px", transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = T.red; e.currentTarget.style.borderColor = T.red; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.ink; e.currentTarget.style.borderColor = T.ink; }}
          >Join the waitlist →</a>
        </div>
      </div>

      {/* Right stats */}
      <div className="fade-up d3" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: T.white, border: `1px solid rgba(26,18,8,0.09)`,
            padding: "1.75rem 2rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: T.red }} />
            <div className="serif" style={{ fontSize: "3rem", fontWeight: 900, color: T.red, lineHeight: 1, display: "block" }}>{s.num}</div>
            <div style={{ fontSize: "0.85rem", color: T.inkSoft, marginTop: "0.4rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="fade-up d5" style={{ position: "absolute", bottom: "2rem", left: "2.5rem", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: "40px", height: "1px", background: T.inkSoft, display: "inline-block" }} />
        Scroll to explore
      </div>

      <style>{`@media(max-width:768px){ #hero { grid-template-columns: 1fr !important; padding: 7rem 1.5rem 4rem !important; } }`}</style>
    </section>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["Financial Aid Translator", "Loan Impact Simulator", "College Cost Reality Check", "Know Before You Borrow", "Free. No Sign-Up Required."];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: T.ink, padding: "0.9rem 0", overflow: "hidden", whiteSpace: "nowrap" }} aria-hidden="true">
      <div style={{ display: "inline-flex", animation: "marquee 24s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: "0.76rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.cream, padding: "0 3rem" }}>
            {item} <span style={{ color: T.red }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PROBLEM SECTION ─────────────────────────────────────────────────────────
function Problem() {
  const [ref, visible] = useReveal();
  const points = [
    { icon: "💸", title: "Hidden true cost", body: "The sticker price doesn't show what you'll really pay after interest compounds over a decade." },
    { icon: "📄", title: "Confusing aid letters", body: "Loans, grants, and work-study are bundled together to make offers look more generous than they are." },
    { icon: "📉", title: "Income blindspot", body: "Nobody tells you whether your loan payment is 8% or 40% of your future take-home pay." },
    { icon: "⏳", title: "20-year default", body: "Standard repayment plans drag on for 10–20 years, quietly reshaping every financial decision you make." },
  ];

  return (
    <section ref={ref} className={`section-reveal${visible ? " visible" : ""}`} style={{ background: T.creamDark, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1rem" }}>The Problem</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.5rem", maxWidth: "700px" }}>
          Most students sign for thousands without knowing what they're really agreeing to.
        </h2>
        <p style={{ fontSize: "1.05rem", color: T.inkSoft, maxWidth: "620px", lineHeight: 1.75, marginBottom: "3.5rem" }}>
          Most students sign for thousands of dollars in loans without understanding monthly payments, interest, repayment timelines, or how those choices affect life after graduation. Paid Off changes that.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {points.map((p, i) => (
            <div key={i} style={{ background: T.white, padding: "2rem", border: `1px solid rgba(26,18,8,0.08)`, borderTop: `3px solid ${T.red}`, transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,18,8,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{p.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: T.ink, marginBottom: "0.5rem" }}>{p.title}</div>
              <p style={{ fontSize: "0.85rem", color: T.inkSoft, lineHeight: 1.65 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){ section { padding: 4rem 1.5rem !important; } }`}</style>
    </section>
  );
}

// ─── LOAN SIMULATOR ───────────────────────────────────────────────────────────
function Simulator() {
  const [ref, visible] = useReveal();
  const [loan, setLoan] = useState(30000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(10);
  const [salary, setSalary] = useState(50000);

  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const monthly = monthlyRate === 0 ? loan / n : (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalRepay = monthly * n;
  const totalInterest = totalRepay - loan;
  const monthlyTakeHome = (salary * 0.72) / 12;
  const pctIncome = (monthly / monthlyTakeHome) * 100;

  const isHealthy = pctIncome <= 10;
  const isStrained = pctIncome > 10 && pctIncome <= 20;
  const isDangerous = pctIncome > 20;

  const statusColor = isHealthy ? "#2A7A4E" : isStrained ? "#B8860B" : T.red;
  const statusLabel = isHealthy ? "Manageable" : isStrained ? "Strained" : "High Risk";

  const SliderInput = ({ label, value, min, max, step, onChange, display }) => (
    <div style={{ marginBottom: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft }}>{label}</span>
        <span className="mono" style={{ fontSize: "1rem", fontWeight: 500, color: T.red }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );

  return (
    <section id="simulator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`} style={{ background: T.creamDark, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1rem" }}>02 — Loan Impact Simulator</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
          What will it <em style={{ fontStyle: "italic" }}>really</em> cost you?
        </h2>
        <p style={{ fontSize: "1rem", color: T.inkSoft, maxWidth: "520px", lineHeight: 1.75, marginBottom: "3rem" }}>
          Slide to your numbers and see what that loan looks like over your life — not just the balance, but the real monthly payment and what percentage of your income it consumes.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "4rem", alignItems: "start" }}>
          {/* Sliders */}
          <div style={{ background: T.white, padding: "2.5rem", border: `1px solid rgba(26,18,8,0.08)` }}>
            <SliderInput label="Total Loan Amount" value={loan} min={5000} max={200000} step={1000} onChange={setLoan} display={fmt(loan)} />
            <SliderInput label="Interest Rate" value={rate} min={3} max={12} step={0.1} onChange={setRate} display={`${rate.toFixed(1)}%`} />
            <SliderInput label="Repayment Term" value={years} min={5} max={30} step={1} onChange={setYears} display={`${years} years`} />
            <SliderInput label="Expected Starting Salary" value={salary} min={25000} max={150000} step={1000} onChange={setSalary} display={fmt(salary)} />
            <p style={{ fontSize: "0.78rem", color: T.inkSoft, lineHeight: 1.65, marginTop: "0.5rem", borderTop: `1px solid rgba(26,18,8,0.08)`, paddingTop: "1rem" }}>
              The 10% rule: financial experts recommend keeping student loan payments under 10% of gross monthly income. Anything above that begins to limit your life choices.
            </p>
          </div>

          {/* Results */}
          <div style={{ position: "sticky", top: "6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: T.ink, padding: "2.5rem", color: T.cream }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,247,242,0.45)", marginBottom: "0.5rem" }}>Total you'll actually repay</div>
              <div className="serif" style={{ fontSize: "3rem", fontWeight: 900, color: "#F5926A", lineHeight: 1 }}>{fmt(Math.round(totalRepay))}</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(250,247,242,0.5)", marginTop: "0.5rem" }}>{fmt(Math.round(totalInterest))} in interest above your original balance</div>
            </div>

            {[
              { label: "Monthly payment", val: fmt(Math.round(monthly)), danger: true },
              { label: "Total interest paid", val: fmt(Math.round(totalInterest)), danger: true },
              { label: "Repayment period", val: `${years} years` },
            ].map((r, i) => (
              <div key={i} style={{ background: T.white, padding: "1.25rem 1.5rem", border: `1px solid rgba(26,18,8,0.08)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.88rem", color: T.inkSoft }}>{r.label}</span>
                <span className="mono" style={{ fontSize: "1rem", fontWeight: 500, color: r.danger ? T.red : T.ink }}>{r.val}</span>
              </div>
            ))}

            {/* Income % indicator */}
            <div style={{ background: T.white, padding: "1.5rem", border: `1px solid rgba(26,18,8,0.08)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.82rem", color: T.inkSoft }}>% of monthly take-home</span>
                <span className="mono" style={{ fontSize: "1rem", fontWeight: 600, color: statusColor }}>{fmtPct(Math.min(pctIncome, 99.9))}</span>
              </div>
              <div style={{ height: "6px", background: "rgba(26,18,8,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(pctIncome, 100)}%`, background: statusColor, transition: "width 0.4s ease, background 0.4s ease", borderRadius: "3px" }} />
              </div>
              <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: T.inkSoft }}>Budget impact</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.6rem", background: `${statusColor}15`, color: statusColor }}>{statusLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #simulator > div > div:last-of-type { grid-template-columns: 1fr !important; gap: 2rem !important; } #simulator div[style*="sticky"] { position: relative !important; top: auto !important; } }`}</style>
    </section>
  );
}

// ─── COLLEGE REALITY CHECK ───────────────────────────────────────────────────
function RealityCheck() {
  const [ref, visible] = useReveal();

  const label = {
    school: "State University",
    totalBorrowed: 58000,
    monthlyPayment: 644,
    avgSalary: 45000,
    payoffYears: 10,
    dti: 17.1,
  };

  const rows = [
    { label: "Estimated total borrowed", val: fmt(label.totalBorrowed), warn: false },
    { label: "Est. monthly payment (10yr)", val: fmt(label.monthlyPayment) + "/mo", warn: true },
    { label: "Avg. starting salary (your field)", val: fmt(label.avgSalary) + "/yr", warn: false },
    { label: "Debt-to-income ratio", val: fmtPct(label.dti), warn: true, note: "Exceeds recommended 15%" },
    { label: "Estimated payoff timeline", val: `${label.payoffYears} years`, warn: false },
    { label: "Total you'll repay (with interest)", val: fmt(label.monthlyPayment * 120), warn: true },
  ];

  return (
    <section id="reality" ref={ref} className={`section-reveal${visible ? " visible" : ""}`} style={{ background: T.white, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1rem" }}>03 — College Cost Reality Check</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
            Every degree comes with a <em style={{ fontStyle: "italic", color: T.red }}>nutrition label.</em>
          </h2>
          <p style={{ fontSize: "1rem", color: T.inkSoft, lineHeight: 1.75, marginBottom: "2rem" }}>
            Just like food packaging tells you what's inside, your college choice should come with a clear breakdown of what you're really committing to — before you enroll.
          </p>
          <p style={{ fontSize: "0.88rem", color: T.inkSoft, lineHeight: 1.7, padding: "1.25rem", background: T.creamDark, borderLeft: `3px solid ${T.red}` }}>
            This sample shows typical numbers for a 4-year degree. The full tool (coming soon) will let you enter your actual school, major, and family income.
          </p>
        </div>

        {/* Debt Nutrition Label */}
        <div style={{ border: `3px solid ${T.ink}`, fontFamily: "'DM Sans', sans-serif" }}>
          {/* Header */}
          <div style={{ background: T.ink, color: T.cream, padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,247,242,0.5)", marginBottom: "0.25rem" }}>College Debt Facts</div>
            <div className="serif" style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{label.school}</div>
            <div style={{ fontSize: "0.78rem", color: "rgba(250,247,242,0.55)", marginTop: "0.25rem" }}>4-Year Undergraduate Degree · Sample Profile</div>
          </div>

          {/* Divider */}
          <div style={{ height: "8px", background: T.ink }} />

          {/* Rows */}
          <div>
            {rows.map((r, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.9rem 1.5rem",
                borderBottom: i < rows.length - 1 ? `1px solid rgba(26,18,8,0.1)` : "none",
                background: r.warn ? "rgba(200,52,26,0.03)" : T.white,
              }}>
                <div>
                  <div style={{ fontSize: "0.88rem", color: T.inkMid, fontWeight: 400 }}>{r.label}</div>
                  {r.note && <div style={{ fontSize: "0.7rem", color: T.red, marginTop: "0.15rem" }}>⚠ {r.note}</div>}
                </div>
                <div className="mono" style={{ fontSize: "1rem", fontWeight: 600, color: r.warn ? T.red : T.ink }}>{r.val}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ background: T.red, color: T.white, padding: "1rem 1.5rem" }}>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem", opacity: 0.8 }}>Bottom line</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.5 }}>
              You'll spend <strong>{fmtPct(label.dti)}</strong> of your monthly take-home on loan payments for a decade. Know this before you commit.
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #reality > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }`}</style>
    </section>
  );
}

// ─── AID TRANSLATOR ───────────────────────────────────────────────────────────
const SAMPLE_AID_TEXT = `Your financial aid package includes: Federal Direct Subsidized Loan ($3,500), Federal Direct Unsubsidized Loan ($2,000), Federal Work-Study ($2,500), Institutional Grant ($8,000), and Federal Pell Grant ($6,895). Your Expected Family Contribution (EFC) is $4,200. Net Price: $12,405.`;

const SAMPLE_TRANSLATION = [
  { term: "Institutional Grant ($8,000)", type: "free", plain: "This is FREE money from your school. You never pay it back. It reduces your real cost." },
  { term: "Federal Pell Grant ($6,895)", type: "free", plain: "Also FREE money from the government. Only available if your family earns under a certain threshold." },
  { term: "Federal Work-Study ($2,500)", type: "work", plain: "This is NOT money in your account. It's a job offer. You must find and work an on-campus job to earn this amount." },
  { term: "Subsidized Loan ($3,500)", type: "debt", plain: "This IS a loan. You must repay it. The government pays interest while you're in school, which is the one upside." },
  { term: "Unsubsidized Loan ($2,000)", type: "debt", plain: "This is also a loan — and interest starts accruing immediately, even while you're still in school." },
  { term: "Net Price: $12,405", type: "warning", plain: "This is your remaining gap after grants only. You'll need to cover this through savings, work, or loans." },
];

function Translator() {
  const [ref, visible] = useReveal();
  const [text, setText] = useState(SAMPLE_AID_TEXT);
  const [translated, setTranslated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTranslate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setTranslated(true); }, 1200);
  };

  const typeColors = {
    free:    { bg: "rgba(42,122,78,0.08)",  text: "#2A7A4E",  tag: "Free Money" },
    work:    { bg: "rgba(184,134,11,0.08)", text: "#8A5A0A",  tag: "Work Required" },
    debt:    { bg: "rgba(200,52,26,0.08)",  text: T.red,       tag: "It's Debt" },
    warning: { bg: "rgba(200,52,26,0.05)",  text: T.inkMid,    tag: "Note" },
  };

  return (
    <section id="translator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`} style={{ background: T.creamDark, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1rem" }}>01 — Financial Aid Translator</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1rem" }}>
          That letter was written<br />to <em style={{ fontStyle: "italic", color: T.red }}>confuse you.</em>
        </h2>
        <p style={{ fontSize: "1rem", color: T.inkSoft, maxWidth: "520px", lineHeight: 1.75, marginBottom: "3rem" }}>
          Paste any text from your financial aid award letter. We'll decode what's free money, what's a job offer, and what's debt — in plain English.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          {/* Input */}
          <div>
            <div style={{ background: T.white, border: `1px solid rgba(26,18,8,0.1)`, padding: "0", overflow: "hidden" }}>
              <div style={{ padding: "0.75rem 1.25rem", borderBottom: `1px solid rgba(26,18,8,0.08)`, background: T.cream, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft }}>
                Paste your aid letter text
              </div>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setTranslated(false); }}
                style={{ width: "100%", minHeight: "200px", padding: "1.25rem", border: "none", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: T.inkMid, lineHeight: 1.7, resize: "vertical", background: T.white }}
                placeholder="Paste your financial aid award letter text here..."
              />
            </div>
            <button
              onClick={handleTranslate}
              disabled={loading}
              style={{ marginTop: "1rem", width: "100%", background: loading ? T.inkSoft : T.red, color: T.white, padding: "0.95rem 2rem", fontSize: "0.9rem", fontWeight: 500, border: "none", cursor: loading ? "wait" : "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.redLight; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.red; }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Translating...
                </>
              ) : "Translate into Plain English →"}
            </button>

            {/* Aid type legend */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
              {[["free","Free Money"],["work","Work Required"],["debt","It's Debt"]].map(([type, label]) => (
                <span key={type} style={{ fontSize: "0.7rem", fontWeight: 500, padding: "0.25rem 0.6rem", background: typeColors[type].bg, color: typeColors[type].text, letterSpacing: "0.04em" }}>{label}</span>
              ))}
            </div>
          </div>

          {/* Output */}
          <div style={{ background: T.ink, padding: "1.75rem", minHeight: "300px", display: "flex", flexDirection: "column" }}>
            {!translated ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.35, textAlign: "center", gap: "0.75rem" }}>
                <div style={{ fontSize: "2.5rem" }}>🔍</div>
                <p style={{ fontSize: "0.88rem", color: T.cream, fontFamily: "'DM Sans',sans-serif" }}>Paste your award letter and click Translate to decode it.</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(250,247,242,0.4)", marginBottom: "1.25rem" }}>Plain English Breakdown</div>
                {SAMPLE_TRANSLATION.map((item, i) => (
                  <div key={i} style={{ borderBottom: `1px solid rgba(250,247,242,0.08)`, padding: "0.9rem 0", lastChild: { border: "none" } }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "0.2rem 0.5rem", background: typeColors[item.type].bg, color: typeColors[item.type].text, whiteSpace: "nowrap", letterSpacing: "0.06em", marginTop: "2px", flexShrink: 0 }}>
                        {typeColors[item.type].tag}
                      </span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(250,247,242,0.75)", fontFamily: "'DM Mono',monospace" }}>{item.term}</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "rgba(250,247,242,0.6)", lineHeight: 1.6, paddingLeft: "0" }}>{item.plain}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Glossary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "3rem" }}>
          {[
            { tag: "Free Money", tagStyle: { background: "rgba(42,122,78,0.1)", color: "#2A7A4E" }, title: "Grants & Scholarships", body: "You never pay this back. This is the only number that truly reduces your cost of attendance." },
            { tag: "Earn It", tagStyle: { background: "rgba(184,134,11,0.1)", color: "#8A5A0A" }, title: "Work-Study", body: "A job offer, not a deposit. You still need to find the position and work the hours to earn this." },
            { tag: "It's Debt", tagStyle: { background: "rgba(200,52,26,0.08)", color: T.red }, title: "All Loans", body: "Subsidized, unsubsidized, PLUS — every dollar is a loan. It must be repaid, with interest." },
          ].map((c, i) => (
            <div key={i} style={{ background: T.white, padding: "1.5rem", border: `1px solid rgba(26,18,8,0.08)` }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.6rem", display: "inline-block", marginBottom: "0.75rem", ...c.tagStyle }}>{c.tag}</span>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", fontWeight: 700, color: T.ink, marginBottom: "0.5rem" }}>{c.title}</div>
              <p style={{ fontSize: "0.84rem", color: T.inkSoft, lineHeight: 1.65 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ #translator > div > div:nth-of-type(2) { grid-template-columns: 1fr !important; } #translator > div > div:last-of-type { grid-template-columns: 1fr !important; } }
      `}</style>
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
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  const inputStyle = {
    width: "100%", background: "rgba(250,247,242,0.07)", border: `1px solid rgba(250,247,242,0.18)`,
    padding: "0.9rem 1.25rem", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem",
    color: T.cream, outline: "none", marginBottom: "1rem",
  };

  return (
    <section id="waitlist" ref={ref} className={`section-reveal${visible ? " visible" : ""}`} style={{
      background: T.ink, color: T.cream, padding: "7rem 2.5rem",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* BG text */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        fontFamily: "'Playfair Display',serif", fontSize: "18vw", fontWeight: 900,
        color: "transparent", WebkitTextStroke: "1px rgba(250,247,242,0.04)",
        pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none",
      }}>PAID OFF</div>

      <div style={{ position: "relative", maxWidth: "540px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(250,247,242,0.4)", display: "block", marginBottom: "1rem" }}>Early Access</span>
        <h2 className="serif" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em", color: T.cream, marginBottom: "1rem" }}>
          Be first to know<br />when we <em style={{ fontStyle: "italic", color: "#F5926A" }}>launch.</em>
        </h2>
        <p style={{ fontSize: "1rem", color: "rgba(250,247,242,0.5)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
          Paid Off is in development. Join the waitlist and we'll let you know the moment it's ready — plus early access to all tools.
        </p>

        {submitted ? (
          <div style={{ background: "rgba(42,122,78,0.15)", border: "1px solid rgba(42,122,78,0.3)", padding: "1.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✓</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#7ED9A8", marginBottom: "0.4rem" }}>You're on the list!</div>
            <p style={{ fontSize: "0.88rem", color: "rgba(250,247,242,0.5)" }}>We'll email you at <strong style={{ color: T.cream }}>{email}</strong> when Paid Off launches. Thank you for your interest.</p>
          </div>
        ) : (
          <div>
            <input style={inputStyle} type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(250,247,242,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(250,247,242,0.18)"}
            />
            <input style={inputStyle} type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(250,247,242,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(250,247,242,0.18)"}
            />
            {error && <p style={{ fontSize: "0.82rem", color: "#F5926A", marginBottom: "1rem", marginTop: "-0.5rem" }}>{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", background: loading ? T.inkSoft : T.red, color: T.white, padding: "1rem 2rem", fontSize: "0.95rem", fontWeight: 500, border: "none", cursor: loading ? "wait" : "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.redLight; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.red; }}
            >
              {loading ? (
                <><span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Joining...</>
              ) : "Join the Waitlist →"}
            </button>
            <p style={{ fontSize: "0.72rem", color: "rgba(250,247,242,0.3)", marginTop: "0.75rem" }}>No spam. No pressure. Unsubscribe anytime.</p>
          </div>
        )}

        {/* Trust stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "3.5rem", flexWrap: "wrap" }}>
          {[["$1.7T","Total US student debt"],["45M","Borrowers in the US"],["Free","Always, forever"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <span className="serif" style={{ fontSize: "2rem", fontWeight: 900, color: "#F5926A", display: "block" }}>{num}</span>
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(250,247,242,0.35)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.creamDark, borderTop: `1px solid rgba(26,18,8,0.08)`, padding: "3rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <div className="serif" style={{ fontSize: "1.3rem", fontWeight: 700, color: T.ink, marginBottom: "0.5rem" }}>
            Paid <span style={{ color: T.red }}>Off</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: T.inkSoft, maxWidth: "260px", lineHeight: 1.65 }}>
            Helping students borrow smarter and graduate with less regret.
          </p>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { heading: "Tools", links: ["Aid Translator", "Loan Simulator", "Reality Check"] },
            { heading: "Company", links: ["About", "Contact", "Privacy"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.75rem" }}>{col.heading}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: "0.4rem" }}>
                  <a href="#" style={{ fontSize: "0.88rem", color: T.inkMid, transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = T.red}
                    onMouseLeave={e => e.target.style.color = T.inkMid}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: `1px solid rgba(26,18,8,0.08)`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.75rem", color: T.inkSoft }}>© 2025 Paid Off. Not financial advice. For educational purposes only.</p>
        <p style={{ fontSize: "0.75rem", color: T.inkSoft }}>paid-off.com</p>
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
      <Marquee />
      <Problem />
      <Translator />
      <Simulator />
      <RealityCheck />
      <Waitlist />
      <Footer />
    </div>
  );
}
