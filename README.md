# Hashbrown Studios

Portfolio site for Hashbrown Studios. Astro 7 + Tailwind v4, one Motion (React) island for booking, CSS scroll-driven animation everywhere else.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
```

## Hosting

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`), served at https://hashbrownstudios.online.

## Editing content

- `src/assets/work/desk.jpg`: placeholder studio photo (Unsplash licence via Lorem Picsum). Swap for a real studio photo.
- `src/components/Booking.tsx`: budget ranges and time slots.
- Contact details and map coordinates live in one place: `src/lib/brand.ts`.
- Projects live in `src/components/Work.astro`, screenshots in `src/assets/work/` (about 1900x1000).

## Notes

- Windows Application Control blocks Astro's native compiler binary on this PC, so the WASM fallback (`@astrojs/compiler-binding-wasm32-wasi`) is an optional dependency. If a fresh `npm install` here fails to build, run `npm install --force`. GitHub Actions uses the native binary.
- The font is a subset of Archivo (variable weight + width). If you add text outside basic Latin, regenerate it from `@fontsource-variable/archivo` with `fontTools.subset` and widen `unicode-range` in `src/styles/global.css`.
