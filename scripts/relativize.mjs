// Makes dist/ work from any sub-path (e.g. GitHub Pages project sites at username.github.io/repo/).
import { readFileSync, writeFileSync } from "node:fs";

const page = new URL("../dist/index.html", import.meta.url);
const html = readFileSync(page, "utf8").replace(/(["'(\s,])\/(?=_astro\/|fonts\/|favicon\.svg|apple-touch-icon\.png)/g, "$1./");
writeFileSync(page, html);
// GitHub Pages runs Jekyll by default, which would skip the _astro folder.
writeFileSync(new URL("../dist/.nojekyll", import.meta.url), "");
