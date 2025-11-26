"use client";

import { useState } from "react";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, next: nextPath })
    });
    setBusy(false);
    if (!r.ok) {
      setErr("Invalid login or password");
      return;
    }
    const data = await r.json();
    window.location.replace(data.next || "/admin");
  }

  return (
      <form onSubmit={submit} className="grid gap-3">
        <div className="grid gap-2">
          <label className="text-sm text-dim" htmlFor="username">Login</label>
          <input
              id="username"
              type="text"
              placeholder="Enter login"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-dim" htmlFor="password">Password</label>
          <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
          />
        </div>

        {err ? <div className="text-red-400 text-sm">{err}</div> : null}

        <button disabled={busy} className="btn btn-primary">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
  );
}
