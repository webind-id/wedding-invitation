import { z } from "zod";
import { isValidReservedName, isValidRootDomain, normalizeRootDomain, parseReservedList, withoutBuiltIn } from "./domain";
import { isValidSlug } from "./slug";

const REQUIRED = "Wajib diisi";
const text = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`);
const required = (max: number) => text(max).min(1, REQUIRED);

const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => isValidSlug(v), "3–60 karakter: huruf kecil, angka, dan tanda - (tidak di awal/akhir)");

export const templateInputSchema = z.object({
  code: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => isValidSlug(v, 2, 40), "2–40 karakter: huruf kecil, angka, dan tanda -"),
  name: required(80),
  description: text(300),
  base_url: z
    .string()
    .trim()
    .transform((v) => v.replace(/\/+$/, ""))
    .refine((v) => /^https?:\/\/[^/\s?#]+$/.test(v), "Alamat domain tanpa path, mis. https://kudo.domain.com"),
  preview_image: text(500).refine((v) => v === "" || v.startsWith("https://"), "Harus diawali https://"),
  is_active: z.boolean(),
});
export type TemplateFormInput = z.infer<typeof templateInputSchema>;

export const invitationMetaSchema = z.object({
  title: required(120),
  slug: slugField,
  template_id: z.string().uuid("Pilih template"),
});
export type InvitationMetaInput = z.infer<typeof invitationMetaSchema>;

export const domainSettingsSchema = z
  .object({
    enabled: z.boolean(),
    scheme: z.enum(["https", "http"]),
    root_domain: z.string().max(253, "Terlalu panjang").transform(normalizeRootDomain),
    reserved: z
      .string()
      .max(2000, "Terlalu panjang")
      .transform(parseReservedList)
      .refine((names) => names.length <= 100, "Maksimal 100 nama")
      .refine((names) => names.every(isValidReservedName), "Hanya huruf kecil, angka, dan tanda -, dipisah koma")
      .transform(withoutBuiltIn),
  })
  .superRefine((v, ctx) => {
    if (v.root_domain && !isValidRootDomain(v.root_domain)) {
      ctx.addIssue({ code: "custom", path: ["root_domain"], message: "Isi domain saja, mis. kudostack.com" });
    } else if (v.enabled && !v.root_domain) {
      ctx.addIssue({ code: "custom", path: ["root_domain"], message: "Wajib diisi bila subdomain aktif" });
    }
  });
export type DomainSettingsInput = z.infer<typeof domainSettingsSchema>;

export const messageTemplateSchema = text(2000);

/** Baca FormData jadi objek polos untuk divalidasi zod. Checkbox → boolean. */
export function formToObject(form: FormData, booleans: string[] = []): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") out[key] = value;
  }
  for (const key of booleans) out[key] = form.get(key) === "on";
  return out;
}
