# syoma.place: guide for AI coding assistants

This is Syoma Zharkov's personal portfolio site. It is static HTML, CSS and JS, served by GitHub
Pages from the `main` branch at https://syoma.place. There is no build step, no package.json and no
framework beyond a vendored, customised copy of UIkit 3.14.0. Keep it that way unless the owner asks.

This file lives in `.claude/` on purpose. GitHub Pages runs Jekyll on this repo, and Jekyll would
publish a root-level `CLAUDE.md` as `https://syoma.place/CLAUDE.html`. Dot-directories are never
published.

## Rules that prevent real breakage

1. **`main` is production.** Every push goes live within about a minute, and a 10-minute CDN cache
   follows. There is no staging environment. Don't commit or push unless the owner asks. Before any
   push, run the checks in [Verify a change](#verify-a-change). A 2024 web-UI edit left a JS syntax
   error that broke the site for 6 days.
2. **`css/uikit.css` is the site theme, not stock UIkit.** Never replace it with an upstream
   download. Every local edit is tagged `syoma:` (`grep -n "syoma:" css/uikit.css`).
   `js/uikit.js` and `js/uikit-icons.js` *are* byte-identical to stock 3.14.0.
3. **`uk-margin-remove-left@s` / `uk-margin-remove-right@s` mean "phones only (≤ 500px)" here.**
   That is the inverse of UIkit's docs (which say ≥ 640px). The page layout depends on it.
4. **The "About" links point at `#black`, not `#about`, on purpose.** See [Navigation](#navigation).
5. **`js/script.js` must load after `<canvas id="SYOMcanvas">`.** It grabs the canvas at the top
   level. `redirectToRandomLink()` must stay a global function (an inline `onclick` calls it).
   Never register the `touchmove` listener with `{passive: false}`, because that breaks scrolling on
   phones.
6. **Don't touch `CNAME`.** It is exactly `syoma.place` with no trailing newline. Deleting or
   re-adding the custom domain re-validates it and resets the "Enforce HTTPS" setting (this happened
   in Sep 2026).
7. **Jekyll processes the repo.** Don't add Markdown or other docs at the repo root; they get
   published. Never put `{{` or `{%` in any file Jekyll renders. Adding `_config.yml` replaces the
   default `exclude` list, so `CNAME` must then be listed explicitly. Adding `.nojekyll` makes `/CNAME`
   public.
8. **The repo is public.** Everything committed is world-readable on GitHub, and nearly everything
   is also served on syoma.place. No secrets and no private info. **Strip GPS from photos before
   adding them** (see [Images](#images)).
9. **Keep the owner's voice.** The copy is casual on purpose ("lol", "Mogging", ":)"). Fix clear
   typos, and don't rewrite tone or content without being asked.

## Working with the owner

- Once the user-facing decisions are settled, build the thing directly. A short round of clarifying
  questions about real forks is fine; long planning passes are not.
- Afterwards, verify visually (serve locally and screenshot) and report what changed.
- Content (bio, classes, photos, captions) belongs to the owner. Ask rather than invent.

## Verify a change

```bash
python -m http.server 8000            # from the repo root, then open http://localhost:8000
node --check js/script.js             # catches syntax errors that would kill the canvas + random link
```

Then check:
- The browser console is clean on load and while moving the mouse over the letters.
- The page works at about 390px (mobile navbar + off-canvas menu), at 500 vs 501px (the custom
  breakpoint) and at 960px+ (desktop navbar, 3-up slider).
- The "SYOMA" particles render and react to the mouse.
- The slider arrows work and its images load as you reach them (they are `loading="lazy"`).
- The off-canvas menu closes after tapping a link.

For visual regressions, compare full-page headless screenshots before and after. The animation is
deterministic at rest, so an untouched layout gives a 0-pixel diff.

YouTube embeds may show "Video unavailable" on `localhost`. Judge them on the live https origin.

Optional HTML lint: `npx --yes html-validate@8 index.html subpage/*.html`. The remaining reports are
the bare `href` on the slider arrows, which UIkit needs.

## File map

| Path | What it is |
|---|---|
| `index.html` | The whole homepage: navbars, hero canvas, About, Projects, Coursework, More (links + photo slider) |
| `css/uikit.css` | UIkit 3.14.0 **with site customisations** (tagged `syoma:`) |
| `css/styles.css` | Site-specific CSS: font fallback, `#black` spacer margins. Put new site styles here |
| `css/node_letters.css` | Sizing for the hero canvas and its wrapper |
| `js/uikit.js`, `js/uikit-icons.js` | Stock UIkit 3.14.0. Icons are used only for the 16 `uk-icon="icon: link"` |
| `js/script.js` | Particle letters, `redirectToRandomLink()` (35 Wikipedia URLs), mobile-menu auto-close |
| `subpage/garment.html`, `subpage/snoopy.html` | Standalone galleries (no UIkit, light theme) with their images next to them |
| `gallery/bornana (N).ext` | Slider photos (1–21 used), plus `beauty_of_math.pdf` (linked from a project card) |
| `icon.svg` | Favicon (Inkscape file, saddle-surface wireframe on a black circle) |
| `CNAME` | Custom domain for GitHub Pages. Don't edit |
| `README.md` | Short human readme. Served raw at `/README.md` |
| `.claude/CLAUDE.md` | This file |

**Pending deletion.** These are unused leftovers, waiting for the owner to delete them: `s` (an
empty file committed by accident), `test.html` (a prototype of the random link with example.com
URLs), `wikipedia.txt` (an older subset of the URL list in `script.js`), and
`js/CourierPrime-Regular.ttf` (never loaded; the canvas uses the system "Courier New"). Nothing
references any of them, but all four are publicly served.

## index.html anatomy

The body, in order:
1. **Desktop navbar** `nav.uk-visible@m` (≥ 960px), sticky, 80px tall. Links: About → `#black`,
   Projects, Coursework, Contact (`mailto:`).
2. **Mobile navbar** `nav.uk-hidden@m` with a hamburger button that toggles `#offcanvas-nav`.
3. **`#offcanvas-nav`**: overlay menu (Home/About/Projects/Coursework/Contact). Every `<li>` has
   `uk-active` on purpose, for styling.
4. **Hero** (a section without an id): `#SYOMwrapper > canvas#SYOMcanvas`, followed by
   `<script src="js/script.js">`. It carries an HTML comment addressed to "INSPECT ELEMENTERS".
   Keep it.
5. `<br>` and then `section#black`, the empty spacer and scroll anchor.
6. **`#about`**: one `<p>` bio. It does not use the `@s` classes, so it keeps its side margins on
   phones.
7. **`#projects`**: 16 cards.
8. **`#coursework`**: most recent first. A "Current Classes:" `<p>` with the Stanford Fall 2026
   classes, then a "Past Classes:" `<p>` with every class on the K-State transcript (Spring 2026
   back to Spring 2023).
9. **`#more`**: a links card, plus a card with the photo slider (`uk-slider="sets: true"`, 1-up
   below 960px, 3-up above).

The `<br>`s between sections are part of the spacing. Don't remove them as "cleanup".

### Recipes

**Add a project.** Copy a card inside `#projects` and keep the class list exactly:
```html
<div class="uk-margin uk-card uk-card-secondary uk-card-body">
    <h4>Project Name</h4>
    <p>One or two sentences.</p>
    <a class="uk-button-text uk-text-decoration-none" href="https://example.com/..." target="_blank">
        <span uk-icon="icon: link"></span> example.com
    </a>
</div>
```
Cards are ordered by the owner's preference, newest-favourite first. The link label is usually the
bare domain.

**Add a course.** Use the same card, without the link (`<h4>DEPT 123 - Title</h4><p>Catalog
description.</p>`). The list runs newest first. Current cards go between the "Current Classes:"
`<p>` and the "Past Classes:" `<p>` (both
`<p class="uk-margin-xlarge-left uk-margin-remove-left@s">`). At the end of a semester, move those
cards to just below "Past Classes:", keeping the newest on top, and drop the "Current Classes:"
`<p>` if nothing is current.

**Add a slider photo.** Strip GPS first, keep the long edge ≤ 1600px, then add:
```html
<div>
    <img src="gallery/bornana (22).jpg" width="600" height="600" loading="lazy" alt="Caption text">
    <div class="uk-position-bottom-center uk-panel uk-text-small uk-text-SYOMBOLD"><p>Caption text</p></div>
</div>
```
- The photos are square crops. `width/height="600"` caps the rendered size at 600 CSS px. Keep it.
- Use forward slashes. The filenames contain spaces and parentheses, so match them exactly.
- `alt` repeats the caption.

**Add a Wikipedia article** to the random link: append to the `urls` array in
`redirectToRandomLink()` in `js/script.js`. Every entry must be a quoted string followed by a comma;
an unquoted URL once broke the whole script. Use `https://en.wikipedia.org/wiki/...` (the `en.m.`
host now just redirects).

**Add a subpage.** Create `subpage/name.html` next to its images, using relative paths. Link it from
a project card with `href="subpage/name.html" target="_blank"`. Include
`<link rel="icon" type="image/svg+xml" href="../icon.svg">`. For YouTube, use an `<iframe>` with a
`https://www.youtube.com/embed/<id>` URL; `/watch?v=` URLs refuse to be framed.

## Navigation

- `uk-scroll` links scroll smoothly and call `preventDefault()`, so the URL hash never changes.
  Because of that, UIkit's off-canvas menu doesn't close by itself. The handler at the bottom of
  `js/script.js` closes it.
- **About → `#black` trick.** At ≥ 500px, `#black` has `margin-top: 30%` and
  `margin-bottom: calc(30% + 150px)` (in `css/styles.css`). The section is empty, so the two margins
  collapse into one gap. That puts the anchor exactly 150px above `#about`, and the About heading
  lands about 70px below the sticky navbar. Scrolling straight to `#about` would hide the heading
  under the bar. Keep both margins, even though `margin-top` looks redundant.
- Known quirks (pre-existing, owner's call):
  - Projects and Coursework land with their heading under the 80px sticky navbar.
  - Below 500px, About does too.
  - A possible fix is `uk-scroll="offset: 80"` on those links. Re-check the About trick if you
    touch it.
- The logo links use `href=""`, so clicking them reloads the page.

## Styling

**Where styles come from.**
- The theme lives in `css/uikit.css`: black `html` background, black navbar, `.uk-card-secondary`
  (#181818 background, #ededed text, 1px #4e4e4e border, 10px radius), and light text `#ededed`.
- `css/styles.css` and `css/node_letters.css` load after it, so their rules win ties.
- When moving a rule out of `uikit.css`, re-check source order. For example, moving the
  `.uk-navbar-item` font rule would change the logo font.

**Light text.**
- `uk-light` is put directly on the headings and paragraphs that should be light.
- Text without it falls back to UIkit's grey `#666`. That applies to the section subtitles such as
  "Some of my favorite projects.", and it is low contrast on black.
- Inside `.uk-card-secondary`, text is light automatically.

**Fonts.**
- IBM Plex Mono (weights 400/500/600) is loaded only by the Google Fonts `@import` at the top of
  `css/uikit.css`, which must stay above every rule.
- Bold text uses the 600 face.
- The navbar logo "SYOMA" renders in the system sans-serif, because `.uk-logo` keeps UIkit's stack.
- The canvas uses the system "Courier New".

**Breakpoints in play.**
| Width | Effect |
|---|---|
| ≤ 500px | `uk-margin-remove-*@s` remove the 70px side margins (custom, inverted `@s`) |
| ≥ 500px | `#black` spacer margins switch on |
| ≥ 960px (`@m`) | Desktop navbar replaces the hamburger; the slider goes 3-up |
| ≥ 1200px | UIkit's xlarge margins grow from 70px to 140px |

**All customisations vs upstream:**
```bash
curl -sL https://cdn.jsdelivr.net/npm/uikit@3.14.0/dist/css/uikit.css | diff --strip-trailing-cr - css/uikit.css
```
The visible ones:
- the font `@import` and IBM Plex Mono on `html`, headings and navbar items
- black page and navbar
- the card look
- light text `#ededed`
- `.uk-text-SYOMBOLD`: white bold caption with a 1px black outline. It replaced `.uk-text-danger`,
  which no longer exists.
- the inverted `@s` margin breakpoint

The other tagged edits (ins/mark/pre/blockquote/hr/forms/secondary buttons/`.uk-button-text`) have no
visible effect today. Several set black text, which would be invisible on this page if those elements
were ever used.

**UIkit features the page relies on.** Use this as the checklist for any UIkit upgrade or removal:
- Navbar, Sticky, Toggle + navbar-toggle-icon, Offcanvas (overlay), Scroll, Icon (`link` only),
  Slider (`sets: true`) + slider-item + slidenav, and the visibility classes `uk-visible@m` /
  `uk-hidden@m` / `uk-hidden-hover`.
- UIkit's JS also adds classes such as `uk-navbar` and `uk-offcanvas` at runtime. Without
  `uikit.js` the layout breaks, not just the interactions.
- `uikit-icons.js` must load after `uikit.js`.

## js/script.js (hero particles)

**Pipeline.**
1. Draw "SYOMA" once at `45px Courier New` at (15, 45).
2. `getImageData(15, 0, 150, 75)`.
3. Each pixel with alpha > 128 becomes a particle at (x·15, y·15). That is about 1012 particles in
   Chrome on Windows; the count varies with font rasterisation.
4. Each frame: draw particles, update them (repel within 250px of the pointer, otherwise ease home
   by 1/10 per frame), then `connect()` joins every pair closer than 100px with a 2px line whose
   opacity is `1 - d/100`.

**Tunables.** These are numbers in the code: bitmap 2090×1000, pointer radius 250, particle size 3,
density `random*30+1`, scale 15, line distance 100, line width 2, and the `resize_var` /
`resolution` knobs (both 1).

**Fragile spots.**
- The 150px sample window fits Courier New exactly. A wider fallback font would clip the "A".
- Changing the bitmap height changes the hero's vertical spacing. CSS only scales the bitmap, and
  the letters occupy roughly y 285–660 of 1000.
- `connect()` is O(n²): about 0.5M distance checks and about 20k strokes per frame. Keep the inner
  loop cheap.
- Draw order matters: the strokes are translucent, so reordering pairs changes pixels.
- The animation runs even when the hero is scrolled off-screen. Pausing it with an
  IntersectionObserver would be a safe optimisation.
- The pointer position is never reset on mouseleave or scroll, so a stale point can leave a hole in
  the letters until the mouse moves. That is long-standing behaviour.

## Subpages

`subpage/*.html` are deliberately bare: no UIkit, light background, Arial (garment) or default serif
(snoopy), and no link back home.

The images are referenced relatively, so the pages must stay next to their images.

`snoopy3.jpg` is actually PNG data with a `.jpg` name. Browsers sniff it fine.

## Images

**GPS.**
- Several older phone photos in `gallery/` and `subpage/` still carry EXIF GPS coordinates.
- Before adding any photo, run `exiftool -gps:all= -overwrite_original <file>`. ExifTool is not
  installed by default here; Strawberry Perl is, so the ExifTool Perl distribution works.
- Pillow re-saves re-encode the pixels and drop Ultra HDR gain maps, so don't use them to strip
  metadata.
- Removing GPS from files already in git history needs a history rewrite and a force-push. Only do
  that if the owner explicitly asks.

**Weight.**
- The 21 slider photos total about 32 MB. `gallery/bornana (10).png` alone is 11.6 MB.
- They are lazy-loaded, but each one is still much larger than its ≤ 600 CSS px display.
- A safe target for new or re-encoded photos is a 1600px long edge, JPEG q85.
- `bornana (11/17/18/20).jpg` and `subpage/snoopy1/2.jpg` are Ultra HDR (they carry a gain map).
  Standard re-encoders drop the HDR part.

**Unused.**
- `gallery/bornana (22–25).jpg` have never been referenced. Ask the owner before adding them to the
  slider or deleting them.
- Deleting or shrinking images does not shrink clone size, because history keeps them.

## Deployment facts

- GitHub Pages runs in classic "deploy from a branch" mode (`main`, `/`), with the
  `pages-build-deployment` workflow using `jekyll-build-pages`.
- Jekyll excludes dotfiles and dot-directories, `_*`, and `CNAME` by default.
- `README.md` is served raw. Any other `.md` would also be rendered to `.html`.
- DNS:
  - The apex has A/AAAA records pointing at GitHub Pages.
  - `www.syoma.place` is a CNAME to `syomazh.github.io` and redirects to the apex.
- **HTTPS is not enforced** at the moment, so `http://` is served without a redirect. The owner
  should tick *Settings → Pages → Enforce HTTPS*.
- Line endings:
  - The system git config has `core.autocrlf=true`, so the working tree is CRLF and the repo stores
    LF.
  - There is no `.gitattributes`.
  - Keep 4-space indentation in HTML, CSS and JS.

## Content checklist (owner, roughly once a semester)

- The bio in `#about`. As of Oct 2026 it says "first-year at Stanford University".
- The contact email `syoma@stanford.edu`. It appears in both navbars and in the bio.
- Move "Current Classes" into the past list and add new ones.
- The slider caption "Back When I was Cool (9 years ago)" is updated by hand.
- "Snoopy Hoco Box 2024", and "DRESSES: coming soon" on the garment page.

## Known issues / backlog

**Needs the owner** (accounts, settings or content):
- The Kiselev's Geometry card's Google Drive link returns 404. The folder ID looks truncated, so
  re-copy the share link.
- Enable "Enforce HTTPS" (see Deployment facts).
- Delete the files listed under "Pending deletion" and the unused gallery photos if they're not
  wanted.
- Strip GPS from the photos that still carry it, and decide whether to scrub history.
- The Instagram link can't be checked automatically (login wall), so verify it by hand.
- Ambiguous copy: "High Exposure Photography in the Alpes" probably means long exposure in the
  Alps.

**Optional improvements** (each one changes behaviour or bytes, so ask first):
- Resize the oversized photos.
- Fix the headings that land under the navbar.
- Raise the contrast of the grey subtitles.
- Use a monospace logo font.
- Pause the animation when it is off-screen.
- Move the font `@import` to `<link rel="preconnect">` + `<link rel="stylesheet">`.
- Strip the Inkscape metadata from `icon.svg`. About 9 KB of it is editor-only, and it includes a
  local export path.
