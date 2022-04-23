/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 01:03:48
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 17:28:21
 * @ Description: blockHash信息, :blockHash为可选路由参数, 通过umijs的路由约定自动匹配 /:blockHash
 */
import styled, { createGlobalStyle } from 'styled-components';
import { useParams, useRequest } from 'umi';
import { useEffect, useMemo } from 'react';
import { BLOCK_DATA_COLUMNS, TRANSACTION_COLUMNS } from './constants';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import CustomValueTypeProvider from '@/components/CustomValueTypeProvider';
import { Badge } from 'antd';
import _ from 'lodash';

const PageWrapper = styled.div``;

const ProCardWrapper = styled(ProCard)`
  margin-bottom: 24px;
`;

const ProListWrapper = styled(ProList)`
  .ant-list-item {
    padding: 0;
  }
  .ant-pro-card-body {
    padding: 0;
  }
`;

const GlobalStyle = createGlobalStyle`
  #root{
    height: 100vh;
  }
  
  // rightContent居中
  .ant-pro-right-content {
    display: flex;
    align-items: center;
  }
  .ant-pro-right-content-resize{
    display: flex;
  }
`;

export default function IndexPage() {
  const { blockHash } = useParams();

  // 查询区块数据-Block详情
  const {
    data: rawblockData,
    error,
    loading: rawblockLoading,
    run: queryRawblockByHash,
  } = useRequest(`/rawblock/${blockHash}`, {
    manual: true,
    debounceWait: 300,
  });

  useEffect(() => {
    // 跳转到详情页, 触发查询Block详情
    if (blockHash) {
      queryRawblockByHash();
    }
  }, [blockHash]);

  // block的全数据源
  const blockDataSource = useMemo(() => {
    // @mock
    const transactionVolume = _(rawblockData?.tx)
      .map('fee')
      .sumBy((item) => item * _.random(1500, 2000));
    return {
      ...rawblockData,
      // format, 某些统计值
      blockReward: _.get(rawblockData, 'tx[0].out[0].value'),
      transactionVolume: transactionVolume,
    };
  }, [rawblockData]);

  // 区块概况详情
  // https://procomponents.ant.design/components/descriptions
  const blockDescriptionsProps = {
    column: 1, // 单列
    columns: BLOCK_DATA_COLUMNS,
    bordered: true,
    dataSource: blockDataSource,
    size: 'small',
    ellipsis: true,
    labelStyle: {
      width: '30%',
    },
    contentStyle: {
      background: 'white',
    },
  };

  // 交易列表, 外层用proList, 内层items为proDescriptions
  // 涉及到dataSource计算, useMemo
  // https://procomponents.ant.design/components/list
  const transactionListProps = useMemo(() => {
    return {
      dataSource: _.map(blockDataSource?.tx || [], (item, index) => {
        return {
          ...item,
          realIndex: index + 1,
        };
      }),
      pagination: {
        defaultPageSize: 5,
        showSizeChanger: false,
      },
      renderItem: (item) => {
        // 每一条交易详情, 内嵌一个description
        const transactionItemProps = {
          column: { xs: 1, sm: 1, md: 3 }, // 3列
          columns: TRANSACTION_COLUMNS,
          ellipsis: true,
          size: 'small',
          bordered: true,
          dataSource: {
            ...item,
            fee: item?.fee || 0.0,
            from: item?.inputs || [],
            to: item?.out || [],
          },
          labelStyle: {
            width: 80,
          },
          size: 'small',
          style: {
            marginBottom: 24,
          },
        };
        return [
          <Badge.Ribbon key={item?.hash + '-badge'} text={item.realIndex}></Badge.Ribbon>,
          <ProDescriptions key={item?.hash + '-descriptions'} {...transactionItemProps} />,
        ];
      },
    };
  }, [blockDataSource?.tx]);

  return (
    <PageWrapper>
      <GlobalStyle />
      {/* 自定义ValueTypeWrapper */}
      <CustomValueTypeProvider>
        <ProCardWrapper title="Block Summary">
          <ProDescriptions {...blockDescriptionsProps} />
        </ProCardWrapper>
        <ProCardWrapper title="Block Transactions">
          <ProListWrapper {...transactionListProps} />
        </ProCardWrapper>
      </CustomValueTypeProvider>
    </PageWrapper>
  );
}
