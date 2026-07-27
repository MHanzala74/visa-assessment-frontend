import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const EMPTY = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  age: "",
  nationality: "",
  preferred_state: "",
  current_occupation: "",
  aus_experience: "",
  overseas_exp: "",
  education_level: "bachelor",
  marital_status: "single",
  english_test_type: "ielts",
  english_test_score: "",
};

export default function Profile() {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        aus_experience: Number(form.aus_experience),
        overseas_exp: Number(form.overseas_exp),
        english_test_score: Number(form.english_test_score),
      };
      await api.post("/profile", payload);
      localStorage.setItem("pc_phone", form.phone);
      setNotice("Profile saved. You can now run the assessment.");
      setTimeout(() => navigate("/assessment"), 900);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((d) => d.msg).join(" · ")
          : typeof detail === "string"
          ? detail
          : "Could not save the profile. Check the fields and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <p className="eyebrow">Step 02</p>
      <h1 className="title">Your profile</h1>
      <p className="lede">
        These details feed directly into the points calculation. Your phone
        number is the key we use to look up the assessment afterwards, so
        double-check it.
      </p>

      <div className="doc-card">
        <p className="card-heading">Applicant details</p>
        <p className="card-sub">All fields are required.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {notice && <div className="alert alert-success">{notice}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-grid">
            <div className="field">
              <label>First name</label>
              <input value={form.first_name} onChange={update("first_name")} required />
            </div>
            <div className="field">
              <label>Last name</label>
              <input value={form.last_name} onChange={update("last_name")} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={update("email")} required />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={update("phone")} placeholder="03001234567" required />
            </div>
            <div className="field">
              <label>Age (18–44)</label>
              <input type="number" min="18" max="44" value={form.age} onChange={update("age")} required />
            </div>
            <div className="field">
              <label>Nationality</label>
              <input value={form.nationality} onChange={update("nationality")} required />
            </div>
            <div className="field">
              <label>Preferred state</label>
              <input value={form.preferred_state} onChange={update("preferred_state")} placeholder="NSW" required />
            </div>
            <div className="field">
              <label>Current occupation</label>
              <input value={form.current_occupation} onChange={update("current_occupation")} required />
            </div>
            <div className="field">
              <label>Australian experience (years)</label>
              <input type="number" min="0" value={form.aus_experience} onChange={update("aus_experience")} required />
            </div>
            <div className="field">
              <label>Overseas experience (years)</label>
              <input type="number" min="0" value={form.overseas_exp} onChange={update("overseas_exp")} required />
            </div>
            <div className="field">
              <label>Education level</label>
              <select value={form.education_level} onChange={update("education_level")}>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor</option>
                <option value="masters">Masters</option>
                <option value="doctorate">Doctorate</option>
              </select>
            </div>
            <div className="field">
              <label>Marital status</label>
              <select value={form.marital_status} onChange={update("marital_status")}>
                <option value="single">Single</option>
                <option value="partner_pr_or_citizen">Partner is PR / citizen</option>
                <option value="partner_skilled">Partner is skilled</option>
                <option value="partner_english_only">Partner — English only</option>
              </select>
            </div>
            <div className="field">
              <label>English test</label>
              <select value={form.english_test_type} onChange={update("english_test_type")}>
                <option value="ielts">IELTS</option>
                <option value="pte">PTE</option>
              </select>
            </div>
            <div className="field">
              <label>English test score</label>
              <input
                type="number"
                step="0.5"
                value={form.english_test_score}
                onChange={update("english_test_score")}
                placeholder={form.english_test_type === "ielts" ? "e.g. 7.5" : "e.g. 79"}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? (
              <span className="loader"><span /><span /><span /></span>
            ) : (
              "Save profile →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
