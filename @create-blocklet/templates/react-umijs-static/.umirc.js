import { defineConfig } from 'umi';

const port = process.env.BLOCKLET_PORT || process.env.PORT || 8080;


export default defineConfig({
  // 自动使用publicPath的内容
  runtimePublicPath: true,
  outputPath: 'build',
  devServer: {
    port
  },
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
});
