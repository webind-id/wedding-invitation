"use client";

import { ArrowLeft, ArrowRight, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { moveItem, removeItem } from "@/lib/immutable";
import { cn } from "@/lib/cn";
import { DEFAULT_MUSIC, GAMELAN_MUSIC, GUZHENG_MUSIC, type Moment } from "@/shared/contract";
import { useEditor } from "./EditorContext";
import { EditorSection } from "./EditorSection";
import { SelectInput, TextArea, TextInput } from "./inputs";
import { ListEditor } from "./ListControls";
import { ACCEPT, MediaInput } from "./MediaInput";

/** client = formulir klien: tanpa pratinjau lagu bawaan per jenis template (klien hanya memakai satu desain). */
export function MediaSection({ client = false }: { client?: boolean }) {
  return (
    <EditorSection id="media" title="Foto utama & musik" errorPaths={["coverPhoto", "posterPhoto", "music", "musicOff"]}>
      <div className="grid gap-6 lg:grid-cols-2">
        <MediaInput label="Foto sampul" path={["coverPhoto"]} aspect="aspect-[4/5]" hint="Potret 4:5, tampil di sampul & pembuka" />
        <MediaInput label="Foto poster desktop" path={["posterPhoto"]} aspect="aspect-video" hint="Lanskap, latar kiri di layar lebar" />
      </div>
      <MusicPicker client={client} />
    </EditorSection>
  );
}

type MusicMode = "default" | "custom" | "off";

const DEFAULT_HINT_ADMIN = "Instrumental bawaan; template Jawa memakai gamelan, Tionghoa memakai guzheng";
const DEFAULT_HINT_CLIENT = "Instrumental bawaan yang sesuai dengan desain undangan";

const MUSIC_OPTIONS: { value: MusicMode; label: string; hint: string }[] = [
  { value: "default", label: "Lagu bawaan", hint: DEFAULT_HINT_ADMIN },
  { value: "custom", label: "Lagu sendiri", hint: "Unggah MP3 atau tempel tautan" },
  { value: "off", label: "Tanpa musik", hint: "Undangan tanpa suara" },
];

/**
 * Musik latar: lagu bawaan (music kosong), lagu sendiri (music berisi URL), atau tanpa musik
 * (musicOff). "Lagu sendiri" diingat secara lokal sampai file diunggah, karena music masih kosong.
 */
function MusicPicker({ client }: { client: boolean }) {
  const { content, set } = useEditor();
  const derived: MusicMode = content.musicOff ? "off" : content.music ? "custom" : "default";
  const [isPickingCustom, setIsPickingCustom] = useState(false);
  const mode: MusicMode = derived === "default" && isPickingCustom ? "custom" : derived;

  function choose(next: MusicMode) {
    setIsPickingCustom(next === "custom");
    set(["musicOff"], next === "off");
    // Lagu bawaan = music kosong. Unggahan lama tetap disimpan saat memilih "Tanpa musik".
    if (next === "default") set(["music"], "");
  }

  return (
    <fieldset>
      <legend className="label">Musik latar</legend>
      <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
        {MUSIC_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm transition-colors",
              mode === opt.value ? "border-ink bg-paper" : "border-line hover:border-muted",
            )}
          >
            <input type="radio" name="music-mode" value={opt.value} checked={mode === opt.value} onChange={() => choose(opt.value)} className="mt-0.5 accent-clay" />
            <span>
              <span className="block font-medium">{opt.label}</span>
              <span className="hint mt-0.5 block">{client && opt.value === "default" ? DEFAULT_HINT_CLIENT : opt.hint}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-3">
        {mode === "default" && !client && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { src: DEFAULT_MUSIC, label: "Template umum" },
              { src: GAMELAN_MUSIC, label: "Template adat Jawa (gamelan)" },
              { src: GUZHENG_MUSIC, label: "Template Tionghoa (guzheng)" },
            ].map((song) => (
              <div key={song.src}>
                <p className="hint mb-1">{song.label}</p>
                <audio src={song.src} controls preload="none" className="h-8 w-full" aria-label={`Pratinjau lagu bawaan: ${song.label}`} />
              </div>
            ))}
          </div>
        )}
        {mode === "custom" && (
          <MediaInput label="File lagu" path={["music"]} kind="audio" hint="MP3 maks. 10 MB — pastikan Anda berhak memakainya. Kosongkan untuk kembali ke lagu bawaan." />
        )}
      </div>
    </fieldset>
  );
}

const SHAPES: { value: Moment["shape"]; label: string }[] = [
  { value: "tall", label: "Potret" },
  { value: "square", label: "Persegi" },
  { value: "wide", label: "Lanskap" },
];
const MAX_MOMENTS = 30;

