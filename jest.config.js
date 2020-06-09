module.exports = {
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': './test/transform.js'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
