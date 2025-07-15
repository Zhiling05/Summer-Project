// src/tests/unit_tests/roles/optometrist_tests/QuestionsRouter.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// 自动 mock Q1 ~ Q19
const questionIds = Array.from({ length: 19 }, (_, i) => i + 1);
questionIds.forEach((n) => {
  jest.mock(
    `../../../../pages/optometrist/assess/questions/Q${n}`,
    () => () => <div data-testid={`q${n}-mock`} />
  );
});

import QuestionsRouter from '../../../../pages/optometrist/assess/questions/QuestionsRouter';

describe('QuestionsRouter 组件', () => {
  // 为每一个已存在的 q 路由动态生成测试用例
  questionIds.forEach((n) => {
    it(`当路由为 /q${n} 时，应渲染 Q${n} 组件占位`, () => {
      render(
        <MemoryRouter initialEntries={[`/q${n}`]}>
          <QuestionsRouter />
        </MemoryRouter>
      );
      expect(screen.getByTestId(`q${n}-mock`)).toBeInTheDocument();
    });
  });

  it('路径未匹配任何 q 时，不应渲染任何 question 占位', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/q999']}>
        <QuestionsRouter />
      </MemoryRouter>
    );
    expect(container.querySelector('[data-testid$="-mock"]')).toBeNull();
  });
});