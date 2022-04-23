/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 02:11:01
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 17:29:56
 * @ Description: 运行时配置
 */

import { Input } from 'antd';

const { Search } = Input;

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
    rightContentRender: () => <Search placeholder="input search text" enterButton="Search" loading />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    collapsedButtonRender: () => <div></div>,
    footerRender: () => <div></div>,
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    ...initialState?.settings,
  };
};
