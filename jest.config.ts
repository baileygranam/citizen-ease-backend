module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/__test__/setup.ts'],
  globalSetup: './src/__test__/globalSetup.ts',
  globalTeardown: './src/__test__/globalTeardown.ts'
};
