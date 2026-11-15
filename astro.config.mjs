import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://hashbrownstudios.online",
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  // Inline CSS so the first paint never waits on a stylesheet request.
  build: { inlineStylesheets: "always" },
});
