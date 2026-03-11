# Magic Battle Menu Assets

This project now includes custom menu art in:

- `images/backgrounds/menu-bg.jpg`
- `images/backgrounds/sandbox-card.jpg`
- `images/backgrounds/inventory-card.jpg`
- `images/backgrounds/dungeons-card.jpg`
- `images/backgrounds/pvp-card.jpg`

`index.html` uses these for the page background and each menu option card.

## Spell Customization Reference

Spells are built in phases. Each phase can define:
- Shape
- Behavior
- One or more Effects (with category rules)
- Trigger for next phase
- Visual Trail / After-hit visual
- Numeric sliders (size/speed/power/count/etc.)

Some options are item-gated via `ITEM_GRANTS` and require the item equipped (staff, robe, relic1, or relic2). They can also be unlocked through vows (5 points per unlock).

### Shapes (17)

| Shape | Mana | Control | What it does | Item unlock |
|---|---:|---:|---|---|
| Missile | 5 | 0 | Small fast projectile. | — |
| Orb | 8 | 1 | Larger, slower energy projectile. | — |
| Blade | 7 | 2 | Slashing blade projectile. | Dragon Heart |
| Beam | 10 | 4 | Continuous beam. | — |
| Ring | 12 | 5 | Expanding circle blast. | Sun Medallion |
| Cone | 10 | 4 | Fan-shaped blast area. | Sun Medallion |
| Nova | 15 | 7 | Expanding explosion from origin. | — |
| Chain | 18 | 9 | Jumps between targets, can stun each hit. | Elder Staff |
| Wall | 12 | 6 | Creates stationary barrier wall. | Celestial Robe |
| Platform (solidify) | 10 | 4 | Creates solid platform (no damage). | — |
| Spike | 8 | 3 | Pointed, facing projectile with pierce-like feel. | Crystal Crown |
| Polygon | 9 | 3 | Custom polygon projectile (sides customizable). | Crystal Crown |
| Ally Orb | 6 | 1 | Orb targets you/allies instead of enemies. | — |
| Summon | 20 | 8 | Summons minions; minions fire next spell phase. | — |
| Meteor | 16 | 6 | Distance-scaled comet with splash explosion. | Stardust Staff |
| Vortex | 18 | 7 | Pulling void projectile with DoT. | Void Staff |
| Same | 0 | 0 | Reuses previous phase shape with new behavior/effects. | — |

### Behaviors (16)

| Behavior | Mana | Control | What it does | Item unlock |
|---|---:|---:|---|---|
| Straight | 0 | 0 | Travels in a straight line. | — |
| Lob / Arc | 2 | 1 | Arcing ballistic path. | — |
| Homing | 5 | 3 | Tracks nearest target. | — |
| Boomerang | 4 | 3 | Returns after traveling out. | Chaos Orb |
| Ground Surge | 5 | 4 | Travels along terrain/ground line. | World Seed |
| Orbit Caster | 8 | 6 | Orbits player before launching. | — |
| Spiral | 6 | 5 | Spirals outward motion. | Moon Pendant |
| Rain Down | 8 | 7 | Drops projectiles from above over an area. | — |
| Barrage | 8 | 7 | Fires a horizontal wall of projectiles. | — |
| Stationary | 0 | 0 | Spawns and stays fixed. | — |
| Underfoot | 3 | 2 | Spawns directly beneath player. | — |
| Self Cast | 2 | 1 | Spawns at caster position. | — |
| Around Self | 5 | 3 | Spawns around player in a circle (`aroundSelfCount`). | — |
| Ground | 4 | 3 | Erupts from ground near enemies (`groundRadius`). | — |
| Zigzag | 5 | 4 | Oscillating sine-wave path. | Moon Pendant |
| Teleport | 7 | 6 | Projectile blinks forward intermittently. | Celestial Robe |

### Effects (29)

Category rules:
- `elemental` = exclusive (one per phase)
- `movement` = exclusive (one per phase)
- `cc`, `support`, `buff`, `utility`, `store` = non-exclusive

| Effect | Cat. | Mana | Control | What it does | Item unlock |
|---|---|---:|---:|---|---|
| Burn | elemental | 5 | 2 | Applies fire DoT. | — |
| Freeze | elemental | 5 | 2 | Slows targets. | — |
| Poison | elemental | 5 | 3 | Applies poison DoT. | — |
| Knockback | movement | 3 | 1 | Pushes target away. | — |
| Pull | movement | 4 | 3 | Pulls target toward caster/impact. | — |
| Force Jump | movement | 4 | 2 | Forces target upward. | — |
| Horizontal Launch | movement | 5 | 2 | Launches target sideways. | — |
| Stun | elemental | 7 | 5 | Briefly stuns target. | — |
| Heal Self | support | 6 | 4 | Heals caster on hit. | Phoenix Feather |
| Shield | support | 6 | 4 | Grants temporary defence boost. | — |
| Lifesteal | support | 8 | 6 | Converts hit damage to caster health. | Blood Staff |
| Speed Boost | buff | 4 | 3 | Temporary movement speed buff on hit. | — |
| Jump Boost | buff | 4 | 3 | Temporary jump boost on hit. | — |
| Mana Regen | buff | 5 | 4 | Temporary mana regen increase. | — |
| Random Delay | utility | 2 | 1 | Adds random spawn delay to projectiles. | — |
| Phase Through | utility | 20 | 6 | Projectile passes through walls. | Void Robe |
| Timed Release | utility | 3 | 2 | Auto-triggers effects after delay. | — |
| Phase Fork | utility | 6 | 5 | Starts next phase without ending current phase. | Eye of Eternity |
| Reset Projectiles | utility | 0 | 0 | Next phase spawns fresh projectiles (no morph). | — |
| Damage Store | store | 4 | 2 | Stores % dealt damage for later use (`damageStorePercent`). | Phoenix Feather |
| Damage Release | store | 6 | 4 | Consumes stored damage for burst and size gain. | Phoenix Feather |
| Damage Heal | store | 5 | 3 | Ally Orb converts stored damage to healing. | Phoenix Feather |
| Dispel | utility | 8 | 4 | Deletes enemy projectiles/walls on contact. | — |
| Blind | cc | 6 | 5 | Reduces enemy detection/perception temporarily. | Shadow Robe |
| Shatter | elemental | 8 | 6 | On-kill fragment burst from target. | Dragon Heart |
| Leech Mana | support | 7 | 5 | Restores mana on hit. | Blood Staff |
| Mark | cc | 5 | 4 | Applies debuff increasing incoming damage to target. | Eye of Eternity |
| Gravity Well | movement | 10 | 7 | Creates pull zone around impact. | World Seed |
| Ricochet | utility | 18 | 6 | Bounces off walls repeatedly. | Chaos Orb |

