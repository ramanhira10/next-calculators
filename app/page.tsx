"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const frequencies = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Semi-annually" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
];

const currencies = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "INR", label: "INR — Indian Rupee" },
];

type CalculatorInputs = {
  principal: string;
  rate: string;
  years: string;
  frequency: string;
  currency: string;
};

type Calculation = {
  interest: number;
  total: number;
};

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    principal: "",
    rate: "",
    years: "",
    frequency: "12",
    currency: "INR",
  });
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [error, setError] = useState("");

  function updateInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setInputs((current) => ({ ...current, [name]: value }));
    setCalculation(null);
    setError("");
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const principal = Number(inputs.principal);
    const rate = Number(inputs.rate);
    const years = Number(inputs.years);
    const periodsPerYear = Number(inputs.frequency);

    if (principal <= 0 || years <= 0 || rate <= -100) {
      setError("Enter a principal and term above zero, and a return greater than -100%.");
      setCalculation(null);
      return;
    }

    const total =
      principal * Math.pow(1 + rate / 100 / periodsPerYear, periodsPerYear * years);

    if (!Number.isFinite(total)) {
      setError("Those values are too large to calculate. Try a smaller amount, rate, or term.");
      setCalculation(null);
      return;
    }

    setCalculation({ total, interest: total - principal });
    setError("");
  }

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat(inputs.currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: inputs.currency,
      maximumFractionDigits: 2,
    }).format(amount);

  const selectedFrequency = frequencies.find(
    (frequency) => frequency.value === inputs.frequency,
  )?.label.toLowerCase();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Folio home">
          folio<span>.</span>
        </a>
        <span className="topbar-note">A clearer view of your money</span>
        <span className="topbar-index">FINANCIAL TOOLS&nbsp; / &nbsp;01</span>
      </header>

      <main className="calculator-page" id="home">
        <div className="page-heading">
          <p className="eyebrow"><span /> GROWTH PROJECTION</p>
          <h1>Compound interest</h1>
          <p className="intro">
            See how your starting balance could grow when your returns earn returns.
          </p>
        </div>

        <div className="calculator-layout">
          <form className="input-panel" onSubmit={calculate}>
            <div className="panel-heading">
              <span className="step-number">01</span>
              <div>
                <h2>Your investment</h2>
                <p>Set the details for your projection.</p>
              </div>
            </div>

            <div className="field-grid">
              <label className="field field-wide" htmlFor="principal">
                <span className="field-label">Starting principal</span>
                <span className="input-wrap">
                  <span className="input-prefix" aria-hidden="true">
                    {inputs.currency === "INR" ? "₹" : inputs.currency}
                  </span>
                  <input
                    id="principal"
                    name="principal"
                    type="number"
                    min="0.01"
                    step="any"
                    inputMode="decimal"
                    placeholder="10,000"
                    value={inputs.principal}
                    onChange={updateInput}
                    required
                  />
                </span>
              </label>

              <label className="field" htmlFor="rate">
                <span className="field-label">Annual rate of return</span>
                <span className="input-wrap">
                  <input
                    id="rate"
                    name="rate"
                    type="number"
                    min="-99.99"
                    max="1000"
                    step="any"
                    inputMode="decimal"
                    placeholder="7"
                    value={inputs.rate}
                    onChange={updateInput}
                    required
                  />
                  <span className="input-suffix" aria-hidden="true">%</span>
                </span>
              </label>

              <label className="field" htmlFor="years">
                <span className="field-label">Investment term</span>
                <span className="input-wrap">
                  <input
                    id="years"
                    name="years"
                    type="number"
                    min="0.01"
                    max="1000"
                    step="any"
                    inputMode="decimal"
                    placeholder="10"
                    value={inputs.years}
                    onChange={updateInput}
                    required
                  />
                  <span className="input-suffix">years</span>
                </span>
              </label>

              <label className="field" htmlFor="frequency">
                <span className="field-label">Compounding frequency</span>
                <select
                  id="frequency"
                  name="frequency"
                  value={inputs.frequency}
                  onChange={updateInput}
                >
                  {frequencies.map((frequency) => (
                    <option key={frequency.value} value={frequency.value}>
                      {frequency.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" htmlFor="currency">
                <span className="field-label">Currency</span>
                <select
                  id="currency"
                  name="currency"
                  value={inputs.currency}
                  onChange={updateInput}
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="calculate-button" type="submit">
              Calculate growth <span aria-hidden="true">↗</span>
            </button>
            <p className="form-footnote">This projection is an estimate, not financial advice.</p>
          </form>

          <section className="result-panel" aria-live="polite" aria-atomic="true">
            <div className="result-topline">
              <span className="step-number result-step">02</span>
              <span className="result-tag">
                <span className="status-dot" /> YOUR PROJECTION
              </span>
            </div>

            {calculation ? (
              <>
                <p className="result-caption total-caption">
                  Total value after {inputs.years} years
                </p>
                <p className="total-value">{formatMoney(calculation.total)}</p>
                <div className="result-divider" />
                <div className="result-detail">
                  <span>Interest earned</span>
                  <strong>{formatMoney(calculation.interest)}</strong>
                </div>
                <div className="result-detail">
                  <span>Starting principal</span>
                  <strong>{formatMoney(Number(inputs.principal))}</strong>
                </div>
                <div className="result-context">
                  {inputs.rate}% annual return, compounded {selectedFrequency}
                </div>
              </>
            ) : (
              <div className="empty-result">
                <span className="result-orbit" aria-hidden="true">↗</span>
                <p className="result-caption">Your future balance</p>
                <p className="empty-value">Ready when you are.</p>
                <p className="empty-hint">
                  Enter your investment details and calculate to see your estimated
                  interest and total value.
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="page-footer">
          <span>THE POWER OF COMPOUNDING</span>
          <span>More time. More growth.</span>
        </footer>
      </main>
    </div>
  );
}
