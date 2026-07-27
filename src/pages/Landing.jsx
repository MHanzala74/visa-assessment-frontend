import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { auth } = useAuth();

  return (
    <div className="page">
      <p className="eyebrow">Skilled migration · Points test</p>
      <h1 className="title">
        Find out which
        <br />
        visa subclass you qualify for.
      </h1>
      <p className="lede">
        Enter your details once. We calculate your points against the Australian
        skilled-migration test, tell you which subclass you land in — 189, 190,
        491 or 482 — and generate a plain-language explanation of the result.
      </p>

      <div className="doc-card" style={{ maxWidth: 560 }}>
        <p className="card-heading">Three steps</p>
        <p className="card-sub">Each one feeds the next — do them in order.</p>
        <div className="result-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="result-item">
            <span className="k">01 · Account</span>
            <span className="v">Create an account, or sign in if you already have one.</span>
          </div>
          <div className="result-item">
            <span className="k">02 · Profile</span>
            <span className="v">Submit your age, education, experience and English test score.</span>
          </div>
          <div className="result-item">
            <span className="k">03 · Assessment</span>
            <span className="v">Look up your phone number to get your score, subclass and explanation.</span>
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <Link to={auth ? "/profile" : "/auth"} className="btn btn-primary">
            {auth ? "Go to profile →" : "Get started →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