### Triggers, trails, visuals

**Phase Triggers**
- `onHit`: next phase starts when current phase hits.
- `afterDelay`: next phase starts after phase duration.
- `onExpire`: next phase starts when projectile/effect expires.

**Trails**
- `none`, `sparkle`, `smoke`, `flame`, `ice`, `lightning`

**After-hit visuals**
- `none`, `explosion`, `flame_burst`, `ice_shatter`, `electric_spark`, `poison_cloud`, `star_burst`

### Sliders / tunable properties

Per phase (depending on shape/behavior/effects used):
- `width`, `height`, `speed`, `duration`, `power`, `count`, `spread`, `color`
- Orbit behavior: `orbitRadius`, `orbitSpeed`, `orbitDuration`
- Around-self behavior: `aroundSelfCount`
- Ground behavior: `groundRadius`
- Store effects: `damageStorePercent`
- Effect tuning: `effectPower`, `effectDuration`

### Item grant quick map (`ITEM_GRANTS`)

- **Stardust Staff**: `meteor`
- **Void Staff**: `vortex`
- **Blood Staff**: `lifesteal`, `leechMana`
- **Elder Staff**: `chain`
- **Shadow Robe**: `blind`
- **Void Robe**: `phaseThrough`
- **Celestial Robe**: `teleport`, `wall`
- **Chaos Orb**: `ricochet`, `boomerang`
- **Sun Medallion**: `cone`, `ring`
- **Moon Pendant**: `spiral`, `zigzag`
- **Crystal Crown**: `polygon`, `spike`
- **Phoenix Feather**: `healSelf`, `damageHeal`, `damageStore`, `damageRelease`
- **Dragon Heart**: `blade`, `shatter`
- **World Seed**: `gravityWell`, `groundSurge`
- **Eye of Eternity**: `phaseFork`, `mark`

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

---

### 6) Raid Bosses Option Image
**File target:** `images/backgrounds/raids-card.png` (or `.webp`)

**Prompt:**
> Ominous throne room of a powerful sorcerer boss, massive dark chamber with cracked marble floor, swirling purple and violet chaos energy radiating from a central elevated platform, floating arcane runes and shattered mask fragments orbiting in the air, dramatic spotlight from above, menacing atmosphere with deep purple, magenta and black color palette, vertical composition for game menu card, no text, no logos, no character faces, epic dark fantasy concept art style.

**Suggested settings:**
- Aspect ratio: `3:4` (or `4:5`)
- Resolution: `1024x1365` or higher

---

## Enemy Sprite Sheet Prompts

Each prompt below is designed to generate a **horizontal sprite sheet** with 4 animation rows: **Idle** (top), **Walking** (second), **Attack** (third), **Defeat/Death** (bottom). Each row should contain 4–6 evenly spaced frames. Use a **transparent or solid‑color background** so frames are easy to cut. Target each sheet at roughly **512×512 px** for regular enemies and **1024×1024 px** for bosses unless noted otherwise.

---

### FIRE DUNGEON ENEMIES

