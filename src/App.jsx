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
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
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
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-up { animation: fadeUp 0.7s ease both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.18s; }
  .d3 { animation-delay: 0.32s; }
  .d4 { animation-delay: 0.46s; }
  .d5 { animation-delay: 0.6s; }

  .section-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.6s ease, transform 0.6s ease;
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
function useReveal(threshold = 0.12) {
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
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="nav-desktop">
        {links.map(l => (
          <a key={l.label} href={l.href}
            style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.red}
            onMouseLeave={e => e.target.style.color = T.inkSoft}
          >{l.label}</a>
        ))}
        <a href="#waitlist"
          style={{ background: T.red, color: T.white, padding: "0.5rem 1.25rem", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", transition: "background 0.2s" }}
          onMouseEnter={e => e.target.style.background = T.redLight}
          onMouseLeave={e => e.target.style.background = T.red}
        >Join Waitlist</a>
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)} id="hamburger"
        style={{ display: "none", background: "none", border: "none", fontSize: "1.4rem", color: T.ink }}>
        {menuOpen ? "✕" : "☰"}
      </button>
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
  return (
    <section id="hero" style={{
      minHeight: "100vh", padding: "9rem 2.5rem 5rem",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem",
      alignItems: "center", position: "relative", overflow: "hidden",
      background: T.cream,
    }}>
      {/* Decorative bg letter */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "-2rem", right: "-1rem",
        fontFamily: "'Playfair Display',serif", fontSize: "22vw", fontWeight: 900,
        color: "transparent", WebkitTextStroke: "1px rgba(200,52,26,0.06)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>$</div>

      {/* Left: headline + CTA */}
      <div>
        <h1 className="fade-up d1 serif" style={{
          fontSize: "clamp(2.8rem, 5vw, 5rem)", fontWeight: 900, lineHeight: 1.05,
          letterSpacing: "-0.03em", color: T.ink, marginBottom: "1.5rem",
        }}>
          Understand student loans before they <em style={{ color: T.red, fontStyle: "italic" }}>shape your future.</em>
        </h1>

        <p className="fade-up d2" style={{
          fontSize: "1.1rem", color: T.inkSoft, lineHeight: 1.75,
          maxWidth: "420px", marginBottom: "2.5rem",
        }}>
          See the real cost of borrowing, compare repayment outcomes, and translate confusing financial aid language.
        </p>

        <div className="fade-up d3" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
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

      {/* Right: impact visual */}
      <div className="fade-up d3">
        <HeroImpactCard />
      </div>

      <div className="fade-up d5" style={{ position: "absolute", bottom: "2rem", left: "2.5rem", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: "36px", height: "1px", background: T.inkSoft, display: "inline-block" }} />
        Scroll to explore
      </div>

      <style>{`@media(max-width:768px){ #hero { grid-template-columns: 1fr !important; padding: 7rem 1.5rem 4rem !important; } }`}</style>
    </section>
  );
}

