import { readFileSync } from "node:fs";

const bundlePath = new URL("../dist/horizontal-gauge-card.js", import.meta.url);
const bundle = readFileSync(bundlePath, "utf8");
const remoteImport =
  /(?:import|export)\s+(?:[\s\S]*?\sfrom\s*)?["']https?:\/\//u.test(bundle) ||
  /import\s*\(\s*["']https?:\/\//u.test(bundle);

if (remoteImport) {
  throw new Error("Production bundle contains a remote HTTP import");
}

if (
  !bundle.includes("customElements.define") ||
  !bundle.includes("horizontal-gauge-card")
) {
  throw new Error("Production bundle does not register horizontal-gauge-card");
}

console.log("Bundle is self-contained and registers horizontal-gauge-card.");