#### 1) Imp
**File target:** `images/enemies/imp-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: small demonic fire Imp creature, about 24×28 pixel logical size, dark crimson red skin with glowing orange-red highlights, bat-like wings on its back, two small curved horns, glowing yellow eyes, thin pointed tail. Cute but mischievous dark fantasy enemy.
>
> Row 1 – Idle animation: hovering in place, wings gently flapping, slight vertical bobbing motion.
>
> Row 2 – Fly/Move animation: flying forward with stronger wing beats, body leaning slightly forward.
>
> Row 3 – Attack animation: lunges forward while swinging a small glowing red energy sword, wings spread wide with aggressive motion.
>
> Row 4 – Defeat animation: wings collapse, body tumbles downward and burns away into glowing embers.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 2) Flame Serpent
**File target:** `images/enemies/flame-serpent-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Flame Serpent, long sinusoidal snake-like fire creature, about 44×20 pixel logical size, deep burnt-orange segmented body with bright orange-yellow underbelly, forked red tongue, single glowing red eye, no limbs. Dangerous slithering dark fantasy enemy.
>
> Row 1 – Idle animation: body coiled slightly in a gentle S-curve, tongue flicking in and out.
>
> Row 2 – Slither/Move animation: slithering forward with pronounced wave motion, segments rippling along the body.
>
> Row 3 – Attack animation: rears up with mouth wide open breathing a cone of fire, body coiled tightly for a lunge strike.
>
> Row 4 – Defeat animation: body goes limp, segments break apart into flickering fire fragments, dissolves into ash.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 3) Ember Mage
**File target:** `images/enemies/ember-mage-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Ember Mage, humanoid fire sorcerer, about 26×44 pixel logical size, dark brown hooded robe with burnt-orange trim, glowing orange eyes under the hood, carries a wooden staff with a flaming orange orb at the tip, robe flares out at the bottom. Mysterious dark fantasy caster enemy.
>
> Row 1 – Idle animation: standing with staff, robe swaying slightly, staff orb pulsing with gentle flame.
>
> Row 2 – Walk animation: walking forward with robe flowing, staff held at side.
>
> Row 3 – Attack animation: raises staff overhead, conjures a fireball above the staff tip, fires it forward with a burst of flame particles.
>
> Row 4 – Defeat animation: staggers, staff drops, robe catches fire and the mage collapses into embers and smoke.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 4) Magma Golem
**File target:** `images/enemies/magma-golem-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Magma Golem, large heavy rock creature with lava cracks, about 40×56 pixel logical size, dark brown-gray rocky body, broad shoulders, thick arms and legs, glowing orange-red lava cracks running through the torso and joints, bright orange-red eyes, no neck — head merges into shoulders. Intimidating heavy dark fantasy enemy.
>
> Row 1 – Idle animation: standing imposingly with fists clenched, lava veins pulsing with light.
>
> Row 2 – Walk animation: slow heavy stomping walk, arms swinging, ground dust particles at feet.
>
> Row 3 – Attack animation: raises both fists overhead and slams the ground, shockwave cracks and lava splashes erupt from the impact point.
>
> Row 4 – Defeat animation: lava cracks dim, chunks of rock break off and crumble to the ground, body collapses into a pile of cooling stone.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 5) Fire Sprite
**File target:** `images/enemies/fire-sprite-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Fire Sprite, tiny floating ball of living flame, about 16×16 pixel logical size, bright orange-yellow core with a white-hot center, outer flame aura that pulses and flickers, no distinct limbs or facial features except two tiny bright eyes, trailing fire particles. Small magical dark fantasy enemy.
>
> Row 1 – Idle animation: hovering with gentle pulsing flame aura, slight up-down bobbing.
>
> Row 2 – Fly/Move animation: darting quickly forward, flame trail stretching behind, core elongates in direction of travel.
>
> Row 3 – Attack animation: flares up intensely to double size, shoots a small flame bolt forward with a bright flash.
>
> Row 4 – Defeat animation: flame sputters, shrinks rapidly, winks out with a puff of smoke and scattered sparks.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### FIRE DUNGEON BOSS

#### 6) Ignaroth, The Inferno Dragon
**File target:** `images/enemies/fire-dragon-sheet.png`  
**Sheet size:** `2048×2048 px` (large boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Ignaroth, The Inferno Dragon — massive fire-breathing dragon boss, about 320×240 pixel logical size. Deep crimson-red scaled body with an orange-red belly covered in horizontal scale lines, enormous bat-like dark-red wings with visible membrane vein details, long muscular neck leading to a fierce horned head with two pairs of curved dark-brown horns (large outer pair, smaller inner pair), glowing orange-yellow slit-pupil eyes with fiery glow aura, wide jaw with rows of pale-yellow teeth, nostrils with wisps of fire, thick spiked tail ending in a large pointed tail blade with bony spines along the tail, four powerful clawed legs, bony spines running down the neck. Epic dark fantasy dungeon boss.
>
> Row 1 – Idle animation: wings half-spread, body breathing with slight rise and fall, tail gently swaying, fire wisps drifting from nostrils.
>
> Row 2 – Fly/Move animation: powerful wing beats, body lunging forward, legs tucked underneath.
>
> Row 3 – Attack animation: rears head back then unleashes a massive cone of fire breath, wings fully spread, tail raised aggressively.
>
> Row 4 – Defeat animation: wings crumple, body crashes to the ground, scales crack and glow with escaping lava light, fades to embers.
>
> Style: clean digital pixel-art sprite sheet, epic dark fantasy boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### ICE DUNGEON ENEMIES

#### 7) Frost Wraith
**File target:** `images/enemies/frost-wraith-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Frost Wraith, ghostly floating ice spirit, about 28×40 pixel logical size, semi-transparent steel-blue body that fades and wavers at the bottom edge like tattered ghostly robes, no legs — lower body dissolves into a ragged wispy tail, pale blue-white glowing eyes, no mouth visible, body slightly luminous. Eerie spectral dark fantasy enemy.
>
> Row 1 – Idle animation: floating in place, body wavering and rippling like cloth in wind, slight vertical bobbing.
>
> Row 2 – Float/Move animation: gliding forward smoothly, ghostly trail behind, body tilting forward.
>
> Row 3 – Attack animation: surges forward with a burst of icy energy from hands, frost nova expanding outward, eyes flare brighter.
>
> Row 4 – Defeat animation: body distorts and scatters into ice crystals and mist, fading from top to bottom.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 8) Ice Archer
**File target:** `images/enemies/ice-archer-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Ice Archer, humanoid frost ranger, about 24×42 pixel logical size, dark steel-blue armor and clothing, lighter blue-gray secondary color, icy blue glowing eyes, holds a curved frost bow in one hand, lean build, hooded. Skilled ranged dark fantasy enemy.
>
> Row 1 – Idle animation: standing with bow at rest, slight breathing animation, frost particles drifting near bow.
>
> Row 2 – Walk animation: walking forward cautiously, bow held at side.
>
> Row 3 – Attack animation: draws bow back with a glowing ice-blue arrow forming, then releases it forward with a frost trail.
>
> Row 4 – Defeat animation: drops bow, staggers back, freezes solid into an ice statue, then shatters into ice fragments.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 9) Snow Beast
**File target:** `images/enemies/snow-beast-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Snow Beast, large hulking yeti-like ice creature, about 44×48 pixel logical size, pale gray-blue shaggy fur body, lighter blue-white fur accents, broad chest, thick powerful arms that hang past the knees, small dark steel-blue eyes, large white fangs protruding from lower jaw, no visible neck, hunched posture. Brutish heavy dark fantasy enemy.
>
> Row 1 – Idle animation: standing with fists clenched, fur rustling, heavy breathing with visible frost breath vapor.
>
> Row 2 – Walk animation: lumbering forward with heavy arm-swinging gait.
>
> Row 3 – Attack animation: rears up and slams both fists down creating an ice shockwave, frost breath vapor blasting from mouth.
>
> Row 4 – Defeat animation: collapses forward onto knees, fur frosts over completely turning white, then crumbles into snow.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 10) Cryo Mage
**File target:** `images/enemies/cryo-mage-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Cryo Mage, humanoid ice sorcerer, about 26×44 pixel logical size, dark navy-blue hooded robe, medium blue trim, glowing icy-blue eyes under the hood, carries a dark gray staff topped with a glowing icy-blue crystal orb, robe flares at the bottom. Mysterious frost caster dark fantasy enemy.
>
> Row 1 – Idle animation: standing with staff, robe gently swaying, staff crystal pulsing with cold blue light.
>
> Row 2 – Walk animation: walking forward with robes flowing, staff held at side.
>
> Row 3 – Attack animation: raises staff, conjures an icicle barrage from the crystal tip, blue energy streaks forward.
>
> Row 4 – Defeat animation: staff shatters, robe frosts over and the mage freezes solid, then cracks and breaks apart.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 11) Glacier Sentinel
**File target:** `images/enemies/glacier-sentinel-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Glacier Sentinel, large armored ice golem guardian, about 42×54 pixel logical size, dark steel-blue rocky/icy body, lighter blue-gray highlights, translucent blue ice vein cracks glowing on the torso, broad flat shoulders, thick rectangular arms and blocky legs, small pale blue-cyan glowing eyes, heavy angular design. Imposing tanky dark fantasy enemy.
>
> Row 1 – Idle animation: standing guard, arms at sides, ice veins pulsing softly.
>
> Row 2 – Walk animation: slow deliberate stomping, arms slightly swinging, ice particles falling from joints.
>
> Row 3 – Attack animation: raises one foot and stomps the ground creating ice spikes erupting from the floor.
>
> Row 4 – Defeat animation: ice veins stop glowing, body cracks along the vein lines and crumbles into ice chunks and frost mist.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### ICE DUNGEON BOSS

