import type { InvitationContent } from "@/shared/contract";
import { sampleContent } from "@/shared/sample";

/**
 * Konten contoh bersama (src/shared/sample.ts) bernuansa Islami/Jawa: QS. Ar-Rum : 21,
 * "…rahmat dan ridho Allah SWT…", acara "Akad Nikah". Undangan baru di admin dimulai dari
 * konten itu, jadi untuk template klenteng teks bawaan yang BELUM diubah admin dianggap
 * kosong, lalu komponen memakai teks template (kutipan Shijing, salam pembuka netral).
 * Teks yang sudah diubah admin selalu ditampilkan apa adanya.
 */

const EMPTY_VERSE: InvitationContent["verse"] = { arabic: "", translation: "", source: "" };

export function isStockVerse(verse: InvitationContent["verse"]): boolean {
  const stock = sampleContent.verse;
  return verse.arabic.trim() === stock.arabic.trim() && verse.source.trim() === stock.source.trim();
}

export function withKlentengDefaults(content: InvitationContent): InvitationContent {
  return {
    ...content,
    verse: isStockVerse(content.verse) ? EMPTY_VERSE : content.verse,
    invitationIntro: content.invitationIntro.trim() === sampleContent.invitationIntro.trim() ? "" : content.invitationIntro,
  };
}

/** Konten demo (/ dan /og): contoh bersama + teks klenteng; "Akad Nikah" menjadi pemberkatan. */
export const klentengDemoContent: InvitationContent = {
  ...withKlentengDefaults(sampleContent),
  events: sampleContent.events.map((event) => (event.name === "Akad Nikah" ? { ...event, name: "Pemberkatan Pernikahan" } : event)),
};
