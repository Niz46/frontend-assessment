module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "plugin:jsx-a11y/recommended", "prettier"],
  plugins: ["jsx-a11y"],
  rules: {
    "react/react-in-jsx-scope": "off",
    // Add any team rules here
  },
};
