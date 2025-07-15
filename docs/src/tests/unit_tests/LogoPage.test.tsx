// src/tests/unit_tests/LogoPage.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import LogoPage from '../../pages/LogoPage';

/**
 * 测试 LogoPage 组件
 */
describe('LogoPage 组件', () => {
  it('应当渲染 “Logo Page” 标题', () => {
    render(<LogoPage />);
    // 这里改成查找标题文本
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Logo Page');
  });
});
