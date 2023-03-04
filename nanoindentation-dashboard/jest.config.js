// module.exports = {
//     transform: {'^.+\\.ts?$': 'ts-jest'},
//     testEnvironment: 'node',
//     testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
//   };

module.exports = {
    transform: {'^.+\\.ts?$': 'ts-jest'},
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    "setupFilesAfterEnv": ["src/jestSetup.ts"],
  // "collectCoverageFrom": ["src/**/*.js", "!**/node_modules/**"],
  // "coverageReporters": ["html", "text", "text-summary", "cobertura"],
  "testMatch": [['<rootDir>/src/tests/**']]
}
