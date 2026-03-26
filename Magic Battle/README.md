# StoryLine(just the story)

GAME START
Starting Region — Emberfall Valley

A lush valley filled with forests and rolling hills.

Major Location

The City of Emberfall

A medium-sized magical city where young mages train.

Architecture:

Stone buildings with glowing runic lanterns

Mage towers rising above rooftops

Market full of magical artifacts

IMPORTANT NPCS (STARTING AREA)
Archmage Thalen

Elderly mage who runs the academy.

Appearance:

Long silver beard

Blue robes covered in runic patterns

Carries a floating spellbook

Role:

Teaches player basic spell creation

Encourages exploration

Hidden Detail:
Sometimes he says strange things like:

“You remind me of someone… though I cannot remember who.”

This hints that the timeline has changed before.

Mira the Spell Merchant

Energetic traveling merchant.

Appearance:

Red cloak

Large backpack full of scrolls

Goggles on forehead

Role:

Sells spell fragments

Provides hints about ruins

Secret:
She claims she has visited the world many times before, though she doesn't understand why she feels that way.

Captain Dorn

Commander of the city guard.

Appearance:

Heavy armor

Scar across left eye

Massive sword

Role:

Sends player on early quests

Warns about monsters appearing across the land

FIRST STORY ARC
The Awakening of Ignaroth

Rumors spread that an ancient dragon has awakened in the volcanic region.

The dragon is Ignaroth.

Region

Ashfang Mountains

Environment:

Rivers of lava

Black volcanic rock

Ruined dragon temples

Key Structure

Temple of Cinders

Inside lies ancient writings describing:

“A force that bends time to shape destiny.”

The dragon boss battle happens here.

The player believes this dragon is the major threat.

After defeating it, strange magical energy pulses across the world.

SECOND STORY ARC
The Frozen Catastrophe

A distant northern region begins freezing rapidly.

Region

Frostveil Expanse

Environment:

Frozen lakes

Ice storms

Ancient glaciers

Major Structure

The Crystal Citadel

A towering fortress made entirely of ice.

Boss:
Kryonax

This titan appears to be freezing the land intentionally.

After the fight, the player finds a strange artifact:

A broken hourglass carved from black stone.

IMPORTANT NPC (MID GAME)
Scholar Elric

Historian studying magical disasters.

Appearance:

Thin and pale

Round glasses

Always carrying scrolls

Role:
He explains that each magical disaster seems to occur in a precise order, as if something is controlling events.

He begins researching chronomancy, a forbidden magic.

THIRD STORY ARC
The Earth Titan

Earthquakes begin destroying cities.

Boss:
Terravox

Region:
Stoneheart Plateau

Environment:

Massive canyon cliffs

Crumbling ruins

Giant stone statues

Structure:
The Buried Vault

Inside the vault are ancient murals showing:

A hooded figure surrounded by clocks and broken timelines.

WORLD EVENTS START CHANGING

After defeating the third boss strange things begin happening:

NPCs repeat dialogue they already said

Enemies appear in places they shouldn't

The sky flickers briefly

The player occasionally sees ghostly versions of previous locations.

LATE GAME REGION
The Ruins of the Arcane Council

A shattered magical city in the far east.

Architecture:

Floating towers

Collapsed bridges

Magical energy storms

NPC here:

The Grand Arcanist

Leader of a hidden order trying to stop magical disasters.

The player initially believes he is responsible for everything.

He claims someone has been altering time itself.

THE FALSE FINAL BOSS

The player fights the Grand Arcanist.

After defeat he reveals:

“I tried to stop him… but time bends to his will.”

Reality freezes.

The world glitches.

The Arcanist disappears.

FINAL REGION
The Chrono Citadel

A fortress floating outside time.

Architecture:

Massive floating clockwork structures

Bridges made of glowing energy

Broken fragments of different timelines

Inside lives the true mastermind:

The Chrono Tyrant

He reveals he has reset the timeline hundreds of times trying to prevent the world's destruction.

Every boss the player defeated was part of his plan to maintain balance.

The player unknowingly broke that balance.

FINAL STORY MOMENT

The Tyrant says:

“I have lived this moment more times than the stars in the sky.
Every path ends in ruin.
Except one… where you never existed.”

The boss fight begins.

# Magic Battle Menu Assets

This project now includes custom menu art in:

- `images/backgrounds/menu-bg.jpg`
- `images/backgrounds/sandbox-card.jpg`
- `images/backgrounds/inventory-card.jpg`
- `images/backgrounds/dungeons-card.jpg`
- `images/backgrounds/pvp-card.jpg`

`index.html` uses these for the page background and each menu option card.

## Spell Customization Reference

Magic Battle's spell system lets you build spells from scratch using a phase-based architecture. Every spell is a sequence of one or more **phases**, and each phase independently defines its shape, behavior, effects, and numeric properties. The result is a fully custom projectile (or chain of projectiles) that you designed yourself.

---

### How Spells Work — The Phase System

A spell is an array of **phases**. When you cast:

1. **Phase 0** fires immediately — projectiles spawn from your character.
2. When a phase transition triggers, the projectile either **morphs** into the next phase (inheriting position/velocity) or **spawns fresh projectiles** at the impact point (if the `resetProjectiles` effect is applied).
3. This continues through all phases in order.

**Phase transitions** are controlled by the `nextTrigger` property on each phase:

| Trigger | When it fires | Use case |
|---|---|---|
| **onHit** | The moment the projectile damages an enemy | Impact explosions, chain reactions, on-contact transformations |
| **onExpire** | When the projectile's lifetime runs out | Delayed detonations, timed mines, projectile-to-AoE conversions |
| **afterDelay** | At 60% of the projectile's total duration | Mid-flight morphs, split shots, delayed phase forks |

**Example 3-phase spell:**
- Phase 0: Homing orb (seeks enemy) → `onHit`
- Phase 1: Nova explosion (AoE burst on impact) → `onExpire`
- Phase 2: Rain of spikes (falling projectiles from where the nova was)

Each additional phase adds **+3 Magic Control requirement** and multiplies mana cost by `0.6 + phases × 0.25`.

---

### Player Stats

Your character has four core stats, boosted by equipped items (staff, robe, relics) and class bonuses:

| Stat | What it does | Scaling |
|---|---|---|
| **Magic Power** | Increases all spell damage | +8% damage per point |
| **Magic Control** | Unlocks advanced shapes/behaviors/effects; reduces mana costs | -1.5% mana cost per point (caps at -70%) |
| **Mana Regen** | Passive mana recovery per frame | +0.009 mana/frame per point (base 0.45/frame) |
| **Magic Defence** | Increases max HP pool | +6 max HP per point |

Magic Control also acts as a **gating requirement** — complex shapes, behaviors, and effects each have a minimum Magic Control threshold. If your control is below the requirement, you cannot cast that spell.

---

### Shapes (17 types)

The shape defines the visual appearance, hitbox geometry, and any special mechanical behavior of each projectile.

#### Missile
- **Mana: 5 · Control: 0**
- Small glowing circle (radius = width × 0.7) with a white inner highlight.
- Standard circular hitbox. The bread-and-butter projectile — cheap, fast, no frills.
- **Niche:** Domain missile projectiles spawn at random positions within the domain field. The `chain` shape uses the same visual but adds bounce-between-targets logic.

#### Orb
- **Mana: 8 · Control: 1**
- Larger circle (radius = width × 1.3) with a bright sparkle core.
- Wider hitbox than missile. Feels heavier and more impactful.
- **Niche:** Good for homing behavior since the larger hitbox makes connecting with targets easier despite homing's -50% damage penalty.

#### Ally Orb
- **Mana: 6 · Control: 1**
- Green-tinted circle (radius = width × 1.3) with a light inner glow.
- **Cannot damage enemies.** Instead, it targets and heals the player when effects like `healSelf` or `damageHeal` are attached.
- **Niche:** Combine with `selfCast` or `underfoot` behavior for reliable self-healing. The `damageHeal` effect converts accumulated damage (from `damageStore`) into a heal on contact.

#### Blade
- **Mana: 7 · Control: 2 · Requires: Dragon Heart**
- Rotating rectangle that spins at `age × 0.3` radians per frame.
- Circular hitbox (radius = width × 0.85). Visually distinct from orbs due to the spin.
- **Niche:** The constant spin makes it feel like a slashing melee attack. Works well with `straight` or `boomerang` behavior for a throwing-blade fantasy.

#### Spike
- **Mana: 8 · Control: 3 · Requires: Crystal Crown**
- Pointed diamond shape that auto-rotates to face its velocity direction.
- Slightly smaller hitbox (radius × 0.9) than standard. Looks sharp and aggressive.
- **Niche:** In a domain expansion, spike-shaped projectiles erupt **upward from the ground** instead of spawning randomly, creating a field-of-spikes effect. Also forced to `straight` behavior in domains (not converted to homing like other shapes).

#### Polygon
- **Mana: 9 · Control: 3 · Requires: Crystal Crown**
- Regular polygon (default 6-sided hexagon) with a white inner star. Rotates slowly at `age × 0.04`.
- Customizable via the `polygonSides` property (6, 8, or 10 sides).
- **Niche:** In a domain expansion, polygon shape creates a **push effect** — all enemies inside the domain are continuously pushed away from center (1.2 strength per frame). Standard hitbox (radius = width × 1.0).

#### Slash
- **Mana: 7 · Control: 2**
- Curved crescent arc with a bright inner edge and trailing glow.
- Circular hitbox (radius = width × 0.85). Auto-rotates to face velocity like spike.
- **Niche:** Visually reads as a melee swing. Warrior class benefits heavily from slash since melee-range hits get +50% damage (within 200px) or +20% (within 350px).

#### Beam
- **Mana: 10 · Control: 4**
- Continuous line drawn from spawn point, rotating at `beamAngle` with length = `beamLen`.
- **Unique hitbox:** Checked as line segments every 40px along the beam's length, not as a circle.
- Deals **-35% damage** (0.65× multiplier) to compensate for hitting multiple targets simultaneously.
- Naturally homes toward the nearest enemy by adjusting its angle.
- **Niche:** The beam shape is one of the few shapes that can hit multiple enemies in a line per frame. Excellent for hallway fights. Affected by ceiling/floor collision — the beam stops at walls.

#### Ring
- **Mana: 12 · Control: 5 · Requires: Sun Medallion**
- Expanding circular ring that grows over its lifetime. Final radius = `(age / maxAge) × width × 8`.
- Hitbox is a circle at the expanding radius — hits enemies as the ring passes through them.
- **Niche:** In a domain expansion, ring causes projectiles to spawn **from the domain's center point** rather than random positions. Good for radial AoE warning zones.

#### Cone
- **Mana: 10 · Control: 4 · Requires: Sun Medallion**
- Triangle shape that expands over time: width = `(age / maxAge) × 200 × width`, height = 40% of width.
- **Directional hitbox:** Triangular area check, not circular. Points forward (toward cursor aim) or downward (if rain behavior).
- **Special rain/barrage interaction:** When combined with rain or barrage behavior, the cone's horizontal velocity is zeroed — it points straight down instead of forward.
- **Niche:** The only shape with a true triangular hitbox. Best for wide-angle breath/blast attacks. Pairs well with `straight` behavior for a spreading flame breath.

#### Wall
- **Mana: 12 · Control: 6 · Requires: Celestial Robe**
- Large vertical rectangle (width × 2 wide, height × 6 tall) with a visible border.
- **Rectangular hitbox** (extends ±width horizontally, ±height × 3 vertically).
- **Blocks enemy projectiles** on contact. Functions as a physical barrier.
- **Niche:** In a domain expansion, wall shape makes the entire domain **50% larger** (1.5× size multiplier). As a normal spell, it's a defensive tool — place it between you and enemies to absorb incoming fire. Combine with `stationary` behavior for a lasting barricade.

