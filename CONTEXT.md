# We Value Teens

The public website of a Wisconsin nonprofit that has run a free teen center in
Edgerton since 1993. It exists to earn the trust of three audiences: parents,
donors, and people who want to start a teen center in their own town.

## Language

### The organisation

**Non-Toxic Youth Alternatives**:
The legal nonprofit entity. Appears in the footer and on giving receipts, almost
nowhere else.
_Avoid_: NTYA, the charity

**We Value Teens**:
The public identity of the organisation, and the name of this site.
_Avoid_: WVT (in reader-facing copy), the brand

**Edgerton Teen Center**:
The building at 204 W Fulton St and the open-doors program that runs inside it
on Friday and Saturday evenings. A place, not an organisation.
_Avoid_: The center (unqualified), ETC, the club

### Content

**Program**:
One of the six named things a teenager can do here — Recording Studio,
PRO-Teen, Arts and Entertainment, Amusement and Recreation, Outdoor Adventures,
Annual Events. All free. A Program is a section of one page, not a page.
_Avoid_: Activity, service, offering

**Essay**:
One piece of Dave Flood's long-form writing on adolescence, ministry and
culture. Dated, bylined, and part of a body of work.
_Avoid_: Blog post, article, entry

**Category**:
One of the small hand-curated topics an Essay belongs to. Replaces the 141
free-text tags carried by the Wagtail site, which were keyword-stuffing rather
than a taxonomy.
_Avoid_: Tag, keyword, topic

**Bio**:
A short profile of a board member or a volunteer: name, title, portrait, and
optional prose.
_Avoid_: Profile, staff card, team member

**The Guide**:
The how-to-start-a-teen-center material — the building, the board, the
insurance, the volunteers, the first year. One of the three audiences comes for
this alone.
_Avoid_: How-to, playbook, toolkit

### Design

**Marquee**:
The chosen visual direction: Anton over Archivo, an ink ground, marquee red and
bulb amber, and photographs bled to the edges with the headline inside them.
Dark only at launch.
_Avoid_: The theme, the design system

**Accent role**:
What an accent colour is allowed to do on a given ground — text or fill. The
same red is a fill on ink and must darken to be text on cream, so the palette is
defined by role rather than by colour name.
_Avoid_: Accent colour, primary/secondary

**Mark**:
The symbol alone: a heart drawn in a single stroke with a heartbeat line crossing
it. Shipped as vector, coloured by role rather than baked in.
_Avoid_: Icon, logo (when the Mark alone is meant), favicon

**Lockup**:
The Mark set beside the words "We Value Teens" in Anton, with "Edgerton Teen
Center · since 1993" beneath in Archivo. The Lockup is what appears in the header;
the Mark alone is what appears in a favicon or an avatar.
_Avoid_: Logo, brand block, header logo

### Editing (inherited from Uncial)

**Content document**:
The normalized, version-stamped JSON representing one editable page's body and
metadata. One `*.json` file in this repository, which is the only source of
truth for content.
_Avoid_: Post, record, entry

**Content page**:
The reader-facing page rendered from a Content document. Ships no editor
JavaScript.
_Avoid_: Public page, live page

**Editor variant**:
The `/…/edit/` route paired with a Content page, where that page is edited in
place and saving commits the JSON back to this repository.
_Avoid_: Admin, CMS page

**Block**:
A reusable content unit defined once as a Svelte component and registered with
`defineSvelteBlock`, then used in both the editor and the renderer. Every block
is designed to be fully editable before it is written; there are no display-only
pseudo-blocks.
_Avoid_: Widget, component (when a Block is meant), section type
