/**
 * Konten contoh (fiktif) — dibagikan ke semua template.
 * Sumber asli: admin/src/shared/ (lihat contract.ts).
 *
 * Dipakai admin sebagai isi awal undangan baru, dan oleh template sebagai
 * demo di halaman root. Path /images/… menunjuk ke folder public template.
 */
import { CONTENT_VERSION, type InvitationContent } from "./contract";

export const sampleContent: InvitationContent = {
  version: CONTENT_VERSION,
  bride: {
    nickname: "Cahya",
    fullName: "Cahya Paramitha",
    title: "S.Ds.",
    childOrder: "Putri pertama dari",
    father: "Bapak Hendra Wijaya",
    mother: "Ibu Ratna Sari",
    instagram: "cahya.example",
    photo: "/images/bride.jpg",
  },
  groom: {
    nickname: "Wahyu",
    fullName: "Wahyu Pradipta",
    title: "S.T.",
    childOrder: "Putra kedua dari",
    father: "Bapak Bambang Santoso",
    mother: "Ibu Dewi Lestari",
    instagram: "wahyu.example",
    photo: "/images/groom.jpg",
  },
  headlineOrder: "bride-first",
  timeZone: "Asia/Jakarta",
  defaultGuest: "Bapak/Ibu/Saudara/i",
  coverPhoto: "/images/cover.jpg",
  posterPhoto: "/images/poster.jpg",
  music: "",
  verse: {
    arabic:
      "وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً",
    translation:
      "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum : 21",
  },
  invitationIntro:
    "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Anda untuk merayakan hari bahagia kami.",
  events: [
    {
      id: "akad",
      name: "Akad Nikah",
      start: "2027-06-12T08:00:00+07:00",
      end: "2027-06-12T10:00:00+07:00",
      venue: "Pendopo Sekar Wangi",
      address: "Jl. Contoh Raya No. 1, Bandung, Jawa Barat",
      mapsUrl: "",
      note: "Khusus keluarga & kerabat dekat",
    },
    {
      id: "resepsi",
      name: "Resepsi",
      start: "2027-06-12T11:00:00+07:00",
      end: "2027-06-12T14:00:00+07:00",
      venue: "Pendopo Sekar Wangi",
      address: "Jl. Contoh Raya No. 1, Bandung, Jawa Barat",
      mapsUrl: "",
      note: "",
    },
  ],
  story: [
    {
      year: "2019",
      title: "Satu meja di perpustakaan",
      text: "Kami bertemu karena berebut satu-satunya meja kosong saat musim ujian. Siapa sangka, meja itu jadi tempat favorit kami berdua.",
    },
    {
      year: "2021",
      title: "Jarak yang menguji",
      text: "Pekerjaan membawa kami ke dua kota berbeda. Panggilan video setiap malam menjadi cara kami tetap saling menjaga.",
    },
    {
      year: "2026",
      title: "Lamaran sederhana",
      text: "Di hadapan kedua keluarga, kami berjanji untuk melangkah ke jenjang yang lebih serius.",
    },
  ],
  moments: [
    { src: "/images/moment-1.jpg", alt: "Momen 1", shape: "tall" },
    { src: "/images/moment-2.jpg", alt: "Momen 2", shape: "square" },
    { src: "/images/moment-3.jpg", alt: "Momen 3", shape: "square" },
    { src: "/images/moment-4.jpg", alt: "Momen 4", shape: "tall" },
  ],
  gift: {
    intro:
      "Kehadiran dan doa Anda sudah lebih dari cukup. Namun bila ingin berbagi tanda kasih, Anda dapat mengirimkannya melalui:",
    accounts: [
      { provider: "Bank Contoh", kind: "bank", holder: "Cahya Paramitha", number: "1234567890" },
      { provider: "E-Wallet Contoh", kind: "ewallet", holder: "Wahyu Pradipta", number: "081200000000" },
    ],
    shipping: {
      recipient: "Cahya & Wahyu",
      phone: "081200000000",
      address: "Jl. Contoh Raya No. 1, Bandung, Jawa Barat 40000",
    },
  },
  closing: {
    message: "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    signature: "Kami yang berbahagia",
  },
  seo: {
    title: "Cahya & Wahyu — 12.06.2027",
    description: "Undangan pernikahan Cahya & Wahyu, Sabtu 12 Juni 2027.",
  },
};
