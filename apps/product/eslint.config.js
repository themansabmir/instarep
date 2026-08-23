import { nextJsConfig } from "@repo/config/eslint/next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    ignores: [".next/**", "next-env.d.ts"],
  },
];
