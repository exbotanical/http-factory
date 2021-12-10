module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coverageDirectory: './coverage',
	coveragePathIgnorePatterns: ['src/defaults.ts', 'src/logger.ts'],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0
		}
	},
	errorOnDeprecated: true,
	// setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
	testRegex: '.test.ts$',
	verbose: true
};
