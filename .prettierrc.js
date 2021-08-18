module.exports = {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'none',
  semi: true,
  quoteProps: 'as-needed',
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.ts',
      options: { parser: 'typescript' }
    }
  ]
};
