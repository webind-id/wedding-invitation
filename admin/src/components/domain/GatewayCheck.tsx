"use client";

import { CheckCircle2, CircleAlert, Radar } from "lucide-react";
import { useState, useTransition } from "react";
import { testGatewayAction, type GatewayReport } from "@/app/(panel)/domain/actions";
import { cn } from "@/lib/cn";

function Row({ ok, title, detail }: { ok: boolean; title: string; detail: string }) {
  const Icon = ok ? CheckCircle2 : CircleAlert;
  return (
    <li className="flex gap-2.5">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", ok ? "text-moss" : "text-clay")} aria-hidden />
      <div className="min-w-0 text-sm">
        <p className="font-medium">{title}</p>
        <p className="break-words text-xs text-muted">{detail}</p>
      </div>
    </li>
  );
}

/** Uji DNS wildcard + Worker dengan memanggil endpoint kesehatan gateway. */
export function GatewayCheck({ rootDomain }: { rootDomain: string }) {
  const [report, setReport] = useState<GatewayReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      const result = await testGatewayAction();
      setReport(result.ok ? result.data : null);
      setError(result.ok ? null : result.error);
    });
  }

  return (
    <section className="card p-5" aria-labelledby="gateway-title">
      <h2 id="gateway-title" className="flex items-center gap-2 font-semibold">
        <Radar className="h-4 w-4 text-clay" aria-hidden /> Uji gateway
      </h2>
      <p className="mt-1 text-xs text-muted">
        Memanggil Cloudflare Worker di <span className="break-all font-mono">kudo-health-check.{rootDomain || "domain-anda"}</span> untuk memastikan DNS
        dan Worker sudah terpasang.
      </p>

      <div aria-live="polite">
        {report && (
          <ul className="mt-4 space-y-3">
            <Row ok title="Gateway terjangkau" detail={`Menjawab dalam ${report.latencyMs} ms`} />
            <Row
              ok={report.rootDomainMatches}
              title="Domain cocok"
              detail={
                report.rootDomainMatches
                  ? `ROOT_DOMAIN = ${report.gatewayRootDomain}`
                  : `Gateway memakai "${report.gatewayRootDomain}". Samakan ROOT_DOMAIN di wrangler.toml, lalu deploy ulang.`
              }
            />
            <Row
              ok={report.database === "ok"}
              title="Koneksi database"
              detail={report.database === "ok" ? "Gateway bisa membaca Supabase." : "Periksa secret SUPABASE_URL & SUPABASE_ANON_KEY, dan migrasi 001/002."}
            />
            <Row
              ok={report.gatewaySecret}
              title="GATEWAY_SECRET"
              detail={
                report.gatewaySecret
                  ? "Terisi — IP asli tamu diteruskan ke template."
                  : "Belum diatur (min. 32 karakter). Batas kirim ucapan akan berlaku untuk semua tamu sekaligus."
              }
            />
          </ul>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-3.5 py-2.5 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>

      <button type="button" onClick={run} disabled={isPending || !rootDomain} className="btn-outline btn-sm mt-4 w-full">
        {isPending ? "Menguji…" : report || error ? "Uji lagi" : "Uji sekarang"}
      </button>
      {!rootDomain && <p className="hint text-center">Simpan domain induk dulu.</p>}
    </section>
  );
}