#### 12) Kryonax, The Frozen Colossus
**File target:** `images/enemies/frost-colossus-sheet.png`  
**Sheet size:** `2048×2048 px` (large boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Kryonax, The Frozen Colossus — massive crystalline ice titan boss, about 360×280 pixel logical size. Dark navy-blue angular crystalline body, torso is a faceted hexagonal ice shape with glowing icy-blue vein lines running vertically, bright diamond-shaped ice core crystal embedded in the chest glowing intense cyan-blue, massive angular shoulder crystals (double-layered ice shards jutting upward on each shoulder), long powerful arms ending in three ice-claw fingers, angular crystalline head with a pointed crown shape and a glowing blue face plate with two bright cyan slit eyes and a V-shaped visor, lower body dissolves into swirling ice mist rather than distinct legs, floating above the ground. Epic dark fantasy dungeon boss.
>
> Row 1 – Idle animation: hovering with ice mist swirling below, body gently rising and falling, shoulder crystals refracting light, chest core pulsing.
>
> Row 2 – Float/Move animation: glides forward, ice mist trailing, arms slightly raised.
>
> Row 3 – Attack animation: raises both arms overhead, chest core blazes bright, slams down creating a massive ice shockwave and icicle eruption.
>
> Row 4 – Defeat animation: crystals crack, chest core shatters with a flash, body fragments into hundreds of ice shards scattering outward, ice mist dissipates.
>
> Style: clean digital pixel-art sprite sheet, epic dark fantasy boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### EARTH DUNGEON ENEMIES

#### 13) Rock Golem
**File target:** `images/enemies/rock-golem-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Rock Golem, large humanoid stone creature, about 40×52 pixel logical size, dark brown-tan rocky body with lighter brown-yellow highlights, broad flat shoulders, thick arms and blocky legs, faint tan-yellow stone vein cracks on the torso, dull yellow-tan glowing eyes, rough hewn texture, no neck — head sits directly on shoulders. Heavy tanky dark fantasy enemy.
>
> Row 1 – Idle animation: standing with fists clenched, idle motion, dust particles at feet.
>
> Row 2 – Walk animation: heavy stomping walk, arms swinging, gravel shaking loose at each step.
>
> Row 3 – Attack animation: hurls a large boulder with one arm, or raises fists and slams the ground with a crack.
>
> Row 4 – Defeat animation: stone veins darken, body crumbles from top to bottom into a pile of rocks and dust.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 14) Vine Crawler
**File target:** `images/enemies/vine-crawler-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Vine Crawler, low serpentine plant creature, about 36×24 pixel logical size, dark green segmented body that undulates like a caterpillar, brighter green head with a single bright lime-green eye, small leaf-like crest on top of the body, no visible limbs — moves by rippling its vine-body along the ground. Creepy crawling dark fantasy enemy.
>
> Row 1 – Idle animation: body gently waving in an S-shape, leaf crest rustling.
>
> Row 2 – Crawl/Move animation: slithering forward with pronounced segments, rippling wave motion.
>
> Row 3 – Attack animation: rears up front half of body and lashes out with a whip-like vine strike.
>
> Row 4 – Defeat animation: body goes limp, leaves wilt and turn brown, shrivels up and crumbles into dried plant matter.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 15) Cave Spider
**File target:** `images/enemies/cave-spider-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Cave Spider, compact arachnid creature, about 30×20 pixel logical size, dark brown elliptical body with lighter gray-brown head segment, four pairs of red eyes arranged in a cluster on the head, eight thin dark-brown legs splayed outward, fangs visible at the front. Fast creepy dark fantasy enemy.
>
> Row 1 – Idle animation: crouched with legs twitching, body bobbing slightly, eyes gleaming.
>
> Row 2 – Walk animation: skittering quickly with rapid leg movements, body low to the ground.
>
> Row 3 – Attack animation: lunges forward with fangs extended for a bite, or shoots a glob of web from its spinnerets.
>
> Row 4 – Defeat animation: legs curl inward under the body, flips onto its back, twitches, and goes still.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 16) Crystal Mage
**File target:** `images/enemies/crystal-mage-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Crystal Mage, humanoid gem-wielding sorcerer, about 26×44 pixel logical size, dark purple hooded robe, lighter purple-violet trim, glowing pinkish-purple eyes under the hood, carries a dark purple staff topped with a diamond-shaped glowing purple crystal, robe flares at the bottom. Arcane caster dark fantasy enemy.
>
> Row 1 – Idle animation: standing with staff, crystal shimmering with purple light, robe swaying gently.
>
> Row 2 – Walk animation: walking forward, robes flowing, staff held at side.
>
> Row 3 – Attack animation: raises staff, the crystal flares and shoots a spread of glowing crystal shards forward.
>
> Row 4 – Defeat animation: crystal on staff explodes, robe tears, mage petrifies into a purple crystal statue and then shatters.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### 17) Mud Elemental
**File target:** `images/enemies/mud-elemental-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Mud Elemental, amorphous blob-like earth creature, about 36×44 pixel logical size, dark brown blobby body with smooth rounded shape (no hard edges), lighter tan-brown dripping highlights, two dull yellow-tan eyes near the top, no mouth, small mud drips constantly falling from the bottom of the body, body bulges and shifts shape slightly. Oozing amorphous dark fantasy enemy.
>
> Row 1 – Idle animation: wobbling in place, mud drips sliding down, body subtly pulsing.
>
> Row 2 – Walk animation: oozing forward, body stretching in direction of travel then contracting, leaving a mud trail.
>
> Row 3 – Attack animation: forms a pseudopod arm and hurls a mud ball, or expands outward in a quicksand-like wave.
>
> Row 4 – Defeat animation: body loses cohesion, flattens into a puddle of mud, drips stop, eyes sink and disappear.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### EARTH DUNGEON BOSS

#### 18) Terravox, The Stone Titan
**File target:** `images/enemies/earth-colossus-sheet.png`  
**Sheet size:** `2048×2048 px` (large boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Terravox, The Stone Titan — colossal earth golem boss, about 400×320 pixel logical size. Dark earthy-brown body made of layered stone slabs and boulders, lighter tan-gold stone highlights and accent lines, massive broad shoulders and trunk-like arms that reach the ground, thick pillar legs, relatively small angular head with glowing amber-yellow eyes set deep in a stone brow, no visible mouth — just a carved stone face plate, glowing golden-orange energy veins visible in the joints and cracks of the stone body, mossy patches on shoulders and back, stalactite-like stone spikes protruding from shoulders and spine. Epic dark fantasy dungeon boss.
>
> Row 1 – Idle animation: standing imposingly, ground trembling with dust at feet, amber veins pulsing slowly.
>
> Row 2 – Walk animation: thunderous stomping forward, arms swaying like pendulums, boulders and pebbles shaking loose.
>
> Row 3 – Attack animation: raises both massive fists and smashes the ground, causing stone pillars and stalagmites to erupt from the floor, shockwave cracks radiating outward.
>
> Row 4 – Defeat animation: amber veins go dark, cracks spread across entire body, stone slabs separate and collapse into a massive rubble pile with a cloud of dust.
>
> Style: clean digital pixel-art sprite sheet, epic dark fantasy boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### RAID BOSS

#### 19) The Manipulator
**File target:** `images/enemies/manipulator-sheet.png`  
**Sheet size:** `2048×2048 px` (large boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: The Manipulator — sinister floating sorcerer raid boss, about 180×260 pixel logical size. Wears a long flowing dark-purple/near-black robe that obscures the lower body entirely (no visible legs — the robe tapers to a ragged floating point), inner robe glows faintly with dark purple magical energy, long spindly dark-purple arms extending from the robe with glowing bright-purple/magenta energy orbs for hands, a smooth pale white porcelain mask for a face (oval shaped with thin sinister curved mouth line), glowing purple-violet eyes emitting light trails, dark hood/cowl over the head framing the mask, five arcane rune symbols orbiting slowly around the body at mid-height (lightning bolt, crystal ball, star, hexagon, diamond shapes), casts a faint shadow on the ground below while floating, menacing ethereal presence. Epic dark fantasy raid boss.
>
> Row 1 – Idle animation: floating with gentle vertical bobbing, arms slightly outstretched with hand-orbs pulsing, orbiting runes rotating slowly, robe swaying.
>
> Row 2 – Float/Move animation: gliding forward with slight forward tilt, robe trailing, rune orbit speeds up.
>
> Row 3 – Attack animation: arms thrust forward, hand-orbs blaze with energy, chaos orbs and purple projectile burst launching from hands, runes flash brightly.
>
> Row 4 – Defeat animation: mask cracks fully and shatters, robe unravels into dark energy wisps, body disintegrates from center outward into purple-magenta particles and fading rune fragments.
>
> Style: clean digital pixel-art sprite sheet, epic dark fantasy raid boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

## Player Sprite Sheet

#### 20) Player Character — Battle Mage
**File target:** `images/player/player-sheet.png`  
**Sheet size:** `768×512 px` (6 columns × 4 rows)

**Prompt:**
> Clean 2D sprite sheet for a video game player character.
> 6 columns and 4 rows (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Young battle mage adventurer, about 32×48 pixel logical size. Slim athletic build, wearing a deep blue-indigo wizard robe with subtle arcane silver trim and rune patterns along the hem and cuffs, a pointed wizard hat in matching dark navy-blue with a silver band, sturdy brown leather boots, tan/light skin visible on face and hands, bright white-blue glowing eyes, a wooden staff with a softly glowing blue crystal orb at the top held in the right hand, short windswept brown hair peeking under the hat, a determined confident expression. Clean readable proportions suitable for a side-scrolling 2D platformer.
>
> Row 1 – Idle animation: standing relaxed, staff held loosely at side, subtle crystal glow pulse, robe gently swaying, slight breathing motion.
>
> Row 2 – Run animation: dynamic running cycle, robe flowing behind, staff held forward, boots hitting ground, hair and hat bouncing slightly.
>
> Row 3 – Cast/Attack animation: plants feet, thrusts staff forward, crystal orb flares with bright blue-white magical energy, free hand extended with arcane circle appearing, magical particles bursting from the staff tip.
>
> Row 4 – Hurt/Death animation: staggers backward, hat tilting, staff lowering, magical energy dimming, final frame crumpled on ground with staff fallen beside, crystal orb dark.
>
> Style: clean digital sprite sheet, dark fantasy adventurer style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

**Suggested settings:**
- Aspect ratio: `3:2`
- Resolution: `768×512` or `1536×1024` (2x)

---

## Item & Ingredient Art Prompts

Use these prompts to generate individual item icons (square, transparent background) for the inventory system.

### Staves

#### Oak Staff
**File target:** `images/items/oak-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A simple rustic oak wood staff, slightly gnarled with a rounded knob at the top, warm brown tones, subtle wood grain texture, fantasy RPG item icon style.

