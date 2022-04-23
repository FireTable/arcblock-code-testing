/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 09:53:00
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 17:09:36
 * @ Description: 常量大全
 */

import { isNumber, random } from 'lodash';
import { formatNumber } from '@/utils';
import { Tag, Col, Row } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const TEXT_STYLE = { fontWeight: 600, fontSize: 14 };

const TAG_PROPS = {
  color: 'rgb(209, 240, 219)',
  style: { color: 'rgb(0, 135, 90)', ...TEXT_STYLE },
};

const ADDR_COL_PROPS = {
  xs: 24,
  sm: 24,
  md: 18,
};

const BTC_COL_PROPS = {
  xs: 24,
  sm: 24,
  md: 6,
};

// 区块概况Columns
export const BLOCK_DATA_COLUMNS = [
  {
    title: 'Hash',
    dataIndex: 'hash',
    key: 'hash',
    copyable: true,
    renderText: (text) => (text ? <a>{text}</a> : '-'),
  },
  {
    title: 'Confirmations',
    dataIndex: 'confirmations',
    key: 'confirmations',
    valueType: 'digit',
    // @mock
    renderText: () => random(0, 9999),
  },
  {
    title: 'Timestamp',
    dataIndex: 'time',
    key: 'timestamp',
    valueType: 'dateTime',
    // API返回的时间戳需要转为毫秒级别
    renderText: (value) => {
      if (isNumber(value)) {
        return value * 1000;
      }
      return value;
    },
  },
  {
    title: 'Height',
    dataIndex: 'height',
    key: 'height',
    valueType: 'digit',
  },
  {
    title: 'Miner',
    dataIndex: 'miner',
    key: 'miner',
    valueType: 'link',
    // @mock
    renderText: (value) => value || 'ArcBlock',
  },
  {
    title: 'Number of Transactions',
    dataIndex: 'n_tx',
    key: 'numberOfTransactions',
    valueType: 'digit',
  },
  {
    title: 'Difficulty',
    dataIndex: 'difficulty',
    key: 'difficulty',
    // @mock
    renderText: () => random(100000, 999999) * 10000,
    valueType: 'digit',
  },
  {
    title: 'Merkle root',
    dataIndex: 'mrkl_root',
    key: 'merkleRoot',
  },
  {
    title: 'Version',
    dataIndex: 'ver',
    key: 'version',
    renderText: (value) => value && `0x${value}`,
  },
  {
    title: 'Bits',
    dataIndex: 'bits',
    key: 'bits',
    valueType: 'digit',
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
    key: 'weight',
    valueType: 'digit',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    valueType: 'digit',
  },
  {
    title: 'Nonce',
    dataIndex: 'nonce',
    key: 'nonce',
    valueType: 'digit',
  },
  {
    title: 'Transaction Volume',
    dataIndex: 'transactionVolume',
    key: 'transactionVolume',
    valueType: 'digitWithBTC', //自定义valueType 带BTC格式化
  },
  {
    title: 'Block Reward',
    dataIndex: 'blockReward',
    key: 'blockReward',
    valueType: 'digitWithBTC', //自定义valueType 带BTC格式化
  },
  {
    title: 'Fee Reward',
    dataIndex: 'fee',
    key: 'feeReward',
    valueType: 'digitWithBTC', //自定义valueType 带BTC格式化
  },
];

// 交易概况Columns
export const TRANSACTION_COLUMNS = [
  {
    title: 'Hash',
    dataIndex: 'hash',
    key: 'hash',
    copyable: true,
    span: 3,
    renderText: (text) => (text ? <a>{text}</a> : '-'),
  },
  {
    title: 'Amount',
    dataIndex: 'hash', // 必须有, 否则显示isEmpty
    key: 'amount',
    renderText: (value, records) => {
      const amount = (records?.out || []).reduce((preCount, currentItem) => preCount + currentItem.value, 0);
      return <Tag {...TAG_PROPS}>{formatNumber(amount / 100000000, 8)} BTC</Tag>;
    },
  },
  {
    title: 'Fee',
    dataIndex: 'fee',
    key: 'fee',
    renderText: (value, records) => {
      return <Tag {...TAG_PROPS}>{formatNumber(value / 100000000, 8)} BTC</Tag>;
    },
  },
  {
    title: 'Date',
    dataIndex: 'time',
    key: 'time',
    valueType: 'dateTime',
    // API返回的时间戳需要转为毫秒级别from
    renderText: (value) => {
      if (isNumber(value)) {
        return value * 1000;
      }
      return value;
    },
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    span: 3,
    render: (value) => {
      // coins init
      if (_.get(value, '0.prev_out.tx_index') == 0) {
        return <span style={{ ...TAG_PROPS.style }}>COINBASE (Newly Generated Coins)</span>;
      }
      return _.map(value, (item) => {
        return (
          <Row key={JSON.stringify(item) + 'from'} type="flex" align="middle" gutter={8} style={{ lineHeight: 2 }}>
            <Col {...ADDR_COL_PROPS}>
              <a style={TEXT_STYLE}>{item?.prev_out?.addr}</a>
            </Col>
            <Col {...BTC_COL_PROPS} style={{ whiteSpace: 'nowrap' }}>
              <Tag {...TAG_PROPS}>{formatNumber(item?.prev_out?.value / 100000000, 8)} BTC</Tag>
              <GlobalOutlined style={{ color: 'rgb(234, 91, 80)' }} />
            </Col>
          </Row>
        );
      });
    },
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
    span: 3,
    render: (value) => {
      // coins init
      if (_.get(value, '0.prev_out.tx_index') == 0) {
        return <span style={{ ...TAG_PROPS.style }}>COINBASE (Newly Generated Coins)</span>;
      }
      return _.map(value, (item, index) => {
        // value不存在, 不渲染了
        return (
          <Row key={JSON.stringify(item) + 'to'} type="flex" align="middle" gutter={8} style={{ lineHeight: 2 }}>
            <Col {...ADDR_COL_PROPS}>{item?.addr ? <a style={TEXT_STYLE}>{item?.addr}</a> : 'OP_RETURN'}</Col>
            <Col {...BTC_COL_PROPS} style={{ whiteSpace: 'nowrap' }}>
              <Tag {...TAG_PROPS}>{formatNumber(item?.value / 100000000, 8)} BTC</Tag>
              <GlobalOutlined style={{ color: 'rgb(61, 137, 245)' }} />
            </Col>
          </Row>
        );
      });
    },
  },
];
