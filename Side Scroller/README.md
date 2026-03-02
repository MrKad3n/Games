# SkyDash Quest — Side-Scroller

## Images Needed

All images should be **PNG with transparency** (no background). Recommended size noted per image.

### Player
| File | Description | Suggested Size |
|---|---|---|
| `images/player/player.png` | **Already exists.** Player character, idle pose facing right. | 64×80 px |
| `images/player/player_attack.png` | *(Optional)* Player mid-slash frame. Falls back to the idle sprite + slash arc if missing. | 64×80 px |

### Enemies
| File | Description | Suggested Size |
|---|---|---|
| `images/enemies/possessed_shrub.png` | A bush / shrub with glowing red eyes, vines, and a menacing look. It's been possessed by the Zenith spirit and given life. | 60×60 px |
| `images/enemies/thorn_crawler.png` | A large beetle / centipede-like forest bug with thorny legs and red eyes. Fast and aggressive. | 70×50 px |
| `images/enemies/corrupted_treant.png` | A massive corrupted tree creature. Dark bark, twisted branches for arms, angry red eyes. Mini-boss / boss. | 100×120 px |
| `images/enemies/shadow_rat.png` | A small dark rat with glowing red eyes and a wispy shadow trail. City pest corrupted by Zenith. | 50×40 px |
| `images/enemies/possessed_lamp.png` | A tall lamp post with a single glowing red eye in its lamp head. The Zenith gave it life. | 50×100 px |
| `images/enemies/corrupted_golem.png` | A massive humanoid assembled from city rubble — bricks, steel, concrete. Glowing red eyes in a blocky head. City boss. | 110×130 px |

> **Fallback:** Every enemy is drawn procedurally if its image is missing, so the game is fully playable without these files.

### Optional (future use)
| File | Description |
|---|---|
| `images/enemies/vine_whip.png` | A tall vine-plant that lashes out with ranged attacks. |
| `images/enemies/zenith_shade.png` | The Zenith spirit's avatar — a dark ethereal humanoid with purple energy. Final boss. |
| `images/ui/map_bg.png` | A stylized world-map parchment background (1280×720). Currently drawn procedurally. |
| `images/gems/*` | Collectible gem sprites for future pickup system. |

---

## Design Decisions (filling in gaps)

These are choices I made where the description was open-ended. All can be changed later.

### Story & World
- **Zenith** is an otherworldly spirit that crossed into this realm through a tear in the forest. It possesses natural objects (plants, bugs, trees) and gives them sentience, speech, and hostility.
- Possessed creatures can **communicate** with the player through a dialogue system. They reveal bits of lore about the Zenith and their own confused new existence.

### Levels (2 chapters)
| # | Name | Theme |
|---|---|---|
| 1 | **The Zenith Forest** | Massive combined forest level (~18000px). 5 zones: Whispering Glade → Thornwood Path → Corrupted Grove → Hollow Creek → Zenith's Core. Vine barriers force platforming, wall-jump sections, 2 treant bosses. |
| 2 | **The Ravaged City** | Urban ruins (~14000px). Corruption spreads to civilization. New enemies: Shadow Rats, Possessed Lamps, Corrupted Golem boss. Alley gaps, building platforms, scaffolding. |

Levels unlock sequentially. Progress is saved in `localStorage`.

### New Mechanics
- **Wall Jump**: Slide on walls (hold toward wall while airborne), press W to launch away. Brief horizontal lock after wall jump.
- **Zenith Vines**: Purple corruption hazards that deal 18 DPS on contact (no iframes). Must platform over them.

### Enemies
| Type | HP | Damage | Speed | Behavior |
|---|---|---|---|---|
| Possessed Shrub | 55 | 10 | Slow | Patrols, chases when player is close. |
| Thorn Crawler | 35 | 8 | Fast | Quick patrols, aggressive chase. |
| Corrupted Treant | 220 | 22 | Slow | High HP mini-boss, strong hits. |
| Shadow Rat | 24 | 6 | Very Fast | Small, fast city pest. Swarming behavior. |
| Possessed Lamp | 65 | 14 | Slow | Tall lamp post enemy, medium threat. |
| Corrupted Golem | 300 | 28 | Slow | City boss, massive HP pool. |

### Combat
- **X key** performs a directional slash in front of the player.
- Slash has a visible arc effect, brief screen-shake on hit ("hitstop").
- Player gets ~0.75 s of invincibility after being hit.
- Enemies flash white and recoil when damaged.

### Controls
| Key | Action |
|---|---|
| **W** | Jump (coyote-time + jump-buffering for responsive feel) |
| **A / D** | Move left / right |
| **S** | Fast-fall while airborne |
| **X** | Basic slash attack |
| **M** | Open world map (only when not in enemy aggro range) |
| **Space / Enter** | Advance dialogue |
| **ESC** | Return to main menu (from map screen) |

### Map & Teleportation
- Pressing **M** during gameplay (when no enemies are aggro'd) opens the world map overlay.
- On the map you can click any **unlocked** location node to teleport there instantly.
- Locked locations show a lock icon and cannot be selected.

### Dialogue
- Dialogue appears as a bottom-screen panel with **left portrait (player)** and **right portrait (enemy)**.
- Text types out letter-by-letter; press Space to skip or advance.
- Triggered by walking into invisible zones or approaching enemies for the first time.