#### Solidify (Platform)
- **Mana: 10 · Control: 4**
- Flat rectangle (width × 3 wide, height × 1.5 tall).
- Rectangular hitbox (±width × 1.5, ±height × 0.75). Deals no damage.
- **Becomes a solid platform** the player can physically stand on. Creates temporary terrain.
- **Niche:** Pure utility. Use it to reach high places, create bridges, or block off paths. The platform disappears when the projectile's duration expires.

#### Nova
- **Mana: 15 · Control: 7**
- Expanding filled circle + outer stroke ring. Grows like ring: `(age / maxAge) × width × 8`.
- Hitbox matches the expanding radius — damages everything inside the expanding sphere.
- **Niche:** In a domain expansion, nova triggers an **instant shockwave on activation** that hits all enemies inside the domain for `power × 5` damage and knocks them away from center with 40 shockwave particles. The most explosive domain opener.

#### Meteor
- **Mana: 16 · Control: 6 · Requires: Stardust Staff**
- Rocky sphere with a heat glow, molten interior, and core detail. Rotates to face velocity.
- **Larger hitbox** than default (radius = max(width, height) × 1.5).
- Deals **-25% base damage** (0.75× nerf), but gets **up to +200% bonus damage** based on distance traveled (calculated as `1 + min(distance / 300, 2.0)`). The farther it flies, the harder it hits.
- **Splash explosion on hit:** Deals 50% of its damage in an AoE splash to nearby enemies.
- **Niche:** In a domain expansion, meteor projectiles **rain from the top of the domain** downward with a +75% damage bonus. Also forced to `straight` behavior in domains (not converted to homing). Best for long-range bombardment — pair with `lob` behavior for maximum distance bonus.

#### Vortex
- **Mana: 18 · Control: 7 · Requires: Void Staff**
- Dark void gradient ring with rotating distortion tendrils and crackling energy.
- **Growing hitbox:** radius = `width × 3 + width × 2 × (age / maxAge)`. Gets bigger over time.
- Automatically **slows itself** (velocity × 0.985 per frame) — gradually comes to a halt.
- **Pulls enemies** toward its center every frame. Deals damage-over-time to enemies in range (every 20 frames).
- **Niche:** In a domain expansion, vortex creates a continuous **pull-to-center effect** (1.5 pull strength per frame) on all enemies inside the domain for the entire duration. A crowd control domain.

#### Chain
- **Mana: 18 · Control: 9 · Requires: Elder Staff**
- Visually identical to missile (small circle, radius = width × 0.7).
- **Bounces between enemies**: after hitting one target, it seeks the nearest unhit enemy within 500px and redirects toward them. Chains up to `chainMax` times (default 3). Resets pierce tracking every 60 frames.
- Customizable `chainStunTime` property — adds stun to each chain link (costs +25 mana per point of stun time).
- **Niche:** In a domain expansion, chain shape applies a **30-frame stun** to all grounded enemies inside the domain every pulse. High mana cost but devastating crowd control. Best for multi-enemy encounters.

#### Summon
- **Mana: 20 · Control: 8**
- Rotating circles with radiating spokes and a glow effect.
- **No direct hitbox** — does not damage enemies. Instead, spawns an allied minion entity.
- Minions fire the spell's **next phase** as their attack. The summon itself is just a delivery mechanism.
- **Niche:** In a domain expansion with `summon` shape + Necromancer class, the domain spawns **3 powerful enemy allies** from your bestiary over its duration (first at 2s, then every ~18s). Summon power scales at `(phase power) × 2.5`. Without Necromancer class, summon in domain has no special behavior.

#### Same
- **Mana: 0 · Control: 0**
- Reuses the shape from the previous phase. Costs nothing extra.
- **Niche:** In a domain expansion, `same` shape creates a **buff-only domain** — no projectile waves spawn at all. The domain purely provides the movement speed, damage, and damage reduction buffs without any automatic attacks. Useful when you want domain buffs without the mana cost of wave projectiles.

---

### Behaviors (16 types)

The behavior controls how the projectile moves through space after being spawned.

#### Straight
- **Mana: 0 · Control: 0**
- Travels in a constant direction toward where your cursor was aimed at cast time.
- No damage modifier. The simplest and cheapest option.
- **Niche:** Always reliable. The baseline everything else is measured against. In a domain, most shapes get force-converted to homing, but `straight` is used for spike and meteor shapes.

