---
name: cuckyouleet
description: Practice the coding rounds LeetCode doesn't cover.
colors:
  paper: "#eef3e2"
  paper-2: "#e3ebd2"
  ink: "#10240b"
  ink-soft: "#3d5634"
  lime: "#a6ec3e"
  lime-hi: "#ccff74"
  lime-lo: "#86d327"
  rim: "#5bff3a"
  win: "#0c160a"
  win-2: "#121f0f"
  win-line: "#22341d"
  code: "#d7ebc8"
  code-dim: "#849d76"
  amber: "#ffcf6e"
  red: "#ff7a66"
  error: "#a3260f"
typography:
  display:
    fontFamily: "Jersey 10, Courier New, monospace"
    fontSize: "5.75rem"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.005em"
  heading:
    fontFamily: "Jersey 10, Courier New, monospace"
    fontSize: "3.6rem"
    fontWeight: 400
    lineHeight: 0.95
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.08em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  sm: "8px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  pill: "999px"
spacing:
  gutter: "16px"
  sm: "8px"
  md: "18px"
  lg: "36px"
  section: "140px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 22px 13px"
  button-primary-hover:
    backgroundColor: "{colors.lime-hi}"
  input:
    backgroundColor: "#fbfdf6"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "13px 16px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  chapter-active:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "6px 12px 8px"
  editor-window:
    backgroundColor: "{colors.win}"
    textColor: "{colors.code}"
    rounded: "16px"
---

# Design System: cuckyouleet

## Overview

The page is a green arcade palette set out like a practical product page. A pale green paper with a dot grid carries ink outlines and pixel display type. The product shows up as a dark editor window glowing with a lime CRT rim. That is the one place the arcade origin shows through. The page demonstrates instead of decorating: a session plays itself, and a five-line bug hunt waits for the visitor to try. It's light because visitors read it in daytime on laptops, and because the dark window only stands out against a light ground.

## Colors

### Primary
- **Lime** `#a6ec3e`: the only fill colour. Primary buttons, the boxed headline phrase, the active chapter, the report card, step numerals, and the right column of the comparison table. Text on lime is always ink.

### Neutral
- **Paper** `#eef3e2` and **Paper 2** `#e3ebd2`: the page ground and the closing panel. The dot grid uses ink at 13% alpha.
- **Ink** `#10240b`: text, outlines and the logo tile. **Ink soft** `#3d5634`: secondary text.
- **Window** `#0c160a` / `#121f0f` / line `#22341d`: the editor. Code text `#d7ebc8`, dim `#849d76`.

### Signal
- **Amber** `#ffcf6e`: strings and the suspect line in the editor. **Red** `#ff7a66`: test failures in the terminal. **Error** `#a3260f`: form errors on paper.

### Named Rules
- **One fill rule:** lime is the only saturated fill on paper. New emphasis comes from lime or ink weight, never a second accent.
- **Glow is light, not decoration:** only screens glow (the editor window and the try-one CRT). Nothing else gets a coloured halo.

## Typography

Jersey 10 (a condensed pixel face) is used for display and section headings, the wordmark, numerals in reports and step markers, and CRT text. Archivo sets body and UI copy. JetBrains Mono is used for code, terminal output and file names only.

### Hierarchy
- Display h1: 3rem to 5.75rem, line-height 0.9, balanced.
- Section h2: 2.4rem to 3.6rem, line-height 0.95.
- h3 and step titles: Archivo 800, 1.1875rem.
- Body: Archivo 1.0625rem/1.55. Secondary copy in ink-soft.
- Pane labels inside the window: Archivo 700, 0.6875rem, uppercase, tracked 0.08em. These are UI chrome inside the product mock and are never used above page headings.

## Layout

The content column is `min(1160px, 100% - 32px)`. The hero is centred and narrower (940px). Sections are separated by 88 to 140px. The nav is a sticky outlined bar. Below 760px, the nav links hide (the CTA stays), the form stacks, the editor becomes one column, and the comparison table turns into labelled rows.

## Elevation & Depth

Depth comes from 2px ink outlines plus soft drop shadows with an offset and blur. The primary button adds an inset bottom shade (`inset 0 -4px 0`) that compresses when pressed. The editor window uses a stacked ring: ink 3px, rim 5px, a 34px lime glow, then a long soft shadow.

## Shapes

Radii are 8px for small controls, 10px for buttons and inputs, 14px for the nav, 16px for the editor, 20px for the closing panel, and pills for chips. The boxed headline phrase sits at −1.2deg. It's the one tilted element on the page.

## Components

### Buttons
Primary: lime fill, 2px ink border, 750 weight, inset bottom shade, presses down 2px. Text buttons: ink-soft and underlined.

### Chips
Tag pills: paper fill, 1.5px ink-at-16% border, 600 weight.

### Inputs
Near-white fill, 2px ink border, a lime-lo focus ring; the error state uses the error red border and message.

### Navigation
A sticky outlined bar on translucent paper, with the wordmark (ink tile bug mark plus pixel wordmark), section links, and a small primary CTA.

### Session window (signature)
A dark editor with a file tree, tabs, code with lime keywords and amber strings, a terminal and an AI helper pane. The session autoplays when scrolled into view. Chapter buttons seek, a pause control stops it, and reduced motion shows the finished state. The lime report card slides in at the end.

### Hero motion (opening)
- **Living headline:** each letter of the h1 is its own element. It hops with a squash and stretch when the cursor passes. A click makes it jump and throws a burst of lime and ink pixel bits plus an ink ring. One random letter twitches every 2.6s.
- **Cursor spotlight:** the dot grid under the cursor lights up lime (a 240px masked layer aligned to the page grid).
- **The bug:** a 9×9 pixel bug with a tripod leg gait follows the cursor in the hero, stops 44px short, and wanders when idle. Clicking it bursts it and sends it running.
- **Load:** hero parts rise in a stagger and the boxed phrase stamps in. Three pixel sparkles twinkle around the box.
- **Session window:** tilts up to 3–4° toward the cursor.
- Cursor effects run only on fine pointers. Everything is off under reduced motion, and the sparkles then show static.

### Try-one CRT
A lime screen inside a dark bezel, with faint scanlines and ink text. It holds a five-line listing whose lines are buttons, a log with Fail, Miss, AI and Pass tags, and a dashed report.

## Do's and Don'ts

### Do:
- Show the product working (sessions, terminals, reports) rather than describing it.
- Label demonstration data as a sample.
- Keep code in JetBrains Mono and display text in Jersey 10.

### Don't:
- Don't add traction numbers, testimonials or company logos. None exist (see PRODUCT.md).
- Don't bring back the arcade cabinet hardware (joysticks, coin doors, "PLAYER 1"). The founder asked for less gamification.
- Don't add eyebrow labels above headings or hard zero-blur offset shadows.
- Don't put text on lime in anything but ink.
