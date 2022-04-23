import BlockHashPage from './[blockHash$]';
import React from 'react';
import { mount } from 'enzyme';

// 对[blockHash$].js进行单元测试   --------------------------------------------------

test('show Waiting for you...', () => {
  const wrapper = mount(<BlockHashPage />);
  const p = wrapper.find('.ant-result-title');
  expect(p.text()).toBe('Waiting for you...');
});

// test('blockHash: 33 => show Something went wrong.', () => {
//   const wrapper = mount(<BlockHashPage />);
//   const p = wrapper.find('.ant-result-title');
//   expect(p.text()).toBe('Something went wrong.');
// });

// 对[blockHash$].js进行单元测试   --------------------------------------------------
