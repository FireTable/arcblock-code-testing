import { generateHtml, getHtml } from '@umijs/test-utils';
import BlockHashPage from './[blockHash$]';

// 对[blockHash$].js进行单元测试   --------------------------------------------------
test('[blockHash$].js', () => {
  // 生成HTML
  expect(generateHtml(BlockHashPage)).toEqual('0.00000000');
});

// 对[blockHash$].js进行单元测试   --------------------------------------------------
