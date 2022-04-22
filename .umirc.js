import { defineConfig } from 'umi';

const port = process.env.BLOCKLET_PORT || process.env.PORT || 8080;

export default defineConfig({
  devServer: {
    port,
  },
  layout: {
    name: 'Ant Design',
    locale: true,
    layout: 'top',
    fixedHeader: true,
  },
  dynamicImport: {},
  mfsu: {},
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
});
