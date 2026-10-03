import Link from "next/link";

export default function Home() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Folio home">
          folio<span>.</span>
        </Link>
        <span className="topbar-note">A clearer view of your money</span>
        <span className="topbar-index">FINANCIAL TOOLS&nbsp; / &nbsp;01</span>
      </header>

      <main className="home-page">
        <div className="page-heading">
          <p className="eyebrow"><span /> CALCULATOR INDEX</p>
          <h1>Investment calculators</h1>
          <p className="intro">Choose an investment type to see its potential growth.</p>
        </div>

        <nav className="calculator-options" aria-label="Investment calculators">
          <Link className="calculator-option" href="/compound-interest">
            <span className="option-index">01 / LUMP SUM</span>
            <span className="option-title">Compound interest</span>
            <span className="option-copy">
              Project how a starting investment could grow over time.
            </span>
            <span className="option-arrow" aria-hidden="true">↗</span>
          </Link>

          <Link className="calculator-option sip-option" href="/sip-calculator">
            <span className="option-index">02 / MONTHLY INVESTING</span>
            <span className="option-title">SIP calculator</span>
            <span className="option-copy">
              Estimate the future value of regular monthly contributions.
            </span>
            <span className="option-arrow" aria-hidden="true">↗</span>
          </Link>
        </nav>

        <footer className="page-footer">
          <span>THE POWER OF COMPOUNDING</span>
          <span>More time. More growth.</span>
        </footer>
      </main>
    </div>
  );
}