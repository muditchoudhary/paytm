import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser, parser: typescriptParser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic": stylistic,
    }
  },
  
  {
    rules: {
      "@stylistic/semi": "error",
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double"],
      "arrow-body-style": ["error", "always"],
      "prefer-arrow-callback": ["error", { "allowNamedFunctions": true, "allowUnboundThis": true }],
      "func-style": ["error", "declaration"],
    }
  }
];