#### Crystal Staff
**File target:** `images/items/crystal-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. An elegant staff with a large multifaceted glowing blue crystal head mounted on a polished silver shaft, arcane energy wisps around the crystal, fantasy RPG item icon style.

#### Storm Staff
**File target:** `images/items/storm-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A dark ironwood staff with crackling yellow-white lightning arcing between twin prongs at the top, stormy electric aura, fantasy RPG item icon style.

#### Blood Staff
**File target:** `images/items/blood-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A sinister crimson-red staff made of twisted dark bone, a pulsing blood-red gem at the top dripping with faint red energy, dark fantasy RPG item icon style.

#### Void Staff
**File target:** `images/items/void-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A sleek black obsidian staff with a swirling dark purple-black void orb at the top, faint purple energy tendrils, stars visible inside the orb, dark fantasy RPG item icon style.

#### Elder Staff
**File target:** `images/items/elder-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. An ancient living wood staff covered in glowing golden runes, a radiant warm-white crystal bloom at the top, tiny leaves and vines growing along the shaft, legendary fantasy RPG item icon style.

#### Stardust Staff
**File target:** `images/items/stardust-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A magnificent celestial staff made of crystallized starlight, shimmering with rainbow iridescence, a brilliant white-gold star at the top radiating cosmic sparkles, legendary fantasy RPG item icon style.

