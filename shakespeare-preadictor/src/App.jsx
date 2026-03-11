import React from 'react'
import { useState, useEffect } from 'react';
import PredCard from './component/PredCard';

const App = () => {


  const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0a0a0f; --deep: #10101a;
    --card: rgba(16, 14, 28, 0.88);
    --border: rgba(180, 140, 60, 0.18);
    --gold: #c9a84c; --gold-bright: #f0c060;
    --crimson: #8b1a2e; --crimson-glow: #c0284a;
    --text: #e8dfc8; --muted: #7a6e5a;
    --green: #4caf7d;
  }
  body { background: var(--ink); font-family: 'Crimson Pro', serif; color: var(--text); min-height: 100vh; overflow-x: hidden; }
  .bg { position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse 80% 60% at 20% 10%,rgba(139,26,46,0.12) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 80% 90%,rgba(0,100,120,0.10) 0%,transparent 60%),radial-gradient(ellipse 100% 100% at 50% 50%,rgba(30,20,10,0.95) 0%,var(--ink) 100%); }
  .noise { position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .lines { position:fixed;inset:0;z-index:1;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(180,140,60,0.03) 40px); }
  .app { position:relative;z-index:2;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px; }
  .header { text-align:center;margin-bottom:40px;animation:fadeDown 0.8s ease both; }
  .crown-row { display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px; }
  .crown-line { height:1px;width:60px;background:linear-gradient(90deg,transparent,var(--gold)); }
  .crown-line.right { background:linear-gradient(90deg,var(--gold),transparent); }
  .crown-icon { font-size:22px;filter:drop-shadow(0 0 8px rgba(201,168,76,0.6)); }
  .title { font-family:'Cinzel',serif;font-size:clamp(22px,4vw,38px);font-weight:900;letter-spacing:0.04em;background:linear-gradient(135deg,var(--gold-bright) 0%,var(--gold) 40%,#e8c87a 70%,var(--gold) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 2px 12px rgba(201,168,76,0.25));line-height:1.15; }
  .subtitle { font-family:'Crimson Pro',serif;font-style:italic;font-size:clamp(13px,2vw,16px);color:var(--muted);letter-spacing:0.06em;margin-top:8px; }
  .card { width:100%;max-width:680px;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:36px 40px 32px;backdrop-filter:blur(24px) saturate(1.2);box-shadow:0 0 0 1px rgba(201,168,76,0.06),0 8px 32px rgba(0,0,0,0.6),0 2px 8px rgba(0,0,0,0.4),inset 0 1px 0 rgba(201,168,76,0.08);animation:fadeUp 0.9s ease both 0.15s; }
  .status-dot { display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.08em;margin-bottom:20px;padding:6px 12px;border-radius:99px;border:1px solid rgba(255,255,255,0.07);background:rgba(0,0,0,0.3); }
  .dot { width:7px;height:7px;border-radius:50%; }
  .dot.ready { background:var(--green);box-shadow:0 0 6px var(--green); }
  .dot.loading { background:var(--gold);box-shadow:0 0 6px var(--gold);animation:pulse 1s ease infinite; }
  .dot.error { background:var(--crimson-glow);box-shadow:0 0 6px var(--crimson-glow); }
  .input-label { font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;display:block;opacity:0.8; }
  .input-wrap { position:relative; }
  textarea { width:100%;background:rgba(0,0,0,0.4);border:1px solid rgba(180,140,60,0.2);border-radius:12px;color:var(--text);font-family:'Crimson Pro',serif;font-size:18px;line-height:1.6;padding:16px 18px 40px;resize:none;height:100px;outline:none;transition:border-color 0.3s,box-shadow 0.3s;letter-spacing:0.01em; }
  textarea::placeholder { color:rgba(180,160,100,0.3);font-style:italic; }
  textarea:focus { border-color:rgba(201,168,76,0.45);box-shadow:0 0 0 3px rgba(201,168,76,0.08),0 0 20px rgba(201,168,76,0.06); }
  .char-count { position:absolute;bottom:10px;right:14px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.05em; }
  .char-count.warn { color:var(--crimson-glow); }
  .btn { margin-top:14px;width:100%;background:linear-gradient(135deg,#1a0e06 0%,#2a1608 50%,#1a0e06 100%);border:1px solid rgba(201,168,76,0.35);border-radius:12px;color:var(--gold-bright);font-family:'Cinzel',serif;font-size:14px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;padding:15px 24px;cursor:pointer;transition:all 0.3s ease;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:10px; }
  .btn::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,0.08) 0%,rgba(201,168,76,0.15) 50%,rgba(201,168,76,0.08) 100%);opacity:0;transition:opacity 0.3s; }
  .btn:hover:not(:disabled)::before { opacity:1; }
  .btn:hover:not(:disabled) { border-color:rgba(201,168,76,0.6);box-shadow:0 0 20px rgba(201,168,76,0.15),0 4px 16px rgba(0,0,0,0.4);transform:translateY(-1px); }
  .btn:active:not(:disabled) { transform:translateY(0); }
  .btn:disabled { opacity:0.5;cursor:not-allowed; }
  .divider { display:flex;align-items:center;gap:16px;margin:28px 0; }
  .divider-line { flex:1;height:1px;background:var(--border); }
  .divider-icon { font-family:'Cinzel',serif;font-size:10px;text-transform:uppercase;color:var(--muted);letter-spacing:0.1em; }
  .error { background:rgba(139,26,46,0.15);border:1px solid rgba(192,40,74,0.3);border-radius:10px;padding:12px 16px;color:#f08090;font-size:15px;margin-top:14px;display:flex;align-items:center;gap:10px;animation:shake 0.4s ease; }
  .spinner-wrap { display:flex;flex-direction:column;align-items:center;gap:16px;padding:24px 0; }
  .spinner { width:40px;height:40px;border:2px solid rgba(201,168,76,0.1);border-top-color:var(--gold);border-right-color:rgba(201,168,76,0.4);border-radius:50%;animation:spin 0.8s linear infinite; }
  .spinner-text { font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.2em;color:var(--muted);text-transform:uppercase; }
  .predictions-header { font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between; }
  .pred-list { display:flex;flex-direction:column;gap:10px; }
  .pred-card { background:rgba(0,0,0,0.3);border:1px solid rgba(180,140,60,0.1);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px;opacity:0;transform:translateY(10px);animation:fadeUp 0.4s ease forwards;transition:border-color 0.3s,background 0.3s; }
  .pred-card:hover { border-color:rgba(201,168,76,0.25);background:rgba(201,168,76,0.04); }
  .pred-rank { font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);min-width:16px;text-align:center; }
  .pred-word { font-family:'Cinzel',serif;font-size:18px;font-weight:600;color:var(--gold-bright);min-width:110px;letter-spacing:0.02em; }
  .pred-bar-wrap { flex:1;display:flex;flex-direction:column;gap:5px; }
  .pred-bar-track { height:5px;background:rgba(255,255,255,0.05);border-radius:99px;overflow:hidden; }
  .pred-bar-fill { height:100%;border-radius:99px;background:linear-gradient(90deg,#8b4513,#c9a84c,#f0c060);transform-origin:left;animation:barGrow 0.6s cubic-bezier(0.22,1,0.36,1) forwards;transform:scaleX(0); }
  .pred-prob { font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;color:var(--gold);min-width:52px;text-align:right;letter-spacing:0.02em; }
  .timestamp { font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:0.05em;margin-top:10px;text-align:right; }
  .footer { margin-top:28px;padding-top:20px;border-top:1px solid var(--border);text-align:center; }
  .footer-model { font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.04em;color:var(--muted);line-height:1.6; }
  .footer-model span { color:rgba(201,168,76,0.5); }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes barGrow { to{transform:scaleX(1)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @media(max-width:520px){.card{padding:24px 20px 22px}.pred-word{min-width:80px;font-size:15px}}
`;




  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [serverStatus, setServerStatus] = useState("checking"); // checking | ready | error
  const MAX_CHARS = 200;
  const BACKEND_URL = "http://localhost:5000";

  // Poll server readiness
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/status`);
        const data = await res.json();
        setServerStatus(data.ready ? "ready" : "training");
        if (!data.ready) setTimeout(check, 3000);
      } catch {
        setServerStatus("error");
        setTimeout(check, 5000);
      }
    };
    check();
  }, []);

  const predict = async () => {
    const text = input.trim();
    if (!text) { setError("Prithee, enter a phrase to continue."); return; }
    if (serverStatus !== "ready") { setError("Server is still training. Please wait..."); return; }
    setError(""); setLoading(true); setPredictions(null);

    try {
      const res = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setPredictions(data.predictions);
      setTimestamp(data.timestamp);
    } catch {
      setError("Could not reach the server. Is server.py running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); predict(); } };

  const statusLabel = { checking: "Connecting…", training: "Model training…", ready: "Model ready", error: "Server offline" };
  const dotClass = { checking: "loading", training: "loading", ready: "ready", error: "error" }[serverStatus];

  return (
    <>
      <style>{STYLES}</style>
      <div className="bg" /><div className="noise" /><div className="lines" />
      <div className="app">
        <header className="header">
          <div className="crown-row">
            <div className="crown-line" />
            <span className="crown-icon">♛</span>
            <div className="crown-line right" />
          </div>
          <h1 className="title">Shakespeare AI<br />Next Word Predictor</h1>
          <p className="subtitle">LSTM-powered language model trained on Shakespeare text</p>
        </header>

        <div className="card">
          {/* Server status */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div className="status-dot">
              <div className={`dot ${dotClass}`} />
              <span style={{ color: "var(--muted)" }}>{statusLabel[serverStatus]}</span>
            </div>
          </div>

          <label className="input-label">◈ Enter thy phrase</label>
          <div className="input-wrap">
            <textarea
              value={input}
              onChange={e => { if (e.target.value.length <= MAX_CHARS) setInput(e.target.value); }}
              onKeyDown={handleKey}
              placeholder='Type your phrase here... e.g. "To be or not"'
            />
            <span className={`char-count ${input.length > MAX_CHARS * 0.85 ? "warn" : ""}`}>
              {input.length}/{MAX_CHARS}
            </span>
          </div>

          <button className="btn" onClick={predict} disabled={loading || serverStatus !== "ready"}>
            {loading
              ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Consulting the oracle…</>
              : <>♛ Predict Next Word</>}
          </button>

          {error && <div className="error"><span>⚠</span> {error}</div>}

          {(loading || predictions) && (
            <>
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-icon">◆ Prophecy ◆</span>
                <div className="divider-line" />
              </div>
              {loading && (
                <div className="spinner-wrap">
                  <div className="spinner" />
                  <p className="spinner-text">Divining the next word…</p>
                </div>
              )}
              {predictions && (
                <>
                  <div className="predictions-header">
                    <span>Top 5 Predictions</span>
                    <span>Confidence</span>
                  </div>
                  <div className="pred-list">
                    {predictions.map((p, i) => (
                      <PredCard key={i} rank={`#${i + 1}`} word={p.word} prob={p.prob} delay={i * 80} />
                    ))}
                  </div>
                  {timestamp && <p className="timestamp">⏱ Predicted at {timestamp}</p>}
                </>
              )}
            </>
          )}

          <footer className="footer">
            <p className="footer-model">
              <span>Model:</span> Embedding(150) → <span>LSTM</span>(256) → <span>LSTM</span>(128) → <span>Dense</span>(150)
            </p>
            <p className="footer-model" style={{ marginTop: 4 }}>
              <span>Backend:</span> Flask · <span>localhost:5000</span>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App