export function GallerySection() {
  const { content, errors, set, update, upload } = useEditor();
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const moments = content.moments;

  /** Unggah beberapa foto berurutan; foto yang berhasil langsung masuk galeri. */
  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, MAX_MOMENTS - moments.length);
    setUploadError(null);
    for (const [i, file] of list.entries()) {
      setProgress(`Mengunggah ${i + 1}/${list.length}…`);
      try {
        const src = await upload(file, "image");
        // Tambahkan ke daftar TERKINI — pengguna mungkin mengedit galeri selama upload.
        update(["moments"], (current) => [...(current as Moment[]), { src, alt: "", shape: "square" }]);
      } catch (err) {
        setUploadError(`${file.name}: ${err instanceof Error ? err.message : "gagal"}`);
      }
    }
    setProgress(null);
  }

  return (
    <EditorSection id="galeri" title="Galeri" description={`${moments.length}/${MAX_MOMENTS} foto`} errorPaths={["moments"]}>
      <TextInput label="Judul galeri" path={["galleryTitle"]} placeholder="Potongan-potongan kecil kita" hint="Bisa diganti sesuai tema atau jumlah foto" />
      {moments.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {moments.map((m, i) => (
            <li key={`${m.src}-${i}`} className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="relative aspect-square bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 top-0 flex justify-between p-1.5">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => set(["moments"], moveItem(moments, i, i - 1))} disabled={i === 0} aria-label={`Geser foto ${i + 1} ke kiri`} className="rounded-lg bg-card/90 p-1 disabled:opacity-30">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => set(["moments"], moveItem(moments, i, i + 1))} disabled={i === moments.length - 1} aria-label={`Geser foto ${i + 1} ke kanan`} className="rounded-lg bg-card/90 p-1 disabled:opacity-30">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button type="button" onClick={() => set(["moments"], removeItem(moments, i))} aria-label={`Hapus foto ${i + 1}`} className="rounded-lg bg-card/90 p-1 text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 p-2">
                <input
                  value={m.alt}
                  onChange={(e) => set(["moments", i, "alt"], e.target.value)}
                  placeholder="Keterangan (alt)"
                  aria-label={`Keterangan foto ${i + 1}`}
                  className="input px-2.5 py-1.5 text-xs"
                />
                <select
                  value={m.shape}
                  onChange={(e) => set(["moments", i, "shape"], e.target.value)}
                  aria-label={`Bentuk foto ${i + 1}`}
                  className="input px-2.5 py-1.5 text-xs"
                >
                  {SHAPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors[`moments.${i}.src`] && <p className="error-text">{errors[`moments.${i}.src`]}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <input ref={fileRef} type="file" accept={ACCEPT.image} multiple className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={Boolean(progress) || moments.length >= MAX_MOMENTS} className="btn-outline">
          <Upload className="h-4 w-4" aria-hidden /> {progress ?? "Unggah foto (bisa banyak)"}
        </button>
        {uploadError && <p className="error-text mt-0">{uploadError}</p>}
        {errors.moments && <p className="error-text mt-0">{errors.moments}</p>}
      </div>
    </EditorSection>
  );
}

export function GiftSection() {
  const { content, set } = useEditor();
  const { gift } = content;

  return (
    <EditorSection id="hadiah" title="Hadiah" description="Rekening, e-wallet, dan alamat kirim kado" errorPaths={["gift"]}>
      <TextArea label="Kalimat pengantar" path={["gift", "intro"]} rows={2} />
      <ListEditor
        path={["gift", "accounts"]}
        items={gift.accounts}
        noun="rekening"
        max={6}
        create={() => ({ provider: "", kind: "bank" as const, holder: "", number: "" })}
        itemKey={(_, i) => `rek-${i}`}
        title={(a, i) => a.provider || `Rekening ${i + 1}`}
      >
        {(_, i) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Bank / e-wallet" path={["gift", "accounts", i, "provider"]} placeholder="BCA" />
            <SelectInput
              label="Jenis"
              path={["gift", "accounts", i, "kind"]}
              options={[
                { value: "bank", label: "Rekening bank" },
                { value: "ewallet", label: "E-wallet" },
              ]}
            />
            <TextInput label="Nomor" path={["gift", "accounts", i, "number"]} />
            <TextInput label="Atas nama" path={["gift", "accounts", i, "holder"]} />
          </div>
        )}
      </ListEditor>

      <label className="flex items-center gap-2.5 pt-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={gift.shipping !== null}
          onChange={(e) => set(["gift", "shipping"], e.target.checked ? { recipient: "", phone: "", address: "" } : null)}
          className="h-4 w-4 accent-clay"
        />
        Terima kiriman kado fisik
      </label>
      {gift.shipping && (
        <div className="grid gap-4 rounded-xl border border-line p-4 sm:grid-cols-2">
          <TextInput label="Penerima" path={["gift", "shipping", "recipient"]} />
          <TextInput label="Telepon (opsional)" path={["gift", "shipping", "phone"]} />
          <TextArea label="Alamat lengkap" path={["gift", "shipping", "address"]} rows={2} className="sm:col-span-2" />
        </div>
      )}
    </EditorSection>
  );
}
