import globals from "globals";

import { baseConfig } from "@repo/config/eslint/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ["src/generated/**", "dist/**"],
  },
];
