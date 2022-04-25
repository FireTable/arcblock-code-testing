# ArcBlock-Coding-Test by umijs-templates

本项目来自 ArcBlock 的 Coding-Test, 通过使用 [Blockchain.com](https://blockchain.com) 的 [API 接口](https://www.blockchain.com/api/blockchain_api), 实现 [类似页面](https://www.blockchain.com/btc/block/00000000000000000007878ec04bb2b2e12317804810f4c26033585b3f81ffaa).


## Launch on Blocklet Server

[![Launch on Blocklet Server](https://assets.arcblock.io/icons/launch_on_blocklet_server.svg)](https://install.arcblock.io/?action=blocklet-install&meta_url=https%3A%2F%2Fgithub.com%2FFireTable%2Farcblock-code-testing%2Freleases%2Fdownload%2Fv1.0.1%2Fblocklet.json)

## 快速预览

<img src="https://github.com/FireTable/arcblock-code-testing/blob/main/screenshots/result-pc.png"  alt=""/>
<p align="center">PC端</p>

<p align="center"><img src="https://github.com/FireTable/arcblock-code-testing/blob/main/screenshots/result-mobile.png" width="480" height="1100" alt=""/>
<p align="center">手机端</p>

<img src="https://github.com/FireTable/arcblock-code-testing/blob/main/screenshots/result-umijs-deploy.png" alt=""/>
<p align="center">部署结果</p>

<img src="https://github.com/FireTable/arcblock-code-testing/blob/main/screenshots/result-devEnv.png" alt=""/>
<p align="center">项目 blocklet 信息</p>

<img src="https://github.com/FireTable/arcblock-code-testing/blob/main/screenshots/init-umijs-project.jpg"  alt=""/>
<p align="center">初始化 umijs 项目</p>

<img src="https://github.com/FireTable/arcblock-code-testing/blob/main/screenshots/github-actions-auto-test.png"  alt=""/>
<p align="center">github Actions</p>

## 简介


### 项目简介

* 项目使用的第三方API, 观察发现无需跨域, allow-orgin: *, 故选择使用 static 的相关模板
* 考虑到想学习一下 create-blocklet 以及 ArcBlock团队: 所有工具设计时候都考虑未来的复用, 故项目模板没有用预设的模板, 而是弄了新模板 templates-react-umijs-static / templates-react-umijs-antdPro-static (多花费了不少时间)
  * 对应的 templates 的修改, 放在了 ./@create-blocklet/templates/*
  * 对应的 index.js 的修改, 放在了 ./@create-blocklet/index.js
  * 覆盖一下 [create-blocklet](https://www.arcblock.io/zh/developer-portal), node index.js 后可以umijs的模板
* 使用 [umijs](https://umijs.org) 作为主框架, 减少项目的配置
* 使用 [proComponents](https://procomponents.ant.design/components) 作为主要组件库, 减少组件的开发
* 使用 [styled-components](https://github.com/styled-components/styled-components) CSS IN JS, 编写项目的样式
* 使用 [lodash](https://github.com/styled-components/styled-components) 第三方工具库, 减少开发和单元测试量
* 使用 [jest-enzyme](https://github.com/enzymejs/enzyme) 编写自动化测试
  * 但是测试覆盖面不够广, 预留时间较短, 待完善
  * enzyme似乎也没支持React17, 配合umijs有各种错误

### TODO List

- [x] 搭建项目 
  - [x] (额外内容) 编写 umijs-templates 的 blocklet, 完善 index.js
  - [x] 使用 create-blotklet, init project, 安装各种依赖
- [x] 开发过程
  - [x] 安装使用 Blocklet Server
  - [x] 完成 Coding-Test 基本功能
  - [x] (额外内容) 优化体验
    - [x] Page按需加载 Loading
    - [x] 增加 Auto-Refresh, 2分钟一次
    - [x] 欢迎页
  - [ ] 单元测试
    - [x] 搭建jest-enzyme
    - [x] 基本的单元测试
    - [x] 提高测试覆盖率
- [x] 部署阶段
  - [x] 完善 Github Actions, 可成功执行, 增加 Auto-Test
  - [x] 配置 blocklet.yml
  - [x] (额外内容) 验证/测试/修复, umijs-templates 问题
  - [ ] (额外内容) 部署到家里面的私网环境, 提供公网访问 

### 代码目录说明

```bash

# macOS安装 tree
brew install tree

# 执行一下
tree -I "node_modules|test*|LICENSE|README.en.md|.umi|dist|build" -L 3

# 重点目录解释
── @create-blocklet     // 来自 create-blocklet 仓库的 diff 变更
│   ├── index.js        // 修改后的 index.js
│   └── templates       // 新增的umijs-templates
├── blocklet.md
├── blocklet.yml  
├── jest.config.js      // jest配置
├── public              // 静态资源
├── screenshots         // preview截图
├── setup-enzyme.js
├── src                 // 代码目录
│   ├── app.js          // umijs 运行时全局配置
│   ├── components      // 组件大全
│   │   ├── CustomValueTypeProvider.js       // ***** CustomValueTypeProvider 组件, proComponents用
│   │   └── PageLoading.js                   // PageLoading 组件, umijs用
│   ├── global.less
│   ├── pages
│   │   ├── [blockHash$].js                  // ***** [blockHash$] 页面, umjis的动态路由
│   │   ├── [blockHash$].test.js             // 页面单元测试
│   │   ├── constants.js                     // ***** clomuns 常量, 用来渲染页面
│   │   └── document.ejs
│   ├── utils.js                             // 工具方法
│   └── utils.test.js                        // 工具方法单元测试

```


## 如何使用

```bash
# 首先找一个你喜欢的目录
git clone https://github.com/FireTable/arcblock-code-testing.git

# 进入目录
cd ./arcblock-code-testing

# 安装依赖
yarn

# 本地启动1: umi启动
# 首次打开会构建 mfsu, 后续再次会变快, 请耐心等待
yarn start
# 本地启动2: blocklet启动
# 如果你使用 blocklet server 的 dev-mode 模式, (模式不能错, 否则需要重装/更换目录)
blocklet dev

# 运行测试
yarn test

# 编译成生产环境的代码
yarn build

# 打包成一个 blocklet
yarn bundle

# 发布到本地 abtnode
yarn deploy
```

## 项目感受 

### 试用 Blocklet-Server 感受

挺成熟的平台, 类比起来感觉是 分布式版本的 docker/k8s, 做了很多减法

美中不足的是, docker版本用了一下, 没有特权模式没办法使用 

然后本机部署又要独占nginx, 我需要腾出来一块开发板, 重装后才能安装上


### 开发感受

挺有趣的过程, 文档写的还不错 

目前工具挺充足的

