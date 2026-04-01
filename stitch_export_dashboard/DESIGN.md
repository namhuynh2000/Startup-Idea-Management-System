```markdown
# Design System Document: The Architect’s Blueprint

## 1. Overview & Creative North Star: "The Editorial Intelligence"
This design system moves away from the "SaaS-in-a-box" aesthetic to create a high-end, editorial experience for Startup Idea Management. The Creative North Star is **The Editorial Intelligence**. 

We treat data not as a spreadsheet, but as a curated gallery. The system breaks the rigid "dashboard" grid through **intentional asymmetry** and **tonal depth**. By utilizing extreme typographic scale (pairing `display-lg` with `label-sm`) and overlapping surfaces, we convey a sense of institutional trust (the Navy) and innovative agility (the Teal). We avoid "boxed-in" layouts; instead, we use breathing room and layering to guide the eye, making complex investment data feel effortless and premium.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, authoritative `primary` (#001736) balanced by the progressive energy of `secondary` (#006a64).

### The "No-Line" Rule
To achieve a high-end feel, **1px solid borders are prohibited** for sectioning content. Boundaries must be defined solely through background color shifts. 
- Use `surface-container-low` (#f3f3fc) for the main workspace background.
- Use `surface-container-lowest` (#ffffff) for primary content cards to create a natural, soft lift.

### Surface Hierarchy & Nesting
Think of the UI as layers of fine paper. 
1. **Base Layer:** `surface` (#f9f9ff)
2. **Structural Sections:** `surface-container` (#ededf6)
3. **Interactive Cards:** `surface-container-lowest` (#ffffff)
4. **Active/Hover States:** `surface-container-high` (#e7e7f0)

### The "Glass & Gradient" Rule
For "Hero" metrics or primary "Submit Idea" CTAs, use a subtle linear gradient from `primary` (#001736) to `primary_container` (#002b5b). For floating navigation or modals, apply **Glassmorphism**: use `surface` at 80% opacity with a `backdrop-filter: blur(12px)`.

---

## 3. Typography: Authority Through Scale
We pair **Manrope** (Headlines) for its modern, geometric character with **Inter** (Body) for its clinical legibility.

- **Display (Manrope):** Use `display-lg` (3.5rem) for high-level "Idea Score" totals or welcome headers. The sheer size creates an editorial "magazine" feel.
- **Headline/Title (Manrope):** `headline-sm` (1.5rem) should be used for idea titles.
- **Body (Inter):** All analytical data uses `body-md` (0.875rem). 
- **Labels (Inter):** Use `label-sm` (0.6875rem) in **All Caps** with 0.05em letter-spacing for investment status categories. This adds a layer of "Financial Report" sophistication.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for a modern SIMS. We utilize **Ambient Shadows** and **Tonal Lift**.

- **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-low` background. The slight shift from #ffffff to #f3f3fc provides all the separation needed.
- **Ambient Shadows:** For floating menus, use `0px 12px 32px rgba(25, 27, 34, 0.06)`. The shadow is a tinted version of `on-surface`, ensuring it looks like light passing through glass, not a grey smudge.
- **The "Ghost Border" Fallback:** If a separation is required for accessibility (e.g., input fields), use `outline-variant` (#c4c6d0) at **20% opacity**.

---

## 5. Components

### Investment Status Badges
Instead of heavy blocks of color, use a "Subtle Inset" style:
- **Public:** `secondary_container` (#6ef4ea) background with `on_secondary_container` (#006f69) text.
- **Private:** `primary_container` (#002b5b) background with `primary_fixed` (#d6e3ff) text.
- **Hybrid:** `tertiary_fixed` (#ffdea8) background with `on_tertiary_fixed_variant` (#5e4200) text.
*All badges use `rounded-full` (9999px) and `label-md` type.*

### The 'Star' Rating Component
To feel premium, the Star Rating should not be a standard yellow icon. Use `secondary` (#006a64) for filled states and `outline_variant` (#c4c6d0) for empty states. Use a thin-stroke (1.5px) SVG star icon to maintain the "clean" aesthetic.

### Complex Data Tables (Idea Management)
- **Header:** Use `surface-container-highest` (#e1e2eb) background, `label-md` bold text, and 0% border.
- **Rows:** Alternating `surface` and `surface-container-low`. **No divider lines.**
- **Spacing:** Use `spacing-5` (1.1rem) for vertical cell padding to allow the data to breathe.

### Input Fields
- **Default:** `surface-container-highest` background, no border, `rounded-md`.
- **Focus:** 1px "Ghost Border" using `secondary` at 40% opacity and a subtle `secondary_container` glow.

### Buttons
- **Primary:** Gradient from `primary` to `primary_container`. White text. `rounded-lg`.
- **Secondary:** Transparent background, `secondary` text, and a 1px "Ghost Border" using `secondary` at 20% opacity.

---

## 6. Do’s and Don’ts

### Do:
- **Use Asymmetric White Space:** Use `spacing-16` (3.5rem) for side margins but `spacing-24` (5.5rem) for top margins to create an editorial feel.
- **Color-Code Roles Subtly:** Use 4px vertical accent lines on the far left of cards to denote user roles (e.g., `secondary` for Admins, `tertiary_fixed_dim` for Investors).
- **Embrace Large Type:** Let the numbers (Idea ROI, Star Ratings) be large and bold.

### Don’t:
- **Don’t use 100% Black:** Always use `on_surface` (#191b22) for text to maintain tonal softness.
- **Don’t use "Default" Shadows:** Avoid the standard CSS `box-shadow: 0 2px 4px`. It looks cheap.
- **Don’t use Dividers:** Never use a `<hr>` or a border-bottom to separate list items. Use vertical space (`spacing-4`) or a background color shift.

---

## 7. Spacing & Rhythm
The system relies on a **Soft-Grid**. Use `spacing-4` (0.9rem) for internal component padding and `spacing-10` (2.25rem) for layout-level gaps. This "oversized" spacing is what transforms a functional tool into a luxury experience.