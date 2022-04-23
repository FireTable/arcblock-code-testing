/**
 * @ Author: Liang Yongzhuo
 * @ Create Time: 2022-04-24 00:56:40
 * @ Modified by: Liang Yongzhuo
 * @ Modified time: 2022-04-24 01:33:50
 * @ Description: Jest.config.js use Enzyme
 */

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { jest } from '@jest/globals';
import React from 'react';

jest.mock('umi', () => ({
  useParams: () => {
    return {
      blockHash: '',
    };
  },
  useRequest: (url, options) => {
    return {
      success: true,
      data: {},
      errorMessage: '',
    };
  },
}));

configure({ adapter: new Adapter() });
