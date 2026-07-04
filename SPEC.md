# SPEC — Silent Failure Museum

**An interactive gallery of real, documented AI-agent disasters — each one replayable, sourced, and paired with "what would have caught it."**
Repo: `silent-failure-museum` · License: MIT (code) / CC BY 4.0 (exhibit text) · Track: Portfolio + Blackbox launch engine · Target: 2–3 weeks

---

## 0. Mission & Positioning

Nobody *feels* the silent-failure problem from statistics. They feel it watching an agent confidently wipe a production database in 9 seconds. The Museum makes agent failure visceral, browsable, and shareable — and every exhibit ends by pointing at the class of tooling that would have caught it (→ Blackbox).

Positioning: **"A museum of AI agents failing quietly. Walk the halls. Read the plaques. Then go check on your own agent."**

**Principles:**
1. **Sourced or labeled.** Every exhibit cites public sources (dated links). Reconstructed traces are clearly badged "Reconstruction." Never fabricate details; never dunk on individuals — anonymize people, name only what's already public.
2. **Replayable.** Each exhibit embeds a step-through trace (Trace Schema v1 + `@agenttrust/trace-player`) — the moment of silent failure highlighted in red.
3. **Beautiful.** This is a portfolio piece. Museum-grade design: dark gallery walls, plaque typography, exhibit numbers. It should feel like an actual museum, not a blog.

## 1. Scope

### P0
- 10 exhibits (below), each: title, era/date, story (300–500 words, sourced), replayable reconstructed trace, "What would have caught it" panel (maps to verifier classes V1–V5 + guardrail classes), lesson plaque, source list.
- Gallery index: "halls" grouped by failure class (Destruction Hall · Silent Wrong-Output Hall · Supply Chain Hall · Delivery Hall).
- Trace player integration (step-through timeline, scrubber, annotation callouts, the failure moment flagged).
- Submission flow: "Donate an exhibit" → GitHub issue template requiring sources + verification checklist.
- OG cards per exhibit (auto-generated), RSS feed, sitemap. Corrections policy page.

### P1
- Visitor-submitted "near miss" wall (moderated), embed widget for exhibits, yearly "state of agent failure" report.

### Out of scope
Accounts, comments, any backend beyond static hosting + forms.

## 2. Exhibit Content Plan (P0 — verify every one before publishing)

Drawn from the 2025–2026 documented incident record. **Build-time task: re-verify each against its public sources; drop any that can't be verified; the launch needs ≥8.**

