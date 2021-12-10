module.exports = {
	// setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
	testRegex: '.test.ts$',
	coverageDirectory: './coverage',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0
		}
	},
	coveragePathIgnorePatterns: ['src/defaults.ts', 'src/logger.ts'],
	errorOnDeprecated: true,
	verbose: true
};
