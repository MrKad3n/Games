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

### Levels (5 total, forest chapter)
| # | Name | Theme |
|---|---|---|
| 1 | **Whispering Glade** | Tutorial — gentle forest, introduces movement + combat. 2–4 Possessed Shrubs. |
| 2 | **Thornwood Path** | Darker canopy, more vertical platforming. Thorn Crawlers introduced. |
| 3 | **The Corrupted Grove** | Dense corruption, mixed enemies. Mini-boss: **Corrupted Treant**. |
| 4 | **Hollow Creek** | Gaps over dark water, precision platforming. |
| 5 | **Zenith's Sanctum** | The source of corruption. Final boss: Corrupted Treant (placeholder until Zenith Shade art). |

Levels unlock sequentially. Progress is saved in `localStorage`.

### Enemies
| Type | HP | Damage | Speed | Behavior |
|---|---|---|---|---|
| Possessed Shrub | 55 | 10 | Slow | Patrols, chases when player is close. |
| Thorn Crawler | 35 | 8 | Fast | Quick patrols, aggressive chase. |
| Corrupted Treant | 220 | 22 | Slow | High HP mini-boss, strong hits. |

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
