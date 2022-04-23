/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 11:20:29
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 22:47:53
 * @ Description: 自定义的valueType, https://procomponents.ant.design/components/schema#自定义-valueType
 */
import React, { useContext } from 'react';
import ProProvider from '@ant-design/pro-provider';
import _ from 'lodash';
import { formatNumber } from '../utils';

export default ({ children }) => {
  const values = useContext(ProProvider);

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: {
          // 带BTC单位的数字
          digitWithBTC: {
            render: (text) => (_.isNumber(text) ? `${formatNumber(text / 100000000, 8)} BTC` : '-'),
            renderFormItem: (text, props) => (_.isNumber(text) ? `${formatNumber(text / 100000000, 8)} BTC` : '-'),
          },
          // 空的占位block
          emptyBlock: {
            render: () => '',
            renderFormItem: () => '',
          },
          // 空的占位block
          link: {
            render: (text) =>
              text ? (
                <a href={`https://arcblock.io`} target="_blank">
                  {text}
                </a>
              ) : (
                '-'
              ),
            renderFormItem: (text) =>
              text ? (
                <a href={`https://arcblock.io`} target="_blank">
                  {text}
                </a>
              ) : (
                '-'
              ),
          },
        },
      }}
    >
      {children}
    </ProProvider.Provider>
  );
};
