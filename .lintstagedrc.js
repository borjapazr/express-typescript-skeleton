module.exports = {
  '*.{js,ts}': [
    'prettier --check --write --ignore-unknown',
    'eslint --cache --color --fix',
    () => 'tsc --pretty --noEmit'
  ],
  '!*.{js,ts}': ['prettier --check --write --ignore-unknown']
};
