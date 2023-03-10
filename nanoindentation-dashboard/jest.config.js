module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: ["node_modules/(?!angular/.*)"]
};

//command to execute jest: node --experimental-vm-modules node_modules/.bin/jest

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
