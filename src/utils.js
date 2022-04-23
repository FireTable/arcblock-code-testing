/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 14:58:13
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 15:03:46
 * @ Description: 一些公用的方法
 */

import _ from 'lodash';

// 根据精度准确的处理数据
export const formatNumber = (num, precision = 0) => {
  if (_.isNumber(num)) {
    const [int, float] = _.split(`${_.round(num, precision)}`, '.');
    // 这样处理不管如何, 都是保留precision位小数
    return `${int || 0}.${_.padEnd(float, precision, 0)}`;
  }
  return num;
};
