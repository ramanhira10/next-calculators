"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

const currencies = [
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
];

type SipInputs = {
  monthlyAmount: string;
  rate: string;
  years: string;
  currency: string;
};

type SipCalculation = {
  invested: number;
  growth: number;
  total: number;
};

export default function SipCalculatorPage() {
  const [inputs, setInputs] = useState<SipInputs>({
    monthlyAmount: "",
    rate: "",
    years: "",
    currency: "INR",
  });
  const [calculation, setCalculation] = useState<SipCalculation | null>(null);
  const [error, setError] = useState("");

  function updateInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setInputs((current) => ({ ...current, [name]: value }));
    setCalculation(null);
    setError("");
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const monthlyAmount = Number(inputs.monthlyAmount);
    const annualRate = Number(inputs.rate);
    const years = Number(inputs.years);
    const months = years * 12;
    const monthlyRate = annualRate / 1200;

    if (monthlyAmount <= 0 || years <= 0 || annualRate <= -100) {
      setError("Enter a monthly amount and term above zero, and a return greater than -100%.");
      setCalculation(null);
      return;
    }

    const total =
      monthlyRate === 0
        ? monthlyAmount * months
        : monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    if (!Number.isFinite(total)) {
      setError("Those values are too large to calculate. Try a smaller amount, rate, or term.");
      setCalculation(null);
      return;
    }

    const invested = monthlyAmount * months;
    setCalculation({ total, invested, growth: total - invested });
    setError("");
  }

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat(inputs.currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: inputs.currency,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Folio home">
          folio<span>.</span>
        </Link>
        <span className="topbar-note">A clearer view of your money</span>
        <span className="topbar-index">FINANCIAL TOOLS&nbsp; / &nbsp;02</span>
      </header>

      <main className="calculator-page">
        <div className="page-heading">
          <p className="eyebrow"><span /> MONTHLY INVESTING</p>
          <h1>SIP calculator</h1>
          <p className="intro">
            Estimate how regular monthly investments could grow through compounding.
          </p>
        </div>

        <div className="calculator-layout">
          <form className="input-panel" onSubmit={calculate}>
            <div className="panel-heading">
              <span className="step-number">01</span>
              <div>
                <h2>Your monthly investment</h2>
                <p>Set the amount and expected return.</p>
              </div>
            </div>

            <div className="field-grid">
              <label className="field field-wide" htmlFor="monthlyAmount">
                <span className="field-label">Monthly SIP amount</span>
                <span className="input-wrap">
                  <span className="input-prefix" aria-hidden="true">
                    {inputs.currency === "INR" ? "₹" : inputs.currency}
                  </span>
                  <input
                    id="monthlyAmount"
                    name="monthlyAmount"
                    type="number"
                    min="0.01"
                    step="any"
                    inputMode="decimal"
                    placeholder="5,000"
                    value={inputs.monthlyAmount}
                    onChange={updateInput}
                    required
                  />
                </span>
              </label>

              <label className="field" htmlFor="rate">
                <span className="field-label">Expected annual return</span>
                <span className="input-wrap">
                  <input
                    id="rate"
                    name="rate"
                    type="number"
                    min="-99.99"
                    max="1000"
                    step="any"
                    inputMode="decimal"
                    placeholder="12"
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
                    min="1"
                    max="100"
                    step="1"
                    inputMode="numeric"
                    placeholder="10"
                    value={inputs.years}
                    onChange={updateInput}
                    required
                  />
                  <span className="input-suffix">years</span>
                </span>
              </label>

              <label className="field field-wide" htmlFor="currency">
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
              Calculate SIP growth <span aria-hidden="true">↗</span>
            </button>
            <p className="form-footnote">
              Estimate assumes monthly deposits at the end of each month. Not financial advice.
            </p>
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
                  Estimated value after {inputs.years} years
                </p>
                <p className="total-value">{formatMoney(calculation.total)}</p>
                <div className="result-divider" />
                <div className="result-detail">
                  <span>Total invested</span>
                  <strong>{formatMoney(calculation.invested)}</strong>
                </div>
                <div className="result-detail">
                  <span>Estimated returns</span>
                  <strong>{formatMoney(calculation.growth)}</strong>
                </div>
                <div className="result-context">
                  Monthly SIP&nbsp; / &nbsp;{inputs.rate}% expected annual return
                </div>
              </>
            ) : (
              <div className="empty-result">
                <span className="result-orbit" aria-hidden="true">↗</span>
                <p className="result-caption">Your SIP projection</p>
                <p className="empty-value">Ready when you are.</p>
                <p className="empty-hint">
                  Enter your monthly amount, expected return, and term to see your
                  invested total and estimated growth.
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="page-footer">
          <Link href="/">← All calculators</Link>
          <span>More time. More growth.</span>
        </footer>
      </main>
    </div>
  );
}