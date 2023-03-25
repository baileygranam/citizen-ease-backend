module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/__test__/setup.ts'],
  globalSetup: './src/__test__/globalSetup.ts',
  globalTeardown: './src/__test__/globalTeardown.ts',
  moduleNameMapper: {
    '@test/(.*)': '<rootDir>/src/__test__/$1',
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@graphql/(.*)': '<rootDir>/src/graphql/$1'
  }
};
