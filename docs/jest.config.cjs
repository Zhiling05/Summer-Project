
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png)$": "<rootDir>_mocks_/fileMock.js",
    '\\.(css|less)$': '<rootDir>/_mocks_/styleMock.js',
    '\\.svg\\?url$': '<rootDir>/_mocks_/fileMock.js',
    '\\.svg$': '<rootDir>/_mocks_/fileMock.js',
  },
 
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.app.json',
    },
  },
};


