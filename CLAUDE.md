# Miller Wagyu Website — Project Context

## Client
**Miller Wagyu Farms** — Steve & Sally Miller, La Crosse, Wisconsin  
Family beef farm in the coulee region of La Crosse. Steve and Sally were both raised on dairy farms; this tradition of quality is central to the brand.

## Contact Info
- Steven (Owner): 608-386-4670
- Catherine (Manager): 608-386-8338
- Email: millerwagyu@gmail.com
- Address: W3402 Jungen Rd, La Crosse, WI 54601
- Market: Serves Minnesota and Wisconsin

## Project Goal
Redesign the existing website (`src/miller wagyu website.html`). Three template concepts were created for client review; **`template-3-gallery.html` is the chosen direction and the only file being actively built out now** (templates 1 & 2 are kept as-is for reference). A companion `src/recipes.html` page has been added, linked from the gallery nav.

## Templates (skeleton — no live ordering yet)
All templates share: logo top-left (cow.jpg), browsable product cuts, skeleton bulk order contact form, Our Story section.

| File | Concept | Vibe |
|---|---|---|
| `template-1-landscape.html` | Farm landscape hero, meats below | Clean/modern, slate-blue + gold |
| `template-2-rustic.html` | Cow art centered on hero, parchment palette | Rustic, warm, family business |
| `template-3-gallery.html` | Bold dark design, all images used | Magazine/editorial, near-black + amber — **ACTIVE/chosen concept** |
| `src/recipes.html` | Recipes, Tips & Tricks companion page | Matches gallery's look; nav links back to `template-3-gallery.html#...` sections |

## Images (all in `/images/`)
**Farm**: `farm.jpg`, `farm overhead view.jpg`, `mailbox.jpg`, `cow.jpg` (brand logo art)  
**Meat cuts**: Ribeye, New York Strip, Filet Mignon, T-bone, Porterhouse Steak, Flank Steak, Skirt steak, Sirloin Steak, Short Ribs, Korean Short Ribs, Wagyu Ground Beef, Rump Roast, Sirloin Tip Roast, Wagyu Tongue, wagyu heart, Liver, Ox Tail, Osso buco, Thors Hammer  
**Info**: `bulk info.jpg`, `cut info.jpg`, `wagyu breed info.jpg`, `local businesses logos.jpg`  
**Food**: `meat.jpg`, `rib plate.jpg`  
**People/lifestyle** (added for gallery + recipes): `steveandcow.jpg`, `sallyandsteve.jpg`, `kids at the farm.jpg`, `farm and many cows.jpg`, `farmersmarket.jpg`  
**Recipe photos** (used by `src/recipes.html`): `recipe-ribeye.jpg`, `recipe-filet.jpg`, `recipe-burger.jpg`, `recipe-short-ribs.jpg`, `recipe-korean-short-ribs.jpg`, `recipe-ragu.jpg`

## Product Categories & Prices
- **Steakhouse**: Ribeye $65, NY Strip $65, Filet Mignon $75, T-Bone $65, Porterhouse $70
- **Classic**: Ground Beef $10, Short Ribs $12.50, Rump Roast $12, Sirloin Tip Roast $12
- **Nouveau**: Flank Steak $35, Skirt Steak $35, Sirloin $40, Korean Short Ribs $25
- **Exotics**: Heart $20, Tongue $50, Liver $15, Ox Tail $15, Osso Buco $20, Thor's Hammer $25

## Bulk Order Pricing
Quarter (~188 lb HW), Half (~375 lb HW), Whole (~750 lb HW) — all $7/lb hanging weight, processing included

## Farmers Markets
- **Fri**: Burns Park La Crosse, 4 PM–Dusk, May–Oct (weekly)
- **Sat**: Crowley Park La Crosse, 9 AM–Noon, June–Oct (bi-weekly)
- **Sat**: Jackson Plaza La Crosse, 8 AM–1 PM, May–Oct (weekly)
- **Wed**: Festival Foods Holmen, 3–6 PM, June–Sept (weekly)

## What the Final Product Will Need (not yet built)
- Real ordering/cart system
- Payment integration
- Contact form backend (email submission)
- Possibly inventory management

## Notes
- Image filenames have spaces — use %20 encoding in HTML src attributes
- **Pages live in `src/` and reference images as `../images/...`** (the `images/` folder is at the project root, one level up). Both `template-3-gallery.html` and `recipes.html` use the `../images/` prefix.
- `cow.jpg` is used as the brand logo/mark in the nav across all templates
- The example/reference site is `src/miller wagyu website.html`
- **Current working focus: `template-3-gallery.html` only.** `template-3-Testing.html` was the scratch file for iterating on the interactive cow diagram, but that diagram is now considered done and Testing is **frozen — do not mirror new changes back into it.** Make diagram/site changes directly in `template-3-gallery.html`. (Historically the two shared identical diagram class names/IDs — `cowSVG`, `cut-region`, `cut-panel-inner`, `CUT_DATA`, etc. — so a change could be copy/pasted between them; that mirroring is no longer required.)
- In `template-3-gallery.html` the diagram lives in its own standalone section (`#cuts-diagram`, "Explore the Cow"), inserted between the landscape banner and the Bulk Orders/"Get In Touch" section — NOT inside the hero like in Testing. It reuses the page's existing `showTab`/`scrollToContact` functions (gallery's `showTab` has no fade animation, unlike Testing's animated version — `goToShopAndHighlight`'s delay before highlighting is shorter there accordingly, ~650ms vs Testing's two 700ms waits).

