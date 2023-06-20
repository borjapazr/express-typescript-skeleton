module.exports = {
  '*': ['cspell'],
  '*.{js,ts}': [
    'prettier --check --write --ignore-unknown',
    'eslint --cache --color --fix',
    () => 'tsc --pretty --noEmit'
  ],
  '!*.{js,ts}': ['prettier --check --write --ignore-unknown'],
  '*.{md,mdx}': ['markdownlint'],
  'package.json': ['npmPkgJsonLint']
};
