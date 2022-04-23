/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 01:03:48
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 18:24:04
 * @ Description: umijs的配置文件, 详见: umijs.org
 */

import { defineConfig } from 'umi';

const port = process.env.BLOCKLET_PORT || process.env.PORT || 8080;

export default defineConfig({
  devServer: {
    port,
  },
  layout: {
    name: 'Blocklet Explorer',
    locale: true,
    layout: 'top',
    fixedHeader: true,
    navTheme: 'dark',
    logo: './logo.svg',
  },
  dynamicImport: {},
  mfsu: {},
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
});
