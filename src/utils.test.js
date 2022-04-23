/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 20:01:28
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 20:13:43
 * @ Description: utils的单元测试
 */

import { formatNumber } from './utils';

// 对formatNumber进行单元测试   --------------------------------------------------
test('formatNumber(0, 8)', () => {
  // 为0应该变成, 8位精度 => 0.00000000
  expect(formatNumber(0, 8)).toEqual('0.00000000');
});

test('formatNumber(2.88888888888888, 8) ', () => {
  // 存在四舍五入, 所以这里应该是2.88888889
  expect(formatNumber(2.88888888888888, 8)).toEqual('2.88888889');
});

test('formatNumber(2) ', () => {
  // 为0应该变成, 8位精度 => 0.00000000
  expect(formatNumber(2)).toEqual('2');
});

test('formatNumber(String) ', () => {
  // 非数字原样返回, 不报错
  expect(formatNumber(`AA`)).toEqual('AA');
  expect(formatNumber(`22`)).toEqual('22');
  expect(formatNumber(null)).toEqual(null);
});

// 对formatNumber进行单元测试   --------------------------------------------------
