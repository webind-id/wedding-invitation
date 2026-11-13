"use client";

import { TIME_ZONES, fromLocalInput, toLocalInput, type TimeZone, type WeddingEvent } from "@/shared/contract";
import { useEditor } from "./EditorContext";
import { EditorSection } from "./EditorSection";
import { DateTimeInput, SelectInput, TextArea, TextInput } from "./inputs";
import { ListEditor } from "./ListControls";
import { MediaInput } from "./MediaInput";

function PersonFields({ who }: { who: "bride" | "groom" }) {
  const p = (key: string) => [who, key] as const;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Nama panggilan" path={p("nickname")} />
        <TextInput label="Nama lengkap" path={p("fullName")} />
        <TextInput label="Gelar (opsional)" path={p("title")} placeholder="S.T." />
        <TextInput label="Anak ke-" path={p("childOrder")} placeholder={who === "bride" ? "Putri pertama dari" : "Putra kedua dari"} />
        <TextInput label="Nama ayah" path={p("father")} />
        <TextInput label="Nama ibu" path={p("mother")} />
        <TextInput label="Instagram (opsional)" path={p("instagram")} placeholder="tanpa @" />
      </div>
      <MediaInput label="Foto" path={p("photo")} aspect="aspect-[3/4]" hint="Potret 3:4, maks. 10 MB (otomatis dikompres ke WebP)" />
    </div>
  );
}

export function CoupleSection() {
  return (
    <EditorSection id="mempelai" title="Mempelai" description="Nama, orang tua, foto, dan urutan nama di judul" errorPaths={["bride", "groom", "headlineOrder"]} defaultOpen>
      <SelectInput
        label="Urutan nama di judul"
        path={["headlineOrder"]}
        options={[
          { value: "bride-first", label: "Mempelai wanita lebih dulu" },
          { value: "groom-first", label: "Mempelai pria lebih dulu" },
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <fieldset className="rounded-xl border border-line p-4">
          <legend className="px-1 text-sm font-semibold text-clay">Mempelai wanita</legend>
          <PersonFields who="bride" />
        </fieldset>
        <fieldset className="rounded-xl border border-line p-4">
          <legend className="px-1 text-sm font-semibold text-clay">Mempelai pria</legend>
          <PersonFields who="groom" />
        </fieldset>
      </div>
    </EditorSection>
  );
}

function newEvent(existing: WeddingEvent[], tz: TimeZone): WeddingEvent {
  const last = existing.at(-1);
  const base = last ? toLocalInput(last.end, tz) : "2027-01-01T08:00";
  const end = new Date(Date.parse(`${base}:00Z`) + 2 * 3_600_000).toISOString().slice(0, 16);
  let id = "acara";
  for (let n = 2; existing.some((e) => e.id === id); n++) id = `acara-${n}`;
  return {
    id,
    name: "",
    start: fromLocalInput(base, tz),
    end: fromLocalInput(end, tz),
    venue: last?.venue ?? "",
    address: last?.address ?? "",
    mapsUrl: last?.mapsUrl ?? "",
    note: "",
  };
}

export function EventsSection() {
  const { content, set } = useEditor();

  /** Ganti zona waktu sambil mempertahankan jam dinding setiap acara. */
  function changeTimeZone(next: TimeZone) {
    const prev = content.timeZone;
    set(
      ["events"],
      content.events.map((e) => ({
        ...e,
        start: fromLocalInput(toLocalInput(e.start, prev), next),
        end: fromLocalInput(toLocalInput(e.end, prev), next),
      })),
    );
    set(["timeZone"], next);
  }

  return (
    <EditorSection id="acara" title="Acara" description="Akad, resepsi, dan lokasi" errorPaths={["events", "timeZone"]}>
      <div className="max-w-xs">
        <label htmlFor="tz" className="label">
          Zona waktu
        </label>
        <select id="tz" value={content.timeZone} onChange={(e) => changeTimeZone(e.target.value as TimeZone)} className="input">
          {Object.entries(TIME_ZONES).map(([tz, { label }]) => (
            <option key={tz} value={tz}>
              {label} ({tz})
            </option>
          ))}
        </select>
      </div>
      <ListEditor
        path={["events"]}
        items={content.events}
        noun="acara"
        min={1}
        max={6}
        create={() => newEvent(content.events, content.timeZone)}
        itemKey={(e) => e.id}
        title={(e, i) => e.name || `Acara ${i + 1}`}
      >
        {(e, i) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Nama acara"
                path={["events", i, "name"]}
                placeholder="Akad Nikah"
                hint={`ID: ${e.id}`}
              />
              <TextInput label="Catatan (opsional)" path={["events", i, "note"]} placeholder="Khusus keluarga" />
              <DateTimeInput label="Mulai" path={["events", i, "start"]} />
              <DateTimeInput label="Selesai" path={["events", i, "end"]} />
              <TextInput label="Tempat" path={["events", i, "venue"]} />
              <TextInput label="Tautan Google Maps (opsional)" path={["events", i, "mapsUrl"]} placeholder="https://maps.app.goo.gl/…" />
            </div>
            <TextArea label="Alamat" path={["events", i, "address"]} rows={2} />
          </>
        )}
      </ListEditor>
    </EditorSection>
  );
}

export function StorySection() {
  const { content } = useEditor();
  return (
    <EditorSection id="kisah" title="Kisah cinta" description="Linimasa perjalanan (boleh kosong untuk menyembunyikan)" errorPaths={["story"]}>
      <ListEditor
        path={["story"]}
        items={content.story}
        noun="bab"
        max={12}
        create={() => ({ year: "", title: "", text: "" })}
        itemKey={(_, i) => `bab-${i}`}
        title={(c, i) => (c.title ? `${c.year} · ${c.title}` : `Bab ${i + 1}`)}
      >
        {(_, i) => (
          <>
            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <TextInput label="Tahun" path={["story", i, "year"]} placeholder="2019" />
              <TextInput label="Judul" path={["story", i, "title"]} />
            </div>
            <TextArea label="Cerita" path={["story", i, "text"]} />
          </>
        )}
      </ListEditor>
    </EditorSection>
  );
}

export function TextsSection() {
  return (
    <EditorSection id="teks" title="Teks undangan" description="Sapaan, ayat, penutup, dan judul halaman" errorPaths={["defaultGuest", "invitationIntro", "verse", "closing", "seo"]}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Sapaan bila tanpa nama tamu" path={["defaultGuest"]} hint="Dipakai bila tautan tanpa ?to=" />
        <TextInput label="Tanda tangan penutup" path={["closing", "signature"]} placeholder="Kami yang berbahagia" />
      </div>
      <TextArea label="Kalimat pengantar" path={["invitationIntro"]} />
      <TextArea label="Ayat (Arab) — kosongkan untuk menyembunyikan" path={["verse", "arabic"]} dir="rtl" />
      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <TextArea label="Terjemahan" path={["verse", "translation"]} />
        <TextInput label="Sumber" path={["verse", "source"]} placeholder="QS. Ar-Rum : 21" />
      </div>
      <TextArea label="Pesan penutup" path={["closing", "message"]} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Judul tab / pratinjau tautan" path={["seo", "title"]} hint="Kosong = nama pasangan" />
        <TextInput label="Deskripsi pratinjau tautan" path={["seo", "description"]} />
      </div>
    </EditorSection>
  );
}