// ─── HERO IMPACT CARD ─────────────────────────────────────────────────────────
function HeroImpactCard() {
  const [borrowed, setBorrowed] = useState(40000);
  const rate = 6.5;
  const years = 10;
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const monthly = (borrowed * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalRepaid = Math.round(monthly * n);
  const interest = totalRepaid - borrowed;
  const multiplier = (totalRepaid / borrowed).toFixed(2);

  return (
    <div style={{ background: T.ink, color: T.cream, padding: "2.5rem", position: "relative", overflow: "hidden" }}>
      {/* Subtle bg watermark */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "-1rem", right: "-0.5rem",
        fontFamily: "'Playfair Display',serif", fontSize: "8rem", fontWeight: 900,
        color: "transparent", WebkitTextStroke: "1px rgba(250,247,242,0.04)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>$</div>

      <div style={{ fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(250,247,242,0.4)", marginBottom: "2rem" }}>
        What a loan really costs — at 6.5% over 10 years
      </div>

      {/* Borrowed row */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(250,247,242,0.45)", marginBottom: "0.4rem" }}>
          You borrow
        </div>
        <div className="serif" style={{ fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 900, color: T.cream, lineHeight: 1 }}>
          {fmt(borrowed)}
        </div>
      </div>

      {/* Arrow connector */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(250,247,242,0.12)" }} />
        <div style={{ fontSize: "0.72rem", color: "rgba(250,247,242,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>+{fmt(interest)} interest</div>
        <div style={{ flex: 1, height: "1px", background: "rgba(250,247,242,0.12)" }} />
      </div>

      {/* Repaid row */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,146,106,0.7)", marginBottom: "0.4rem" }}>
          You actually repay
        </div>
        <div className="serif" style={{ fontSize: "clamp(2.8rem,5vw,4rem)", fontWeight: 900, color: "#F5926A", lineHeight: 1 }}>
          {fmt(totalRepaid)}
        </div>
      </div>

      {/* Bar visualization */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", height: "10px", borderRadius: "2px", overflow: "hidden", gap: "2px" }}>
          <div style={{ width: `${(borrowed / totalRepaid) * 100}%`, background: "rgba(250,247,242,0.3)", transition: "width 0.4s ease" }} />
          <div style={{ flex: 1, background: "#F5926A", transition: "width 0.4s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.68rem", color: "rgba(250,247,242,0.4)" }}>Principal</span>
          <span style={{ fontSize: "0.68rem", color: "rgba(245,146,106,0.7)" }}>Interest</span>
        </div>
      </div>

      {/* Slider */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(250,247,242,0.4)" }}>Adjust loan amount</span>
          <span className="mono" style={{ fontSize: "0.78rem", color: T.cream }}>{fmt(borrowed)}</span>
        </div>
        <input type="range" min={5000} max={150000} step={1000} value={borrowed}
          onChange={e => setBorrowed(Number(e.target.value))}
          style={{ background: "rgba(250,247,242,0.15)" }}
        />
      </div>

      {/* Footer callout */}
      <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(250,247,242,0.08)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.78rem", color: "rgba(250,247,242,0.4)" }}>Monthly payment</span>
        <span className="mono" style={{ fontSize: "1rem", color: "#F5926A", fontWeight: 500 }}>{fmt(Math.round(monthly))}/mo</span>
      </div>
    </div>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["Financial Aid Translator", "Loan Impact Simulator", "College Cost Reality Check", "Know Before You Borrow", "Free. No Sign-Up."];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: T.ink, padding: "0.85rem 0", overflow: "hidden", whiteSpace: "nowrap" }} aria-hidden="true">
      <div style={{ display: "inline-flex", animation: "marquee 24s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: "0.74rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.cream, padding: "0 3rem" }}>
            {item} <span style={{ color: T.red }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PROBLEM ──────────────────────────────────────────────────────────────────
function Problem() {
  const [ref, visible] = useReveal();
  const points = [
    { num: "01", title: "The true cost is hidden", body: "Interest compounds quietly. The price you see is never the price you pay." },
    { num: "02", title: "Aid letters are designed to confuse", body: "Loans are bundled with grants to make offers look more generous than they are." },
    { num: "03", title: "Nobody shows you the income math", body: "Will your payment be 8% of your income — or 40%? Nobody tells you." },
    { num: "04", title: "Repayment follows you for decades", body: "Standard plans run 10 to 20 years. That affects every financial decision you make." },
  ];

  return (
    <section ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.creamDark, padding: "7rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1.25rem" }}>Why it matters</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "3.5rem", maxWidth: "640px" }}>
          Most students sign without seeing the full picture.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {points.map((p, i) => (
            <div key={i} style={{
              background: T.white, padding: "2rem",
              border: `1px solid rgba(26,18,8,0.07)`, borderTop: `3px solid ${T.red}`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,18,8,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="mono" style={{ fontSize: "0.7rem", color: T.red, letterSpacing: "0.12em", marginBottom: "1rem" }}>{p.num}</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: T.ink, marginBottom: "0.5rem", lineHeight: 1.3 }}>{p.title}</div>
              <p style={{ fontSize: "0.88rem", color: T.inkSoft, lineHeight: 1.65 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){ section[class*="section-reveal"] { padding: 4rem 1.5rem !important; } }`}</style>
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

  const statusColor = pctIncome <= 10 ? "#2A7A4E" : pctIncome <= 20 ? "#B8860B" : T.red;
  const statusLabel = pctIncome <= 10 ? "Manageable" : pctIncome <= 20 ? "Strained" : "High Risk";

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
    <section id="simulator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.creamDark, padding: "7rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1.25rem" }}>What will it cost?</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "0.75rem" }}>
          Your numbers. Your reality.
        </h2>
        <p style={{ fontSize: "1rem", color: T.inkSoft, maxWidth: "460px", lineHeight: 1.7, marginBottom: "3rem" }}>
          Adjust the sliders and see what your loan will actually look like — month by month, year by year.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "4rem", alignItems: "start" }}>
          <div style={{ background: T.white, padding: "2.5rem", border: `1px solid rgba(26,18,8,0.08)` }}>
            <SliderInput label="Loan Amount" value={loan} min={5000} max={200000} step={1000} onChange={setLoan} display={fmt(loan)} />
            <SliderInput label="Interest Rate" value={rate} min={3} max={12} step={0.1} onChange={setRate} display={`${rate.toFixed(1)}%`} />
            <SliderInput label="Repayment Term" value={years} min={5} max={30} step={1} onChange={setYears} display={`${years} years`} />
            <SliderInput label="Starting Salary" value={salary} min={25000} max={150000} step={1000} onChange={setSalary} display={fmt(salary)} />
            <p style={{ fontSize: "0.78rem", color: T.inkSoft, lineHeight: 1.65, borderTop: `1px solid rgba(26,18,8,0.08)`, paddingTop: "1rem" }}>
              Experts recommend keeping loan payments under 10% of gross monthly income.
            </p>
          </div>

          <div style={{ position: "sticky", top: "6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: T.ink, padding: "2.5rem", color: T.cream }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,247,242,0.4)", marginBottom: "0.5rem" }}>Total repaid</div>
              <div className="serif" style={{ fontSize: "3rem", fontWeight: 900, color: "#F5926A", lineHeight: 1 }}>{fmt(Math.round(totalRepay))}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(250,247,242,0.45)", marginTop: "0.5rem" }}>{fmt(Math.round(totalInterest))} above what you borrowed</div>
            </div>

            {[
              { label: "Monthly payment", val: fmt(Math.round(monthly)), danger: true },
              { label: "Total interest", val: fmt(Math.round(totalInterest)), danger: true },
              { label: "Repayment period", val: `${years} years`, danger: false },
            ].map((r, i) => (
              <div key={i} style={{ background: T.white, padding: "1.25rem 1.5rem", border: `1px solid rgba(26,18,8,0.08)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.88rem", color: T.inkSoft }}>{r.label}</span>
                <span className="mono" style={{ fontSize: "1rem", fontWeight: 500, color: r.danger ? T.red : T.ink }}>{r.val}</span>
              </div>
            ))}

            <div style={{ background: T.white, padding: "1.5rem", border: `1px solid rgba(26,18,8,0.08)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.82rem", color: T.inkSoft }}>% of take-home pay</span>
                <span className="mono" style={{ fontSize: "1rem", fontWeight: 600, color: statusColor }}>{fmtPct(Math.min(pctIncome, 99.9))}</span>
              </div>
              <div style={{ height: "5px", background: "rgba(26,18,8,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(pctIncome, 100)}%`, background: statusColor, transition: "width 0.4s ease, background 0.4s ease", borderRadius: "3px" }} />
              </div>
              <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", color: T.inkSoft }}>Budget impact</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", background: `${statusColor}15`, color: statusColor }}>{statusLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ #simulator > div > div:last-of-type { grid-template-columns: 1fr !important; gap: 2rem !important; } #simulator div[style*="sticky"] { position: relative !important; top: auto !important; } }`}</style>
    </section>
  );
}

// ─── COLLEGE REALITY CHECK ────────────────────────────────────────────────────
function RealityCheck() {
  const [ref, visible] = useReveal();

  const label = {
    totalBorrowed: 58000,
    monthlyPayment: 644,
    avgSalary: 45000,
    payoffYears: 10,
    dti: 17.1,
  };

  const rows = [
    { label: "Total borrowed", val: fmt(label.totalBorrowed), warn: false },
    { label: "Monthly payment", val: fmt(label.monthlyPayment) + "/mo", warn: true },
    { label: "Avg. starting salary", val: fmt(label.avgSalary) + "/yr", warn: false },
    { label: "Debt-to-income ratio", val: fmtPct(label.dti), warn: true, note: "Exceeds recommended 15%" },
    { label: "Payoff timeline", val: `${label.payoffYears} years`, warn: false },
    { label: "Total repaid", val: fmt(label.monthlyPayment * 120), warn: true },
  ];

  return (
    <section id="reality" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.white, padding: "7rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1.25rem" }}>The full picture</span>
          <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "1.25rem" }}>
            Every degree has a <em style={{ fontStyle: "italic", color: T.red }}>real cost.</em>
          </h2>
          <p style={{ fontSize: "1rem", color: T.inkSoft, lineHeight: 1.75, marginBottom: "1.5rem" }}>
            This is what a typical 4-year degree actually looks like on paper. The full tool lets you enter your own school, major, and income.
          </p>
        </div>

        <div style={{ border: `3px solid ${T.ink}` }}>
          <div style={{ background: T.ink, color: T.cream, padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,247,242,0.45)", marginBottom: "0.25rem" }}>College Debt Facts</div>
            <div className="serif" style={{ fontSize: "1.8rem", fontWeight: 900, lineHeight: 1 }}>State University</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.5)", marginTop: "0.25rem" }}>4-Year Degree · Sample Profile</div>
          </div>
          <div style={{ height: "8px", background: T.ink }} />
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.9rem 1.5rem",
              borderBottom: i < rows.length - 1 ? `1px solid rgba(26,18,8,0.09)` : "none",
              background: r.warn ? "rgba(200,52,26,0.03)" : T.white,
            }}>
              <div>
                <div style={{ fontSize: "0.88rem", color: T.inkMid }}>{r.label}</div>
                {r.note && <div style={{ fontSize: "0.68rem", color: T.red, marginTop: "0.1rem" }}>{r.note}</div>}
              </div>
              <div className="mono" style={{ fontSize: "1rem", fontWeight: 600, color: r.warn ? T.red : T.ink }}>{r.val}</div>
            </div>
          ))}
          <div style={{ background: T.red, color: T.white, padding: "1rem 1.5rem" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.75, marginBottom: "0.25rem" }}>Bottom line</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.5 }}>
              {fmtPct(label.dti)} of monthly take-home goes to loan payments — for a decade.
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
    free:    { bg: "rgba(42,122,78,0.08)",  text: "#2A7A4E", tag: "Free Money" },
    work:    { bg: "rgba(184,134,11,0.08)", text: "#8A5A0A", tag: "Work Required" },
    debt:    { bg: "rgba(200,52,26,0.08)",  text: T.red,      tag: "It's Debt" },
    warning: { bg: "rgba(200,52,26,0.05)",  text: T.inkMid,   tag: "Note" },
  };

  const handleTranslate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setTranslated(true); }, 1000);
  };

  return (
    <section id="translator" ref={ref} className={`section-reveal${visible ? " visible" : ""}`}
      style={{ background: T.creamDark, padding: "7rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: T.red, display: "block", marginBottom: "1.25rem" }}>Decode your aid letter</span>
        <h2 className="serif" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.ink, marginBottom: "0.75rem" }}>
          Free money, or <em style={{ fontStyle: "italic", color: T.red }}>more debt?</em>
        </h2>
        <p style={{ fontSize: "1rem", color: T.inkSoft, maxWidth: "460px", lineHeight: 1.7, marginBottom: "3rem" }}>
          Paste your award letter. We'll show you exactly what each line means.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          {/* Input */}
          <div>
            <div style={{ background: T.white, border: `1px solid rgba(26,18,8,0.1)`, overflow: "hidden" }}>
              <div style={{ padding: "0.7rem 1.25rem", borderBottom: `1px solid rgba(26,18,8,0.08)`, background: T.cream, fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft }}>
                Your award letter
              </div>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setTranslated(false); }}
                style={{ width: "100%", minHeight: "200px", padding: "1.25rem", border: "none", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: T.inkMid, lineHeight: 1.7, resize: "vertical", background: T.white }}
                placeholder="Paste your financial aid letter here..."
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
                <><span style={{ display: "inline-block", width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Translating...</>
              ) : "Translate into Plain English →"}
            </button>
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem", flexWrap: "wrap" }}>
              {[["free","Free Money"],["work","Work Required"],["debt","It's Debt"]].map(([type, lbl]) => (
                <span key={type} style={{ fontSize: "0.68rem", fontWeight: 500, padding: "0.2rem 0.55rem", background: typeColors[type].bg, color: typeColors[type].text, letterSpacing: "0.04em" }}>{lbl}</span>
              ))}
            </div>
          </div>

          {/* Output */}
          <div style={{ background: T.ink, padding: "1.75rem", minHeight: "280px", display: "flex", flexDirection: "column" }}>
            {!translated ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.3, textAlign: "center", gap: "0.5rem" }}>
                <div style={{ width: "32px", height: "32px", border: "1px solid rgba(250,247,242,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", color: T.cream }}>→</div>
                <p style={{ fontSize: "0.85rem", color: T.cream }}>Your plain-English breakdown appears here.</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(250,247,242,0.35)", marginBottom: "1.25rem" }}>Plain English Breakdown</div>
                {SAMPLE_TRANSLATION.map((item, i) => (
                  <div key={i} style={{ borderBottom: i < SAMPLE_TRANSLATION.length - 1 ? `1px solid rgba(250,247,242,0.07)` : "none", padding: "0.85rem 0" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.62rem", fontWeight: 600, padding: "0.18rem 0.45rem", background: typeColors[item.type].bg, color: typeColors[item.type].text, whiteSpace: "nowrap", letterSpacing: "0.06em", marginTop: "2px", flexShrink: 0 }}>
                        {typeColors[item.type].tag}
                      </span>
                      <span className="mono" style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(250,247,242,0.7)" }}>{item.term}</span>
                    </div>
                    <p style={{ fontSize: "0.84rem", color: "rgba(250,247,242,0.55)", lineHeight: 1.55 }}>{item.plain}</p>
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
    width: "100%", background: "rgba(250,247,242,0.07)", border: `1px solid rgba(250,247,242,0.15)`,
    padding: "0.9rem 1.25rem", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem",
    color: T.cream, outline: "none", marginBottom: "1rem",
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
    <section id="waitlist" ref={ref} className={`section-reveal${visible ? " visible" : ""}`} style={{
      background: T.ink, color: T.cream, padding: "7rem 2.5rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* BG watermark */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        fontFamily: "'Playfair Display',serif", fontSize: "18vw", fontWeight: 900,
        color: "transparent", WebkitTextStroke: "1px rgba(250,247,242,0.04)",
        pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none",
      }}>PAID OFF</div>

      <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

        {/* ── Left: messaging ── */}
        <div>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(250,247,242,0.35)", display: "block", marginBottom: "1.25rem" }}>Early Access</span>

          <h2 className="serif" style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.cream, marginBottom: "2.5rem" }}>
            Join the first group testing Paid Off's student debt tools.
          </h2>

          {/* Early access includes */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,247,242,0.4)", marginBottom: "1rem" }}>
              Early access includes
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {earlyAccess.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "5px", height: "5px", background: T.red, borderRadius: "50%", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.95rem", color: "rgba(250,247,242,0.75)", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(250,247,242,0.08)", marginBottom: "2.5rem" }} />

          {/* Early users receive */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,247,242,0.4)", marginBottom: "1rem" }}>
              Early users will receive
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {earlyPerks.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "14px", height: "14px", border: `1px solid rgba(245,146,106,0.5)`, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "5px", height: "5px", background: "#F5926A", borderRadius: "50%" }} />
                  </div>
                  <span style={{ fontSize: "0.95rem", color: "rgba(250,247,242,0.75)", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div>
          {submitted ? (
            <div style={{ background: "rgba(42,122,78,0.12)", border: "1px solid rgba(42,122,78,0.25)", padding: "2.5rem" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#7ED9A8", marginBottom: "0.5rem" }}>You're on the list.</div>
              <p style={{ fontSize: "0.88rem", color: "rgba(250,247,242,0.45)", lineHeight: 1.6 }}>
                We'll email <strong style={{ color: T.cream }}>{email}</strong> when Paid Off launches.
              </p>
            </div>
          ) : (
            <div style={{ background: "rgba(250,247,242,0.04)", border: "1px solid rgba(250,247,242,0.08)", padding: "2.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(250,247,242,0.4)", letterSpacing: "0.08em", marginBottom: "1.75rem" }}>
                Spots are limited. Join now to secure early access.
              </div>
              <input style={inputStyle} type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                onFocus={e => e.target.style.borderColor = "rgba(250,247,242,0.35)"}
                onBlur={e => e.target.style.borderColor = "rgba(250,247,242,0.15)"}
              />
              <input style={inputStyle} type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = "rgba(250,247,242,0.35)"}
                onBlur={e => e.target.style.borderColor = "rgba(250,247,242,0.15)"}
              />
              {error && <p style={{ fontSize: "0.8rem", color: "#F5926A", marginBottom: "1rem", marginTop: "-0.5rem" }}>{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: "100%", background: loading ? T.inkSoft : T.red, color: T.white, padding: "1rem 2rem", fontSize: "0.9rem", fontWeight: 500, border: "none", cursor: loading ? "wait" : "pointer", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.redLight; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.red; }}
              >
                {loading ? (
                  <><span style={{ display: "inline-block", width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: T.white, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Joining...</>
                ) : "Request Early Access →"}
              </button>
              <p style={{ fontSize: "0.7rem", color: "rgba(250,247,242,0.25)", marginTop: "0.85rem", textAlign: "center" }}>No spam. Unsubscribe anytime.</p>
            </div>
          )}

          {/* Trust stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {[["$1.7T","US student debt"],["45M","Borrowers"],["Free","Always"]].map(([num, lbl]) => (
              <div key={lbl}>
                <span className="serif" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#F5926A", display: "block", lineHeight: 1 }}>{num}</span>
                <span style={{ fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(250,247,242,0.3)" }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`@media(max-width:900px){ #waitlist > div:last-of-type { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.creamDark, borderTop: `1px solid rgba(26,18,8,0.08)`, padding: "3rem 2.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <div className="serif" style={{ fontSize: "1.25rem", fontWeight: 700, color: T.ink, marginBottom: "0.4rem" }}>
            Paid <span style={{ color: T.red }}>Off</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: T.inkSoft, maxWidth: "240px", lineHeight: 1.6 }}>
            Helping students borrow smarter and graduate with less regret.
          </p>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { heading: "Tools", links: ["Aid Translator", "Loan Simulator", "Reality Check"] },
            { heading: "Company", links: ["About", "Contact", "Privacy"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.inkSoft, marginBottom: "0.75rem" }}>{col.heading}</div>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom: "0.4rem" }}>
                  <a href="#" style={{ fontSize: "0.85rem", color: T.inkMid, transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = T.red}
                    onMouseLeave={e => e.target.style.color = T.inkMid}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: `1px solid rgba(26,18,8,0.07)`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: T.inkSoft }}>© 2025 Paid Off. Not financial advice. For educational purposes only.</p>
        <p style={{ fontSize: "0.72rem", color: T.inkSoft }}>paid-off.com</p>
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
      <Simulator />
      <RealityCheck />
      <Translator />
      <Waitlist />
      <Footer />
    </div>
  );
}
