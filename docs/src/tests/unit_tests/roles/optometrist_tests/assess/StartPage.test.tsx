import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StartPage from '../../../../../pages/optometrist/assess/StartPage';

// Mock Header 和 BottomNav 组件
jest.mock('../../../../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

jest.mock('../../../../../components/BottomNav', () => () => (
  <div data-testid="bottom-nav">Bottom Navigation Loaded</div>
));

// Mock useNavigate 钩子
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('StartPage Component', () => {
  test('renders Header, main content and BottomNav', () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    );

    // 检查Header是否渲染成功
    expect(screen.getByTestId('header')).toHaveTextContent('Assessment');

    // 检查页面内容是否渲染成功
    expect(screen.getByRole('heading', { name: 'Assessment' })).toBeInTheDocument();
    expect(
      screen.getByText(/This assessment can help determine appropriate referral recommendations/i)
    ).toBeInTheDocument();

    // 检查按钮是否渲染成功
    expect(screen.getByRole('button', { name: 'Start now' })).toBeInTheDocument();

    // 检查BottomNav是否渲染成功
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  test('navigate to first question on button click', () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: 'Start now' });

    // 模拟点击按钮
    fireEvent.click(button);

    // 检查导航函数是否被调用并跳转到正确路径
    expect(mockNavigate).toHaveBeenCalledWith('../questions/Q1');
  });
});