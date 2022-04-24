/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 02:11:01
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-24 13:58:23
 * @ Description: 运行时配置
 */

import { Input, Row } from 'antd';
import { history } from 'umi';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';

const { Search } = Input;

// 包裹全局ConfigProvider
export function rootContainer(container) {
  return <ConfigProvider locale={enUS}>{container}</ConfigProvider>;
}

// 配置全局的请求配置
export const request = {
  prefix: 'https://blockchain.info/',
  mode: 'cors',
  timeout: 5000,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [
    // 适配API返回数据格式
    async (res) => {
      const data = await res.json();
      return {
        ...res,
        success: res.status === 200,
        data: data,
        errorMessage: data.message,
      };
    },
  ],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => (
      <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
        <Search
          allowClear
          defaultValue={history.location.pathname.replaceAll('/', '')}
          placeholder="Please enter the hash"
          enterButton="Search"
          onSearch={(value) => {
            history.push(`/${value}`);
          }}
          style={{
            minWidth: '50vw',
            maxWidth: '75vw',
          }}
        />
      </div>
    ),
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    collapsedButtonRender: () => <div></div>,
    footerRender: () => (
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{ height: 36, position: 'fixed', bottom: 0, width: '100vw', background: 'white' }}
      >
        <a href="https://github.com/FireTable/arcblock-code-testing" target="_blank" rel="noopener noreferrer">
          [Github Repo]
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://docs.arcblock.io/abtnode/" target="_blank" rel="noopener noreferrer">
          [Learn Blocklet]
        </a>
      </Row>
    ),
    menuHeaderRender: (logo, title) => {
      return (
        <div
          style={{
            borderRadius: 4,
            backgroundColor: 'rgb(3, 21, 41)',
            height: 36,
            padding: '0px 12px',
          }}
        >
          {logo}
          {title}
        </div>
      );
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    ...initialState?.settings,
  };
};
