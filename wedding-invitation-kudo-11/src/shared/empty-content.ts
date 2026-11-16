import { CONTENT_VERSION, type InvitationContent } from "./contract";

/** Konten kosong untuk form baru; teks admin boleh dipertahankan secara eksplisit. */
export function emptyContent(text?: Pick<InvitationContent, "defaultGuest" | "coverGreeting" | "invitationIntro" | "verse" | "closing" | "seo">): InvitationContent {
  return {
    version: CONTENT_VERSION,
    bride: { nickname: "", fullName: "", title: "", childOrder: "", father: "", mother: "", address: "", instagram: "", photo: "" },
    groom: { nickname: "", fullName: "", title: "", childOrder: "", father: "", mother: "", address: "", instagram: "", photo: "" },
    headlineOrder: "bride-first",
    timeZone: "Asia/Jakarta",
    defaultGuest: text?.defaultGuest ?? "",
    coverGreeting: text?.coverGreeting ?? "Kepada Yth.",
    coverPhoto: "",
    posterPhoto: "",
    music: "",
    verse: text?.verse ?? { arabic: "", translation: "", source: "" },
    invitationIntro: text?.invitationIntro ?? "",
    events: [{ id: "acara", name: "", start: "", end: "", untilFinished: false, venue: "", address: "", mapsUrl: "", note: "" }],
    story: [],
    galleryTitle: "",
    moments: [],
    gift: { intro: "", accounts: [], shipping: null },
    closing: text?.closing ?? { message: "", signature: "" },
    seo: text?.seo ?? { title: "", description: "" },
  };
}
