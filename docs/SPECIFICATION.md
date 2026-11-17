# Atelier Barre website: specification

| | |
|---|---|
| Project | Synent Technologies web development internship, Task 7 (Multi-Page Website), also covering Task 4 (Responsive Navigation Bar) |
| Author | Parfait Ahouanto |
| Version | 1.0.0 |
| Status | Delivered |

## 1. Context and objective

Task 7 asks for a complete multi-page website with four pages (Home, About, Services, Contact),
responsive design, navigation between pages and a consistent interface across them, delivered as a
professional website structure. Task 4 asks for a responsive navigation bar with a logo, menu items
and a hamburger menu toggled in JavaScript on mobile. The shared header of this site answers both.

### 1.1 The chosen business

The site presents **Atelier Barre**, a fictional architecture and building studio in Cotonou, Benin.
It designs and builds houses, shops and schools with compressed earth blocks pressed from the red
laterite of southern Benin, locally called *terre de barre*, which gives the studio its name.

Why this subject:

- **It is specific to the place.** Laterite is under every plot in the region, and heat is the main
  problem a house in Cotonou has to solve. The subject gives the copy real content to work with
  (soil tests, rainy seasons, block yards, prices in FCFA) instead of generic agency language.
- **It gives the design its material.** The palette, the typography and the drawings all come from
  the building trade: earth, lime wash, the claustra blocks of West African modernist architecture.
- **It differs from Task 2**, which presented a parcel courier service.

Atelier Barre does not exist. The footer of every page says so.

### 1.2 Audience and primary job

- **Audience:** families with a plot in Cotonou or Abomey-Calavi planning to build, owners of hot
  concrete houses, and organisations building schools.
- **Primary job of the site:** explain why building in earth makes sense, show what the studio
  offers and at what price, and lead the visitor to book a site visit through the contact form.

## 2. Sitemap

```
/                Home       Hero, why earth, recent work, call to action
├── /about       About      Story, timeline, team, three rules, call to action
├── /services    Services   Four services with scope and prices, process, FAQ, call to action
├── /contact     Contact    Form (Server Action), next steps, studio details
└── /*           404        Custom "page not found" with the ways back in
```

Generated routes: `/sitemap.xml` (built from the navigation, so it follows the menu) and
`/robots.txt`.

## 3. Functional requirements

| ID | Requirement | Where |
|---|---|---|
| F1 | The site has four pages (Home, About, Services, Contact) and a custom 404 page. | `app/**/page.tsx`, `app/not-found.tsx` |
| F2 | Every page has its own title, description, canonical URL and Open Graph and Twitter tags. | `lib/metadata.ts`, `metadata` export of each page |
| F3 | Every page shares the same header (logo and navigation) and footer. | `app/layout.tsx`, `components/site/` |
| F4 | The navigation marks the current page with `aria-current="page"` and a visual marker. | `components/site/site-nav.tsx`, `lib/navigation.ts` |
| F5 | Below 768 px a hamburger button opens the navigation in a panel. The panel traps focus, closes with Escape, with its close button, by clicking outside or by following a link, and returns focus to the button. | `site-nav.tsx` (shadcn `Sheet`) |
| F6 | The footer repeats the navigation, gives the studio's contact details and states that the business is fictional. | `components/site/site-footer.tsx` |
| F7 | The Home, About and Services pages end with the same call to book a site visit, which pre-selects the matching subject on the contact form. | `components/site/closing-call.tsx`, `?subject=site-visit` |
| F8 | The Services page lists four services with what is included, a typical duration and a starting price, a numbered process, and an FAQ that works without JavaScript. | `app/services/page.tsx`, `content/services.ts` |
| F9 | The contact form collects a name, an email, an optional phone number, a subject from a list and a message. Each field is validated as the visitor types, with an error that says how to fix it. | `components/contact/contact-form.tsx`, `lib/contact/schema.ts` |
| F10 | A Server Action validates the request again with the same schema and returns typed field errors or a success message. | `app/contact/actions.ts`, `lib/contact/process-contact.ts` |
| F11 | The action limits each client to 5 messages per 10 minutes and silently drops submissions that fill the honeypot field. | `lib/contact/rate-limiter.ts`, `lib/contact/client-key.ts` |
| F12 | After a submission, the outcome is shown in a status region that receives focus; on success the form is cleared. | `contact-form.tsx` |
| F13 | With JavaScript disabled the form still posts to the Server Action, and the page shows the server's errors with the visitor's input refilled. | `contact-form.tsx`, `process-contact.ts` (`submittedValues`) |

