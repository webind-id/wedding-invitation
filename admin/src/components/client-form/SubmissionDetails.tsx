import type { ReactNode } from "react";
import type { ClientGuestRow } from "@/lib/client-form";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import type { InvitationContent, Person } from "@/shared/contract";

/**
 * Isian lengkap kiriman klien (read-only) untuk ditinjau admin sebelum diimpor. Komponen server —
 * dikirim ke ClientFormPanel sebagai `details`. Isian wajib yang kosong ditandai lewat `fieldErrors`
 * (klien tidak wajib mengisi semua; admin yang melengkapi).
 */
interface SubmissionDetailsProps {
  content: InvitationContent;
  guests: ClientGuestRow[];
  fieldErrors: Record<string, string>;
}

export function SubmissionDetails({ content, guests, fieldErrors }: SubmissionDetailsProps) {
  const err = (key: string) => fieldErrors[key];
  const tz = content.timeZone;
  const filledGuests = guests.filter((g) => g.name || g.contact);

  return (
    <div className="space-y-5">
      <Group title="Mempelai">
        <div className="grid gap-4 md:grid-cols-2">
          <PersonCard label="Mempelai wanita" person={content.bride} prefix="bride" err={err} />
          <PersonCard label="Mempelai pria" person={content.groom} prefix="groom" err={err} />
        </div>
        <Fields>
          <Field label="Urutan nama" value={content.headlineOrder === "bride-first" ? "Wanita dulu" : "Pria dulu"} />
          <Field label="Zona waktu" value={content.timeZone} />
        </Fields>
      </Group>

      <Group title={`Acara (${content.events.length})`} error={err("events")}>
        {content.events.length === 0 && <Empty />}
        {content.events.map((e, i) => (
          <Item key={e.id || i} title={e.name || `Acara ${i + 1}`} missing={!e.name}>
            <Fields>
              <Field label="Mulai" value={e.start ? formatDateTime(e.start, tz) : ""} error={err(`events.${i}.start`)} />
              <Field label="Selesai" value={e.untilFinished ? "Sampai selesai" : e.end ? formatDateTime(e.end, tz) : ""} error={err(`events.${i}.end`)} />
              <Field label="Tempat" value={e.venue} error={err(`events.${i}.venue`)} />
              <Field label="Alamat" value={e.address} error={err(`events.${i}.address`)} wide />
              <Field label="Google Maps" value={e.mapsUrl && <ExtLink href={e.mapsUrl} />} error={err(`events.${i}.mapsUrl`)} wide />
              <Field label="Catatan" value={e.note} />
            </Fields>
          </Item>
        ))}
      </Group>

      <Group title="Foto & musik">
        <div className="flex flex-wrap gap-4">
          <Thumb label="Foto sampul" src={content.coverPhoto} />
          <Thumb label="Foto poster" src={content.posterPhoto} />
        </div>
        <Fields>
          <Field
            label="Musik"
            value={
              content.musicOff ? (
                "Tanpa musik"
              ) : content.music ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio src={content.music} controls preload="none" className="mt-1 h-8 w-full max-w-sm" />
              ) : (
                "Lagu bawaan template"
              )
            }
            wide
          />
        </Fields>
      </Group>

      <Group title="Teks undangan">
        <Fields>
          <Field label="Sapaan di sampul" value={content.coverGreeting} />
          <Field label="Sapaan bila tanpa nama" value={content.defaultGuest} error={err("defaultGuest")} />
          <Field label="Kalimat pengantar" value={content.invitationIntro} wide />
          <Field label="Ayat (Arab)" value={content.verse.arabic && <span dir="rtl" className="block text-right text-base">{content.verse.arabic}</span>} wide />
          <Field label="Terjemahan" value={content.verse.translation} wide />
          <Field label="Sumber ayat" value={content.verse.source} />
          <Field label="Pesan penutup" value={content.closing.message} wide />
          <Field label="Tanda tangan" value={content.closing.signature} />
        </Fields>
      </Group>

      <Group title={`Kisah (${content.story.length})`}>
        {content.story.length === 0 && <Empty />}
        {content.story.map((c, i) => (
          <Item key={i} title={[c.year, c.title].filter(Boolean).join(" · ") || `Bab ${i + 1}`} missing={!c.title}>
            <p className="whitespace-pre-line text-sm text-ink/80">{c.text || <Missing />}</p>
          </Item>
        ))}
      </Group>

      <Group title={`Prosesi adat (${content.ceremonies.length})`}>
        {content.ceremonies.length === 0 && <Empty />}
        {content.ceremonies.map((c, i) => (
          <Item key={i} title={c.name || `Prosesi ${i + 1}`} missing={!c.name}>
            {c.description && <p className="whitespace-pre-line text-sm text-ink/80">{c.description}</p>}
          </Item>
        ))}
      </Group>

      <Group title={`Galeri (${content.moments.length})`}>
        {content.galleryTitle && <p className="text-sm text-ink/80">Judul: {content.galleryTitle}</p>}
        {content.moments.length === 0 ? (
          <Empty />
        ) : (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {content.moments.map((m, i) => (
              <li key={i} className="aspect-square overflow-hidden rounded-lg border border-line bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt={m.alt || `Foto ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              </li>
            ))}
          </ul>
        )}
      </Group>

      <Group title="Hadiah">
        <Fields>
          <Field label="Pengantar" value={content.gift.intro} wide />
        </Fields>
        {content.gift.accounts.map((a, i) => (
          <Item key={i} title={a.provider || `Rekening ${i + 1}`} missing={!a.provider}>
            <Fields>
              <Field label="Jenis" value={a.kind === "bank" ? "Bank" : "E-wallet"} />
              <Field label="Atas nama" value={a.holder} error={err(`gift.accounts.${i}.holder`)} />
              <Field label="Nomor" value={a.number && <span className="font-mono">{a.number}</span>} error={err(`gift.accounts.${i}.number`)} />
            </Fields>
          </Item>
        ))}
        {content.gift.shipping && (
          <Item title="Alamat kirim kado">
            <Fields>
              <Field label="Penerima" value={content.gift.shipping.recipient} error={err("gift.shipping.recipient")} />
              <Field label="Telepon" value={content.gift.shipping.phone} />
              <Field label="Alamat" value={content.gift.shipping.address} error={err("gift.shipping.address")} wide />
            </Fields>
          </Item>
        )}
        {content.gift.accounts.length === 0 && !content.gift.shipping && <Empty />}
      </Group>

      <Group title={`Daftar tamu (${filledGuests.length})`}>
        {filledGuests.length === 0 ? (
          <Empty text="Tidak ada tamu yang diketik (cek juga file daftar tamu di atas, bila ada)." />
        ) : (
          <div className="max-h-80 overflow-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-paper text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 font-semibold">#</th>
                  <th className="px-3 py-2 font-semibold">Nama</th>
                  <th className="px-3 py-2 font-semibold">Kontak</th>
                  <th className="px-3 py-2 font-semibold">Diundang oleh</th>
                </tr>
              </thead>
              <tbody>
                {filledGuests.map((g, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="px-3 py-1.5 text-muted">{i + 1}</td>
                    <td className="px-3 py-1.5">{g.name || <Missing />}</td>
                    <td className="px-3 py-1.5 font-mono text-xs">{g.contact || "—"}</td>
                    <td className="px-3 py-1.5">{g.inviter || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Group>
    </div>
  );
}

function PersonCard({ label, person, prefix, err }: { label: string; person: Person; prefix: string; err: (k: string) => string | undefined }) {
  return (
    <div className="rounded-xl border border-line p-4">
      <div className="flex items-start gap-3">
        {person.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.photo} alt="" className="h-14 w-14 shrink-0 rounded-full border border-line object-cover" />
        ) : (
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-paper text-xs text-muted">foto</div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="font-semibold">{person.nickname || <Missing />}</p>
        </div>
      </div>
      <Fields>
        <Field label="Nama lengkap" value={person.fullName} error={err(`${prefix}.fullName`)} wide />
        <Field label="Gelar" value={person.title} />
        <Field label="Anak ke-" value={person.childOrder} error={err(`${prefix}.childOrder`)} />
        <Field label="Ayah" value={person.father} error={err(`${prefix}.father`)} />
        <Field label="Ibu" value={person.mother} error={err(`${prefix}.mother`)} />
        <Field label="Alamat" value={person.address} wide />
        <Field label="Instagram" value={person.instagram && `@${person.instagram.replace(/^@/, "")}`} />
      </Fields>
    </div>
  );
}

function Group({ title, error, children }: { title: string; error?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-card p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {error && <p className="error-text">{error}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Item({ title, missing = false, children }: { title: string; missing?: boolean; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className={cn("text-sm font-semibold", missing && "text-danger")}>{title}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Fields({ children }: { children: ReactNode }) {
  return <dl className="mt-2 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">{children}</dl>;
}

function Field({ label, value, error, wide = false }: { label: string; value: ReactNode; error?: string; wide?: boolean }) {
  const empty = value === "" || value === null || value === undefined || value === false;
  return (
    <div className={cn("min-w-0", wide && "sm:col-span-2")}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="whitespace-pre-line break-words text-ink/85">{empty ? error ? <Missing text={error} /> : <span className="text-muted/60">—</span> : value}</dd>
      {!empty && error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function Missing({ text = "Belum diisi" }: { text?: string }) {
  return <span className="text-xs font-medium text-danger">{text}</span>;
}

function Empty({ text = "Tidak diisi." }: { text?: string }) {
  return <p className="text-sm text-muted">{text}</p>;
}

function ExtLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="break-all text-moss underline underline-offset-2">
      {href}
    </a>
  );
}

function Thumb({ label, src }: { label: string; src: string }) {
  return (
    <figure className="w-28">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="aspect-[4/5] w-full rounded-lg border border-line object-cover" />
      ) : (
        <div className="grid aspect-[4/5] w-full place-items-center rounded-lg bg-paper text-xs text-muted">Belum ada</div>
      )}
      <figcaption className="mt-1 text-xs text-muted">{label}</figcaption>
    </figure>
  );
}
