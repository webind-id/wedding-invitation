"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form action={action} className="card w-full max-w-sm p-8 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.5)]">
        <p className="eyebrow">KudoStack</p>
        <h1 className="mt-2 font-display text-3xl italic">Admin undangan</h1>
        <p className="mt-1 text-sm text-muted">Kelola template, undangan, dan tamu.</p>

        <label className="mt-7 block">
          <span className="label">Username</span>
          <input name="username" className="input" autoComplete="username" required />
        </label>
        <label className="mt-4 block">
          <span className="label">Password</span>
          <input name="password" type="password" className="input" autoComplete="current-password" required />
        </label>

        {state && !state.ok && (
          <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-3.5 py-2.5 text-xs font-medium text-danger">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={isPending} className="btn-primary mt-6 w-full">
          {isPending ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