## Interactive Cow Diagram (template-3-Testing.html, ported into template-3-gallery.html)
An SVG beef cuts diagram where regions are clickable/hoverable to show product data.

### SVG Structure
- ViewBox: `0 0 530 315`, cut region group: `transform="translate(5,5)"`
- Cow silhouette path comes from `inspirations/US_Beef_cuts.svg` (rect3105 outer sub-path only — the inner hole sub-path was removed to avoid background shading artifacts)
- Cut region paths also sourced from `US_Beef_cuts.svg` (same coordinate space, direct copy)
- Labels are in root SVG space (group coords + 5 for both x and y)

### Cut Regions & Source Paths
| Region | data-cut | fill class | Source path ID |
|---|---|---|---|
| Chuck | chuck | cut-chuck | path1341 (endpoints snapped to shared junctions, see below) |
| Rib | rib | cut-rib | path1345 (endpoints snapped) |
| Short Loin | shortloin | cut-shortloin | simplified to a clean quadrilateral (see below) |
| Tenderloin | tenderloin | cut-tenderloin | manual rect M 360,48 L 419,48 L 428,97 L 362,97 |
| Sirloin | sirloin | cut-sirloin | manual quad, right edge = exact copy of Round's left-edge curve |
| Round | round | cut-round | path1349 (one endpoint snapped, see below) |
| Brisket | brisket | cut-brisket | path1369 (endpoints snapped) |
| Plate | flank | cut-plate | path1343 (endpoints snapped) |
| Flank | flank | cut-flank | straight quadrilateral M 301.75,136.34 L 302.45,178.31 L 364.42,141.88 L 421.89,163.23 (see below) |

Tenderloin has its **own** `data-cut="tenderloin"` / `CUT_DATA.tenderloin` entry (label "Tenderloin", just Filet Mignon) — it used to share `data-cut="shortloin"` with Short Loin so the panel always said "SHORT LOIN" when hovering it, which was wrong/confusing. Keep `CUT_TAB_MAP.tenderloin = 'steakhouse'` in sync if `CUT_TAB_MAP` changes.

