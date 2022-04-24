/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 01:03:48
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-24 13:50:16
 * @ Description: umijs的配置文件, 详见: umijs.org
 */

import { defineConfig } from 'umi';

const port = process.env.BLOCKLET_PORT || process.env.PORT || 8080;

export default defineConfig({
  publicPath: './',
  // 自动使用publicPath的内容
  runtimePublicPath: true,
  outputPath: 'build',
  devServer: {
    port,
  },
  layout: {
    name: 'Blockchain Explorer',
    locale: true,
    layout: 'top',
    fixedHeader: true,
    navTheme: 'dark',
    logo: './logo.svg',
  },
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  mfsu: {},
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
});
