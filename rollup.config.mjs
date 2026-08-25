import { readFileSync } from "node:fs";

import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

export default {
  input: "src/horizontal-gauge-card.ts",
  output: {
    file: "dist/horizontal-gauge-card.js",
    format: "es",
    sourcemap: false,
    banner: `/* Horizontal Gauge Card v${packageJson.version} | MIT */`,
  },
  plugins: [
    nodeResolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser({ ecma: 2022, format: { comments: /^!/ } }),
  ],
};
