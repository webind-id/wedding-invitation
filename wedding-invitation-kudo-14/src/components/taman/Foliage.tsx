/**
 * Dedaunan pengisi bagian — dekoratif, aria-hidden, tidak bisa diketuk.
 * - LeafHem: sepasang rumpun daun menjuntai melintasi batas atas bagian, menyambung bagian
 *   sebelumnya seperti taman yang tak terputus. Lapisan luar parallax (data-depth).
 * - NightLeaves: siluet daun samar di pojok bagian gelap ("taman malam").
 */
const LEAF = "/images/taman/dedaunan.webp";

export function LeafHem() {
  return (
    <div aria-hidden className="leaf-hem">
      <div data-depth="14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LEAF} alt="" width={600} height={626} loading="lazy" decoding="async" className="is-l" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LEAF} alt="" width={600} height={626} loading="lazy" decoding="async" className="is-r -scale-x-100" />
      </div>
    </div>
  );
}

export function NightLeaves() {
  // Dipotong di dalam bagiannya sendiri: siluet tidak boleh bocor ke bagian terang di atas/bawah.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LEAF} alt="" width={600} height={626} loading="lazy" decoding="async" className="night-leaf -left-[90px] -top-[60px] rotate-[150deg]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LEAF} alt="" width={600} height={626} loading="lazy" decoding="async" className="night-leaf -bottom-[70px] -right-[90px] -rotate-[20deg]" />
    </div>
  );
}
