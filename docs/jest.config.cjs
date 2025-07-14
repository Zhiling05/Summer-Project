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
//========================================
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/tests/unit_tests/**/*.test.ts?(x)'],//cl
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },//cl

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>_mocks_/fileMock.js",
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
//===============================================

// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   // 使用 ts-jest 预设
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',

//   // 明确告诉 Jest 要加载哪些测试文件
//   testMatch: [
//     '<rootDir>/src/tests/unit_tests/**/*.test.ts',
//     '<rootDir>/src/tests/unit_tests/**/*.test.tsx'
//   ],

//   // 用 ts-jest 来处理 .ts/.tsx
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest'
//   },

//   // 识别的模块后缀
//   moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],

//   // 在运行测试前载入 React Testing Library 的扩展断言
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

//   // 静态资源和样式的 mock 规则
//   moduleNameMapper: {
//     '\\.(css|scss|sass)$': 'identity-obj-proxy',
//     '\\.(png|jpe?g|gif|svg)(\\?url)?$': '<rootDir>/__mocks__/fileMock.ts'
//   },

//   // 指向你项目的 tsconfig.app.json，以便 ts-jest 使用正确的 TS 配置
//   globals: {
//     'ts-jest': {
//       tsconfig: '<rootDir>/tsconfig.app.json'
//     }
//   }
// };



