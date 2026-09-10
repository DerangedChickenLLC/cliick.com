# prototype2 — running punch list

Knock-on effects and deferred cleanups noticed while iterating. Not blocking;
review before finalising. Delete this file when prototype2 is promoted.

## Copy principle — describe the result, not the mechanism

Not a task. A rule to write against, and the reason several rewrites in this
file went the way they did.

**A connectKey is an address, not an invitation.** Holding someone's code lets
you ask; they keep the right of refusal, and the key is revokable, which is what
makes publishing an address safe at all. That is the true model — and people
reliably cannot hold it, however carefully it is explained. Explaining it harder
does not work. It has been tried.

So the site does not try. **Use words that are true about the outcome and vague
about the mechanism.** A person needs a model that predicts what will happen.
They do not need the model the system runs on, and being handed it makes them
worse at predicting, not better.

| use | why it works |
|---|---|
| **join** | absorbs the asking as a sub-step of arriving |
| **share** | "share a Cliick" carries no direction at all |
| **connected**, **in** | states where things ended up |
| **invite only** | describes the *result* — only vetted people get in — not who asked whom |

| avoid | why it fails |
|---|---|
| **invite** (as a verb) | asserts a direction that is often backwards |
| **request** | names the mechanism and raises the question it answers |
| **accept**, **approve** | drags the reader into who-asked-whom |

The test: *does following this sentence require understanding an asymmetry?*
If yes, rewrite it.

The clearest failure was a line on the Start flow that read well and taught
nothing: "Being connected is not the same as being let in, which is the point."
Pure mechanism. It asked the reader to hold two states apart and grasp why, at
the exact moment they were trying to follow an instruction. Removed in `74c47f6`.

Note that **"invite only" is safe and "invite them" is not** — same word, and
the difference is whether it names a result or an action. That pair is the
quickest way to check whether a sentence is on the right side of the rule.

Where this applies beyond the marketing site: the FAQ (38 answers, several of
which explain mechanics), the app's own strings, and the store listings. Any
sweep of one should carry this rule into the others.

## Copy

- [ ] **"Collects nothing" deserves more than three chips.** Verified in code:
  `UserEntity` holds a display name, avatar, colour, mascot and consent flags;
  `OauthAccountEntity` holds a provider and an opaque subject id. There is no
  email, phone, address or card column anywhere in the model, and the OAuth
  path does not even handle an email scope. Subscriptions run through the app
  stores, so card details never reach Cliick at all — you necessarily already
  have a relationship with Apple or Google to have installed it. (Not on
  Amazon; would support it if we were.)

  This is a rare thing: a privacy claim that is literally checkable rather than
  promised. It is currently three chips among nine. It is plausibly a scene, a
  headline, or the spine of the manifesto page — worth deciding where it
  belongs rather than leaving it as a footnote to a pricing section.

- [ ] **Scene 3 copy is not settled** (committee rejected). Currently "Funded by
  members. Not ads." / "Members pay for Cliick, and guests are on the house. No
  tracking. No data brokers. No AI training."

  Tried and rejected, so as not to retread:
  - "With no advertisers to answer to, there's no one to sell you to" — two
    `to`-endings in one sentence, stumbles read aloud.
  - "Nobody is bidding for your attention here" as the headline — good frame
    ("bidding" names the mechanism the way "advertising platform" does in scene
    2), but the committee wanted "Funded by members. Not ads." kept.
  - "You're not our product. Not now, not ever." — strong line, but it
    duplicated Membership's h1, so it was moved there instead. Do not bring it
    back to scene 3.
  - "The only people Cliick answers to are the ones using it" / "The only thing
    Cliick sells is Cliick" — offered, not taken.

  Constraints learned along the way:
  - Any claim here must survive the free tier. "The people using Cliick are the
    ones paying for it" is false for every Guest, and this scene sits one
    scroll above a $0 tier, so it invites the "if you're not paying, you're the
    product" reflex. "Guests are on the house" was the fix and is worth keeping
    in whatever replaces this.
  - The scene's headline is clipped while scenes 1 and 2 are long and flowing,
    so the closing refrain has little to change gear from. Either accept that
    or the headline has to lengthen.
  - No em dashes.

