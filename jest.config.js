const port = process.env.BLOCKLET_PORT || process.env.PORT || 8080;

const ignoreList = [
  // umi缓存
  '<rootDir>/src/.umi/',
  '<rootDir>/node_modules/',
  // umi配置文件
  '<rootDir>/src/app.js',
  // provider无需测试
  '<rootDir>/src/components/CustomValueTypeProvider.js',
  // pageLoading逻辑简单无需测试
  '<rootDir>/src/components/PageLoading.js',
  // constants无需测试
  '<rootDir>/src/pages/constants.js',
];

module.exports = {
  testURL: `http://localhost:${port}`,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['./setup-enzyme.js'],
  setupFiles: ['./setup-enzyme.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ignoreList, //转换时需忽略的文件
  coveragePathIgnorePatterns: ignoreList, // 统计覆盖信息时需要忽略的文件
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
};
