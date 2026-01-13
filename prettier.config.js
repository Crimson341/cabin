//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  // Basics
  semi: false,
  singleQuote: true,
  trailingComma: 'all',

  // Line length - 80 is too restrictive for modern screens
  printWidth: 100,

  // Consistent spacing
  tabWidth: 2,
  useTabs: false,

  // JSX
  jsxSingleQuote: false,
  bracketSameLine: false,

  // Cleaner diffs
  arrowParens: 'always',
  bracketSpacing: true,

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],

  // Tailwind class sorting
  tailwindFunctions: ['clsx', 'cn', 'cva'],
}

export default config
