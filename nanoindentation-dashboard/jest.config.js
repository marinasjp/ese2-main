module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ["node_modules/(?!variables/.*)"]
};

// module.exports = {
//   transform: {'^.+\\.ts?$': 'ts-jest'},
//   testEnvironment: 'node',
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//   setupFilesAfterEnv: ["<rootDir>/jestSetup.ts"],
//   // "collectCoverageFrom": ["src/**/*.js", "!**/node_modules/**"],
//   // "coverageReporters": ["html", "text", "text-summary", "cobertura"],
//   // testMatch: [['<rootDir>/src/tests/**']]
//   testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
// }
