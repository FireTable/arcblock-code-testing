import { defineConfig } from 'umi';

const port = process.env.BLOCKLET_PORT || process.env.PORT || 8080;


export default defineConfig({
  devServer: {
    port
  },
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
});
