/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 14:58:13
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 20:11:26
 * @ Description: 一些公用的方法
 */

import _ from 'lodash';

// 根据精度准确的处理数据
export const formatNumber = (num, precision = 0) => {
  if (_.isNumber(num)) {
    let [int, float] = _.split(`${_.round(num, precision)}`, '.');
    float = _.padEnd(float, precision, 0);
    // 这样处理不管如何, 都是保留precision位小数
    return `${int || 0}${float ? `.${float}` : ''}`;
  }
  return num;
};
