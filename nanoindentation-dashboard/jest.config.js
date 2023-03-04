// module.exports = {
//     transform: {'^.+\\.ts?$': 'ts-jest'},
//     testEnvironment: 'node',
//     testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
//   };


module.exports = {
  // "collectCoverageFrom": ["src/**/*.js", "!**/node_modules/**"],
  // "coverageReporters": ["html", "text", "text-summary", "cobertura"],
  "testMatch": [['<rootDir>/nanoindentation-dashboard/src/tests/**']]
}