- [ ] **Manifesto line, verbatim, for the new page.** From a contributor, in the
  room: *"Everyone please STOP posting your personal lives on advertising
  platforms!"* Too scolding for body copy — it makes the visitor the wrongdoer
  on a site whose whole posture is invitational — but it is the founding
  grievance stated plainly, and a quote is allowed an intensity a paragraph is
  not. Belongs on the manifesto page planned alongside About, set as a stated
  conviction and ideally attributed. Its sharpest idea, "advertising platforms"
  as the frame for what those products structurally are, is already carried
  into scene 2.
- [x] ~~"No X. No Y." is becoming a refrain.~~ Made deliberate: all three
  scenes now close on it — "Invite only. No searching. No pushed content." /
  "No followers. No reach." / "No tracking. No data brokers. No AI training."
  Counts vary 3-2-3 so it reads as a refrain rather than a template.
- [ ] **"No AI training" is now load-bearing.** It closes the homepage's final
  scene as well as appearing in the promise chips and the FAQ, so it is one of
  the site's most prominent promises. It is also the policy claim in the
  ledger most likely to age badly. Needs an owner to confirm it holds
  indefinitely before launch, not just today.

- [x] ~~Hero slogan duplicates the closing CTA.~~ Resolved: the footer CTA
  is now `Join the Reset.` alone, so the title and footer are distinct.
- [x] ~~Capitalisation mismatch between hero and footer.~~ Gone with the
  footer's second line.
- [ ] **The hero phrase still recurs in scene 2.** The hero is "Reclaim your
  Feed" and scene 2's heading is "Start fresh and reclaim your feed" — so
  the homepage still says it twice, roughly one screen apart, and scene 2 is
  the more prominent of the two now that scene headings run 52px. Removing it
  from the footer disambiguated title from footer but not title from scene.
  Note the scene copy exists twice in `index.html` (stage + fallback), so any
  reword needs both.
