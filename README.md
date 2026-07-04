# Silent Failure Museum 🏛️

**A museum of AI agents failing quietly.** Walk the halls. Read the plaques. Each exhibit is a real, sourced agent failure — replayable step-by-step, paired with *what would have caught it*. Then go check on your own agent.

> Nobody feels the silent-failure problem from statistics. They feel it watching an agent confidently drop a production database in nine seconds. This makes the problem visceral, browsable, and shareable — and points every exhibit at the tooling that would have caught it.

---

## Status: `M0` — content pipeline + validator

This repo currently ships the **exhibit content model and the validator that gates it** — the part that guarantees credibility. The Astro gallery, the embedded trace player, and the full 10-exhibit collection land in later milestones (see [`SPEC.md`](./SPEC.md)).

What's here:
- `schema/exhibit.schema.json` — the exhibit contract.
- `exhibits/*/exhibit.json` — one **draft** exhibit ("Nine Seconds to Irreversible") using **Trace Schema v1**.
- `scripts/validate-exhibits.mjs` — a dependency-free CI gate: **no exhibit ships without sources.**

## Quickstart

```bash
node scripts/validate-exhibits.mjs
# → Validating 1 exhibit(s)...
#   All exhibits valid ✔
```

(`npm test` runs the same validator.)

## The credibility rules (enforced or documented)

1. **Sourced or labeled.** Every exhibit cites dated sources. Reconstructions are badged `reconstruction`; class-representative pieces are `composite`. The validator fails any exhibit with zero sources, and blocks a `published` exhibit that still has `verified: false` sources.
2. **Replayable.** Each exhibit carries a Trace Schema v1 reconstruction that the (upcoming) trace player steps through, with the failure moment flagged.
3. **"What would have caught it."** Every exhibit maps to a verifier/guardrail class (e.g. `guardrail:blast-radius`, `V2_swallowed_error`).

> ⚠️ The bundled exhibit is a **draft** with placeholder sources (`REPLACE-WITH-VERIFIED-SOURCE`). That's deliberate: real citations get verified at authoring time, not invented. Fill and verify sources, flip `status` to `published`, and the validator will hold you to it.

## Halls

`destruction` · `silent-wrong-output` · `supply-chain` · `delivery` · `annex`

## License

MIT (code) / CC BY 4.0 (exhibit text). See [`LICENSE`](./LICENSE). Part of the **Agent Trust Suite**; consumes the trace format from [Blackbox](https://github.com/Kaushik-hub306/blackbox).
