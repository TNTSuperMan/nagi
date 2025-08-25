const js = require("@eslint/js");
const globals = require("globals");
const pluginReact = require("eslint-plugin-react");
const config = require("eslint/config");

module.exports = config.defineConfig([
  {
    ignores: ["**/dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,cjs,jsx}"],
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "eqeqeq": "error",
      "no-console": "warn",
      "curly": "error",
      "indent": ["error", 2],
      "semi": ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "quotes": ["error", "double", { avoidEscape: true }],
    },
  },

  { files: ["**/*.{js,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  
  { files: ["frontend/**/*.{js,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  { files: ["frontend/**/*.{js,jsx}"], languageOptions: { sourceType: "commonjs" } },
  pluginReact.configs.flat.recommended,
]);
