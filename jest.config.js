module.exports = {
    testEnvironment: 'jsdom', // required for DOM APIs
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
