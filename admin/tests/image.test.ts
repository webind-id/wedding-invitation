import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { IMAGE_MAX_DIMENSION, toWebp } from "@/lib/image";

/** JPEG uji dengan EXIF (orientasi + data "GPS"-like di komentar) seperti foto dari HP. */
async function photo(width: number, height: number, orientation = 1): Promise<Uint8Array> {
  const buf = await sharp({ create: { width, height, channels: 3, background: { r: 200, g: 120, b: 90 } } })
    .jpeg({ quality: 95 })
    .withMetadata({ orientation, exif: { IFD0: { Copyright: "rahasia", ImageDescription: "lokasi rumah" } } })
    .toBuffer();
  return new Uint8Array(buf);
}

describe("toWebp", () => {
  it("re-encodes any accepted photo as WebP", async () => {
    const out = await toWebp(await photo(800, 600));
    const meta = await sharp(out).metadata();
    expect(meta.format).toBe("webp");
    expect([meta.width, meta.height]).toEqual([800, 600]);
  });

  it("shrinks huge photos to fit the max dimension, keeping the aspect ratio", async () => {
    const meta = await sharp(await toWebp(await photo(4000, 3000))).metadata();
    expect(meta.width).toBe(IMAGE_MAX_DIMENSION);
    expect(meta.height).toBe(Math.round((IMAGE_MAX_DIMENSION * 3) / 4));
  });

  it("never enlarges small photos", async () => {
    const meta = await sharp(await toWebp(await photo(300, 200))).metadata();
    expect([meta.width, meta.height]).toEqual([300, 200]);
  });

  it("applies the EXIF rotation so phone photos are upright", async () => {
    // Orientasi 6 = putar 90° searah jarum jam: 800×600 tersimpan, tampil 600×800.
    const meta = await sharp(await toWebp(await photo(800, 600, 6))).metadata();
    expect([meta.width, meta.height]).toEqual([600, 800]);
  });

  it("strips all metadata (EXIF can contain GPS location)", async () => {
    const input = await photo(800, 600);
    expect((await sharp(input).metadata()).exif).toBeDefined();
    const meta = await sharp(await toWebp(input)).metadata();
    expect(meta.exif).toBeUndefined();
    expect(meta.orientation).toBeUndefined();
  });

  it("makes a typical photo smaller than the original JPEG", async () => {
    const noisy = new Uint8Array(
      await sharp({ create: { width: 1600, height: 1200, channels: 3, background: "#888", noise: { type: "gaussian", mean: 128, sigma: 30 } } })
        .jpeg({ quality: 95 })
        .toBuffer(),
    );
    expect((await toWebp(noisy)).byteLength).toBeLessThan(noisy.byteLength);
  });

  it("rejects bytes that are not an image", async () => {
    await expect(toWebp(new TextEncoder().encode("bukan gambar"))).rejects.toThrow();
  });
});
