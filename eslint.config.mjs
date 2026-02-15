import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "projects/**/*",
        "**/*package.json",
        "**/package-lock.json",
        "**/dist",
        "**/coverage",
        "e2e/**/*",
        "**/commitlint.config.js*",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates",
    "plugin:prettier/recommended",
).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts"],

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["tsconfig.json", "e2e/tsconfig.json"],
            createDefaultProgram: true,
        },
    },

    rules: {
        "no-unused-vars": "warn",

        "@angular-eslint/component-selector": ["error", {
            prefix: "app",
            style: "kebab-case",
            type: "element",
        }],

        "@angular-eslint/directive-selector": ["error", {
            prefix: "app",
            style: "camelCase",
            type: "attribute",
        }],

        "sort-imports": ["error", {
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
            allowSeparatedGroups: false,
        }],

        "no-console": "off",
    },
}, ...compat.extends("plugin:@angular-eslint/template/recommended").map(config => ({
    ...config,
    files: ["**/*.html"],
})), {
    files: ["**/*.html"],
    rules: {},
}];