#### Lob / Arc
- **Mana: 2 · Control: 1**
- Fires in the aimed direction but applies +0.25 gravity per frame, creating a parabolic arc.
- **+25% damage bonus** to compensate for the difficulty of aiming arcs.
- **Niche:** The gravity makes projectiles naturally fall toward ground-level enemies. Pairs excellently with `meteor` shape since lob gives you distance (for meteor's distance bonus) plus lob's own +25%. The two stack multiplicatively.

#### Homing
- **Mana: 5 · Control: 3**
- Curves toward the nearest valid target (enemy, dummy, or slime) with a maximum turn rate of 12° per frame, scaled to the projectile's speed.
- **-50% damage penalty** — the tradeoff for guaranteed hits.
- **Niche:** In domain expansions, almost all projectile shapes get force-converted to homing behavior (exceptions: meteor and spike keep straight). This makes homing the de-facto domain behavior. The -50% penalty still applies to domain projectiles, which is why meteor domains (forced straight) deal more per-projectile damage.

#### Boomerang
- **Mana: 4 · Control: 3 · Requires: Chaos Orb**
- Travels outward in a straight line, then **returns to the player** at 45% of its total lifetime.
- Resets its `hitTargets` set on the return trip — can hit the same enemy twice (once going out, once coming back).
- **Niche:** Effectively doubles your hit count on a single enemy. Synergizes with effects that trigger per-hit like `lifesteal`, `burn`, and `damageStore`.

#### Ground Surge
- **Mana: 5 · Control: 4 · Requires: World Seed**
- Applies +0.6 gravity per frame but **bounces** off the ground and platforms (reverses to -1.5 vertical velocity on impact).
- Rolls along the floor in low bouncing arcs. Horizontal velocity is frozen on initial contact until it hits something.
- **Niche:** Automatically follows terrain contours. Good for clearing ground-level enemies in uneven environments. Less useful against flying enemies.

#### Orbit Caster
- **Mana: 8 · Control: 6**
- Circles around the player at `orbitRadius` (default 80px) with `orbitSpeed` (default 3) for `orbitDuration` (default 1.5 seconds).
- After the orbit duration expires, the projectile **launches toward the nearest enemy**.
- **-30% damage penalty** during and after orbit.
- **Tunable:** `orbitRadius` (50–150), `orbitSpeed` (1–10), `orbitDuration` (0.5–3 seconds).
- **Niche:** Creates a defensive shield that then becomes offensive. High count + orbit = protective ring of projectiles. The launch phase inherits homing-like targeting.

#### Rain Down
- **Mana: 8 · Control: 7**
- Spawns projectiles high above the player (y = origin - 150px) spread across an area. Projectiles fall straight down with ±0.8 random horizontal drift.
- **+50% damage bonus** — highest damage multiplier of any behavior.
- Cone and beam shapes have their horizontal velocity zeroed when combined with rain, pointing straight down.
- **Niche:** The +50% damage is enormous. Pair with high-power meteor shape for devastating area bombardment. The tradeoff is unpredictability — you can't precisely aim where rain lands. Best in large rooms.

#### Barrage
- **Mana: 8 · Control: 7**
- Fires a horizontal wall of projectiles from your side (offset 120px in facing direction), spread vertically.
- **+35% damage bonus.**
- Like rain, cone and beam shapes get their horizontal velocity zeroed.
- **Niche:** Think of it as a sideways rain. Created for area control in hallways and corridors. The vertical spread covers a wide zone.

#### Stationary
- **Mana: 0 · Control: 0**
- Spawns at the cast point and stays fixed. No velocity. Lingers for full duration.
- No damage modifier. Acts as a persistent area-of-effect zone.
- **Niche:** Combine with `wall` shape for a lasting barrier, or `vortex` shape for a stationary gravity pull. Also great for `nova` — a stationary expanding explosion.

#### Underfoot
- **Mana: 3 · Control: 2**
- Spawns directly at the player's feet (y = player.y + height + 4). Pinned to player position, zero velocity.
- **Niche:** Primarily for self-buffs and defensive effects. Combine with `shield`, `healSelf`, or `ally orb` shape for reliable self-targeting. The projectile follows you since it's pinned.

#### Self Cast
- **Mana: 2 · Control: 1**
- Spawns at the player's center and stays pinned. Triggers player-targeting effects like `healSelf`, `shield`, `forceJump`, and `damageHeal`.
- **Niche:** The dedicated healing/buff behavior. No offensive capability. Use with ally orb + healSelf for a pure heal, or with forceJump for a rocket-jump effect.

#### Around Self
- **Mana: 5 · Control: 3**
- Spawns a ring of projectiles orbiting the player. Each is evenly spaced around a circle at `aroundSelfRadius` (default 50px).
- The total count is determined by the phase's `count` parameter — that many projectiles orbit simultaneously.
- Unlike Orbit Caster, these never launch. They stay orbiting until duration expires.
- **Tunable:** `aroundSelfCount` (2–8), `aroundSelfRadius` (30–150).
- **Niche:** Defensive ring that damages anything that touches you. Combine with `burn` or `freeze` effects for a persistent elemental aura.

#### Ground
- **Mana: 4 · Control: 3**
- Auto-locks to the nearest enemy within `groundRadius` (default 200px) and erupts upward from the ground at their position.
- If no enemy is in range, erupts at the player's position instead.
- **+40% damage bonus** and **3× duration multiplier.**
- **Tunable:** `groundRadius` (100–500), `groundAutoLock` (true/false).
- **Niche:** The auto-targeting makes this very consistent. The +40% damage and 3× duration are excellent. Best with spike or nova shapes for ground-eruption effects.

#### Zigzag
- **Mana: 5 · Control: 4**
- Moves in the aimed direction but oscillates sideways in a sine wave. Amplitude = `40 + width × 0.5`, frequency = 0.09 radians/frame.
- **Niche:** Harder for enemies to dodge (in PvP contexts). The weaving path also gives wider coverage than straight. Larger projectiles (higher width) zigzag with wider amplitude.

#### Teleport
- **Mana: 7 · Control: 6 · Requires: Celestial Robe**
- Blinks forward 60px every 20 frames along its aim direction. Between blinks, it's invisible/intangible.
- Automatically **re-aims at nearby enemies** after each blink — has built-in homing between teleport jumps.
- Spawns visual particles on each teleport.
- Auto-advances to the next phase on enemy contact.
- **Niche:** Bypasses obstacles and closes gaps. The periodic re-targeting makes it semi-homing without the -50% damage penalty. One of the stronger advanced behaviors.

#### Domain
- **Mana: 1000 · Control: 10**
- Must be the **first phase (Phase 0)** of a spell. Can only be cast as an **Ultimate** (slot 10).
- Creates a massive domain expansion field. See the **Domain Expansion** section below for full details.

---

### Effects (24 types)

Effects are applied on-hit (or on-cast for self-targeting effects). Each phase can have multiple effects, but some categories are exclusive (only one per phase):

- **Elemental** (exclusive): burn, freeze, poison, stun, shatter
- **Movement** (exclusive): knockback, pull, forceJump, horizontalLaunch, gravityWell
- **Support**: healSelf, shield, lifesteal
- **Store**: damageStore, damageRelease, damageHeal
- **Utility**: timedRelease, phaseFork, resetProjectiles, phaseThrough, ricochet, dispel, randomDelay
- **CC**: mark

Each effect has `effectPower` and `effectDuration` multiplier sliders that scale its strength.

#### Burn
- **Mana: 5 · Control: 2** · Elemental
- Applies fire damage-over-time to the target. Deals **5 ticks** at intervals of 60 frames.
- Total burn damage = 50% of the base hit damage × `effectDuration` multiplier, divided across 5 ticks.
- If the player gets hit by a burn effect, they take **20% of the tick damage**.
- **Niche:** Stacks favorably with boomerang (double application on out + return). The `effectDuration` slider directly multiplies total burn damage, making it one of the most scalable effects. Vow elemental damage bonus (+7% per point) applies to burn spells.

#### Freeze
- **Mana: 5 · Control: 2** · Elemental
- Slows enemy movement to **50% speed** and prevents attacks for the duration.
- Duration = 90 frames × `effectDuration` multiplier. Maximum duration wins if reapplied (doesn't stack additively).
- **Niche:** Pure crowd control. The slow lasts 1.5 seconds base — long enough to create safe windows. Best on fast, high-count projectiles to keep the slow permanently refreshed.

#### Poison
- **Mana: 5 · Control: 3** · Elemental
- Applies poison DoT. Deals **6 ticks** at intervals of 75 frames (slower than burn but more ticks).
- Total poison damage = 40% of base hit damage × `effectDuration`, divided across 6 ticks.
- Visual: Green cloud appears over poisoned enemies. If the player is poisoned, same green cloud.
- **Niche:** Slightly less total damage than burn but lasts longer (6 ticks × 75 = 450 frames vs burn's 5 × 60 = 300 frames). Better for sustained pressure.

#### Stun
- **Mana: 7 · Control: 5** · Elemental
- Prevents all enemy actions (movement, attacks, AI decisions) for the duration.
- Duration = 60 frames × `effectDuration` multiplier (1 second base). Yellow text indicator appears.
- **Niche:** The most powerful CC effect. Unlike freeze (which only slows), stun completely locks the target. Higher mana/control cost is justified. Best on chain shape (which can stun multiple targets in sequence).

#### Knockback
- **Mana: 3 · Control: 1** · Movement
- Pushes the enemy horizontally away from the caster. Displacement = `facing × 40 × effectPower × ultMultiplier`.
- Instant, no ramp-up — enemy is shoved immediately.
- **Niche:** Cheap defensive tool. Keep enemies at range. Pairs well with meteor (knock them away to get distance bonus on the next meteor shot).

#### Pull
- **Mana: 4 · Control: 3** · Movement
- Drags the enemy toward the player. Force = `50 × effectPower` horizontal + `30 × effectPower` vertical.
- **Niche:** The opposite of knockback. Group enemies together for AoE follow-up. Combine with nova or ring on the next phase for a pull → explosion combo.

#### Force Jump
- **Mana: 4 · Control: 2** · Movement
- Launches the target upward. Force = `60 × effectPower × ultMultiplier`.
- When applied to the player (via self-cast), gives an enhanced jump boost instead.
- **Niche:** Repositioning tool. Launch enemies into the air where they can't attack, or use it on yourself as a rocket jump. Self-cast + forceJump is a mobility tool.

#### Horizontal Launch
- **Mana: 5 · Control: 2** · Movement
- Launches the enemy/player based on the **projectile's direction** (not the caster's facing).
- Force = `projectile.power × 3.5 × effectPower × ultMultiplier`.
- **Niche:** Differs from knockback in that the launch direction follows the projectile, not the caster. A homing missile that curves around will launch the enemy in the direction it was traveling on impact.

#### Lifesteal
- **Mana: 8 · Control: 6** · Support · Requires: Blood Staff
- Heals the player for **20% of damage dealt** × `effectPower` × `ultMultiplier`.
- Shows pink healing numbers. Stacks with vow spellVamp bonus.
- **Niche:** Sustain in prolonged fights. Best on high-damage, multi-hit spells (rain + high count) for massive healing throughput. The 20% base rate scales with effectPower, so maxing effectPower can push it toward 40%+.

#### Heal Self
- **Mana: 6 · Control: 4** · Support · Requires: Phoenix Feather
- Heals the player for `power × 5 × effectPower × ultMultiplier × healerBoost`.
- Healer class gets **+40% healing** on this effect.
- Green healing numbers appear. Must be on an `allyOrb` shape or `selfCast`/`underfoot` behavior.
- **Niche:** Direct healing — the only way to cast a dedicated heal spell. Power slider directly controls heal amount. Healer class makes this 40% stronger, making it the class's core mechanic.

#### Shield
- **Mana: 6 · Control: 4** · Support
- Grants a temporary damage-absorbing shield: `power × 3 × effectPower × ultMultiplier` points.
- Displays as a blue shield bar. Absorbs damage before HP. Decays over time.
- **Niche:** Stacks with existing shield. Casting shield repeatedly builds up a large absorb buffer. Best on fast-cooldown, low-cost spells for constant shield refreshing.

#### Damage Store
- **Mana: 4 · Control: 2** · Store · Requires: Phoenix Feather
- Accumulates a percentage of all damage dealt into a stored pool.
- Default: 50% of each hit stored. Tunable via `damageStorePercent` (10%–100%).
- Stored damage appears as a ⚡ overlay on your character.
- **Niche:** Does nothing by itself — requires `damageRelease` or `damageHeal` on another spell to consume the stored pool. Build up massive stored damage, then release it all at once.

#### Damage Release
- **Mana: 6 · Control: 4** · Store · Requires: Phoenix Feather
- Consumes all stored damage. Adds **+1 damage per 500 stored** as a flat bonus to the hit.
- Also slightly increases projectile size on release for visual feedback.
- Resets `damageStored` to 0 after consumption.
- **Niche:** The payoff for damageStore. Build up damage with rapid-fire spells on one slot, then release it with a big single-hit spell on another slot. The bonus is multiplied into the full damage formula.

#### Damage Heal
- **Mana: 5 · Control: 3** · Store · Requires: Phoenix Feather
- Converts stored damage into healing: `damageStored × 0.5 × healerBoost`.
- Must be on an ally orb. Healer class gets the +40% bonus here too.
- **Niche:** Alternative to damageRelease — trade offense for sustain. Store damage with combat spells, then heal with an ally orb + damageHeal spell.

#### Timed Release
- **Mana: 3 · Control: 2** · Utility
- Delays all hits by `timedReleaseDelay` frames (default 0.5 seconds / 30 frames). The projectile's maxAge is auto-extended to accommodate the delay.
- **Niche:** Queue up multiple projectiles on a target, then they all hit simultaneously when the timer expires. Useful for overwhelming burst damage that bypasses per-hit diminishing returns.

#### Phase Fork
- **Mana: 6 · Control: 5** · Utility · Requires: Eye of Eternity
- When the current phase triggers its next phase, the original projectile **continues existing** instead of being consumed.
- `phaseForkRepeats` controls how many times the fork spawns (each adds +35 mana cost).
- **Niche:** Creates branching spell trees. Phase 0 fires a homing orb → on hit, it forks: the orb keeps going AND a nova explodes at the impact point. Without phaseFork, the orb would be consumed.

#### Reset Projectiles
- **Mana: 0 · Control: 0** · Utility
- When the next phase triggers, instead of morphing the existing projectile, **fresh projectiles spawn** at the trigger point.
- Also resets `hitTargets`, allowing the new phase to hit enemies that were already hit by the previous phase.
- **Niche:** Required for phase transitions that should feel like a new spell being cast (e.g., an explosion spawning new projectiles) rather than the same projectile transforming.

#### Phase Through
- **Mana: 20 · Control: 6** · Utility · Requires: Void Robe
- Allows the projectile to pass through solid walls and platforms freely.
- **-45% damage penalty** unless the projectile was spawned by a domain expansion (domain projectiles get phaseThrough free, no penalty).
- **Niche:** Bypasses terrain. Expensive but essential in tilemap dungeons where walls would otherwise block your shots. In domains, projectiles naturally phase through (no cost needed).

#### Dispel
- **Mana: 8 · Control: 4** · Utility
- Destroys enemy projectiles and spell walls on contact within an AoE radius = `max(width, height) × 0.8`.
- Shows a 🚫 indicator and purple impact visual.
- **Niche:** Anti-projectile defense. Shoot a dispel missile into incoming enemy fire to clear it. Larger projectiles (higher width/height) create larger dispel zones.

#### Ricochet
- **Mana: 18 · Control: 6** · Utility · Requires: Chaos Orb
- Reflects off walls and solid surfaces. Bounces at the wall's angle and resets pierce tracking on each bounce.
- Maximum 1 bounce per wall contact. Maintains velocity through bounces.
- **Niche:** Excellent in enclosed spaces — the projectile keeps bouncing and hitting. Combine with high-duration for maximum bounces. Works well in pyramid corridors and tight dungeon rooms.

#### Shatter
- **Mana: 8 · Control: 6** · Elemental · Requires: Dragon Heart
- When an enemy dies while shatter is applied, the enemy explodes into **fragments** that deal area damage.
- Stores `power × 0.3` + the projectile's color for the fragment explosion.
- **Niche:** Chain-reaction potential. If shatter fragments kill another shattered enemy, it chains. Best on high-power spells fighting groups of weaker enemies.

#### Gravity Well
- **Mana: 10 · Control: 7** · Movement · Requires: World Seed
- Creates a persistent **pull zone** at the impact point with a 120px radius.
- The well lasts 120 frames (2 seconds). Power affects pull strength.
- Animated as a dark void with spinning rings.
- **Niche:** Area denial + crowd control. Drop a gravity well in a corridor, then follow up with rain or nova on the clustered enemies. Unlike pull (instant), gravity well is persistent and affects all enemies in range over time.

#### Mark
- **Mana: 5 · Control: 4** · CC · Requires: Eye of Eternity
- Tags the enemy with a debuff marker. Marked enemies take increased incoming damage.
- **Niche:** Currently a combo-setup mechanic. Mark a tough enemy, then switch to your damage spell — the mark increases all subsequent damage.

---

### Damage Formula

Every projectile hit runs through this formula:

```
Final Damage = power × 8 × [all multipliers below]
```

| Multiplier | Value | When |
|---|---|---|
| Magic Power | `1 + magicPower × 0.08` | Always (stat-based) |
| Homing penalty | `× 0.5` | Homing behavior |
| Lob bonus | `× 1.25` | Lob behavior |
| Orbit penalty | `× 0.7` | Orbit behavior |
| Rain bonus | `× 1.5` | Rain behavior |
| Barrage bonus | `× 1.35` | Barrage behavior |
| Beam penalty | `× 0.65` | Beam shape |
| Meteor base nerf | `× 0.75` | Meteor shape |
| Meteor distance bonus | `× (1 + min(dist/300, 2.0))` | Meteor shape (up to +200%) |
| Phase-through penalty | `× 0.55` | phaseThrough effect (non-domain) |
| Spread bonus | `× (1 + spread × 0.0025 × count)` | Multi-projectile spread |
| Diminishing returns | `× 1 / (1 + hitNum × 0.04)` | Each successive hit on same target |
| Domain active | `× 1.3` | Player inside active domain |
| Domain element match | `× 1.5 – 2.25` | Spell element matches domain element |
| Same-shape domain | `× 1.3` | Projectile shape matches domain shape |
| Dominion class | `× 1.4` | Domain projectiles + Dominion Master class |
| Ranger distance | `× (1 + min(dist/1000, 0.8))` | Ranger class (up to +80%) |
| Warrior melee | `× 1.5 / 1.2 / 1.0` | Warrior class (<200px / <350px / >350px) |
| Vow power boost | `× (1 + vowPower × 0.12)` | Per-slot vow power boost |
| Vow elemental | `× (1 + vowElemDmg × 0.07)` | Elemental effect + vow boost |
| Item boost | Varies | Equipped item multiplier |

**Domain projectiles** skip diminishing returns (dimMult always = 1).

---

### Trails & After-Hit Visuals

**Trails** add particle effects behind moving projectiles:

| Trail | Color | Description |
|---|---|---|
| **none** | — | No trail |
| **sparkle** | Light blue (200,220,255) | Magical sparkle particles; 25% spawn rate per frame |
| **flame** | Orange (255,140,50) | Fire particles; 25% spawn rate |
| **smoke** | Gray (100,100,100) | Subtle smoke puffs |
| **ice** | Cyan (150,220,255) | Frosty crystalline trail |
| **lightning** | Purple-white (180,180,255) | Electric arc particles; 25% spawn rate |

**After-hit visuals** play on impact:
- `none`, `explosion`, `flame_burst`, `ice_shatter`, `electric_spark`, `poison_cloud`, `star_burst`

---

### Domain Expansion

Domain Expansion is the most powerful mechanic in Magic Battle. It creates a massive reality-warping field that alters the battlefield for 60 seconds.

#### How to Set Up a Domain

1. Create a spell with **Phase 0 behavior = "domain"**. This must be your ultimate (slot 10).
2. The Phase 0 shape determines the **domain's special effect** (see table below).
3. Phase 1+ defines what projectiles the domain automatically spawns in waves.
4. Hold down cast to charge your ultimate, then release to expand.

#### Activation Cost

- **1000 base mana** for the domain behavior alone.
- Plus all shape/effect costs from other phases, multiplied by the multi-phase formula.
- Necromancer class doubles the ultimate cost (paying 20k+ instead of 10k+).
- Consumes your total accumulated mana pool (not regular mana).

#### What Happens Inside a Domain

| Effect | Value |
|---|---|
| **Spell damage boost** | +30% to all your spells |
| **Movement speed boost** | +40% player movement |
| **Incoming damage reduction** | -35% damage taken |
| **Platform removal** | All platforms inside the domain boundary vanish (restored on collapse) |
| **Duration** | 60 seconds (3600 frames) |
| **Size** | 1.8× canvas width/height (Dominion class: +30% larger) |
| **Screen shake** | Intensity 25–30 for 45–50 frames on activation |

#### Domain Shape Effects

The shape you choose for Phase 0 determines the domain's unique mechanic:

| Shape | Domain Effect |
|---|---|
| **Nova** | Instant shockwave on activation — damages all enemies for `power × 5`, knocks them away, 40 shockwave particles |
| **Vortex** | Continuous pull-to-center (1.5 strength/frame) for entire domain duration |
| **Polygon** | Continuous push-from-center (1.2 strength/frame) — scatter enemies outward |
| **Chain** | Periodic 30-frame stun on all grounded enemies inside domain |
| **Wall** | Domain is 50% larger (1.5× multiplier stacks with Dominion's 1.3×) |
| **Same** | Buff-only domain — no projectile waves, just the stat boosts |
| **Spike** | Projectile waves erupt upward from the ground |
| **Meteor** | Projectile waves rain from the top of the domain (+75% damage) |
| **Ring** | Projectile waves spawn from domain center outward |
| **Other** | Projectile waves spawn at random positions throughout the domain |

#### Domain Projectile Waves

Over the 60-second duration, the domain fires **35 waves** of projectiles from Phase 1+:
- Waves spawn every 80–130 frames (1.3–2.2 seconds apart).
- All projectiles are **forced to homing behavior** (exceptions: meteor and spike keep straight).
- Domain projectiles **bypass diminishing returns** (no damage reduction from multi-hit).
- Domain projectiles with `phaseThrough` effect get **no damage penalty** (normally -45%).
- Power is capped at `10 × (1 + magicPower × 0.08) × vowPowerMult` per projectile.

#### Element Matching

The domain has an element (from `domainElement`, default "burn"). When your spells match the domain's element:
- **Matching element** (e.g., burn spell in burn domain): **225% damage** (2.25×)
- **Any spell in active domain**: **150% damage** (1.5×) minimum

#### Domain Collapse

After 60 seconds, the domain collapses:
- "Domain Collapse" message appears.
- All hidden platforms are restored.
- All buffs end instantly.

---

### Vows — Sacrifice & Power

Vows are sacred contracts where you **sacrifice something to gain power**. You have **3 vow slots**, each containing one sacrifice and one or more boosts.

#### Sacrifice Types (What You Give Up)

| Sacrifice | Effect | Details |
|---|---|---|
| **Health** | Reduces max HP by a percentage | Caps at 90% HP loss. A 50-point health sacrifice = 50% less max HP. |
| **Max Mana** | Reduces your mana pool | Applied as: `max(100, 1500 - penalty)`. Even at maximum sacrifice, you keep 100 mana. |
| **Spell Slots** | Locks specific spell slots | Locked slots show 🔒 and cannot be cast. Frees up vow points to boost remaining slots. |
| **Effects** | Removes specific effects from all spells | Any spell with a locked effect has that effect stripped on cast. |
| **Shapes** | Bans specific shapes | Any spell using a banned shape gets forcibly converted to `missile`. |
| **Movement** | Reduces movement speed | -1% speed per point of penalty (minimum 50% speed). |
| **Visibility** | Creates fog-of-war overlay | Strength = `min(penalty, 60) / 100`. At 60+, you can barely see beyond your character. |
| **Item Slots** | Disables equipment slots | Sacrificed slots cannot equip items. Lose those stat bonuses. |

#### Boost Types — Global (Apply to All Spells)

| Boost | Per Point | Details |
|---|---|---|
| **Max Health** | +8% bonus HP | `vowMaxHealthBonus += amount × 8` |
| **Jump Height** | +8% jump boost | Stacks with items and class bonuses |
| **Player Speed** | +8% movement speed | Stacks multiplicatively with movement penalty if both are vowed |
| **Defense** | -5% damage taken | Caps at 70% damage reduction (min 30% damage taken) |
| **Elemental Damage** | +7% for burn/freeze/poison/stun spells | Only applies to spells that have an elemental effect |
| **Crit Chance** | Flat crit % increase | Adds to base critical hit chance |
| **Spell Vamp** | Healing on damage dealt | Passive lifesteal from all spell damage |
| **Thorns** | Damage reflection | Enemies take damage when they hit you |
| **Mana Efficiency** | -2.5% mana cost on all spells | Global cost reducer, stacks with Magic Control discount |

#### Boost Types — Per-Spell-Slot (Apply to One Slot Only)

These are assigned to a specific spell slot via `targetSlot`:

| Boost | Per Point | Details |
|---|---|---|
| **Power** | +12% damage | Multiplicative with all other damage bonuses |
| **Size** | +10% projectile size | Bigger hitboxes = easier to hit |
| **Speed** | +10% projectile velocity | Faster projectiles reach targets sooner |
| **Count** | +1 projectile (flat) | Capped at 20 total. Extra projectiles = extra hits |
| **Duration** | +10% projectile lifetime | Longer-lived projectiles travel farther and persist longer |
| **Effects** | +15% effect power/duration | Burn ticks harder, freeze lasts longer, etc. |
| **Mana Cost** | -5% mana cost for this slot | Slot-specific discount on top of global efficiency |
| **Cooldown** | -8% cooldown for this slot | Cast this spell more frequently |
| **Size Bonus** | +50% size (if flagged) | Binary flag — either on or off, gives flat 50% |

#### Vow Strategy

The key to vows is **specialization**. Lock away things you don't use to supercharge things you do:
- Lock 3 spell slots you never cast → boost the 2 spells you rely on with +power, +count, +effects.
- Sacrifice HP → gain defense (you end up roughly the same survivability but with extra room for offensive boosts).
- Ban shapes you never use → free points for elemental damage boosts.
- Sacrifice visibility → gain mana efficiency for nearly free spells (if you can handle the fog).

---

### Mage Classes

Classes provide permanent passive bonuses and define your playstyle. Selected once via the class NPC.

#### None (Default)
- No bonuses, no penalties. A blank slate.

#### Warrior
- **Movement speed:** 7.5 (vs 7.0 base) — fastest class.
- **Magic Defence:** +10 flat bonus (+60 max HP).
- **Spell range:** -40% duration/range on all spells.
- **Melee damage bonus:** Spells that hit within 200px deal **+50% damage**. Hits within 350px deal **+20%**. Beyond 350px, no bonus.
- **Sword attack:** Gains a physical melee slash mechanic.
- **Playstyle:** Get close. Your spells hit harder at point-blank range but fizzle at distance. Use slash shape, groundSurge, and underfoot behavior to maximize melee presence. The +10 defence and extra speed keep you alive up close.

#### Ranger
- **Spell range/duration:** +60% on all spells — projectiles fly 60% farther and last 60% longer.
- **Max HP:** -15% penalty.
- **Distance damage bonus:** Up to **+80% damage** based on how far the projectile has traveled (max at 1000px distance, scaling linearly).
- **Playstyle:** Stay far away. Your spells get stronger the farther they fly. Meteor + lob + ranger = maximum distance damage stacking. The HP penalty means you need to avoid getting hit.

#### Healer
- **Healing effectiveness:** +40% on all healing effects (`healSelf`, `damageHeal`).
- **Damage dealt:** -20% penalty on all offensive spells.
- **Playstyle:** Support-oriented. Build dedicated healing spells (allyOrb + selfCast + healSelf) and sustain through any fight. Your damage is lower, but you're nearly unkillable with good heal rotations. Shield effect is not boosted — only HP healing.

#### Dominion Master
- **Domain size:** +30% larger domain expansion field.
- **Domain projectile damage:** +40% on all projectiles spawned by your domain.
- **No penalties.**
- **Playstyle:** Domain-centric. Everything you do is about getting your ultimate charged and expanding. The larger domain catches more enemies, and +40% damage on 35 waves of homing projectiles is devastating. Build your non-domain spells for fast mana accumulation.

#### Necromancer
- **Domain summon:** In a domain expansion with summon shape, spawns **3 powerful bestiary enemies** as allies. Summon power = `phase power × 2.5`.
- **Summon selection:** In the spell editor, can browse your defeated-enemies bestiary to pick which enemy to summon.
- **Ultimate cost:** Doubled (20k+ mana instead of 10k+).
- **Playstyle:** Collect powerful enemies in your bestiary, then summon them as allies via domain expansion. The doubled cost means you need longer to charge, but having 3 powerful allies fighting for you for 60 seconds is game-changing.

---

### Item Grant Quick Map

Some shapes, behaviors, and effects require specific items equipped to unlock:

| Item | Unlocks |
|---|---|
| **Stardust Staff** | Meteor |
| **Void Staff** | Vortex |
| **Blood Staff** | Lifesteal, Leech Mana |
| **Elder Staff** | Chain |
| **Shadow Robe** | Blind |
| **Void Robe** | Phase Through |
| **Celestial Robe** | Teleport, Wall |
| **Chaos Orb** | Ricochet, Boomerang |
| **Sun Medallion** | Cone, Ring |
| **Moon Pendant** | Spiral, Zigzag |
| **Crystal Crown** | Polygon, Spike |
| **Phoenix Feather** | Heal Self, Damage Heal, Damage Store, Damage Release |
| **Dragon Heart** | Blade, Shatter |
| **World Seed** | Gravity Well, Ground Surge |
| **Eye of Eternity** | Phase Fork, Mark |

Items can also be unlocked through vows at a cost of **5 vow points per unlock**, bypassing the equipment requirement.

---

### Rank Unlocks

Shapes, behaviors, and effects are gated behind your player rank:

| Rank | Name | Shapes Unlocked | Behaviors Unlocked |
|---|---|---|---|
| 0 | Novice | Missile, Orb, Ally Orb, Same | Straight, Stationary, Self Cast |
| 1 | Apprentice | Blade, Spike, Polygon, Solidify, Slash | Lob, Underfoot |
| 2 | Adept | Beam, Cone, Wall | Homing, Boomerang, Ground Surge |
| 3 | Mage | Ring, Nova, Meteor | Around Self, Ground, Zigzag |
| 4 | Archmage | Chain, Vortex, Summon | Orbit, Rain, Barrage, Teleport |
| 5 | Grandmaster | — | Domain |

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

### IRON FORGE ENEMIES

#### 21) Iron Sentinel
**File target:** `images/enemies/iron-sentinel-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Iron Sentinel — armored mechanical guardian, about 44×56 pixel logical size. Dark gunmetal-grey body (#4a4a5a) made of riveted iron plates, lighter steel-grey (#6a6a7a) highlights along pauldrons and joints, bulky square torso with a single glowing orange slit visor for a face, thick segmented arms ending in heavy iron gauntlets, blocky armored legs with pistons at the knees, faint orange forge-glow seeping from gaps between plates, a heavy iron shield fused to the left arm, slow imposing posture. Dark fantasy dungeon enemy.
>
> Row 1 – Idle animation: standing guard, visor glow pulsing faintly, steam wisps from joints, slight mechanical hum sway.
>
> Row 2 – Walk animation: heavy clanking march forward, pistons compressing at knees, each step shaking the ground slightly.
>
> Row 3 – Attack animation: raises right gauntlet and slams downward, orange sparks erupting on impact, shield arm braces forward.
>
> Row 4 – Defeat animation: visor dims, plates buckle and pop rivets, collapses forward into a pile of scrap metal with sparks scattering.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy dungeon style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### 22) Forge Drone
**File target:** `images/enemies/forge-drone-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Forge Drone — small flying mechanical construct, about 24×24 pixel logical size. Compact rounded copper-orange body (#cc6622) with bright amber-orange (#ff8844) glowing propulsion vents on the sides, a single large red-orange lens eye in the center, two small articulated grabber arms beneath, thin rotating gear-blade propeller on top keeping it airborne, faint heat shimmer below from exhaust, trails a faint orange spark stream when moving. Dark fantasy dungeon enemy.
>
> Row 1 – Idle animation: hovering with gentle bobbing, propeller spinning, lens eye scanning left and right, grabber arms twitching.
>
> Row 2 – Fly/Move animation: tilts forward and zips through the air, spark trail intensifying, grabber arms tucked.
>
> Row 3 – Attack animation: lens flares bright red, fires a concentrated orange energy bolt from the eye, recoil pushes it back slightly.
>
> Row 4 – Defeat animation: propeller sputters and stops, sparks shower from cracked lens, tumbles and crashes to the ground in pieces.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy dungeon style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### 23) Slag Brute
**File target:** `images/enemies/slag-brute-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Slag Brute — hulking molten-metal humanoid, about 52×60 pixel logical size. Massive broad-shouldered body made of dark scorched iron-brown (#553322) with glowing cracks of molten copper-orange (#774433) running through the surface, heavy hunched posture, enormous fists that drag near the ground, a crude face with two deep-set glowing orange ember eyes and a jagged mouth leaking molten drips, thick stumpy legs, patches of still-cooling slag crusted on shoulders and back, radiates intense heat shimmer. Dark fantasy dungeon enemy.
>
> Row 1 – Idle animation: standing with fists clenched, molten cracks pulsing with heat, occasional molten drip from jaw, heavy breathing rise and fall.
>
> Row 2 – Walk animation: lumbering forward with earth-shaking steps, arms swinging wide, molten flecks scattering from body.
>
> Row 3 – Attack animation: rears back and throws a massive overhead double-fist slam, molten slag splashes outward on impact, ground cracks beneath.
>
> Row 4 – Defeat animation: molten glow fades to dull grey, body hardens and cracks like cooling lava, shatters into dark slag chunks and ash.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy dungeon style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### IRON FORGE BOSS

#### 24) The Iron Colossus
**File target:** `images/enemies/iron-colossus-sheet.png`  
**Sheet size:** `2048×2048 px` (large boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: The Iron Colossus — towering mechanical war-golem boss, about 500×400 pixel logical size. Colossal body of dark blackened iron (#3a3a4a) with lighter gunmetal-grey (#5a5a6a) segmented armor plates, enormous barrel-shaped torso covered in rivets and welded seams, two massive piston-driven arms with giant forge-hammer fists that could flatten buildings, thick pillar legs with hydraulic joints glowing faintly orange from internal furnace, a relatively small angular head with a single visor slit blazing bright orange-white like a furnace window, smokestacks on the shoulders venting dark smoke and orange embers, glowing molten-orange energy core visible through a cracked chest plate, chains and broken anvils hanging from the waist as trophies. Epic dark fantasy dungeon boss.
>
> Row 1 – Idle animation: standing titanic, furnace core pulsing, smokestacks billowing, ground cracking beneath its weight, visor glow intensifying and dimming.
>
> Row 2 – Walk animation: earth-trembling march forward, each step causing visible shockwaves, pistons pumping, chains swaying, embers raining from shoulders.
>
> Row 3 – Attack animation: raises both colossal hammer-fists overhead and brings them crashing down, massive shockwave erupting outward, molten sparks and debris flying, furnace core blazing white-hot.
>
> Row 4 – Defeat animation: furnace core destabilizes and overloads with blinding orange light, armor plates blow outward one by one, internal skeleton frame collapses into a mountain of twisted metal and cooling embers.
>
> Style: clean digital pixel-art sprite sheet, epic dark fantasy boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### CORRUPTED SYLVARIS ENEMIES

#### 25) Dark Vine Crawler
**File target:** `images/enemies/dark-vine-crawler-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Dark Vine Crawler — low-slung corrupted plant creature, about 38×18 pixel logical size. Flat wide body made of twisted dark purple-black vines (#2a1a2a) with sickly purple (#4a2a4a) thorns and barbs along spine, multiple vine-tendril legs splayed to the sides like a centipede, two small glowing magenta eyes at the front, a fang-lined maw dripping dark purple ichor, faint purple corruption aura flickering around the body, leaves along the back are wilted and blackened with purple veins. Dark fantasy corrupted underground enemy.
>
> Row 1 – Idle animation: crouched low, tendrils twitching, corruption aura pulsing, eyes scanning, slight body undulation.
>
> Row 2 – Crawl/Move animation: skittering rapidly forward on vine legs, body rippling like a wave, corruption trail left behind.
>
> Row 3 – Attack animation: rears front half up, vine tendrils lash forward in a whip strike, maw snaps, purple energy burst at point of impact.
>
> Row 4 – Defeat animation: vines unravel and wither, purple glow fades, body collapses into a pile of dead blackened vines and dissipating purple mist.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy dungeon style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### 26) Dark Thorn Wolf
**File target:** `images/enemies/dark-thorn-wolf-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Dark Thorn Wolf — corrupted wolf-like beast made of thorny vines, about 36×28 pixel logical size. Sleek predatory body formed from woven dark indigo-black vines (#1a1a2a) with dark purple (#3a2a4a) thorn spikes along the spine and legs, four lean muscular vine-legs ending in sharp thorn claws, angular wolf head with pointed vine ears, glowing magenta-purple eyes, open snarling mouth with thorn-teeth, a bushy tail of frayed dark vines trailing purple wisps, faint purple corruption aura around paws and muzzle. Dark fantasy corrupted underground enemy.
>
> Row 1 – Idle animation: standing alert, ears twitching, tail swishing, corruption aura flickering at paws, low growl posture.
>
> Row 2 – Run animation: bounding forward in a wolf gallop, thorn spikes bristling, vine body stretching and compressing, purple wisps trailing.
>
> Row 3 – Attack animation: lunges forward with jaws open wide, thorn claws slashing, burst of purple energy on bite impact, body coiling for the strike.
>
> Row 4 – Defeat animation: vine body unravels starting from tail, thorns fall away, purple glow drains, collapses into a scatter of dead vines and fading purple sparks.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy dungeon style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### 27) Dark Moss Wraith
**File target:** `images/enemies/dark-moss-wraith-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Dark Moss Wraith — floating corrupted nature spirit, about 30×44 pixel logical size. Tall slender ghostly figure made of dark blackish-green (#1a2a1a) decayed moss and fungal matter, body tapers to a wispy trail at the bottom (no legs — floats), darker green (#2a3a2a) mold patches and dripping corruption ooze along the torso, long thin arms ending in clawed mossy fingers, a hooded head shape formed from drooping moss with two glowing sickly yellow-green eyes peering from the shadows beneath, faint green-purple miasma cloud drifting around the body, small glowing spore particles orbiting slowly. Dark fantasy corrupted underground enemy.
>
> Row 1 – Idle animation: floating with gentle vertical bobbing, moss tendrils swaying, miasma pulsing, spore particles drifting lazily.
>
> Row 2 – Float/Move animation: gliding forward with body tilted slightly, moss trailing behind like a tattered cloak, miasma thickening in wake.
>
> Row 3 – Attack animation: arms thrust forward, launches a volley of glowing toxic spore projectiles, eyes flare bright, miasma surges outward.
>
> Row 4 – Defeat animation: moss body dries and crumbles from top down, eyes dim, spore particles scatter and fade, remains drift to ground as dead moss and dust.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy dungeon style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

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

#### 20) The Chrono Tyrant
**File target:** `images/enemies/chrono-tyrant-sheet.png`  
**Sheet size:** `2048×2048 px` (large boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: The Chrono Tyrant — imposing temporal sorcerer raid boss, about 180×260 pixel logical size. Wears a long flowing dark midnight-blue robe edged with ornate golden clockwork trim, the robe obscures the lower body entirely (tapers to ragged floating hem), inner robe fabric glows faintly with warm golden temporal energy, broad armored shoulders with golden clock-gear pauldrons, long dark arms with golden gauntlets that emanate faint golden light, a dark angular hood framing a shadowed face with two piercing golden glowing eyes that leave light trails, a large ornate golden clock emblem on the chest with slowly turning hands, faint golden clock-gear particles orbit the body at mid-height, hovers above the ground with golden energy wisps trailing beneath the robe, radiates an aura of ancient unstoppable time magic. Epic dark fantasy raid boss.
>
> Row 1 – Idle animation: floating with gentle vertical bobbing, arms slightly outstretched with gauntlets pulsing golden light, orbiting clock-gears rotating slowly, robe swaying.
>
> Row 2 – Float/Move animation: gliding forward with slight forward lean, robe trailing behind, clock-gear orbit speeds up, golden energy wisps intensify.
>
> Row 3 – Attack animation: arms thrust forward, gauntlets blaze with golden temporal energy, launches golden vortex and clock-hand projectiles, chest clock emblem flares brightly, robe billows outward.
>
> Row 4 – Defeat animation: clock emblem cracks and shatters, robe unravels into golden temporal wisps, body dissolves from extremities inward into golden clock fragments and fading time particles.
>
> Style: clean digital pixel-art sprite sheet, epic dark fantasy raid boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

## Player Sprite Sheet

#### 21) Player Character — Battle Mage
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

### NPC COMBATANTS

#### 21) Captain Dorn — City Guard Captain
**File target:** `images/enemies/captain-dorn-sheet.png`

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game NPC boss combatant.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Captain Dorn, battle-hardened male city guard captain, about 44×88 pixel logical size, heavy dark steel plate armor with gold trim accents, large pauldrons on each shoulder, long jagged scar across left eye, massive two-handed greatsword, short cropped dark hair, stern intimidating expression, dark leather boots, gold belt buckle. Fantasy military commander design.
>
> Row 1 – Idle animation: standing with greatsword resting on shoulder, slight breathing motion, armor catching faint light, weight shifting subtly between feet.
>
> Row 2 – Walk/Run animation: aggressive forward march with greatsword held at side, heavy armored footsteps, cape or shoulder cloth flowing behind, determined charging pose.
>
> Row 3 – Attack animation: wide horizontal greatsword slash combo, sword sweeping in a powerful arc with golden energy trail, follow-through heavy slash, body twisting with force, sparks flying from blade tip.
>
> Row 4 – Defeat animation: staggers backward dropping to one knee, greatsword plants into ground for support, armor sparking and dented, final frame collapsed with sword fallen beside him.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

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
> Wide parallax side-scroller background, lush green rolling hills, bright blue sky with soft clouds, glowing arcane wildflowers (pink, blue, gold) scattered across meadows, sparkling magical particles in the air, small crystal formations growing from the ground, serene and inviting tutorial area, polished 2D game art, no characters, no text.

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

### Sylvaris Wildes Enemies

Each prompt below generates a **horizontal sprite sheet** with 4 rows: Idle, Walk, Attack, Death. 4–6 frames per row, transparent background, side-view facing right.

#### Thorn Wolf
**File target:** `images/enemies/thornWolf.png` (512×512)
> Clean 2D pixel-art sprite sheet. A feral wolf covered in bark-like armor and thorny vines, dark green-brown fur, glowing amber eyes, lean muscular build, thorn spikes along its spine, 4 rows × 6 columns, dark fantasy game style.

#### Spore Fungus
**File target:** `images/enemies/sporeFungus.png` (512×512)
> Clean 2D pixel-art sprite sheet. A large sentient mushroom creature with a bulbous brown-orange cap spotted with pale dots, thick stubby stem legs, releasing spore clouds, 4 rows × 6 columns, dark fantasy game style.

#### Moss Wraith
**File target:** `images/enemies/mossWraith.png` (512×512)
> Clean 2D pixel-art sprite sheet. A ghostly floating wraith made of tangled moss and vines, glowing green eyes, translucent body trailing green wisps, spectral forest spirit, 4 rows × 6 columns, dark fantasy game style.

#### Willow Wisp
**File target:** `images/enemies/willowWisp.png` (512×512)
> Clean 2D pixel-art sprite sheet. A small floating orb of pale green-white light, flickering ethereal glow, tiny leaf-like wings, magical forest wisp, delicate and luminous, 4 rows × 6 columns, dark fantasy game style.

#### Glow Beetle
**File target:** `images/enemies/glowBeetle.png` (512×512)
> Clean 2D pixel-art sprite sheet. A large armored beetle with a bioluminescent blue-teal shell, six segmented legs, mandibles, glowing patterns on its carapace, cave-dwelling insect, 4 rows × 6 columns, dark fantasy game style.

#### Stalactite Bat
**File target:** `images/enemies/stalactiteBat.png` (512×512)
> Clean 2D pixel-art sprite sheet. A large cave bat with rocky stalactite-like growths on its wings and body, grey-purple coloring, red glowing eyes, leathery wings, 4 rows × 6 columns, dark fantasy game style.

#### Deep Root Horror
**File target:** `images/enemies/deepRootHorror.png` (1024×1024, mini-boss)
> Clean 2D pixel-art sprite sheet. A massive underground horror made of twisted dark roots and corrupted wood, pulsing purple corruption core in its chest, multiple tendril-like arms, glowing violet eyes, towering and menacing, 4 rows × 4 columns, dark fantasy boss style.

#### Sky Vine
**File target:** `images/enemies/skyVine.png` (512×512)
> Clean 2D pixel-art sprite sheet. A tall sentient vine creature growing from a tree branch, bright green with thorns, leaf-blade appendages, animated whipping motion, treetop plant monster, 4 rows × 6 columns, dark fantasy game style.

#### Wind Sylph
**File target:** `images/enemies/windSylph.png` (512×512)
> Clean 2D pixel-art sprite sheet. An ethereal wind spirit with a translucent blue-white humanoid form, swirling air currents around its body, flowing wispy hair, graceful and dangerous, 4 rows × 6 columns, dark fantasy game style.

#### Elder Treant
**File target:** `images/enemies/elderTreant.png` (1024×1024, mini-boss)
> Clean 2D pixel-art sprite sheet. A colossal ancient tree creature with a face carved into its trunk, massive branch-like arms, green canopy crown, roots for legs, bark armor, glowing green eyes, imposing and ancient, 4 rows × 4 columns, dark fantasy boss style.

#### Storm Raptor
**File target:** `images/enemies/stormRaptor.png` (1024×1024, mini-boss)
> Clean 2D pixel-art sprite sheet. A huge predatory bird wreathed in lightning, dark blue-purple plumage, crackling electric aura, sharp golden beak and talons, storm clouds trailing behind its wings, fierce and powerful, 4 rows × 4 columns, dark fantasy boss style.

---

### DRAGON GRAVEYARD ENEMIES

#### Bone Wraith
**File target:** `images/enemies/boneWraith.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Bone Wraith, a ghostly floating undead spirit haunting a dragon graveyard, about 32×50 pixel logical size, tattered dark purple-violet cloak that frays into wisps at the bottom edge, no visible legs — body dissolves into a spectral trail, pale bone-white skull head with two glowing magenta-purple eye sockets, skeletal clawed hands reaching from the cloak, faint purple ethereal aura surrounding the body, ancient and menacing dark fantasy enemy.
>
> Row 1 – Idle animation: floating in place, cloak wavering like smoke, glowing eyes pulsing softly, wispy trail drifting below.
>
> Row 2 – Float/Move animation: gliding forward smoothly, cloak trailing behind, body tilting forward aggressively, purple particle trail.
>
> Row 3 – Attack animation: surges forward with skeletal hands extended, fires a glowing purple shadow bolt from palms, eyes flare bright magenta, cloak billows outward.
>
> Row 4 – Defeat animation: cloak shreds apart into purple wisps, skull cracks and shatters, body dissolves into fading purple embers and bone fragments.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### Frost Hatchling (Baby Ice Dragon — Mini-Boss)
**File target:** `images/enemies/babyDragon.png` (1024×1024, boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game mini-boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Frost Hatchling, a young ice dragon recently hatched from ancient remains, about 120×90 pixel logical size, pale icy blue-white scaled body with a lighter blue-white underbelly, small but sharp translucent ice-blue wings with visible membrane veins, rounded head with two small curved ice-white horns, large bright cyan glowing eyes with curious but fierce expression, short snout with wisps of frost breath escaping the nostrils, stubby but clawed legs, a medium-length tail ending in an icicle-like tip, frost crystals growing along spine ridges, overall youthful dragon proportions — large head relative to body, compact wings, chubby torso. Menacing yet somewhat adorable dark fantasy mini-boss.
>
> Row 1 – Idle animation: standing with wings folded, frost breath puffing from nostrils, tail swishing gently, ice crystals on body glimmering.
>
> Row 2 – Walk/Move animation: trotting forward with small wing flaps for balance, body bouncing slightly, frost particles trailing behind.
>
> Row 3 – Attack animation: rears back, opens mouth wide and unleashes a cone of ice breath with swirling frost particles and ice shards, wings spread outward, eyes glow intensely brighter cyan.
>
> Row 4 – Defeat animation: stumbles, ice crystals on body crack and shatter, collapses onto side, body slowly freezes into a translucent ice statue that cracks apart into sparkling ice dust.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### STORM ISLANDS NPC

#### Marek the Fisherman
**File target:** `images/npcs/marek-sheet.png` (512×512)

**Prompt:**
> 2D pixel-style character sprite sheet, 6 columns × 4 rows, transparent background.
> A weathered middle-aged fisherman NPC, tanned sun-darkened skin, short scruffy brown hair with grey streaks, kind tired eyes, wearing a faded blue fisherman's tunic with rolled-up sleeves, tan trousers tucked into worn leather boots, a rope belt with a fish hook hanging from it, a wide-brimmed straw sun hat, carries a simple wooden fishing rod over one shoulder.
> Row 1: idle (standing with rod, looking out to sea).
> Row 2: walk cycle (casual stroll, rod bouncing on shoulder).
> Row 3: talking (hand gesturing, expressive face, rod lowered).
> Row 4: alarmed (pointing toward the volcano, wide eyes, hat blowing).
> Fantasy RPG style, clean outlines, side-view facing right.

---

### STORM ISLANDS ENEMIES

Each prompt below generates a **horizontal sprite sheet** with 4 rows: Idle, Walk, Attack, Death. 4–6 frames per row, transparent background, side-view facing right.

#### Flame Salamander
**File target:** `images/enemies/flameSalamander.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Flame Salamander, a long low-slung fire lizard, about 48×24 pixel logical size, dark charcoal-grey body with bright orange-red fire markings running along its spine and flanks, four short muscular legs with clawed feet, a long thick tail that tapers to a glowing ember tip, flat wide head with a broad jaw, two small glowing orange eyes, faint heat shimmer aura around the body, volcanic fire creature.
>
> Row 1 – Idle animation: standing low to the ground, tail swishing slowly, fire markings pulsing with faint glow, tongue flicking.
>
> Row 2 – Walk animation: low scurrying motion, legs moving in a quick alternating gait, body undulating side-to-side like a real salamander, ember tip trailing sparks.
>
> Row 3 – Attack animation: rears upper body up slightly, opens mouth wide and spits three small fireballs in a spread pattern, fire markings flare bright orange-red.
>
> Row 4 – Defeat animation: legs buckle, body rolls onto side, fire markings dim and fade to dark grey, body crumbles into cooling ash and embers.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

#### Magma Imp
**File target:** `images/enemies/magmaImp.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Magma Imp, a small mischievous volcanic demon, about 32×40 pixel logical size, dark obsidian-black skin with bright orange-red magma crack lines running across the torso, arms, and face, two short curved horns on the forehead glowing faintly orange at the tips, large bright yellow-orange glowing eyes with a wicked expression, pointed ears, sharp teeth visible in a wide grin, thin wiry arms and legs, clawed three-fingered hands, a short pointed tail, small and agile dark fantasy enemy.
>
> Row 1 – Idle animation: standing with a menacing crouch, magma cracks pulsing with light, hands flexing, tail twitching.
>
> Row 2 – Walk animation: quick darting movement, hunched forward, arms swinging, magma cracks flickering with each step.
>
> Row 3 – Attack animation: leaps into the air with arms raised, hurls a glowing orange magma bolt downward, magma cracks flare intensely bright, landing with a small lava splash.
>
> Row 4 – Defeat animation: magma cracks dim to dark, body stiffens and cracks like cooled lava, shatters into black obsidian fragments and orange sparks.
>
> Style: clean digital pixel-art sprite sheet, dark fantasy game style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### STORM ISLANDS BOSS

#### Pyraxis, The Fire Colossus
**File target:** `images/enemies/fireColossus.png` (2048×2048, large boss)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 4 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Pyraxis, The Fire Colossus — a massive living volcano titan boss, about 380×300 pixel logical size. Dark volcanic-grey rocky body with deep glowing orange-red magma veins running through every joint and crevice, enormous broad torso covered in jagged volcanic rock plates with bright lava visible between the cracks, two massive arms ending in huge rocky fists with lava dripping from the knuckles, thick pillar-like legs with magma pooling at the feet, a crowned head with two enormous curved horns made of dark volcanic rock glowing orange at the tips, a deep-set face with two blazing yellow-white eyes like molten metal, a wide jaw with lava dripping from the corners, a radial heat aura distortion surrounding the body, glowing orange-red core visible in the center of the chest, volcanic smoke and ember particles rising from the shoulders. Towering apocalyptic dark fantasy dungeon boss.
>
> Row 1 – Idle animation: standing imposingly, magma veins pulsing rhythmically, smoke rising from shoulders and horns, chest core throbbing with deep orange light, ground glowing faintly beneath its feet.
>
> Row 2 – Walk/Move animation: slow thundering steps, each footfall causing lava to splash outward, arms swinging with molten rock dripping, volcanic tremor effect, ember particles trailing.
>
> Row 3 – Attack animation: raises both fists overhead, chest core blazes white-hot, slams the ground causing a massive lava eruption with magma pillars shooting upward, shockwave cracks spreading across the ground, horns glowing intensely.
>
> Row 4 – Defeat animation: magma veins flicker and dim, body cracks along every vein line, chest core sputters and goes dark, massive chunks of volcanic rock break away and crumble, body collapses into a mountain of cooling stone and fading embers, final wisp of smoke rising.
>
> Style: clean digital pixel-art sprite sheet, epic dark fantasy boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### SEA TEMPLE ENEMIES

#### Abyssal Guardian
**File target:** `images/enemies/abyssalGuardian.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Abyssal Guardian — a large, slow, armored deep-sea fish-warrior, about 40×48 pixel logical size. Dark blue-black scaled body covered in ancient barnacle-encrusted plate armor, two thick armored fins used as shield-like arms, a massive jaw with rows of glowing blue-white teeth, two deep-set eyes glowing pale cyan, heavy tail with armor plates, bioluminescent markings running down the sides of the body pulsing faintly, an ancient coral-encrusted helmet fused to the head, trailing strands of deep-sea kelp hanging from the armor joints. Intimidating deep ocean sentinel.
>
> Row 1 – Idle animation: hovering in place, armored fins held defensively, bioluminescent markings pulsing slowly, jaw slightly opening and closing, small bubbles rising from the gills.
>
> Row 2 – Walk/Move animation: slow powerful swimming strokes, armored fins pushing water, tail sweeping side to side, kelp strands trailing behind, faint water current distortion.
>
> Row 3 – Attack animation: lunges forward with jaw wide open, armored fin swings in a crushing strike, bioluminescent markings flare bright cyan, shockwave ripple in the water, teeth glowing intensely.
>
> Row 4 – Hurt/Defeat animation: recoils backward, armor plates crack and chip, bioluminescent markings flicker and fade, sinks downward, eyes dim, armor fragments floating away.
>
> Style: clean digital pixel-art sprite sheet, dark underwater fantasy style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### Coral Sentinel
**File target:** `images/enemies/coralSentinel.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Coral Sentinel — a living coral construct creature, about 36×36 pixel logical size. Body made entirely of vibrant living coral in shades of deep red, orange, purple, and teal, a rounded central mass with branching coral arms extending outward like thorny appendages, sharp coral spines protruding from the back and shoulders, two glowing amber eyes set deep in a coral face-like formation, small bioluminescent polyps dotting the surface that pulse with light, tiny sea anemone tendrils around the base, hard calcified armor sections on the torso. Ancient temple guardian animated by deep-sea magic.
>
> Row 1 – Idle animation: swaying gently as if in a current, coral branches shifting subtly, polyps pulsing with soft amber light, small particles of sand drifting around the base.
>
> Row 2 – Walk/Move animation: lurching forward on coral limb-like extensions, branches rattling and clicking, polyps flashing brighter with each step, small coral fragments breaking off and regrowing.
>
> Row 3 – Attack animation: coral spines extend outward sharply, launches a volley of spine projectiles, body flares with bright amber-orange light, polyps all pulse simultaneously, sharp crackling energy around the spines.
>
> Row 4 – Hurt/Defeat animation: coral branches snap and shatter, polyps go dark, body crumbles into coral rubble, amber eyes fade to grey, fragments scatter in the water.
>
> Style: clean digital pixel-art sprite sheet, underwater fantasy style with vivid coral colors, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### Depth Serpent
**File target:** `images/enemies/depthSerpent.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Depth Serpent — a fast, sleek deep-sea snake creature, about 50×20 pixel logical size (long and low). Dark teal-green scaled body that transitions to pale bioluminescent blue along the underbelly, a narrow angular head with a pointed snout and two glowing green slit-pupil eyes, a long sinuous body with fin-like ridges running along the spine, a forked tail fin, rows of tiny sharp teeth visible when the mouth opens, faint venom dripping from the fangs glowing sickly green, undulating body movement like a sea snake. Swift and deadly predator of the deep temple.
>
> Row 1 – Idle animation: coiled loosely with head raised alertly, body undulating in a slow S-curve, green eyes scanning, tongue flicking out, spine fins rippling gently.
>
> Row 2 – Walk/Move animation: rapid serpentine swimming, body forming fluid S-waves, spine fins flattened for speed, water trail behind, eyes locked forward, incredible speed suggested by motion blur on tail.
>
> Row 3 – Attack animation: lunges with mouth wide open revealing venomous fangs, body coils and strikes like a spring, venom spray from fangs glowing green, spine fins flare outward, impact ripple effect.
>
> Row 4 – Hurt/Defeat animation: body goes rigid and curls, scales crack revealing pale flesh beneath, green glow fades from eyes, body goes limp and drifts downward, faint venom cloud dissipating.
>
> Style: clean digital pixel-art sprite sheet, dark underwater fantasy style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Leviathan Head

**File target:** `images/enemies/leviathanHead.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss part.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Leviathan Head — the massive angular reptilian skull of an ancient sea serpent boss. Armored blue-green scales with deep ocean teal base (#0a3a5a), glowing cyan eyes (#44ffdd) with slit pupils, long snout lined with rows of crystalline teeth, bioluminescent vein markings along the jaw, fins and tendrils trailing from the back of the skull, luminous cyan (#44ffdd) energy veins pulsing across armored plates.
>
> Row 1 – Idle animation: mouth closed, eyes scanning, jaw tendrils drifting slowly, subtle glow pulse in throat, bioluminescent veins flickering.
>
> Row 2 – Move/Swim animation: head pushing forward through water, jaw streamlined, tendrils swept back by current, eyes locked ahead, faint wake ripples at snout.
>
> Row 3 – Attack animation: mouth opening wide revealing crystalline teeth and energy glow in throat, roaring with cyan energy blast forming, jaw unhinged, tendrils flaring outward, shockwave rings from mouth.
>
> Row 4 – Hurt/Defeat animation: head recoils, scales crack and chip away, cyan glow fades from eyes, jaw drops open limply, tendrils go slack, energy veins dim and flicker out.
>
> Style: clean digital pixel-art sprite sheet, dark underwater fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Leviathan Body

**File target:** `images/enemies/leviathanBody.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss part.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Leviathan Body Segment — a thick serpentine body section of an ancient sea serpent boss. Layered armored scales in dark ocean teal (#0a3a5a) with deep blue underbelly (#0a2040), ridged spine with dorsal fins running along the top, subtle bioluminescent stripes along the sides glowing cyan (#44ffdd), muscular and imposing underwater predator segment.
>
> Row 1 – Idle animation: body segment resting with subtle undulation, scales shimmering, dorsal fins gently waving, bioluminescent stripes pulsing slowly.
>
> Row 2 – Move/Swim animation: body forming fluid S-curve as it swims, dorsal fins flattened for speed, bioluminescent stripes brightening with exertion, water displacement ripples around scales.
>
> Row 3 – Attack animation: scales flare outward defensively, dorsal fins spike up aggressively, bioluminescent stripes flash rapidly, bubble particles erupting from between scales, body tensing for strike.
>
> Row 4 – Hurt/Defeat animation: scales crack and fall away revealing pale flesh, dorsal fins droop and break, bioluminescent glow fades, body segment goes limp and sinks.
>
> Style: clean digital pixel-art sprite sheet, dark underwater fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Leviathan Tail

**File target:** `images/enemies/leviathanTail.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss part.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Leviathan Tail — the massive tail fin of an ancient sea serpent boss. Dark teal armored scales tapering into a thinner flexible tail ending in a wide translucent fin with glowing cyan (#44ffdd) vein patterns, trailing bioluminescent particles, fin edges glow bright cyan, powerful and sweeping.
>
> Row 1 – Idle animation: tail resting horizontal, fin gently waving, bioluminescent particles drifting off fin edges, vein patterns pulsing with slow rhythm.
>
> Row 2 – Move/Swim animation: tail sweeping side to side propelling through water, fin fully extended for thrust, trailing particle wake, vein patterns brightening with each sweep.
>
> Row 3 – Attack animation: tail curling up and swiping/slamming down powerfully, vortex energy gathering at tip, fin edges flaring bright, shockwave ripple from impact, bioluminescent flash.
>
> Row 4 – Hurt/Defeat animation: tail goes rigid then limp, fin tears and becomes ragged, vein glow dims and extinguishes, bioluminescent particles scatter and fade, tail drifts downward.
>
> Style: clean digital pixel-art sprite sheet, dark underwater fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Sand Wraith

**File target:** `images/enemies/sandWraith.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Sand Wraith — a ghostly desert spirit made of swirling sand and tattered burial wraps. Translucent sandy body (#c4a050) with darker sand core (#8a6a30), hollow glowing amber eyes (#ffcc44), wisps of sand constantly shedding from its form, tattered linen bandages trailing behind, faint golden dust aura. Dimensions: 50×58 pixels in-game.
>
> Row 1 – Idle animation: wraith hovering slightly, sand particles swirling around its translucent body, bandage wraps drifting in spectral wind, eyes pulsing with amber glow.
>
> Row 2 – Move/Patrol animation: wraith gliding forward, sand trail streaming behind, body partially dissolving and reforming as it moves, bandages trailing horizontally.
>
> Row 3 – Attack animation: wraith gathering sand into hands and blasting outward, sand vortex forming around body, eyes flaring bright, dust explosion effect from palms.
>
> Row 4 – Hurt/Defeat animation: wraith recoiling as sand scatters, body breaking apart into sand clouds, bandages unraveling, eyes dimming, form fully dissolving into a pile of sand.
>
> Style: clean digital pixel-art sprite sheet, desert fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Tomb Guardian

**File target:** `images/enemies/tombGuardian.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Tomb Guardian — a massive ancient stone golem animated by pyramid magic. Heavy sandstone body (#7a6848) with darker cracks revealing inner amber glow (#ffaa22), Egyptian-style carved face with glowing hieroglyph eyes, thick blocky arms and legs, crumbling stone texture, gold inlay decorating chest and shoulders. Dimensions: 56×68 pixels in-game.
>
> Row 1 – Idle animation: guardian standing firm, subtle amber light pulsing through cracks, hieroglyph eyes scanning slowly, tiny stone fragments occasionally falling from joints.
>
> Row 2 – Move/Patrol animation: guardian taking heavy deliberate steps, ground dust kicking up with each footfall, stone plates grinding visibly, amber light intensifying in leg joints.
>
> Row 3 – Attack animation: guardian raising massive stone fists overhead and slamming down, cracks spreading across arms with bright amber energy, shockwave dust ring from impact, hieroglyphs on chest blazing.
>
> Row 4 – Hurt/Defeat animation: guardian staggering, large stone chunks breaking off revealing hollow amber-lit interior, hieroglyphs flickering out, body crumbling into a pile of rubble.
>
> Style: clean digital pixel-art sprite sheet, desert fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Desert Serpent

**File target:** `images/enemies/desertSerpent.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Desert Serpent — a long venomous snake adapted to desert ruins. Sandy tan scales (#c4a860) with darker diamond pattern (#8a6830) along the back, pale underbelly (#e8d8a0), bright green venom dripping from exposed fangs (#66ff44), narrow slit-pupil yellow eyes, forked tongue flicking, low and wide body profile. Dimensions: 64×30 pixels in-game.
>
> Row 1 – Idle animation: serpent coiled loosely, tongue flicking in and out, scales shimmering, venom drip forming and falling from fangs, eyes darting.
>
> Row 2 – Move/Patrol animation: serpent slithering forward in S-curves, body rippling along the ground, sand trail left behind, diamond pattern shifting with movement.
>
> Row 3 – Attack animation: serpent rearing up and striking forward with open jaws, venom spray launching from fangs, body coiling and springing, forked tongue extended.
>
> Row 4 – Hurt/Defeat animation: serpent recoiling and writhing, scales scattering, body going limp and flattening, venom pooling beneath, eyes closing.
>
> Style: clean digital pixel-art sprite sheet, desert fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Mummy Warrior

**File target:** `images/enemies/mummyWarrior.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Mummy Warrior — a reanimated ancient Egyptian soldier wrapped in decaying linen bandages. Yellowed dirty bandage wrappings (#c4b880) over dark desiccated skin (#4a3828), glowing red eyes peering through face wraps (#ff4444), rusted bronze khopesh sword in one hand, tattered gold-trimmed war skirt, exposed bone visible through torn bandages on arms. Dimensions: 48×62 pixels in-game.
>
> Row 1 – Idle animation: mummy standing alert, bandages swaying, red eyes scanning, khopesh held at ready, dust particles drifting from body.
>
> Row 2 – Move/Patrol animation: mummy shuffling forward with stiff but menacing gait, loose bandages trailing, khopesh dragging slightly, leaving dusty footprints.
>
> Row 3 – Attack animation: mummy swinging khopesh in wide arcs, cursed dark energy trailing the blade, bandages from arm extending outward, red eyes flaring bright, follow-through slash.
>
> Row 4 – Hurt/Defeat animation: mummy staggering back, bandages unraveling rapidly, khopesh dropping, body collapsing into a pile of loose wrappings and bones, red eye glow extinguishing.
>
> Style: clean digital pixel-art sprite sheet, desert fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Scarab Swarm

**File target:** `images/enemies/scarabSwarm.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Scarab Swarm — a writhing mass of enchanted golden scarab beetles moving as one entity. Shimmering gold-green carapaces (#88aa22) with iridescent highlights (#ccdd44), dozens of tiny beetles forming a cohesive shifting blob shape, occasional individual beetles breaking away and rejoining, faint green magical glow binding the swarm, dark mandibles visible on front-facing beetles. Dimensions: 52×40 pixels in-game.
>
> Row 1 – Idle animation: swarm hovering in loose cluster, beetles constantly shifting positions within the mass, green magical threads flickering between individuals, overall shape pulsing.
>
> Row 2 – Move/Patrol animation: swarm flowing forward as a unified wave, beetles rippling in coordinated motion, trailing a few straggler beetles, green glow intensifying at leading edge.
>
> Row 3 – Attack animation: swarm expanding outward then converging rapidly on target, beetles scattering and reforming aggressively, green energy bursting from center, mandibles gnashing visibly.
>
> Row 4 – Hurt/Defeat animation: swarm scattering chaotically, individual beetles falling and flipping over, green binding magic shattering, beetles scurrying away in all directions, mass dissipating.
>
> Style: clean digital pixel-art sprite sheet, desert fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Sandstorm Djinn

**File target:** `images/enemies/sandstormDjinn.png` (512×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Sandstorm Djinn — a powerful elemental spirit of the desert storm. Upper humanoid torso (#aa8844) with muscular arms crossed, lower body dissolving into a swirling sand tornado, glowing white eyes with no pupils (#ffffff), ornate golden armbands and necklace, turban-like crown of hardened sand, sand particles constantly orbiting the body, crackling lightning within the tornado base. Dimensions: 54×66 pixels in-game.
>
> Row 1 – Idle animation: djinn floating with arms crossed, sand tornado base spinning slowly, lightning occasionally arcing within, sand particles orbiting body, turban crown shifting.
>
> Row 2 – Move/Patrol animation: djinn gliding forward, tornado base elongating and propelling, sand trail spiraling behind, armbands glowing, lightning intensifying in base.
>
> Row 3 – Attack animation: djinn extending arms outward, massive sand blast launching from palms, tornado base expanding, lightning bolts shooting upward, eyes blazing white, sand whirlwind around body.
>
> Row 4 – Hurt/Defeat animation: djinn recoiling, tornado base destabilizing, sand body losing cohesion, armbands cracking and falling, lightning going wild then fading, form dispersing into a sand cloud.
>
> Style: clean digital pixel-art sprite sheet, desert fantasy style, consistent proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

---

### Seraphel, the Severed Light (Boss — 6 Sprite Sheets)

Seraphel is a fallen angel boss with 6 separate sprite sheets for different animation states:

#### Sheet 1: Idle (`seraphel-idle-sheet.png`)

**File target:** `images/enemies/seraphel-idle-sheet.png` (1024×1024)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Seraphel, the Severed Light — a fallen angel of divine judgment. Tall armored humanoid figure in white-gold plate armor with ornate filigree, 6 wings made of golden light extending from the back (3 per side, slightly broken/cracked at tips), a rotating golden halo floating above the head, glowing golden eyes, a long blade of pure condensed light held in the right hand. Dimensions: 70×90 pixels in-game.
>
> Row 1 – Idle animation: Seraphel hovering in place, wings gently pulsing with golden light, halo slowly rotating, light blade held at side with a faint shimmer, armor reflecting ambient glow, small golden particles drifting upward from feet.
>
> Row 2 – Idle variant: same as Row 1 but wings shift position slightly, head tilts, light blade pulses brighter then dims.
>
> Row 3 – Idle combat ready: Seraphel raises light blade to guard position, wings spread wider, halo spins faster, eyes glow brighter, armor plates shift, more intense particle effects.
>
> Row 4 – Idle to alert transition: Seraphel turns slightly, wings flare outward, halo tilts, blade extends forward, golden energy crackles along armor seams.
>
> Style: clean digital pixel-art sprite sheet, epic celestial boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### Sheet 2: Walk/Glide (`seraphel-walk-sheet.png`)

**File target:** `images/enemies/seraphel-walk-sheet.png` (1024×1024)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Seraphel, the Severed Light — fallen angel boss in white-gold plate armor, 6 golden light wings (3 per side), rotating halo, glowing golden eyes, light blade weapon.
>
> Row 1 – Forward glide: Seraphel gliding forward through the air, wings beating slowly for propulsion, armor gleaming, light blade trailing golden sparks, halo level and rotating.
>
> Row 2 – Fast advance: wings beating harder, more forward lean, light blade extended back, trailing golden streak, halo tilted forward, armor plates streamlined.
>
> Row 3 – Strafe/circle: Seraphel moving laterally, wings asymmetric (leading side tucked, trailing side extended), blade held across body, golden trail curving behind.
>
> Row 4 – Retreat/reposition: wings spread wide for braking, body leaning back, blade held defensively, golden energy pulsing outward as afterimage particles trail.
>
> Style: clean digital pixel-art sprite sheet, epic celestial boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### Sheet 3: Attack (`seraphel-attack-sheet.png`)

**File target:** `images/enemies/seraphel-attack-sheet.png` (1024×1024)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy.
> 4 rows and 10 columns (40 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Seraphel, the Severed Light — fallen angel boss in white-gold armor, 6 golden light wings, rotating halo, light blade. 10 columns per row for complex boss attack animations.
>
> Row 1 – Blink Strike: Seraphel dissolves into golden light particles (frames 1-3), reappears behind target with blade raised (frames 4-6), slashes downward in wide golden arc (frames 7-9), afterimage fading (frame 10).
>
> Row 2 – Halo Blades: halo stops rotating and rises above head (frames 1-3), splits into 12 spinning golden blade fragments orbiting Seraphel (frames 4-7), blades launch outward in all directions (frames 8-9), new halo reforms (frame 10).
>
> Row 3 – Radiant Rush: wings flare and body crouches (frames 1-3), golden energy charges along blade (frames 4-5), explosive forward dash leaving golden trail (frames 6-8), skid and recovery pose (frames 9-10).
>
> Row 4 – Skyfall Spears: raises left hand toward the sky (frames 1-3), golden spear shapes form above (frames 4-6), hand sweeps down and spears rain from above (frames 7-9), arm returns to neutral (frame 10).
>
> Style: clean digital pixel-art sprite sheet, epic celestial boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### Sheet 4: Phase 2 Attacks (`seraphel-phase2-sheet.png`)

**File target:** `images/enemies/seraphel-phase2-sheet.png` (1024×1024)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss enemy in corrupted/enraged Phase 2 form.
> 4 rows and 10 columns (40 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Seraphel Phase 2 — same armored angel but now corrupted: armor has orange-red cracks glowing through gold, wings are shattered/jagged with flickering orange-white fragments, halo is cracked and split into two halves orbiting the head, eyes burn red-orange. Light blade is unstable, flickering between gold and orange-red.
>
> Row 1 – Lightstorm Arena: arms spread wide, body surrounded by swirling light storm (frames 1-3), storm intensifies with bolts raining down (frames 4-7), explosive pulse sends golden-orange bolts across entire arena (frames 8-9), storm subsides (frame 10).
>
> Row 2 – Judgment Cage: raises both hands forming golden ring around target area (frames 1-4), pulls hands inward as ring of light pillars constricts (frames 5-7), pillars explode inward with massive flash (frames 8-9), cage dissipates (frame 10).
>
> Row 3 – Core Overload: body curls inward gathering energy, broken wings folding around body (frames 1-4), intense golden-orange glow builds at center (frames 5-7), massive explosion outward shattering the energy shell (frames 8-9), recovery as wings re-extend (frame 10).
>
> Row 4 – Divine Rush Combo: dash forward (frames 1-2), rapid 3-slash sequence with blade trailing orange arcs (frames 3-6), leaps upward (frame 7), overhead slam creating shockwave ring (frames 8-9), landing recovery (frame 10).
>
> Style: clean digital pixel-art sprite sheet, corrupted celestial boss style, consistent character proportions across every frame, side-view facing right, clear readable silhouette, evenly spaced animation frames, no cropping, no overlapping frames.

#### Sheet 5: Wings Detail (`seraphel-wings-sheet.png`)

**File target:** `images/enemies/seraphel-wings-sheet.png` (1024×512)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for boss wing overlay animations.
> 2 rows and 8 columns (16 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Wings for Seraphel, the Severed Light — 6 wings of pure golden light, 3 per side. Each wing is made of translucent golden energy with feather-like light rays at the edges.
>
> Row 1 – Phase 1 Wings: intact golden light wings in various positions — folded close (frame 1), slightly spread (frames 2-3), fully extended with bright glow (frames 4-5), beat downward (frames 6-7), return to folded (frame 8). All 6 wings visible, translucent golden glow.
>
> Row 2 – Phase 2 Wings: same wing positions but now shattered/damaged — broken at tips with jagged edges, flickering between gold and orange-red, trailing loose energy fragments, some wing segments missing or detached and orbiting nearby. Shows progressive deterioration across the frames.
>
> Style: clean digital pixel-art sprite sheet, celestial energy wing overlay, consistent proportions, transparent golden glow effects, no cropping, no overlapping frames.

#### Sheet 6: Defeat (`seraphel-defeat-sheet.png`)

**File target:** `images/enemies/seraphel-defeat-sheet.png` (1024×1024)

**Prompt:**
> Clean 2D pixel-art style sprite sheet for a video game boss death sequence.
> 4 rows and 6 columns (24 frames total) arranged in a perfectly aligned grid with even spacing.
> Transparent background.
>
> Character: Seraphel, the Severed Light (Phase 2 corrupted form) — fallen angel boss dying after defeat.
>
> Row 1 – Final blow impact: Seraphel staggers back (frames 1-2), armor cracks widen as golden-orange light pours out (frames 3-4), blade dissolves into sparks (frames 5-6).
>
> Row 2 – Wings shatter: remaining wing fragments burst apart one by one (frames 1-3), golden feather particles scatter in all directions (frames 4-5), halo fragments spin away (frame 6).
>
> Row 3 – Body dissolving: armor plates fall away revealing pure light underneath (frames 1-3), body begins dissolving upward into golden particles (frames 4-6), ethereal silhouette remains briefly.
>
> Row 4 – Final ascension: remaining light form rises upward (frames 1-3), explosion of golden particles leaving nothing behind (frames 4-5), empty space with fading golden sparkles (frame 6).
>
> Style: clean digital pixel-art sprite sheet, epic celestial boss death sequence, consistent character proportions across every frame, side-view facing right, evenly spaced animation frames, no cropping, no overlapping frames.

---

## Notes

- Current assets are JPG images in `images/backgrounds`.
- If you regenerate images in another format (`.png`/`.webp`), update the file references in `index.html` to match.
- Keep image file names the same base names to avoid changing CSS selectors.