#### Bone Staff
**File target:** `images/items/bone-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A staff carved from a large yellowed animal bone, a small skull at the top with faintly glowing green eye sockets, wrapped in leather strips, dark fantasy RPG item icon style.

#### Prism Staff
**File target:** `images/items/prism-staff.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A polished white-silver staff with a triangular prism crystal at the top splitting light into a rainbow spectrum, clean geometric design, fantasy RPG item icon style.

### Robes

#### Linen Robe
**File target:** `images/items/linen-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A simple off-white linen robe with a rope belt, basic apprentice wizard clothing, plain and unadorned, fantasy RPG item icon style.

#### Silk Robe
**File target:** `images/items/silk-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A flowing violet silk robe with faint silver embroidery along the edges, elegant and lightweight, subtle magical shimmer, fantasy RPG item icon style.

#### Arcane Vestment
**File target:** `images/items/arcane-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A deep purple robe with glowing blue arcane runes sewn into the fabric, a golden clasp at the collar, protective magical aura, fantasy RPG item icon style.

#### Shadowweave Robe
**File target:** `images/items/shadow-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A black robe that seems to absorb all light, edges dissolving into shadow wisps, faint dark purple inner glow, sinister and powerful, dark fantasy RPG item icon style.

#### Ember Robe
**File target:** `images/items/ember-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A dark red-orange robe with glowing ember-like particles along the hem, smoldering edges that never burn, warm firelight glow, fantasy RPG item icon style.

#### Void Robe
**File target:** `images/items/void-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A robe woven from pure darkness, with tiny stars and nebula visible in the fabric, deep purple-black with cosmic particle effects, epic fantasy RPG item icon style.

#### Celestial Robe
**File target:** `images/items/celestial-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A magnificent white-gold robe threaded with literal starlight, constellation patterns glowing across the fabric, radiant golden trim, divine and legendary, fantasy RPG item icon style.

#### Hunter's Cloak
**File target:** `images/items/hunter-cloak.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A forest green hooded cloak with brown leather shoulder pads, utility pouches, lightweight and agile design, ranger-style fantasy RPG item icon style.

#### Tide Robe
**File target:** `images/items/tide-robe.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A flowing aqua-blue robe that ripples like living water, with seafoam white trim and tiny bubble particles, ocean-themed fantasy RPG item icon style.

### Relics

#### Mana Gem
**File target:** `images/items/mana-gem.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A large faceted brilliant blue gem glowing with inner mana energy, soft blue light radiating outward, hovering slightly, fantasy RPG item icon style.

#### Ring of Embers
**File target:** `images/items/fire-ring.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A dark metal ring with a small embedded ruby that glows with orange-red fire, tiny flames licking around the band, warm and dangerous, fantasy RPG item icon style.

#### Frost Amulet
**File target:** `images/items/frost-amulet.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A silver chain necklace with a teardrop-shaped ice crystal pendant, frost particles emanating from it, cold blue glow, fantasy RPG item icon style.

#### Chaos Orb
**File target:** `images/items/chaos-orb.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A swirling multicolored orb of chaotic magical energy, constantly shifting between purple, red, green, and blue, unstable crackling aura, fantasy RPG item icon style.

#### Phoenix Feather
**File target:** `images/items/phoenix-feather.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A magnificent golden-red feather with a fiery gradient from orange base to brilliant gold tip, glowing ember particles, legendary radiance, fantasy RPG item icon style.

#### Sun Medallion
**File target:** `images/items/sun-medallion.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A golden circular medallion with a stylized sun face in the center, radiating golden light beams, warm divine energy, fantasy RPG item icon style.

#### Moon Pendant
**File target:** `images/items/moon-pendant.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A silver crescent moon pendant on a thin chain, soft white-blue moonlight glow, tiny star sparkles around it, mystical and serene, fantasy RPG item icon style.

#### Dragon Heart
**File target:** `images/items/dragon-heart.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A massive crystallized dragon heart, dark red with inner fire glow pulsing like a heartbeat, scale-textured surface, veins of glowing orange magma, legendary fantasy RPG item icon style.

#### World Seed
**File target:** `images/items/world-seed.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small glowing green-gold seed with tiny roots and a sprout emerging, surrounded by orbiting particles of earth, water, fire, and air, cosmic creation energy, legendary fantasy RPG item icon style.

#### Thunder Tooth
**File target:** `images/items/thunder-tooth.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A large curved fang from a storm serpent, ivory-white with crackling yellow-blue lightning veins running through it, electric sparks at the tip, fantasy RPG item icon style.

#### Ghost Lantern
**File target:** `images/items/ghost-lantern.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small ornate paper lantern with a ghostly green-blue flame inside, wispy spirit faces visible in the light, eerie but beautiful, fantasy RPG item icon style.

#### Bloodstone
**File target:** `images/items/bloodstone.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A dark crimson gemstone with a polished surface, deep red inner glow pulsing rhythmically, dark veins running through it, ominous and powerful, fantasy RPG item icon style.

#### Wind Charm
**File target:** `images/items/wind-charm.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small jade green charm shaped like a leaf with swirling wind currents visible around it, light and airy with floating particles, fantasy RPG item icon style.

#### Eye of Eternity
**File target:** `images/items/eye-of-eternity.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A floating all-seeing eye made of crystallized time, iris shifts through all colors of the spectrum, golden sclera, cosmic knowledge radiating outward, legendary fantasy RPG item icon style.

#### Crystal Crown
**File target:** `images/items/crystal-crown.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. An ornate crown made of interlocking purple and clear crystals, magical refracted light, regal and powerful, fit for an archmage, fantasy RPG item icon style.

### Crafting Ingredients

#### Arcane Dust
**File target:** `images/items/arcane-dust.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small pile of shimmering iridescent magical dust, glittering with tiny sparkles of blue, purple, and gold, stored in a small glass vial, fantasy RPG item icon style.

#### Ember Shard
**File target:** `images/items/ember-shard.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A jagged angular shard of solidified fire, glowing orange-red with inner heat, small flames flickering from cracks, warm radiance, fantasy RPG item icon style.