**Out of scope.** No email is sent and nothing is stored. The action logs a sanitised summary to
standard output (section 7.4). A real deployment would pass the validated request to a mail or CRM
adapter at the point marked in `process-contact.ts`.

## 4. Page content

All copy lives in `content/` or in the page itself, written for this subject. There is no
placeholder text.

| Page | Sections |
|---|---|
| Home | Hero: the headline "Houses built from the red earth they stand on." set as a running bond, a lede, two actions, and the claustra screen. "Why we build in earth": three reasons (cooling, local production, repairs by any mason). "Recent work": three projects, each with a drawn elevation, place, year, programme and floor area. Closing call. |
| About | Intro "An architect, a mason and a block press". Story in three paragraphs with a quote from the master mason. Timeline 2016 to 2026. Team of four with monogram blocks (no portraits: the people are fictional). "Three rules we do not bend". Closing call. |
| Services | Intro with an in-page index. Architecture and permits, Construction, Earth blocks, Cooling retrofit: each with its audience, what is included, duration and starting price. "How a project runs" in five numbered stages. Four questions in native `details` elements. Closing call. |
| Contact | Intro "Tell us about your plot". The form. "What happens next" in three steps. Studio address, phone, email, opening hours and block yard. |
| 404 | "This wall has no door.", a short explanation, a link home and links to the other pages. |

Numbered markers are only used where the content is a real sequence: the project process, the
contact next steps and the timeline years.

## 5. Information architecture and components

| Concern | Choice |
|---|---|
| Rendering | Server Components everywhere. Only the navigation (`usePathname`, open state), the contact form and the nonce provider are Client Components. |
| Copy and data | `content/site.ts` holds the facts used on several pages (name, address, phone, hours, navigation), so the header, footer, contact page and metadata never disagree. |
| Shared building blocks | `PageIntro` (inner page opening), `CtaLink` (a link styled as a button: navigation stays a real link), `ClosingCall`, `Logo`. |
| Forms | shadcn `Field`, `FieldLabel`, `FieldError` and `FieldDescription` with react-hook-form's `Controller`. This is the pattern the shadcn documentation now recommends for react-hook-form; the older `Form` wrapper is no longer part of the current registry style. |
| Drawings | `components/art/claustra.tsx` and `elevation.tsx` draw everything in SVG. Each block is defined once and reused with `<use>`. |

## 6. Design

### 6.1 Direction

The site borrows from the building site. Its signature is the **claustra**, the perforated screen
block found on West African modernist buildings, which lets air through and keeps the sun off the
wall behind. The hero shows a claustra screen drawn in SVG; each opening shows the shadow of the
block's thickness, as if the sun were falling through it. The screen is laid course by course on
page load, bottom to top: it is the only animation on the site. A strip of claustra tops the footer
of every page and the logo is a single block.

The second idea is typographic: the home headline is set like a **running bond**. Every other line
is offset by half a block, the way masons stagger the joints of a wall. Everything else is quiet:
left-aligned text, generous space, thin rules for structure.

### 6.2 Colour tokens

Defined in `app/globals.css` (`@theme`) and mapped once onto the shadcn variables (`--primary`,
`--border`, `--ring`…), so every component takes the brand.

| Token | Value | Source | Role |
|---|---|---|---|
| `lime` | `#E9EBE6` | lime wash on a finished wall | Page background |
| `plaster` | `#DFE2DC` | rendered wall | Alternate sections, drawing panels |
| `laterite` | `#8F3518` | *terre de barre* | Primary actions, active link, blocks |
| `laterite-deep` | `#6E2810` | wet earth | Hover state, block reveal |
| `kiln` | `#33201A` | fired earth, charred wood | Text, footer and dark sections |
| `dust` | `#6B5A50` | dry laterite dust | Secondary text |
| `neem` | `#2F5D46` | neem trees planted for shade | Success only |
| `harmattan` | `#F2C46B` | the dusty dry-season sky | Light through the claustra, accents on dark |
| `signal` | `#B42318` | | Errors only |
| `joint` | `#857368` | mortar joint | Form field borders |

