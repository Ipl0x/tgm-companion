# Reviewing Game Data

The goal of review is to preserve exact source data and make uncertainty visible. Community submissions are evidence, not automatic truth.

## Investment submissions

Check the structured fields against the evidence, including:

- Investment category
- Investment name
- Investment level
- Original/base investment time
- Cash
- Arms
- Cargo
- Metal
- Diamonds
- Oil
- Crypto Coins
- Family Currency
- Family Insignia
- Gold
- Influence
- Investment prerequisites
- Screenshot or other evidence

### Original Time

Investment submissions must use the original/base game time. Do not accept a player-specific reduced timer caused by Investment Buff, VIP, Family Help, or another personal speed modifier as the source value.

### Prerequisites

Only record prerequisites that are actually supported by the source. Do not infer an intermediate prerequisite just because it looks logical.

### Zero vs Unknown

These have different meanings:

- `0` = the source confirms that the required value is zero.
- `Unknown` = the value was not supplied, is unreadable, or is not sufficiently verified.

Never convert missing information into zero.

## Star-Up submissions

Check that the building/target is clear and that submitted costs or requirements match the screenshot/source. Preserve the original game ordering and exact values when integrating maintained data.

## Wiki tip / correction submissions

Separate factual corrections from strategy advice.

A factual correction should be supported by evidence where practical. A strategy tip can be useful without being the only correct playstyle, but it should not be presented as verified game data unless it actually is.

## Cross-checking multiple reports

Independent matching submissions strengthen confidence. Compare records field by field, not only by title or one resource value.

Example:

```text
Investment: Safeguard Boost
Level: 3

Report A → Cash: 1,500,000
Report B → Cash: 1,500,000
Report C → Cash: 1,500,000
```

Matching Cash values alone do not prove every other field. Continue checking time, other resources, Gold, Influence, and prerequisites.

## Conflicting evidence

When reports disagree:

1. Keep the issue at `status:cross-checking`.
2. Identify exactly which fields conflict.
3. Compare screenshots and item/level context.
4. Ask for clearer evidence when necessary.
5. Do not average or estimate conflicting values.

## Data completeness

An item should only be treated as complete when the required levels and fields have actually been collected and verified. Partial data should stay partial, and unknown fields should stay unknown.

This is especially important for under-construction categories where some levels can be source-backed while the overall category is still incomplete.
