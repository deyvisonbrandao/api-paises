import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/{controllers,services}/**/*.{ts,js}'
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

export default config;
