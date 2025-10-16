import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],

  // ✅ Resolve CSS/image modules & path aliases
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/constants/nfl_teams$': '<rootDir>/__mocks__/nfl_teams.ts'
  },

  // ✅ Make Jest resolve @/* imports inside src
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // ✅ Use ts-jest with a dedicated Jest TypeScript config
  transform: {
    '\\.[jt]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        isolatedModules: false,
        diagnostics: false
      }
    ]
  },

  // ✅ Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.{spec,test}.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!vite.config.ts'
  ],
  coverageDirectory: '<rootDir>/coverage',

  // ✅ Ignore Vite / Tailwind / boilerplate files from coverage
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    'vite-env.d.ts',
    'vite.config.ts',
    'tailwind.config.ts',
    'postcss.config.ts',
    'jest.config.ts',
    'eslint.config.js',
    'setup-tests.ts',
    'src/constants/google.ts',
    'src/constants/nfl_teams.ts',
    'src/lib/googleAuth.ts'
  ]
};

export default config;
