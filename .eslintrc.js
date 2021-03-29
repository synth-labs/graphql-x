module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
  extends: [
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "airbnb-typescript/base",
    "prettier",
  ],
  rules: {
    "tsdoc/syntax": "warn",
    "no-console": "off",
    "@typescript-eslint/lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true,
      },
    ],
    "semi": [
      "error",
      "always",
    ],
  },
};
