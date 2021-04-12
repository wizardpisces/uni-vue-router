module.exports = {
    preset: 'ts-jest',
    globals: {
        __DEV__: true,
        __VERSION__: require('./package.json').version,
    },
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: __dirname,
    testMatch: ['<rootDir>/src/**/__tests__/**/*spec.[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/']
}
