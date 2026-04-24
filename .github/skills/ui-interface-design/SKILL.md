# Skill: Brutalist UI Interface Design

## Description
Expertise in creating high-performance web interfaces specifically for a personal website for Jorius

## UI Principles
- **Typography:** Prefer system monospaced fonts (e.g., 'Fira Code', 'Ubuntu Mono', 'Nerd Fonts', 'Meslo', etc...) to reflect the programming development environment.
- **Borders:** Use solid, 2px or 3px black/white borders instead of shadows to define cards and sections.
- **Spacing:** Use hard-coded "blocky" padding (e.g., multiples of 8px) rather than fluid percentages where possible.

## Component Structure
When asked to create a "Service Card" for `curator-node`:
1. Use a `<section class="service-card">` block.
2. Include a status indicator (BEM: `service-card__status--online`).
3. Display the service name in `ALL_CAPS`.
4. Add a "Direct Link" button with a hover effect that inverts the colors (Brutalist style).