- [ ] **Hero copy exists twice.** The stage scenes and the fallback flow each
  carry their own hero + section copy (author's note, `index.html`). Every
  copy edit must be made in both until the design settles.

## Layout

- [ ] **Hero headline wraps to two lines** at 1440px — "Reclaim your / Feed".
  It misses a single line by a few pixels against the container, so the wrap
  is accidental rather than designed. Either nudge the type/width to fit one
  line, or commit to the two-line stack.

## Hero backdrop (placeholder)

- [ ] **Subpage crop lands in the dark region.** `.page-hero .hero-bg` uses
  `object-position: center 75%`, which on the simulated backdrop picks up the
  navy lower-left rather than the warm bokeh. Subpage headers read flat and
  dark. Either shift to roughly `center 35%`, or give the SVG more interest
  low in the frame.
- [ ] **Hatch reads on the phone's black chrome.** The placeholder hatch is
  invisible over photography but shows as visible stripes across the app's
  dark nav bar. Consider masking it to the photo area or dropping its opacity.

## Colour schemes

- [ ] **A second scheme is planned** (visitor-selectable, a completely
  different look). Everything now resolves through the SCHEME block at the top
  of `redesign.css`; a second scheme should be defined by overriding that block
  alone. Do not introduce colour literals below it — the one leak we already
  hit was an inline `style="background: var(--band-gray)"` on About, which
  silently produced 1.01:1 text when the token was repointed.
- [ ] **Decide how the scheme is selected** — `data-scheme` on `<html>` plus a
  toggle, persisted. Not built.

## Subpage structure

- [x] ~~About and Membership carry two headers.~~ Resolved: the page name is
  now a small eyebrow and each page's real headline was promoted into the
  header, so there is one header per page.
- [ ] **FAQ's headline is invented copy.** "Questions, answered." and "Search
  below, or browse by topic." were written to fill the merged pattern — About
  and Membership reuse their own existing copy, FAQ had none. Copy round.
- [ ] **The supporting-art slot is empty on all three pages.** `.page-hero-art`
  is wired and documented; it just needs images. Sized to `min(360px, 32vw)`
  and dropped below 900px.
- [ ] **Page ledes are placeholders** written to make the pattern visible, not
  approved copy. They belong in the copy round.

## Responsive

- [ ] **Small-screen nav.** Four links plus the wordmark do not fit below
  ~340px; `.nav-links` is the only element still pushing past the viewport at
  320px, on every page, and it is the one genuinely broken responsive case
  left. Needs a real pattern — drawer, disclosure, or a condensed row — not a
  tweak. Decide the pattern before building; it also has to work over the lit
  backdrop and against the frosted nav bar.
- [ ] **Optimisation pass generally** — breakpoints are chosen per component
  rather than from a shared set.

## Explorations

- [ ] **Light gallery.** Real galleries hang work on white walls because a
  bright neutral surround makes photographs read as objects, and the product
  is user photography — so a light scheme may serve the content better than
  the dark one. Not a token swap: every relationship inverts (objects become
  raised and lighter, the night backdrop needs heavy correction or replacing,
  the phone's black bezel goes from melting into the wall to being the darkest
  thing on screen). The `.band.latte` context block is a working miniature of
  exactly this — the light gallery is that block applied site-wide.
- [ ] **Second scheme, visitor-selectable** (the other founder's, deliberately
  unlike this one). See the scheme notes above.

## Dark gallery — unfinished edges

- [ ] **`.win` on About keeps its `clip-path`,** which crops the phone. It is
  now a lit alcove rather than a flat slab, but if we want the homepage's
  no-box treatment here too, the crop has to go and About's layout shifts.
- [ ] **`.band.latte` is deliberately light** (`#F2EBDF`), not an oversight:
  it is the "back out into the light" beat before the black footer, and
  `.latte-fluffy` depends on `mix-blend-mode: multiply` to drop its baked-in
  white background, which only works over a light band. Making the band dark
  requires a transparent mascot asset — keying the white out leaves artifacts
  where its drop shadow was, since that shadow is grey-on-white and no
  luminance threshold separates it from the white cup.

## About rebuild — content moved out, still homeless

About was six sections and four of them belonged elsewhere; it read as a
holding pen. Rebuilt as the trust page. The evicted content is recorded here so
it is parked, not lost.

- [ ] **The noun is still never defined, anywhere on the site.** About used to
  carry it, in "Everything in its right place": *"Cliicks are private groups you
  create and invite people to — family, friends, coworkers, neighbors, artists.
  Each group only sees what you intend."* The homepage says "Start a cliick"
  three times without ever saying what one is, and this is the single most
  repeated recommendation in the September notes. It belongs on Home, early.

- [x] ~~The five-step onboarding needs the "Start a Cliick" page.~~ Built. The
  sequence changed on the way: About's five steps opened with Download and Sign
  in, which are the app's job, not the site's. The page teaches the part that
  decides whether a Cliick survives — name it, fill it, then invite — because
  the failure mode is inviting people into an empty room.

- [ ] **"Start a Cliick" is a page with no way to start a Cliick.** The CTA
  goes to the app stores, which is honest but is a seam. Universal links would
  let the button open the app for someone who already has it, and the store for
  someone who does not. Already on the list separately; this page is now the
  strongest argument for it.

- [x] ~~Home still needs the noun.~~ Done, in the hero tagline: "You make a
  Cliick for each part of your life: your family, your book club, the people you
  travel with." Defining by use rather than by category, because "a private
  group" is what it is and "your book club" is what it is *for*.

  The casing was normalised at the same time and was arguably the bigger
  problem: the site spelled the noun both ways (16 "Start a cliick" against 12
  "Start a Cliick", and one FAQ answer used both inside a single paragraph), so
  a reader had to work out that the lowercase generic and the capitalised brand
  were the same word. It is a proper noun now, everywhere.

- [x] ~~About's founder section is a placeholder.~~ Done: Nina and John, real
  photograph, real quote. The photo was supplied as a baked social card (image
  on top, quote burned into a black band below); only the photograph was used
  and the quote reset in the site's own type. No roles given, deliberately, and
  no ownership claim beyond "self-funded", which is the language John uses with
  people and names the thing that matters rather than the paperwork. For the
  record and not for the page: John is the sole owner on paper,
  Nina is his fiancee and it is jointly their project, and the wider team is
  part-time volunteers who are not being named. An earlier draft said "we own
  it outright", which reads as two owners and is false — a page whose whole
  argument is that its claims can be checked cannot carry one that cannot.
  Keep any future wording here to what survives scrutiny: privately held, no
  investors, no funding round.

- [ ] **Ownership belongs on Membership too, not only About.** "Nina and John
  own Cliick outright — no investors, no funding round waiting to change the
  terms" is the structural reason the member-funded argument holds. Membership
  currently asserts the conclusion without the reason, and About now carries
  the reason without the audience. Worth a line on Membership pointing at it.

- [ ] **The bylaw belongs on About, once it is written down.** "I'd rather shut
  down operations than violate it" is a stronger claim than anything currently
  on the site. Deliberately not published while it cannot be quoted.

- [ ] **Deleted as duplicates, no action needed unless someone misses them:**
  About's "Share with the people who matter" (Home scene 2 says it) and
  "Funded by members. Not advertisers." (Home scene 3 *and* Membership both say
  it).

- [ ] **One claim, three different words.** Home scene 3 says "No attention
  farming", the Home light band says "data mining", Membership's chip says "No
  data mining", and the FAQ says "data brokers" twice. Pick one and use it
  everywhere; the variation reads as imprecision on the one claim that most
  needs to sound exact.

## About — follow-ups

- [ ] **Try the founders' quote at the top of About.** Reverted for now
  (`d4ffe44`, reverted in `1a0791b`), not rejected: the reasoning behind it
  stands, which is that most visitors never reach the bottom of a page and the
  quote is the only line on About in their own voice.

  Two arrangements were built and both are recoverable from that commit:

  - *As a caption under the photograph.* Visible but not powerful — at caption
    size it reads as a photo credit, and it leaves the page ending on
    positioning plus housekeeping.
  - *As the page title,* 62px at weight 500, names beneath, photo beside. This
    was the strong one. Its cost is that About then opens on a general aphorism
    rather than a claim about Cliick; the eyebrow, names and photograph resolve
    that quickly, and About is not a landing page, but it is a real trade.

  Whatever is tried next has to keep the dark close intact: the quote at 52px
  with 168px of air above it, on the lit backdrop, is the most dramatic moment
  on the site and both attempts spent it.

  A third option nobody has built: leave the quote where it is and give the
  hero a different reason to hold someone — the hero currently earns attention
  with the photograph alone.

## Copy parked, not discarded

- [ ] **About's close is centred on the page's own ground, not a light band.**
  Tried the homepage's latte treatment first; the surface change was not what
  the centring needed. Membership already centres its close on the dark, and
  the row above supplies enough width to counterweight the footer. Cream also
  put two hard transitions in a row on the way into a black footer, where dark
  is one soft step. If the second colour scheme ever changes the backdrop's
  drama, revisit — the quote currently relies on the lit layer behind it.

- [ ] **"Not a platform. A place."** was About's positioning heading. It sat
  directly above the founders' quote in the closing band and the two competed
  for the same beat; the quote won, so the heading came out and its paragraph
  moved up into the hero, where it is the same thought as "not a business plan
  looking for a market". The phrase itself is good and is now unused — it may
  belong on Home, or as a scene headline.

## Brand — "Cliick" vs "cliick", system-wide

- [ ] **Settle the noun's casing everywhere, not just the website.** The site
  used to distinguish "Cliick" (the product) from "cliick" (a group). The
  convention was deliberate but it was not holding: before the sweep, the site
  ran 16 lowercase against 12 capitalised, and one FAQ answer used both
  spellings inside a single paragraph.

  Decision, for now: **capitalised everywhere.** English already separates the
  two senses with determiners, and that survives what case cannot —
  sentence-initial position (where the distinction silently dies), screen
  readers, and other people writing about you.

  | form | reads as |
  |---|---|
  | Cliick is your private network | the product — no article |
  | a Cliick, every Cliick, your Cliicks | a group — determiner or plural |

  The wordmark's CLIICK is typography, not a third sense; ignore it in prose.

  **Scope beyond the website, not yet touched.** Raw counts are dominated by
  code identifiers, which are not in scope — only strings a person reads are:

  - **Clique (app)** — ~180 quoted strings contain the lowercase word. Most are
    identifiers or URLs, but real display copy is in there: "active cliicks",
    "create cliick", "in {cliick}", "Paused lives on your phone, not in the
    cliick".
  - **Circles (backend)** — user-visible surfaces only: error messages,
    notification and email copy, anything rendered into the OpenAPI description
    fields. Class and column names stay as they are.
  - **Documents** — store listings, privacy policy and ToS. These are the
    highest-stakes copies because Apple and Google review them and they are
    quoted back at you.

  Sequencing note: do the app and Documents together, since store listings
  describe app screens and the two drifting apart is worse than either being
  wrong alone.

## App vs site — found by reading the Maestro flows

The start flow was checked against `.maestro/flows/01-onboarding.yaml` and
`destructive/08-connect-lifecycle.yaml` rather than against assumptions. Steps
one and three of the ladder succeed unaided. What follows is what does not.

- [x] ~~Onboarding pre-selects Premium Yearly, and Complete Setup buys it.~~
  **Withdrawn — I was wrong.** `useSetupSubscription` calls `requestSubscription`
  from expo-iap, which routes through StoreKit and Play Billing, so the OS
  purchase sheet with Face ID or a password is mandatory and the error path
  handles `"Purchase cancelled."` explicitly. Nobody is charged by tapping
  through. The capture note was warning a test engineer off triggering a real
  purchase during a screenshot run; I read a QA caution as a dark pattern.

  Pre-selecting Premium is also a deliberate and defensible call: status-quo
  bias means whatever is selected reads as the thing in hand, and starting at
  Premium frames that as full capacity rather than as free-ness. Cliick is a
  subscription product whose free tier is an unbounded trial, so this is the
  right default for the business.

- [ ] **The app displays 5 where the site displays 6, and both say "members".**
  Confirmed from source, not from a capture comment — I softened this once and
  should not have. `CapacityConfig.java` sets `freeMemberCap = 6` and says in a
  comment that this "means owner + 5 others". `apiConfig.ts` mirrors it at 6.
  But `useAvailableSubscriptions.ts` renders
  `${MAX_CLIICK_MEMBERS_FREE_TIER - 1} members per cliick`, so the app puts
  **5 members** on screen while the plan cards say **6 members**. Same cap, same
  noun, different arithmetic, minutes apart in the start flow.

  The unambiguous phrasing is the one the paywall already uses — "up to 5
  **others**" — and it is also what the site said originally: "Up to 6 members
  per Cliick, you and 5 others". That gloss was dropped when the capacity bar
  was ported to Home. Restoring it on both surfaces would close this without
  either side having to be wrong.

- [ ] **The site sells free-first; the app is paid-by-design. The site should
  move.** This runs opposite to what I first recommended. The plan cards say
  "Free forever" and list Guest first, which frames the free tier as a
  destination. The app never uses that phrase — its framing throughout
  `paywallCopy.ts` is "Guests get up to 5 others in each cliick. Become a Member
  to go bigger", which frames it as a floor. The intent is a generous unbounded
  trial, and someone following the start flow reads one framing and meets the
  other minutes later. The single sharpest change is "Free forever" → something
  that reads as a starting point; card order and emphasis are a second question.

- [ ] **Step two cannot complete alone.** Connect → Become Peeps → *they accept*.
  The last move belongs to somebody else, so it is the one rung the page cannot
  promise. Worth deciding whether "about five minutes" survives that, and
  whether the app could let a first post reach a new connection without the
  Peeps round-trip.

- [ ] **"Three small things, about five minutes" is measured after setup.**
  Setup is five screens: name (required), photo, hatch tag, subscription, then
  the feed. It is the longest part of the first run and the flow deliberately
  skips it.

- [x] ~~A third sign-in provider exists.~~ Dev-only. "Apple or Google" is
  accurate for users.

- [ ] **Vocabulary drift between app and site.** The app's empty feed says
  *"It'll feel a bit empty to start with, but that's kinda the point. Cliick is
  your zen space."* The site makes the same argument in a different register and
  never says "zen space". Onboarding's welcome, *"It's time to reclaim your
  feed"*, matches the hero exactly and should be protected in any rewrite.

## Brand — wordmark rollout

- [ ] **Pull the CLIICK wordmark through the rest of the system.** Deliberately
  deferred: the mark wants sitting with before it propagates, because every
  place below is harder to change once it lands. Source and tooling live in
  `prototype2/brand/` (see its README); shipped assets in
  `prototype2/images/brand/`.

  Currently the wordmark exists in exactly one place: the site nav on the four
  prototype2 pages. Not yet touched:

  - **Promote the source out of prototype2.** It sits beside the marketing
    prototype because that is where it was drawn. It belongs next to the bird
    in `Clique/assets/`, tracked the way `logo-source.svg` is, so artwork can be
    generated on demand rather than hand-exported.
  - **Wire it into `Clique/scripts/generate-brand-assets.mjs`.** That script is
    the source of truth for margins and canvas fitting (L60/R40/T50/B50 on
    1024). Anything generated outside it will drift — this rollout already hit
    that once, when a hand-refitted viewBox dropped the margins and the mark
    rendered clipped.
  - **App**: splash, any in-app brand lockup. `LogoImage.tsx` is generated by
    that script, so the wordmark should arrive the same way.
  - **Store listings** (`Documents/`), social/OG images, email.
  - **favicon and the site's own `<head>` icons** — still the bird alone, which
    may well be correct, but it is a decision rather than an oversight.
  - **The light scheme.** Both marks are inline SVG on `currentColor`, so they
    already follow the ink tokens. Worth confirming against the second scheme
    when it exists rather than assuming.

- [ ] **Nav height is still 96px** for a 44px lockup. It wants to come down, but
  that changes page rhythm everywhere, so it was left alone.

- [ ] **The wordmark is hidden below 720px**, as it was when it was text. Now
  that it is a drawn mark rather than a font, whether to show it there is worth
  revisiting.

- [ ] **The bird and the wordmark both contain a broken circle.** The mark's
  inner rings and the wordmark's Cs are the same gesture. Not planned. Either
  exploit it deliberately or separate them; leaving it accidental is the worst
  of the three.

## Scaffolding to remove before launch

- [ ] **Placeholder film slates.** Delete the marked block in `redesign.css`
  plus every `.phone--placeholder` class and `.film-slate` span once real
  recordings exist. `.phone-screen video` is already styled for the swap.
- [ ] **Simulated hero backdrop.** `images/redesign/hero-bg-sim.svg` is a
  procedural stand-in, not photography. Replace with the real shoot; the
  original `hero-bg.png` is still in the repo if we need to fall back.
- [ ] **Palette / hero-tone switchers** were removed from prototype2. They
  still exist in `/prototype/` if we want to revisit those variants.
