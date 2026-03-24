# Moon Design Archive

This folder is the canonical design space for the card game project.

The original `.docx` sources have been harvested into `server/src/data/moon-cards.generated.ts`, and the remaining prose notes were converted to markdown.

## Canonical Structure

- `cards/characters/` - merged character cards, one canonical copy per card
- `cards/common/` - common cards: event, action, trick, item, and general cards
- `cards/spells/` - elemental spell cards
- `cards/support/` - auxiliary cards and status pieces
- `lore/setting/` - setting and world notes
- `rules/` - the main system and rule notes
- `rules/battle-rules.md` - combat quick reference for the battle UI
- `drafts/` - loose ideas and temporary design drafts
- `archive/0.1/` - older draft material from the 0.1 line
- `archive/needs-repair/` - empty or corrupted documents that still need recovery

## Merge Policy

- If the same card appears in multiple versions, keep the newest canonical copy here.
- Older duplicates are removed from the active tree instead of being kept side by side.
- Zero-length docs are treated as repair items, not active cards.
