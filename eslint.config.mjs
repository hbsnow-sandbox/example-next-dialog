// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

const flatCompat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    files: ["**/*.{mjs,ts,tsx}"],
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.node,
      sourceType: "module",
      ecmaVersion: 2020,
    },
  },
  js.configs.recommended,
  ...flatCompat.extends("next/core-web-vitals"),
  ...flatCompat.extends("next/typescript"),
  {
    rules: {
      "no-restricted-syntax": "error",
      eqeqeq: "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "tailwind-merge",
              message:
                "tailwind-mergeは直接importせず、@/utils/cnを使用してください。",
            },
          ],
        },
      ],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
    },
  },
  {
    ...unicorn.configs.recommended,
    rules: {
      ...unicorn.configs.recommended.rules,
      "unicorn/no-null": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
  {
    rules: {
      "react/jsx-curly-brace-presence": "error",
      "react/self-closing-comp": ["error", { component: true, html: false }],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
        },
      ],
    },
  },
  eslintConfigPrettier,
  {
    rules: {
      // multi-lineまたはmulti-or-nestの場合にのみprettierと競合する可能性があります。
      // allに指定していることから、prettierと競合することがないため最後に指定しています。
      // 参考: {@link https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#curly}
      curly: ["error", "all"],
    },
  },
);