1. **"Nine Seconds to Irreversible"** — coding agent deletes a production database during a routine task (the widely-documented Cursor/Railway-era incident writeups). Hall: Destruction.
2. **"The Sync That Emptied the Server"** — Windows server wipe via an agent "sync" misunderstanding. Hall: Destruction.
3. **"ClawHavoc"** — the ClawHub supply-chain attack: hundreds of malicious skills, credential-stealing payloads; Snyk's 47%-of-skills-flagged audit. Hall: Supply Chain.
4. **"The Plugin That Read Your Banking Cookies"** — documented malicious personal-agent plugin capturing session cookies. Hall: Supply Chain.
5. **"Confirmed. (It Wasn't.)"** — voice agents confirming bookings that silently failed at the webhook (documented Vapi/Retell agency reports). Hall: Silent Wrong-Output.
6. **"The Digest That Never Came"** — personal-agent scheduled tasks completing 'successfully' with no message ever delivered (OpenClaw issues #33815, #77520, #90822). Hall: Delivery.
7. **"The Wrong Restaurant"** — composite reconstruction of the classic silent wrong-output failure: task satisfied on paper, wrong in every detail. Badged Reconstruction/Composite. Hall: Silent Wrong-Output.
8. **"Agents Ate the Budget"** — the runaway-loop cost incidents behind 2026's enterprise clawbacks (KPMG ~50% scale-back; Uber's $1,500/mo caps as documented in FT). Hall: Silent Wrong-Output (economic).
9. **"The Allowlist That Wasn't"** — permission rules silently not enforced across platforms (documented Claude Code issues #64432, #55866). Hall: Destruction (near-miss class).
10. **"70% Wrappers"** — a meta-exhibit: the graveyard wall of 2024–26 product categories that died (SDR agents, wrapper apps), as market-level silent failure. Hall: special annex; tone = wry, sourced.

Each exhibit's trace is authored as a Trace Schema v1 JSON file in `exhibits/<slug>/trace.json` — reconstructed to match the documented sequence of events, badged appropriately.

## 3. Architecture

```
src/
  content/exhibits/<slug>/   # index.mdx (story, sources, panels) + trace.json + assets
  components/                # TracePlayer island, Plaque, HallNav, OGCard
  pages/                     # Astro routes: /, /hall/<hall>, /exhibit/<slug>, /about, /methodology, /donate
  styles/
scripts/
  validate-exhibits.ts       # schema + required-fields + source-link checker (CI gate)
  og-generate.ts             # satori/resvg OG card generation at build
```

- **Stack:** Astro (static output) + one React island (`@agenttrust/trace-player`). Tailwind for layout, custom CSS for the museum look. Deployed to Cloudflare Pages/Netlify. No backend.
- **Content pipeline is the product:** exhibits are MDX + trace.json validated in CI. A missing source link fails the build.
- **Design direction:** near-black walls (#0d0d0f), warm gallery spotlight gradients, serif exhibit titles (museum plaque register), small-caps metadata lines ("EXHIBIT 004 · SUPPLY CHAIN HALL · 2026"), red accent reserved exclusively for the failure moment. The trace player styled like a security console embedded in a plinth.

## 4. Milestones & Acceptance

### M0 — Scaffold (day 1)
Astro + Tailwind + CI (typecheck, lint, exhibit validator stub, build). `make golden` = full build + link check.
**Accept:** deploy pipeline live on a placeholder page.

### M1 — Trace player integration + exhibit model (days 2–4)
Wire `@agenttrust/trace-player` (or vendor the component if the package isn't published yet — record ADR), define exhibit frontmatter schema (title, hall, date, sources[], badge, verifier_mapping[]), build the validator.
**Accept:** one demo exhibit renders with working step-through replay; validator fails builds on missing source/badge; player keyboard-accessible (←/→ steps, space plays).

### M2 — Design system + 3 exhibits (days 5–8)
Full museum visual language: home (the "lobby" with hall doors), hall pages, exhibit template with plaque/story/player/"what would have caught it" panel. Write + verify exhibits 1, 3, 6.
**Accept:** Lighthouse ≥95 performance/accessibility on exhibit pages; all three exhibits fully sourced; OG cards generate; mobile layout excellent (players degrade to tap-through).

### M3 — Full collection (days 9–12)
Remaining exhibits written, traces authored, sources re-verified (drop unverifiable ones; minimum 8 total). Methodology + corrections-policy pages. RSS, sitemap, donate-an-exhibit issue template.
**Accept:** validator green across all exhibits; every "what would have caught it" panel links a named verifier class; zero fabricated specifics (self-audit checklist in `docs/verification-log.md` completed per exhibit).

### M4 — Launch (week 3)
Show HN: "A museum of AI agents failing silently." Cross-link Blackbox ("the flight recorder these incidents needed") once its repo is public. `launches/` folder: draft post, 6 screenshots, 60-second walkthrough video script.
**Accept:** live domain, analytics (privacy-friendly, e.g. Plausible), exhibit permalinks stable.

## 5. Quality Bar

- CI: build, link-checker (external links resolve), exhibit validator, Lighthouse budget.
- Accessibility: full keyboard nav, reduced-motion mode (player becomes stepper), alt text everywhere.
- Performance: static, <100KB JS on non-player pages; player island lazy-loaded.
- Editorial: every exhibit peer-read once (read-aloud pass) before publish; corrections policy honored within 48h.

## 6. Prompting Opus 4.8 for this repo

- "Exhibit content: draft from the sourced notes in `exhibits/<slug>/sources.md` only. If a detail isn't in a source, don't write it — flag it as a question in the draft instead."
- "Design: museum register, not dashboard register. Plaques, halls, exhibit numbers. Red appears only at failure moments."
- "The validator is law: no exhibit ships without sources[], badge, hall, and verifier_mapping."
