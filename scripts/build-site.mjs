import { build } from "esbuild";
import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

await build({
  entryPoints: ["src/site.jsx"],
  outfile: "site.js",
  bundle: true,
  minify: true,
  format: "esm",
  target: ["es2020"],
  jsx: "automatic",
  loader: { ".ts": "tsx", ".tsx": "tsx" },
  alias: {
    "@": path.join(root, "src"),
  },
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "linked",
});
await copyFile("site.js", "public/site.js");
await copyFile("site.js.LEGAL.txt", "public/site.js.LEGAL.txt");
