# Luxury Vietnamese Wedding Invitation Design

## Goal
Build a premium, romantic Vietnamese online wedding invitation with a red, cream, gold, and pink-heart visual system. The final site should feel like an emotional wedding album rather than a generic template.

## Direction
Use the approved "Romantic Storybook" direction: a warm, story-led page with soft cream surfaces, deep red cinematic depth, gold ornament details, floating petals, falling hearts, subtle sparkle, and smooth scroll reveals.

## Site Structure
The site is a single static page:

1. Fullscreen hero with `/assets/hero/hero-main.jpg`, `/assets/hero/hero-bg.jpg`, monogram, couple names, wedding date, CTA, petals, sparkles, and light flare.
2. Couple intro with groom and bride profile cards.
3. Six-step love story timeline using `/assets/story/story-1.jpg` through `/assets/story/story-6.jpg`.
4. Event cards for Lễ Vu Quy, Lễ Thành Hôn, and Tiệc Cưới, plus venue context and location QR.
5. Countdown timer to the wedding date.
6. Gallery using `/assets/gallery/gallery-01.jpg` through `/assets/gallery/gallery-12.jpg` with lightbox preview.
7. RSVP form with success heart animation.
8. Wedding wishes displayed as softly floating cards.
9. QR invitation section with `/assets/qr/qr-invitation.png`.
10. Optional video section using `/assets/video/wedding-highlight.mp4`.
11. Footer with `/assets/logo/signature.png`, closing quote, and floral decoration.

## Technical Approach
Create a static implementation with `index.html`, `styles.css`, and `script.js`. This keeps the card simple to host while supporting countdown, music fallback, RSVP state, lightbox, scroll reveals, heart particles, scroll progress, and reduced-motion handling.

## Content
Use polished Vietnamese placeholder content for names, dates, events, venue addresses, story text, and guest wishes. All media references must match the user-provided asset paths. Missing local assets should degrade elegantly through CSS backgrounds and visible alt text, so the layout can still be reviewed before real files are added.

## Motion And Responsiveness
Use transform and opacity-based animations, Intersection Observer scroll reveals, mobile-reduced particle density, and `prefers-reduced-motion` fallbacks. Layout must be mobile-first for 360-430px screens and expand to tablet and desktop with two-column cards, alternating timeline, and 3-4 column gallery.

## Verification
Add a Node-based verification script that checks required files, section anchors, asset paths, music controls, countdown, RSVP, lightbox, and responsive CSS markers. Run the script after implementation and manually verify the site in a local browser.
