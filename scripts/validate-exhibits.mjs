#!/usr/bin/env node
/**
 * Exhibit validator — the CI gate.
 *
 * Dependency-free. Refuses to pass if any exhibit is missing required fields,
 * has an unknown hall/badge, has no sources, or carries a trace that isn't
 * Trace Schema v1. A missing source link fails the build — sourcing is the
 * museum's entire credibility.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const EX_DIR = fileURLToPath(new URL("../exhibits/", import.meta.url));

const HALLS = new Set(["destruction", "silent-wrong-output", "supply-chain", "delivery", "annex"]);
const BADGES = new Set(["documented", "reconstruction", "composite"]);
const REQUIRED = ["id", "title", "hall", "date", "badge", "summary", "sources", "verifierMapping", "trace"];

let errors = 0;
const fail = (slug, msg) => {
  console.error(`  ✗ [${slug}] ${msg}`);
  errors++;
};

if (!existsSync(EX_DIR)) {
  console.error("No exhibits/ directory found.");
  process.exit(1);
}

const slugs = readdirSync(EX_DIR).filter((d) => statSync(join(EX_DIR, d)).isDirectory());
if (slugs.length === 0) {
  console.error("No exhibits found — the museum needs at least one exhibit.");
  process.exit(1);
}

console.log(`Validating ${slugs.length} exhibit(s)...`);

for (const slug of slugs) {
  const file = join(EX_DIR, slug, "exhibit.json");
  if (!existsSync(file)) {
    fail(slug, "missing exhibit.json");
    continue;
  }

  let ex;
  try {
    ex = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(slug, `invalid JSON: ${e.message}`);
    continue;
  }

  for (const field of REQUIRED) {
    if (ex[field] === undefined) fail(slug, `missing required field: ${field}`);
  }
  if (ex.hall && !HALLS.has(ex.hall)) fail(slug, `unknown hall: ${ex.hall}`);
  if (ex.badge && !BADGES.has(ex.badge)) fail(slug, `unknown badge: ${ex.badge}`);

  if (!Array.isArray(ex.sources) || ex.sources.length === 0) {
    fail(slug, "at least one source is required");
  } else {
    ex.sources.forEach((s, i) => {
      if (!s || typeof s.url !== "string" || typeof s.date !== "string") {
        fail(slug, `source[${i}] must have a url and a date`);
      }
    });
  }

  if (ex.trace && ex.trace.traceVersion !== "1.0") {
    fail(slug, "trace.traceVersion must be '1.0'");
  }

  // A published exhibit may not carry unverified sources.
  if (ex.status === "published" && Array.isArray(ex.sources)) {
    if (ex.sources.some((s) => s && s.verified === false)) {
      fail(slug, "published exhibit still has unverified sources");
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} problem(s) found. Fix them before shipping.`);
  process.exit(1);
}
console.log("All exhibits valid ✔");
