
# Field Manual v0.10 — Monuments Library

Added a full Monuments section to the site:
- quick cards for safe zones, small monuments, large inland monuments and ocean monuments
- filters for type, required card, radiation band and utility access
- detail view with radiation, recommended protection, needed keycards, fuse count, what the monument gives, utilities and notes
- direct YouTube guide search link for each monument
- stylized local visuals showing the monument location profile (roadside / coast / ocean / snow / safe zone)

Important notes:
- this version intentionally does **not** include full route walkthroughs on-site
- some monument values differ between current community-maintained references; the affected cards are flagged with a warning note instead of pretending the numbers are exact
- videos are linked as YouTube search links so the user can jump to community guides without me hardcoding one creator per monument yet

## v0.11 — Monument photographs
- All 28 existing monument records now use the corresponding real in-game capture rather than the abstract text graphic.
- Photo references: Rust Hub / Rustbench (May 2026), https://rusttoolhub.com/en/guides/monuments. The large Harbor variant represents the existing combined Harbor card.
- Individual source links appear in the detail view. Images are externally hosted and require internet; they are not copied into the archive. If loading fails, the same host's original image path is tried and then a clearly marked unavailable state is displayed. Image reuse permissions have not been independently verified; verify them before publishing publicly.
- Existing monument requirements and other modules are retained. Fixed radiation display classification of values containing 0% (e.g. 50%).

## v0.13 — Six-module edition
Removed standalone Raiding and Crafting modules and their planned placeholders. Restored the v0.11 functional modules unchanged; sidebar numbering runs 01–06. Industrial crafting guides remain. Extract into a new folder for a clean installation.

## v0.14 — Navigation repair
All six guide cards are native full-card anchors, with instant section jumps and keyboard access. Navigation highlighting runs independently of the genetics application. Existing module files remain unchanged.

## v0.15 — Creator profile
Added the supplied local avatar and a linked “my link” in the header, opening the supplied Steam profile in a new tab. Existing sections are unchanged. The redundant header genetics shortcut is hidden on narrower screens to accommodate the profile link.

## v0.16 — Smooth navigation
Restored native smooth anchor scrolling for all sections, preserving full-card links, navigation highlighting and reduced-motion support. Initial deep links still settle instantly after loading.
Adjusted the active-section detection tolerance during smooth scrolling.
