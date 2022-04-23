/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-23 21:16:59
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-23 21:32:13
 * @ Description: 按需加载时候的Loading组件
 */

import React from 'react';
import logo from '../../public/logo.svg';

export default () => {
  const fullCenterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: 'white',
    fontWeight: 'bold',
  };
  return (
    <div
      style={{
        height: '80vh',
        width: '100%',
        ...fullCenterStyle,
      }}
    >
      <div
        style={{
          ...fullCenterStyle,
          background: 'rgb(3, 21, 41)',
          borderRadius: 4,
          padding: 24,
          width: 240,
          height: 240,
        }}
      >
        <img src={logo} width={120}></img>
        <div style={{ marginTop: 12 }}>Loading...</div>
      </div>
    </div>
  );
};