Measured WCAG 2 contrast ratios (computed from the hex values with the WCAG relative luminance
formula, not estimated):

| Text or element | Background | Ratio | Level |
|---|---|---|---|
| kiln (body text) | lime | 12.84:1 | AAA |
| kiln | plaster | 11.78:1 | AAA |
| dust (secondary text) | lime | 5.46:1 | AA |
| dust | plaster | 5.01:1 | AA |
| laterite (links, prices, active nav) | lime | 6.50:1 | AA |
| laterite | plaster | 5.97:1 | AA |
| lime on laterite (buttons, closing call) | | 6.50:1 | AA |
| lime on laterite-deep (button hover) | | 8.86:1 | AAA |
| kiln on harmattan (button on dark) | | 9.46:1 | AAA |
| lime on kiln (footer, dark sections) | | 12.84:1 | AAA |
| harmattan on kiln (headings on dark) | | 9.46:1 | AAA |
| `#C8B9AD` on kiln (muted text on dark) | | 8.07:1 | AAA |
| `#D9CDC3` on kiln (body text on dark) | | 9.89:1 | AAA |
| signal (errors) | lime | 5.48:1 | AA |
| signal | card `#F4F5F2` | 6.01:1 | AA |
| neem (success) | card `#F4F5F2` | 6.92:1 | AA |
| joint (field borders, non-text) | lime | 3.76:1 | 1.4.11 (≥ 3:1) |
| joint | card `#F4F5F2` | 4.13:1 | 1.4.11 (≥ 3:1) |

### 6.3 Typography

Two families, clearly distinct, self-hosted through `next/font`:

| Family | Role | Why |
|---|---|---|
| **Zilla Slab** 500, 600, 700 | Headings, numbers, prices | Heavy slab serifs read like stacked blocks. |
| **Atkinson Hyperlegible Next** (variable) | Body text, labels, forms | Drawn for legibility. Its slashed zero keeps phone numbers and prices unambiguous. |

| Use | Size | Line height |
|---|---|---|
| Home headline | `clamp(2.1rem, 9vw, 4.4rem)`, 700 | 1.02 |
| Page title | `clamp(2.6rem, 6.5vw, 4.75rem)`, 700 | 0.98 |
| Section heading | `clamp(1.9rem, 3.6vw, 2.6rem)`, 700 | 1.1 |
| Item heading | 1.3 to 1.75 rem, 600 | 1.2 |
| Body | 1.0625 rem (17 px), 400 | 1.6 |
| Lede | 1.2 rem | 1.65 |

Running text is kept to about 65 characters per line (`.measure`, 38 rem). Headings use
`text-wrap: balance`, paragraphs `text-wrap: pretty`. The running-bond headline never wraps inside a
line, which would break the pattern; its size is chosen so the longest line fits at 360 px.

### 6.4 Shape, space and motion

- Radius 3 px: a block has a softened arris, not a pill. Panels have no radius.
- Content width 76 rem with fluid side padding (`clamp(1.25rem, 4vw, 2.5rem)`).
- Sections alternate between lime and plaster; dark kiln sections hold the process and the rules.
- **Motion:** one page-load sequence (the hero claustra), the navigation marker and the FAQ sign.
  `prefers-reduced-motion: reduce` disables all of it.

## 7. Security

### 7.1 Headers

| Header | Value | Set in |
|---|---|---|
| `Content-Security-Policy` | see 7.2, new nonce per request | `proxy.ts` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | `next.config.ts` |
| `X-Content-Type-Options` | `nosniff` | `next.config.ts` |
| `X-Frame-Options` | `DENY` (CSP `frame-ancestors 'none'` for modern browsers) | `next.config.ts` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | `next.config.ts` |
| `Permissions-Policy` | camera, microphone, geolocation, payment, USB and topics disabled | `next.config.ts` |
| `Cross-Origin-Opener-Policy` / `-Resource-Policy` | `same-origin` | `next.config.ts` |
| `X-Powered-By` | removed (`poweredByHeader: false`) | `next.config.ts` |

