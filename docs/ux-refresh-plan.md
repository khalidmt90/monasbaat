# UX Refresh Plan — Apple-inspired polish

This document lists a focused audit and planned changes to bring the project to a refined, Apple-grade experience while keeping brand tokens and routes intact.

1) High-level audit — current issues
- Mobile typography: body text commonly <14px; small labels and helper text under 12px.
- Tap targets: many buttons/links have <44px height and small touch areas.
- Focus styles: default browser outline or missing; inconsistent keyboard nav.
- Motion: no reduced-motion fallbacks; some CSS transitions use non-GPU-friendly properties.
- Media: images/videos lack aspect-ratio/placeholders; LCP could be improved.
- RTL: some components use physical margins/paddings causing mirrored layout issues.

2) Planned fixes (atomic, non-breaking)
- Tokens & globals (this PR): add motion tokens, fluid type utilities (clamp), focus utilities, safe-area tokens.
- Accessibility: enforce min font-size on mobile via utilities; ensure tap targets >=44px.
- Typography: implement fluid scale classes (text-fluid-sm/md/lg/xl) using clamp().
- Layout: introduce 8pt spacing scale, container max-widths, responsive grid utilities.
- Motion: introduce CSS motion tokens and prefer-reduced-motion fallbacks.
- Components: iterate components in small PRs — navbar, buttons, hero, cards, forms.
- Media: add aspect-ratio utilities and responsive picture sources for hero media.

3) Acceptance criteria
- Mobile body text >= 14px; interactive targets >= 44x44
- All animations respect prefers-reduced-motion
- RTL mirrored correctly using logical properties
- Lighthouse targets: Perf >=90, A11y >=95 (goal)

4) Deliverables
- This audit doc (docs/ux-refresh-plan.md)
- CSS tokens & utilities (globals.css + tailwind.config.js)
- Subsequent PRs for components and pages

Next: add tokens and global utilities in CSS and Tailwind config to bootstrap the work.
