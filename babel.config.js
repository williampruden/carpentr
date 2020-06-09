module.exports = {
  plugins: [
    ['@babel/proposal-class-properties', { loose: false }],
    '@babel/syntax-dynamic-import'
  ],
  presets: [
    '@babel/env',
    '@babel/react'
  ]
}
