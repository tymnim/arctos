const stylistic = require("@stylistic/eslint-plugin");

module.exports = {
  "plugins": [
    "@stylistic"
  ],
  "env": { "browser": true,
    "es2021": true,
    "node": true
  },
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "@stylistic/indent": ["error", 2, { "MemberExpression": "off" }],
    "@stylistic/arrow-spacing": "error",
    "@stylistic/eol-last": ["error", "always"],
    "@stylistic/arrow-parens": ["error", "as-needed"],
    "@stylistic/block-spacing": "error",
    "@stylistic/brace-style": ["error", "stroustrup"],
    "@stylistic/comma-dangle": ["error", "never"],
    "@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
    "@stylistic/dot-location": ["error", "property"],
    "@stylistic/function-call-argument-newline": ["error", "consistent"],
    "@stylistic/function-call-spacing": ["error", "never"],
    "@stylistic/function-paren-newline": ["error", "consistent"],
    "@stylistic/generator-star-spacing": ["error", { "before": false, "after": true }],
    "@stylistic/implicit-arrow-linebreak": ["error", "beside"],
    "@stylistic/key-spacing": ["error", { "beforeColon": false }],
    "@stylistic/keyword-spacing": ["error", { "after": true }],
    "@stylistic/lines-between-class-members": ["error", "always"],
    "@stylistic/max-len": ["error", { "code": 100, "ignoreUrls": true }],
    "@stylistic/max-statements-per-line": ["error", { "max": 1 }],
    "@stylistic/new-parens": "error",
    "@stylistic/no-confusing-arrow": ["error", { "allowParens": false }],
    "@stylistic/no-extra-semi": "error",
    "@stylistic/no-multiple-empty-lines": ["error", { "max": 1, "maxBOF": 1, "maxEOF": 1 }],
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/no-whitespace-before-property": "error",
    "@stylistic/object-curly-spacing": ["error", "always"],
    "@stylistic/operator-linebreak": ["error", "before"],
    "@stylistic/quotes": ["error", "double"],
    "@stylistic/rest-spread-spacing": ["error", "never"],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/semi-spacing": "error",
    "@stylistic/space-before-blocks": "error",
    "@stylistic/space-before-function-paren": ["error", { "asyncArrow": "always", "anonymous": "always", "named": "never" }],
    "@stylistic/space-in-parens": ["error", "never"],
    "@stylistic/space-infix-ops": "error",
    "@stylistic/space-unary-ops": "error",
    "@stylistic/template-curly-spacing": "error",
    "@stylistic/template-tag-spacing": "error"
  }
};