#### Ice Crystal
**File target:** `images/items/ice-crystal.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A perfectly formed hexagonal ice crystal, brilliant translucent blue, frost particles radiating outward, never melting, cold blue glow, fantasy RPG item icon style.

#### Shadow Essence
**File target:** `images/items/shadow-essence.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small dark glass bottle containing swirling black-purple shadow energy, the darkness seems to move on its own, faint purple glow at the cork, fantasy RPG item icon style.

#### Dragon Scale
**File target:** `images/items/dragon-scale.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A large iridescent dragon scale, dark red-gold with a metallic sheen, nearly indestructible looking, reflects light like polished armor, fantasy RPG item icon style.

#### Starlight Dew
**File target:** `images/items/starlight-dew.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small crystal phial containing luminous silvery-white liquid that glows like captured starlight, tiny star particles floating inside, legendary and precious, fantasy RPG item icon style.

#### Mana Herb
**File target:** `images/items/mana-herb.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small bundle of glowing blue-green herbs tied with string, leaves shimmer with mana energy, soft cyan aura, fresh and magical, fantasy RPG item icon style.

#### Void Shard
**File target:** `images/items/void-shard.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A fragment of pure void, a small black crystalline shard that seems to absorb all surrounding light, faint purple anti-energy humming around edges, fantasy RPG item icon style.

#### Molten Core
**File target:** `images/items/molten-core.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A rough spherical core of molten rock, cracked surface revealing bright orange-yellow magma underneath, heat shimmer and smoke wisps, fantasy RPG item icon style.

#### Inferno Fang
**File target:** `images/items/inferno-fang.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A massive curved dragon tooth, dark obsidian black with glowing orange-red fire veins, the tip still smolders with eternal flame, epic fantasy RPG item icon style.

#### Lava Essence
**File target:** `images/items/lava-essence.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small sealed stone jar containing swirling bright orange lava energy, glowing cracks on the container, intense volcanic heat visible, fantasy RPG item icon style.

#### Frost Core
**File target:** `images/items/frost-core.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A perfectly spherical core of eternal ice, brilliant pale blue with a bright white center, frost crystals growing outward, intensely cold aura, fantasy RPG item icon style.

#### Glacial Shard
**File target:** `images/items/glacial-shard.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A jagged fragment of ancient glacial ice, deep blue with streaks of white, impossibly cold, frost mist trailing from it, epic fantasy RPG item icon style.

#### Permafrost
**File target:** `images/items/permafrost.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A chunk of ancient permafrost ground, layers of ice and frozen earth visible, tiny frozen crystals embedded throughout, millennia-old cold, fantasy RPG item icon style.

#### Terra Core
**File target:** `images/items/terra-core.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A rough spherical stone core with glowing amber-green veins of living earth energy, tiny crystals and roots growing from cracks, pulsing with geological power, fantasy RPG item icon style.

#### Titan Shard
**File target:** `images/items/titan-shard.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A massive angular fragment of enchanted stone, covered in ancient glowing golden-brown runes, impossibly dense and heavy looking, epic fantasy RPG item icon style.

