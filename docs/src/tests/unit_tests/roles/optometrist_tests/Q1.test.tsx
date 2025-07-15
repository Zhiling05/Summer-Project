// src/tests/unit_tests/roles/optometrist_tests/Q1.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import Q1 from '../../../../pages/optometrist/assess/questions/Q1';

/**
 * Q1 组件 单元测试
 */
describe('Q1 组件', () => {
  it('应当渲染问题标题和“Next”按钮', () => {
    // 如果 Q1 内部使用了 Link/Navigation，可包裹 MemoryRouter
    render(
      <MemoryRouter>
        <Q1 />
      </MemoryRouter>
    );

    // 检查是否有标题（h1/h2/h3 等）
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();

    // 检查“下一步”按钮是否存在，若按钮文本不同，请调整正则
    const nextButton = screen.getByRole('button', { name: /下一步|Next/i });
    expect(nextButton).toBeInTheDocument();
  });
});
