/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 01:03:48
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 19:37:51
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
import { Badge, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useReactive } from 'ahooks';
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
  // .ant-pro-right-content-resize{
  //   display: flex;
  // }
`;

export default function IndexPage() {
  const { blockHash } = useParams();

  const state = useReactive({
    errorMsg: '',
  });

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
    if (blockHash && _.size(blockHash) == 64) {
      state.errorMsg = '';
      queryRawblockByHash();
      return;
    }
    state.errorMsg = 'Hash verification failed.';
  }, [blockHash]);

  useEffect(() => {
    // 统一通过errorMsg报错
    if (error?.data?.data?.message) {
      state.errorMsg = error?.data?.data?.message;
    }
  }, [error]);

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
    loading: rawblockLoading,
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

  // 交易概要数据源
  // 涉及到遍历useMemo
  const txDataSource = useMemo(() => {
    return _.map(blockDataSource?.tx || [], (item, index) => {
      return {
        ...item,
        realIndex: index + 1,
      };
    });
  }, [blockDataSource?.tx]);

  // 交易列表, 外层用proList, 内层items为proDescriptions
  // https://procomponents.ant.design/components/list
  const transactionListProps = {
    loading: rawblockLoading,
    dataSource: txDataSource,
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
        // 序号badge
        <Badge.Ribbon key={item?.hash + '-badge'} placement="end" text={item.realIndex}></Badge.Ribbon>,
        <ProDescriptions key={item?.hash + '-descriptions'} {...transactionItemProps} />,
      ];
    },
  };

  // 动态组件, 减少jsx中写判断
  let ChildrenComponent = rawblockData && (
    <CustomValueTypeProvider>
      <ProCardWrapper title="Block Summary">
        <ProDescriptions {...blockDescriptionsProps} />
      </ProCardWrapper>
      <ProCardWrapper title="Block Transactions">
        <ProListWrapper {...transactionListProps} />
      </ProCardWrapper>
    </CustomValueTypeProvider>
  );

  // 无blockHash, 提示
  if (!blockHash) {
    ChildrenComponent = (
      <Result style={{ margin: '30vh 0' }} icon={<SmileOutlined />} title="Waiting for you search." subTitle={''} />
    );
  }

  // 存在报错
  if (blockHash && state.errorMsg) {
    ChildrenComponent = (
      <Result style={{ margin: '20vh 0' }} status="500" title="Something went wrong." subTitle={state.errorMsg} />
    );
  }

  return (
    <PageWrapper>
      <GlobalStyle />
      {ChildrenComponent}
    </PageWrapper>
  );
}
