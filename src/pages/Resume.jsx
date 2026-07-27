import { useState, useRef } from "react";
import api from "../lib/api";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const pickFile = (f) => {
    setError(null);
    setResult(null);
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are accepted.");
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/analyze-resume", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not analyze this resume.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <p className="eyebrow">Optional</p>
      <h1 className="title">Resume analyzer</h1>
      <p className="lede">
        Upload a PDF resume and the AI pipeline will extract and assess its
        content — useful as a sanity check alongside your points score.
      </p>

      <div className="doc-card" style={{ maxWidth: 560 }}>
        <p className="card-heading">Upload PDF</p>
        <p className="card-sub">Drag a file in, or click to browse.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div
          className={"dropzone" + (dragging ? " drag" : "")}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
        >
          <span className="dropzone-label">PDF only</span>
          <strong>{file ? file.name : "Drop your resume here"}</strong>
          <span className="dropzone-label">or click to browse</span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleUpload} disabled={!file || busy}>
            {busy ? <span className="loader"><span /><span /><span /></span> : "Analyze resume →"}
          </button>
        </div>
      </div>

      {result && (
        <div className="doc-card">
          <p className="card-heading">Analysis result</p>
          <div className="mrz">{JSON.stringify(result, null, 2)}</div>
        </div>
      )}
    </div>
  );
}
