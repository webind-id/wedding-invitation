// Vitest (Vite) mendukung `import x from "./file?raw"` → isi berkas sebagai string.
declare module "*?raw" {
  const content: string;
  export default content;
}
