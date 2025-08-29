/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable some rules that are causing issues
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  }
};