### 7.2 Content-Security-Policy

Production policy (built by `lib/security/csp.ts`, covered by tests):

```
default-src 'self';
script-src 'self' 'nonce-<random>' 'strict-dynamic';
style-src 'self' 'nonce-<random>';
style-src-attr 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self'; connect-src 'self';
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
manifest-src 'self'; worker-src 'self';
upgrade-insecure-requests            (only when served over HTTPS)
```

- **Scripts:** no `unsafe-inline`, no `unsafe-eval`. `proxy.ts` generates 128 random bits per
  request and sets the policy on the request and the response; Next.js reads the nonce from the
  request header and stamps it on its own scripts. `'strict-dynamic'` lets those trusted scripts
  load the page chunks and makes browsers ignore host allow-lists.
- **Style elements need the nonce too.** Two libraries inject `<style>` elements at runtime:
  react-remove-scroll (scroll lock behind the menu and the select) and the Radix Select viewport.
  `NonceProvider` passes the nonce to them (through `get-nonce` and a React context). The nonce
  appears in the page's RSC payload; markup injected by an attacker cannot read script text, and
  code able to read it would already be running, so this does not weaken the policy.
- **zod** probes for `new Function` support to compile faster parsers. The schema module sets
  `z.config({ jitless: true })` so the probe never runs and no violation is reported.
- **Development** adds `'unsafe-eval'` (React rebuilds server error stacks with it),
  `'unsafe-inline'` for styles (hot reload) and `ws:` for the hot-reload socket. None of these are
  in the production policy.

**Trade-offs, stated precisely:**

1. **Style attributes are allowed** (`style-src-attr 'unsafe-inline'`). Radix positions the select
   menu and sheet with inline `style` attributes. Attributes cannot run code; the residual risk is
   CSS-based exfiltration through injected markup, low on a site with no secrets in the page.
2. **Every page renders per request.** A nonce must be unique per response, so pages cannot be
   prerendered or cached by a CDN. The root layout reads the request headers to opt in, and Cache
   Components / Partial Prerendering are switched off because a static shell cannot carry a nonce.
   For a four-page brochure site the cost is small; the experimental hash-based alternative (SRI)
   was not chosen because it is still marked experimental.

Verified on the production build: all five pages, the open mobile menu, the open select and a form
submission report **no CSP violation** in Chrome, and every `<script>` carries the nonce.

### 7.3 Contact form protections

| Measure | Implementation |
|---|---|
| Server-side validation | The Server Action is a public endpoint. It re-validates with the same zod schema as the browser: allow-listed characters for the name, a real email format, 8 to 15 digits for the phone, a subject from the list, 20 to 2 000 characters for the message. Only known text fields are read from the request; files and unknown fields are ignored. |
| Rate limit | Sliding window in memory: 5 messages per client per 10 minutes. Checked before anything else. The tracked keys are capped (10 000) so a flood of addresses cannot exhaust memory. |
| Client identity | See below. Never taken from a header the client controls. |
| Honeypot | A `website` field hidden from sight, from assistive technology and from the tab order. If it is filled, the action answers "sent" (the bot learns nothing) and drops the request. |
| Output | Errors and messages are rendered by React, which escapes text. There is no `dangerouslySetInnerHTML` in the project code. |
| Request size | Field lengths are capped by the schema; Next.js caps Server Action bodies at 1 MB. |

**Which IP address is used for the rate limit.** The left-most `X-Forwarded-For` entry is written
by the client: keying on it would let anyone bypass the limit by sending a new value with each
request. `lib/contact/client-key.ts` only uses sources written by a trusted party:

1. **On Vercel** (`VERCEL=1`), `x-vercel-forwarded-for`, set by the Vercel edge; a value sent by
   the client is overwritten.
2. **Behind your own proxies**, `X-Forwarded-For` only when `TRUSTED_PROXY_HOPS` is set to the number
   of trusted proxies in front of the app. Each proxy appends the address it received the request
   from, so the client address is the entry at position `TRUSTED_PROXY_HOPS` counted from the right.
   Example with one nginx in front: `X-Forwarded-For: 1.2.3.4, 203.0.113.7` gives `203.0.113.7`;
   the forged `1.2.3.4` is ignored. If the header has fewer entries than expected, nothing is trusted.
