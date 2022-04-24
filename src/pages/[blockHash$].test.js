import BlockHashPage from './[blockHash$]';
import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

// 对[blockHash$].js进行单元测试   --------------------------------------------------
describe('[blockHash$]页面测试', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('test snapshot', () => {
    const wrapper = shallow(<BlockHashPage />);
    expect(toJson(wrapper)).toMatchSnapshot(); // 快照
  });

  test('show Waiting for you...', () => {
    const wrapper = mount(<BlockHashPage />);
    const p = wrapper.find('.ant-result-title');
    // 空白页校验
    expect(p.text()).toBe('Waiting for you...');
  });
});

// 对[blockHash$].js进行单元测试   --------------------------------------------------
