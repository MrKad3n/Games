# Magic Battle Menu Assets

This project now includes custom menu art in:

- `images/backgrounds/menu-bg.jpg`
- `images/backgrounds/sandbox-card.jpg`
- `images/backgrounds/inventory-card.jpg`
- `images/backgrounds/dungeons-card.jpg`
- `images/backgrounds/pvp-card.jpg`

`index.html` uses these for the page background and each menu option card.

## AI Image Prompts

Use these prompts in your image model (DALL·E, Midjourney, SDXL, Firefly, etc.) if you want to regenerate/upgrade the art.

### 1) Main Menu Background
**File target:** `images/backgrounds/menu-bg.png` (or `.webp`)

**Prompt:**
> A dark fantasy magic game menu background, wide cinematic landscape, moonlit night sky, distant layered mountains, subtle arcane energy streaks in the foreground, cool color palette (deep indigo, violet, midnight blue), atmospheric fog, high contrast but readable for UI overlays, no characters, no text, clean center composition for menu cards, polished game concept art style.

**Suggested settings:**
- Aspect ratio: `16:9`
- Resolution: `1920x1080` or higher

---

### 2) Sandbox Option Image
**File target:** `images/backgrounds/sandbox-card.png` (or `.webp`)

**Prompt:**
> Fantasy magic training grounds at night, floating runes, glowing practice pillars, spell circles and soft cyan particles, calm experimental vibe, teal and blue color palette, vertical composition designed for a game menu card, no text, no logo, no character faces, crisp concept-art style.

**Suggested settings:**
- Aspect ratio: `3:4` (or `4:5`)
- Resolution: `1024x1365` or higher

---

### 3) Inventory Option Image
**File target:** `images/backgrounds/inventory-card.png` (or `.webp`)

**Prompt:**
> Arcane vault interior with magical shelves, floating relics, potion vials, enchanted tomes, item grid feeling, purple and magenta highlights, mystical sparkles, dark fantasy UI-friendly background, vertical composition for menu card, no text, no logos, no watermark.

**Suggested settings:**
- Aspect ratio: `3:4` (or `4:5`)
- Resolution: `1024x1365` or higher

---

### 4) Dungeons Option Image
**File target:** `images/backgrounds/dungeons-card.png` (or `.webp`)

**Prompt:**
> Ancient dungeon entrance in a fantasy world, heavy stone gate, glowing torches, worn stairs leading into darkness, golden and amber light against dark shadows, dangerous adventure mood, vertical composition for game menu card, no text, no characters, high-detail concept art.

**Suggested settings:**
- Aspect ratio: `3:4` (or `4:5`)
- Resolution: `1024x1365` or higher

---

### 5) PvP Option Image
**File target:** `images/backgrounds/pvp-card.png` (or `.webp`)

**Prompt:**
> Intense magical duel arena, two opposing spell energies colliding in the center, red and crimson accents mixed with dark purples, sparks and shockwave effects, competitive high-energy atmosphere, vertical composition for game menu card, no text, no logos, clean focal center.

**Suggested settings:**
- Aspect ratio: `3:4` (or `4:5`)
- Resolution: `1024x1365` or higher

## Notes

- Current assets are JPG images in `images/backgrounds`.
- If you regenerate images in another format (`.png`/`.webp`), update the file references in `index.html` to match.
- Keep image file names the same base names to avoid changing CSS selectors.
