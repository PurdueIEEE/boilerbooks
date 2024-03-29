module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "comma-dangle": [ "error", {
            "arrays": "never",
            "objects": "always",
            "imports": "never",
            "exports": "always",
            "functions": "never",
        }],
        "no-unused-vars": "off",
        "space-before-function-paren": ["error", "never"],
        "keyword-spacing": ["error", {
            "before": true,
            "after": true,
        }]
    }
};