3. **Otherwise**, one shared key, `anonymous`, with its own budget of 20 messages per 10 minutes
   across all visitors. The limit gets stricter but can no longer be bypassed.

Unit tests cover a spoofed first entry, two-hop chains, a too-short chain, the Vercel header and
the fallback.

**Limit.** The rate limiter lives in the server process: it resets on restart and is not shared
between instances. A deployment on several instances should use a shared store (Redis, Upstash) or
a platform firewall rule.

### 7.4 Logging and privacy

The action logs one JSON line per event on standard output (12-factor). A received request logs the
subject, the email **domain**, whether a phone number was given and the message length; never the
name, the full email address or the message. Rate-limit and honeypot events log no personal data.
The site loads nothing from third parties: no analytics, no external fonts, no external images.

## 8. Accessibility

- Landmarks: `header`, `nav` (labelled "Main", "Footer", "Services on this page"), `main`, `aside`,
  `footer`. A skip link leads to the main content.
- Every section is labelled by its heading (`aria-labelledby`); one `h1` per page.
- Navigation: `aria-current="page"` on the current link. The hamburger is a real button named
  "Open menu" with `aria-expanded` and `aria-controls` (from Radix). The panel is a modal dialog with
  a title, traps focus, closes with Escape and returns focus to the button.
- Form: every field has a visible label; hints and errors are linked with `aria-describedby`;
  invalid fields get `aria-invalid`; on a failed submit focus moves to the first invalid field; the
  server's answer is announced (`role="status"` or `role="alert"`) and receives focus.
- Focus is visible everywhere: a 3 px laterite outline, harmattan on dark surfaces.
- Contrast: all text pairs pass AA, most pass AAA (section 6.2).
- Decorative SVG is hidden from assistive technology (`aria-hidden`); the hero drawing has a visible
  caption. French words are marked `lang="fr"`.
- `prefers-reduced-motion` removes the animation and transitions.

## 9. Responsive behaviour

Mobile first, checked at 360, 390 and 1440 px with no horizontal scrolling on any page.

| Breakpoint | Changes |
|---|---|
| < 640 px | Single column. Form fields stack. The hero claustra is capped at 19 rem. |
| ≥ 640 px | Name and email, phone and subject sit side by side. |
| ≥ 768 px | Inline navigation replaces the hamburger. Reasons, rules and timeline use columns; projects show the drawing beside the facts. |
| ≥ 1024 px | Hero, story, services, FAQ and contact use two columns; the process shows five columns; the services index moves beside the page title. |

## 10. Testing and quality

| Command | Covers |
|---|---|
| `npm test` | 45 Vitest tests in 7 files |
| `npm run lint` | ESLint with the Next.js configuration (including the React Compiler rules) |
| `npm run typecheck` | TypeScript in strict mode |
| `npm run build` | Production build |

| Test file | What it checks |
|---|---|
| `lib/contact/schema.test.ts` | Valid requests, names in any script, rejected markup, email, subject, message length after trimming, phone formats |
| `lib/contact/rate-limiter.test.ts` | Limit, retry delay, window sliding, separate keys, memory cap, invalid configuration |
| `lib/contact/client-key.test.ts` | Spoofed `X-Forwarded-For` ignored, trusted hops, Vercel header, shared fallback, environment parsing |
| `lib/contact/process-contact.test.ts` | Success and sanitised log, no personal data in logs, field errors, non-text fields, honeypot, rate limit |
| `lib/security/csp.test.ts` | Production script and style rules, framing and form rules, HTTPS-only upgrade, development relaxations, nonce format |
| `lib/navigation.test.ts` | Active-link rule, trailing slash, sub-pages, shared prefixes |
| `components/site/site-nav.test.tsx` | `aria-current`, opening the menu, `aria-expanded`, closing with Escape (focus returned) and on link click |

Manual checks on the production build (`next start`, headless Chrome): screenshots of every page
and the 404 at 1440 and 390 px, the open mobile menu, the open subject select, the form's client
errors, its success state, and its server errors with JavaScript disabled; the CSP check described
in section 7.2.
