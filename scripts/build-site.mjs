import { build } from "esbuild";
import { copyFile } from "node:fs/promises";

await build({
  entryPoints: ["src/site.jsx"],
  outfile: "site.js",
  bundle: true,
  minify: true,
  format: "esm",
  target: ["es2020"],
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "linked",
});
await copyFile("site.js", "public/site.js");
await copyFile("site.js.LEGAL.txt", "public/site.js.LEGAL.txt");