#### Ancient Amber
**File target:** `images/items/ancient-amber.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A large polished piece of deep golden-orange amber, a tiny prehistoric insect visible inside, warm honey glow, ancient and mysterious, fantasy RPG item icon style.

---

## Open World — Chapter 1 AI Image Prompts

Use these prompts to generate sprite sheets and backgrounds for the Open World mode (Chapter 1: Emberfall Awakening). All sprite sheets use a transparent background.

### Region Backgrounds

#### Emberfall Valley Panorama
**File target:** `images/backgrounds/ow-valley-bg.png` (3840×1080)
> Wide parallax side-scroller background, lush green rolling hills, bright blue sky with soft clouds, glowing arcane wildflowers (pink, blue, gold) scattered across meadows, sparkling magical particles in the air, distant stone pathway winding right, small crystal formations growing from the ground, serene and inviting tutorial area, polished 2D game art, no characters, no text.

#### Emberfall City
**File target:** `images/backgrounds/ow-city-bg.png` (3840×1080)
> Wide parallax side-scroller background, medieval fantasy city at dusk, stone buildings with warm lit windows, tall mage towers with glowing runes, floating golden lanterns drifting through the air, cobblestone streets, a prominent clock tower in the center-right, arcane market stalls, purple-indigo twilight sky, atmospheric and bustling, polished 2D game concept art, no characters, no text.

#### Whispering Woods
**File target:** `images/backgrounds/ow-woods-bg.png` (3840×1080)
> Wide parallax side-scroller background, dense magical forest, very tall ancient trees with glowing teal and green bioluminescent bark, floating green spores and particles, thick mystical fog rolling through the undergrowth, glowing mushrooms on the ground, eerie but beautiful atmosphere, dark green and teal color palette, abandoned stone ruin visible in the mid-distance, polished 2D game art, no characters, no text.

#### Ashfang Foothills
**File target:** `images/backgrounds/ow-foothills-bg.png` (3840×1080)
> Wide parallax side-scroller background, volcanic foothills landscape, black and dark red volcanic rock terrain, distant smoking volcanoes with orange lava glow at peaks, scorched dead trees, cracks in the ground emitting orange-red lava light, thick haze and ash particles in the air, ominous dark red-brown sky, desolate and dangerous, polished 2D game art, no characters, no text.

#### Temple of Cinders
**File target:** `images/backgrounds/ow-temple-bg.png` (3840×1080)
> Wide parallax side-scroller background, interior of an ancient dragon worship temple, massive stone pillars with carvings of dragons, pools of glowing orange lava below the walkway, crumbling stone statues of dragons, braziers with magical fire, very dark atmosphere lit primarily by lava glow and fire, dark red and black color palette, epic and foreboding, polished 2D game art, no characters, no text.

---

### NPC Sprite Sheets

#### Archmage Thalen
**File target:** `images/npcs/thalen-sheet.png`
> 2D pixel-style character sprite sheet, 6 columns × 4 rows, transparent background. An elderly archmage with a long silver beard, deep blue and gold robes with arcane rune patterns, a tall pointed wizard hat with a glowing crystal tip, holding a gnarled wooden staff with a blue orb, wise and powerful appearance. Row 1: idle (subtle staff glow). Row 2: walk cycle. Row 3: casting gesture (staff raised). Row 4: talking (mouth open, hand gesturing). Fantasy RPG style, clean outlines.

#### Mira — Spell Merchant
**File target:** `images/npcs/mira-sheet.png`
> 2D pixel-style character sprite sheet, 6 columns × 4 rows, transparent background. A young woman spell merchant with short red hair and green eyes, wearing a crimson scarf and leather vest over a white blouse, belt with pouches of spell components, confident and welcoming. Row 1: idle (examining a scroll). Row 2: walk cycle. Row 3: offering item (hand extended). Row 4: talking with a smile. Fantasy RPG style, clean outlines.

#### Captain Dorn — City Guard
**File target:** `images/npcs/dorn-sheet.png`
> 2D pixel-style character sprite sheet, 6 columns × 4 rows, transparent background. A burly city guard captain in polished steel plate armor with a dark grey tabard bearing a sun emblem, close-cropped brown hair, a square jaw, holding a halberd. Row 1: idle (at attention). Row 2: walk cycle. Row 3: pointing/commanding gesture. Row 4: talking (stern expression). Fantasy RPG style, clean outlines.

---

### Open World Enemy Sprite Sheets

#### Corrupted Wolf
**File target:** `images/enemies/corrupted-wolf-sheet.png`
> 2D pixel-style enemy sprite sheet, 6 columns × 4 rows, transparent background. A wolf corrupted by dark magic, matted dark purple-grey fur with glowing magenta veins/cracks running along its body, glowing purple eyes, bared fangs, slightly larger than a normal wolf, menacing and feral. Row 1: idle (snarling). Row 2: run cycle. Row 3: attack (lunging bite). Row 4: death (collapsing). Fantasy RPG style, clean outlines.

#### Arcane Wisp
**File target:** `images/enemies/arcane-wisp-sheet.png`
> 2D pixel-style enemy sprite sheet, 6 columns × 4 rows, transparent background. A floating ball of unstable arcane energy, teal and green glowing core with swirling magical trails, no solid body, ethereal and dangerous, pulsing light, small sparks orbiting it. Row 1: idle (floating pulse). Row 2: float/drift cycle. Row 3: attack (energy bolt launching). Row 4: dissipate/death. Fantasy RPG style, clean outlines.

#### Living Vine
**File target:** `images/enemies/living-vine-sheet.png`
> 2D pixel-style enemy sprite sheet, 6 columns × 4 rows, transparent background. A magically animated plant creature, thick dark green vine body rooted to the ground, thorny whip-like tendrils, a single glowing amber eye-like bud at the top, menacing plant monster. Row 1: idle (swaying). Row 2: (same as idle, stationary creature). Row 3: attack (tendril whipping forward). Row 4: withering/death. Fantasy RPG style, clean outlines.

#### Fire Imp
**File target:** `images/enemies/fire-imp-sheet.png`
> 2D pixel-style enemy sprite sheet, 6 columns × 4 rows, transparent background. A small humanoid fire demon, bright red-orange skin, short curved horns, glowing yellow eyes, sharp teeth in a wicked grin, small bat-like wings (non-functional), hands wreathed in flame. Row 1: idle (flame flickering). Row 2: run cycle. Row 3: attack (throwing fireball). Row 4: death (bursting into embers). Fantasy RPG style, clean outlines.

#### Lava Beetle
**File target:** `images/enemies/lava-beetle-sheet.png`
> 2D pixel-style enemy sprite sheet, 6 columns × 4 rows, transparent background. A large armored beetle with a volcanic rock shell, glowing orange-red lava visible through cracks in its carapace, thick legs, small fiery mandibles, lumbering and tank-like. Row 1: idle (shell pulsing). Row 2: walk cycle (slow, heavy). Row 3: attack (mandible snap). Row 4: death (shell cracking apart). Fantasy RPG style, clean outlines.

---

### Boss Sprite Sheets

#### Fire Warden (Mid-Boss)
**File target:** `images/enemies/fire-warden-sheet.png`
> 2D pixel-style boss sprite sheet, 4 columns × 4 rows, transparent background, 256×256 frame size. A massive stone guardian infused with fire, humanoid body made of cracked dark stone with molten lava glowing through the fissures, one giant fist, the other arm ends in a flame blade, a carved stone face with burning eye sockets, standing tall and imposing. Row 1: idle (flames flickering). Row 2: walk (heavy stomp). Row 3: attack (ground slam with fire shockwave). Row 4: special (fire blade sweep). Epic boss design, fantasy RPG style, clean outlines.

#### Ignaroth — Young Inferno Dragon (Final Boss Ch.1)
**File target:** `images/enemies/ignaroth-sheet.png`
> 2D pixel-style boss sprite sheet, 4 columns × 4 rows, transparent background, 256×256 frame size. A young but fearsome dragon, dark red and black scales, massive wingspan (partially folded), long neck with a spiked crest, glowing orange eyes, flames licking from its jaws, powerful clawed feet, a long barbed tail, partially perched on volcanic rock. Row 1: idle (breathing smoke). Row 2: charge (lunging forward). Row 3: fire breath (wide cone of flame from mouth). Row 4: meteor rain (roaring skyward, flames erupting around it). Epic boss design, fantasy RPG style, clean outlines.

---

### Story Item Art

#### Moon Pendant Fragment
**File target:** `images/items/moon-pendant-fragment.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A crescent-shaped silver pendant fragment, emitting soft blue-white moonlight glow, small arcane runes etched along the curved edge, a crack down the middle suggesting it's part of a larger artifact, trailing faint magical sparkles, mysterious and ancient, fantasy RPG item icon style.

#### Sun Medallion Fragment
**File target:** `images/items/sun-medallion-fragment.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A triangular golden medallion fragment, radiating warm golden-orange sunlight, engraved with a partial sun symbol and ancient script, glowing edges, part of a larger circular medallion, powerful and ancient, fantasy RPG item icon style.

#### Broken Black Hourglass
**File target:** `images/items/broken-hourglass.png` (128×128)
> Clean 2D game icon, transparent background, 128×128 pixels. A small ornate hourglass made of dark obsidian-black material with silver filigree, cracked down the middle, the sand inside visibly flowing UPWARD defying gravity, faint purple-blue temporal magic glow around the cracks, eerie and mysterious, key story item, fantasy RPG item icon style.

---

## Notes

- Current assets are JPG images in `images/backgrounds`.
- If you regenerate images in another format (`.png`/`.webp`), update the file references in `index.html` to match.
- Keep image file names the same base names to avoid changing CSS selectors.
