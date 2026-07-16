# FE-05 playground notes

## Accessibility gaps that shadcn/ui usually handles better

1. Dialog focus management is more robust in shadcn/ui because it combines portal rendering, focus scope, and focus restoration with a polished escape and outside-interaction pattern. A manual dialog can cover the main keyboard behavior, but the shadcn version is more resilient when nested controls, animations, or multiple layers are involved.
2. Tabs in shadcn/ui usually include more consistent roving focus and activation behavior across browsers, along with stronger defaults for `aria-orientation`, `aria-controls`, and focus-visible states. A manual implementation can satisfy the assignment requirements, but the shadcn pattern is more battle-tested for complex tab sets.

## Comparison status

The manual implementation in this repository keeps the assignment components fully visible and understandable without pulling in extra UI libraries. A shadcn/ui comparison was attempted from the workspace root, but the repository's minimal Tailwind setup and Next.js configuration made the generated component setup awkward for this exercise, so the comparison remains documented here instead of altering the app experience.
