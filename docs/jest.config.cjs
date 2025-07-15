// const { createDefaultPreset } = require("ts-jest");
//
// const tsJestTransformCfg = createDefaultPreset().transform;
//
// /** @type {import("jest").Config} **/
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // remain commented for now
//   transform: {},
// };

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

//   moduleNameMapper: {
//     "\\.(jpg|jpeg|png)$": "<rootDir>_mocks_/fileMock.js",
//     '\\.(css|less)$': '<rootDir>/_mocks_/styleMock.js',
//     '\\.svg\\?url$': '<rootDir>/_mocks_/fileMock.js',
//     '\\.svg$': '<rootDir>/_mocks_/fileMock.js',
//   },
//   //solve png showing problem
//   globals: {
//     'ts-jest': {
//       tsconfig: '<rootDir>/tsconfig.app.json',
//     },
//   },
// };

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/tests/unit_tests/**/*.test.ts?(x)'],//cl
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },//cl

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png)$": "<rootDir>_mocks_/fileMock.js",
    '\\.(css|less)$': '<rootDir>/_mocks_/styleMock.js',
    // 样式文件
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // 图片与 svg（含 ?url）都走同一个 mock
    '\\.(png|jpe?g|gif|svg)(\\?url)?$': '<rootDir>/_mocks_/fileMock.js'
  },
  //solve png showing problem
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.app.json',
    },
  },
};


