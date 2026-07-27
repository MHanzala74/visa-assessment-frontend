import { useState, useEffect } from "react";
import api from "../lib/api";

const SUBCLASS_LABEL = {
  189: "Skilled Independent",
  190: "Skilled Nominated",
  491: "Skilled Work Regional",
  482: "Skills in Demand",
};

export default function Assessment() {
  const [phone, setPhone] = useState(() => localStorage.getItem("pc_phone") || "");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [graphUrl, setGraphUrl] = useState(null);
  const [graphBusy, setGraphBusy] = useState(false);

  useEffect(() => {
    return () => {
      if (graphUrl) URL.revokeObjectURL(graphUrl);
    };
  }, [graphUrl]);

  const runAssessment = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setGraphUrl(null);
    setBusy(true);
    try {
      const res = await api.get(`/visa/${encodeURIComponent(phone)}`);
      setResult(res.data);
      localStorage.setItem("pc_phone", phone);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Could not find a profile for that phone number. Submit a profile first."
      );
    } finally {
      setBusy(false);
    }
  };

  const loadGraph = async () => {
    setGraphBusy(true);
    try {
      const res = await api.get(`/visa/${encodeURIComponent(phone)}/graph`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      setGraphUrl(url);
    } catch {
      setError("Could not generate the score graph.");
    } finally {
      setGraphBusy(false);
    }
  };

  const eligible = result && result.score >= 55;

  return (
    <div className="page">
      <p className="eyebrow">Step 03</p>
      <h1 className="title">Run the assessment</h1>
      <p className="lede">
        Look up a saved profile by phone number to get its points score, the
        matching visa subclass, and an AI-generated explanation.
      </p>

      <div className="doc-card" style={{ maxWidth: 480 }}>
        <p className="card-heading">Look up profile</p>
        <p className="card-sub">Enter the phone number used when the profile was saved.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={runAssessment}>
          <div className="field full">
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03001234567" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? <span className="loader"><span /><span /><span /></span> : "Run assessment →"}
          </button>
        </form>
      </div>

      {result && (
        <div className="doc-card">
          <div className="stamp-wrap">
            <div className={"stamp" + (eligible ? "" : " rejected-tone")}>
              <div className="stamp-inner">
                <span className="stamp-label">Subclass</span>
                <span className="stamp-subclass">{result.visa}</span>
                <span className="stamp-word">{eligible ? "Eligible" : "Below threshold"}</span>
              </div>
            </div>
          </div>

          <div className="score-row">
            <span className="score-number">{result.score}</span>
            <span className="score-max">/ 100 points</span>
          </div>

          <p style={{ textAlign: "center", color: "var(--slate)", fontSize: 14, marginTop: 4 }}>
            {SUBCLASS_LABEL[result.visa] || "Visa subclass"}
          </p>

          <div className="result-grid">
            <div className="result-item">
              <span className="k">Candidate</span>
              <span className="v">{result.candidate?.first_name} {result.candidate?.last_name}</span>
            </div>
            <div className="result-item">
              <span className="k">Phone</span>
              <span className="v">{result.candidate?.phone}</span>
            </div>
          </div>

          {result.explanation && (
            <div className="explanation">{result.explanation}</div>
          )}

          <div style={{ marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={loadGraph} disabled={graphBusy}>
              {graphBusy ? <span className="loader"><span /><span /><span /></span> : "Show score breakdown graph"}
            </button>
          </div>

          {graphUrl && (
            <div className="graph-frame">
              <img src={graphUrl} alt="Score breakdown graph" />
            </div>
          )}
        </div>
      )}

      {!result && !busy && (
        <div className="empty" style={{ marginTop: 12 }}>
          <strong>No assessment yet</strong>
          Run a lookup above to see the score, subclass and explanation.
        </div>
      )}
    </div>
  );
}
