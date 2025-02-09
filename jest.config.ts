import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  collectCoverage: true, // 统计覆盖率
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/scripts',
    '<rootDir>/bin',
    '<rootDir>/build',
    '<rootDir>/docs',
    '<rootDir>/examples/',
  ],
};

export default config;
