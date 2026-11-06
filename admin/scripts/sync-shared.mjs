#!/usr/bin/env node
/**
 * Salin admin/src/shared/* ke setiap template, agar kontrak konten,
 * token pratinjau, dan konten contoh selalu identik.
 *
 * Pemakaian: npm run shared:sync            (salin)
 *            npm run shared:sync -- --check (hanya cek, exit 1 bila berbeda)
 *
 * Template ditemukan otomatis: folder saudara ../<nama>/ yang punya src/shared/.
 */
import { copyFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adminRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(adminRoot, "src", "shared");
const workspace = path.dirname(adminRoot);
const checkOnly = process.argv.includes("--check");

const files = readdirSync(source).filter((f) => f.endsWith(".ts"));
const targets = readdirSync(workspace, { withFileTypes: true })
  .filter((d) => d.isDirectory() && path.join(workspace, d.name) !== adminRoot)
  .map((d) => path.join(workspace, d.name, "src", "shared"))
  .filter((dir) => existsSync(dir));

let drift = 0;
for (const target of targets) {
  for (const file of files) {
    const from = path.join(source, file);
    const to = path.join(target, file);
    const same = existsSync(to) && readFileSync(to, "utf8") === readFileSync(from, "utf8");
    if (same) continue;
    if (checkOnly) {
      drift++;
      console.log(`berbeda: ${path.relative(workspace, to)}`);
    } else {
      copyFileSync(from, to);
      console.log(`disalin: ${path.relative(workspace, to)}`);
    }
  }
}

if (targets.length === 0) console.log("Tidak ada template dengan folder src/shared/.");
else if (!checkOnly) console.log(`Selesai — ${targets.length} template diperiksa.`);
if (checkOnly && drift > 0) process.exit(1);
