import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { parseFragment } from "parse5";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const output = resolve("node_modules/.cache/loadline-tests/react-pages.mjs");
await mkdir(resolve("node_modules/.cache/loadline-tests"), { recursive: true });
await build({
  stdin: {
    contents:
      "export { pages } from './src/pages.jsx'; export { Header, Footer, SiteContext, DownloadProvider } from './src/components.jsx';",
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  outfile: output,
  bundle: true,
  packages: "external",
  platform: "node",
  format: "esm",
  jsx: "automatic",
  logLevel: "silent",
});
const { pages, Header, Footer, SiteContext, DownloadProvider } = await import(
  pathToFileURL(output)
);
const all = (node) => [node, ...(node.childNodes || []).flatMap(all)];
const attr = (node, name) =>
  node.attrs?.find((attribute) => attribute.name === name)?.value;
function render(path) {
  const page = createElement(pages[path]);
  return renderToStaticMarkup(
    createElement(
      SiteContext.Provider,
      { value: { theme: "light", setTheme() {}, openCapture() {} } },
      createElement(Header, { path }),
      path === "/download" ? createElement(DownloadProvider, null, page) : page,
      createElement(Footer),
    ),
  );
}

test("each React route retains one main landmark, unique IDs, and valid control targets", () => {
  for (const path of Object.keys(pages)) {
    const nodes = all(parseFragment(render(path)));
    assert.equal(
      nodes.filter((node) => node.tagName === "main").length,
      1,
      path,
    );
    assert.equal(nodes.filter((node) => node.tagName === "h1").length, 1, path);
    const ids = nodes.map((node) => attr(node, "id")).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs on ${path}`);
    for (const node of nodes)
      for (const target of (attr(node, "aria-controls") || "")
        .split(" ")
        .filter(Boolean))
        assert.ok(ids.includes(target), `Missing ${target} on ${path}`);
  }
});

test("React download starts unavailable until manifest validation completes", () => {
  const nodes = all(parseFragment(render("/download")));
  const button = nodes.find((node) => attr(node, "id") === "latest-download");
  const notes = nodes.find((node) => attr(node, "id") === "release-notes-link");
  const copy = nodes.find((node) => attr(node, "id") === "copy-checksum");
  assert.equal(attr(button, "aria-disabled"), "true");
  assert.equal(attr(button, "href"), "/download/");
  assert.equal(attr(notes, "aria-disabled"), "true");
  assert.equal(attr(copy, "disabled"), "");
  assert.match(render("/download"), /Checking release availability/);
});

test("React explorer keeps one selected tab, its panel, and real image links", () => {
  const nodes = all(parseFragment(render("/")));
  const tabs = nodes.filter((node) => attr(node, "role") === "tab");
  assert.equal(tabs.length, 4);
  assert.equal(
    tabs.filter((node) => attr(node, "aria-selected") === "true").length,
    1,
  );
  const visible = nodes.filter(
    (node) =>
      attr(node, "role") === "tabpanel" && attr(node, "hidden") === undefined,
  );
  assert.equal(visible.length, 1);
  assert.equal(attr(visible[0], "id"), attr(tabs[0], "aria-controls"));
  assert.ok(
    nodes.some(
      (node) =>
        node.tagName === "a" &&
        attr(node, "href") === "/assets/loadline-home-light.png",
    ),
  );
});
