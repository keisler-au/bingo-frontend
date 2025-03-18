// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "plugin:prettier/recommended"],
  ignorePatterns: ["/dist/*", "jest.setup.js"],
  rules: {
    "prettier/prettier": "error",
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};
