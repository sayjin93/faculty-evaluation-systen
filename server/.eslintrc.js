module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  rules: {
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-return-assign': 0,
    camelcase: 0,
    'no-console': 'off', // Disable the no-console rule
    'consistent-return': 'off', // Disable the consistent-return rule
    'max-len': 'off', // Disable the max-len rule
    'import/no-dynamic-require': 'off', // Disable the import/no-dynamic-require rule
    'global-require': 'off', // Disable the global-require import
    'linebreak-style': ['error', 'unix'], // Enforce LF linebreaks
  },
};