### Key Technical Decisions
- **Stroke-width 0.45 via CSS** (not inline): At shared boundaries, two adjacent regions each draw 0.45px → 0.9px combined, looking like a single clean line. Active state overrides to 1.2px. Do not change inline stroke-width on paths — the `.cut-region` CSS class controls it (stroke color/width/dasharray all live there now; `.cut-tenderloin` overrides dasharray to 4,3).
- **Per-region fill via CSS class, not inline `fill` attribute.** Each region has a second class (`cut-chuck`, `cut-rib`, etc., see table above) that sets a distinct semi-transparent color so regions are visually differentiable. `.cut-region.active` overrides fill to gold regardless of which region class is present. When adding/editing a region, give it both `cut-region` and its `cut-<name>` class — a path with no `cut-<name>` class renders with the SVG default fill (opaque black).
- **All shared-boundary endpoints are snapped to exact common coordinates** (not just "close"). The original paths traced from `US_Beef_cuts.svg` had small (2–12px) gaps between neighboring regions' edges, which is barely visible with transparent fill but reads as a visible seam of background color once regions have solid-ish fills. Every junction where 2+ regions' corners meet was unified to one coordinate, and each affected path's curve endpoint was moved to it (keeping the curve's original absolute control points, only re-relativizing them to the new start/end — see `git log`/this session for the derivation if more junctions need adjusting). Junctions currently unified: chuck/rib (top + bottom), rib/shortloin (top + bottom), chuck/brisket, brisket/plate, plate/flank, plate/rib/brisket/chuck (4-way bottom junction), round/sirloin/flank (3-way corner at the rump).
- **Short Loin was simplified to a clean quadrilateral** (`M 296.65,36.27 L 359.40,33.66 L 364.42,141.88 L 301.75,136.34 Z`). The original traced path1339 had a zigzag notch on its right edge (an artifact of the source trace) that crossed into the Sirloin column and caused crossing/overlapping lines.
- **Sirloin's right edge is an exact copy of Round's left-edge curve** (same bezier control points, reversed direction), so Sirloin and Round share one continuous curved boundary instead of two independently-drawn lines that drift apart by up to ~12px in the middle.
- **Tenderloin is inside Sirloin primal only** (roughly x=360–428, inset within the Sirloin column): Keeping it out of the Short Loin area avoids overlapping diagonal lines across two regions.
- **Do not re-add path1347** (Bottom Sirloin from US_Beef_cuts.svg) — it creates a downward triangular shape into the flank area.
- If you reshape any region again, re-verify shared edges with Playwright's `elementFromPoint` sampled across the boundary (not just visual screenshot) to confirm there's no dead zone or wrong-region hit — see this session's approach: get `#cowSVG`'s bounding box, convert local SVG coords (`+5` for the group translate) to page pixels via the viewBox scale, then `document.elementFromPoint`.
- **Snapping endpoints alone is not enough once regions have visible fill.** Endpoint-snapping (above) fixes gaps at the junction *points*, but if the two curves on either side of a shared edge have different bulge/curvature along their length, you still get a lens-shaped overlap (double-fill, reads as a desaturated/blended color) or sliver gap (reads as background green) in the *middle* of the edge — easy to miss in a quick screenshot, visible on zoom or by sampling pixel colors. Internal dividing lines between two cut-regions (as opposed to edges that only border the body outline) were converted to straight `L` lines on **both** sides (Chuck/Rib, Chuck/Brisket, Rib/Short Loin, Rib/Plate, Brisket/Plate, Plate/Flank, Sirloin/Flank) so they're guaranteed identical, not just close. Only edges that border the body outline silhouette (not another cut-region) were left as the original traced bezier curves. **This is now the standing rule for this diagram: any new/edited boundary between two fill regions must be a straight line shared verbatim by both paths (copy the exact same coordinates into both), never two independently-curved edges** — even a curve that *looks* close to its neighbor will drift apart somewhere along its length once you zoom in or sample pixels, and that drift becomes a visible sliver/blend the moment both sides have a solid-ish fill.
- **Flank is now a plain 4-point straight quadrilateral, vertices listed in actual perimeter order**: `M 301.75,136.34 L 364.42,141.88 L 421.89,163.23 L 302.45,178.31 Z` = J4 (rib/shortloin/plate corner) → A (Short Loin's bottom-right corner — this edge matches Short Loin's bottom edge) → J11 (Round/Sirloin corner — this edge matches Sirloin's bottom edge exactly) → J7 (Plate's bottom-right corner) → close back to J4 (matches Plate's right edge). Two earlier attempts got this wrong in instructive ways: (1) keeping the old traced curve as the closing edge while straightening only the Sirloin-facing edge made the curve and the new straight edge cross (self-intersect), which silently ate a chunk of the fill via the SVG fill-rule; (2) listing the same 4 correct points but in `J4→J7→A→J11` order (not perimeter order) also self-intersected into a bowtie, leaving only a thin sliver instead of the full region. **The lesson: when building a polygon from a set of "this point must be here" junction coordinates, the order they're connected in matters as much as the coordinates themselves — sort them around the actual perimeter, don't just list them in whatever order they were derived.** If a region's fill is missing a chunk it used to have (not just a thin seam at one edge), suspect a self-intersecting/misordered path — check by sampling pixels well inside the "missing" area, not just at the boundary.
- **Click-to-select panel** (`selectCut(key)` in the `<script>`, replaces an earlier hover-triggered version): clicking a `.cut-region` or `.diagram-cut-label` sets `selectedCut`, moves the `.active` (gold highlight) class to that region/label, and fills the right-hand panel — label, tagline, a `blurb` sentence (`CUT_DATA[key].blurb`, explains what's anatomically different about that part of the cow / why it's cooked the way it is), and the `.cut-card` list. There is no hover-preview and no button — selection only changes on click, and stays until a different region/label is clicked. `.cut-region:hover` / `.diagram-cut-label:hover` are pure-CSS subtle hover cues (not selection). There used to be an "Inquire About These Cuts" button that scrolled to `#shop` and highlighted matching `.product-card`s (`goToShopAndHighlight`/`emphasizeProductCards`/`CUT_TAB_MAP`) — removed at the client's request in favor of just showing the cuts in place; if that jump-to-shop behavior is wanted back, it's straightforward to re-add as its own affordance (e.g. on the cut-cards) rather than reviving the old hover/button combo.

### Playwright Setup (for visual iteration)
Python playwright is installed. Screenshot the live `#cowSVG` element directly from the rendered page — do NOT extract its `outerHTML` into a fresh blank page, since that fresh page has none of the original `<style>` rules and every region will render with the SVG default (opaque black) fill instead of its real color:
```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1600, "height": 1000})
    page.goto("file:///Users/cashpergande/IdeaProjects/Miller%20Wagyu%20Website/src/template-3-Testing.html")
    page.wait_for_timeout(3000)  # let the intro overlay finish
    page.query_selector("#cowSVG").screenshot(path="/tmp/cow_current.png")
    browser.close()
```

### Reference Files
- `inspirations/CutsofBeefDiagram-1200x675-1.jpg` — primary visual reference for cut line positions
- `inspirations/US_Beef_cuts.svg` — source of all anatomically correct path data (520×311px, layer group `transform="translate(5,5.0016988)"`)
- Vectorization tools tried: Inkscape Trace Bitmap (single-scan only, unusable), autotracer.org (too many micro-paths, unusable). US_Beef_cuts.svg is the best source available.
