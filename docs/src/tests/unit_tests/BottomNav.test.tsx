// src/tests/unit_tests/BottomNav.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// 模拟 useNavigate，捕获导航调用
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // 保留原有其他导出
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import BottomNav from '../../components/BottomNav';  // 根据项目结构调整路径

/**
 * BottomNav 组件 单元测试
 */
describe('BottomNav 组件', () => {
  /**
   * 测试：渲染所有导航按钮
   */
  it('应渲染 Home、Assess、Records、Guide 四个导航按钮', () => {
    // 使用 MemoryRouter 包裹，以支持内部的编程式导航
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );

    // 检查页面上是否存在这四个按钮
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Assess/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Records/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guide/i })).toBeInTheDocument();
  });

  /**
   * 测试：点击按钮时应调用 navigate 到对应路由
   */
  it('点击 Home、Assess、Records、Guide 按钮应调用对应的 navigate 路由', () => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );

    // 点击 Home 按钮，应该导航到 /optometrist/home
    fireEvent.click(screen.getByRole('button', { name: /Home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/optometrist/home');

    // 点击 Assess 按钮，应该导航到 /optometrist/assess/start
    fireEvent.click(screen.getByRole('button', { name: /Assess/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/optometrist/assess/start');

    // 点击 Records 按钮，应该导航到 /optometrist/records
    fireEvent.click(screen.getByRole('button', { name: /Records/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/optometrist/records');

    // 点击 Guide 按钮，应该导航到 /optometrist/guide
    fireEvent.click(screen.getByRole('button', { name: /Guide/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/optometrist/guide');
  });
});
