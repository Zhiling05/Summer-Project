import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';

// 创建一个测试用的路由容器
const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <div>
        {/* 模拟实际的路由结构 */}
        <div data-testid="select-role">Home Page</div>
        <div data-testid="assess-page">Assess Page</div>
        <div data-testid="records-page">Records Page</div>
        <div data-testid="guide-page">Guide Page</div>
        <BottomNav />
      </div>
    </MemoryRouter>
  );
};

describe('BottomNav Component', () => {
  // 1. 基础渲染测试
  it('renders all navigation buttons', () => {
    renderWithRouter();
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Assess')).toBeInTheDocument();
    expect(screen.getByText('Records')).toBeInTheDocument();
    expect(screen.getByText('Guide')).toBeInTheDocument();
  });

  // 2. 测试激活状态（真实行为）
  it('marks correct button as active based on current path', () => {
    renderWithRouter(['/select-role']);
    
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).toHaveClass('nav-item active');
    
    // 其他按钮不应该激活
    const assessButton = screen.getByText('Assess').closest('button');
    expect(assessButton).not.toHaveClass('nav-item active');
  });

  // 3. 测试点击行为的结果
  it('shows correct content when navigation occurs', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<div>Welcome</div>} />
          <Route path="/select-role" element={<div>Select Role Page</div>} />
          <Route path="/optometrist/assess/start-page" element={<div>Assessment Page</div>} />
          <Route path="/optometrist/records" element={<div>Records Page</div>} />
          <Route path="/optometrist/guide" element={<div>Guide Page</div>} />
        </Routes>
        <BottomNav />
      </MemoryRouter>
    );

    // 点击 Home 按钮
    fireEvent.click(screen.getByText('Home'));
    
    // 验证页面内容变化
    expect(screen.getByText('Select Role Page')).toBeInTheDocument();
  });

  // 4. 防重复导航测试
  it('prevents unnecessary navigation when already on target', () => {
    const { rerender } = renderWithRouter(['/select-role']);
    
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).toHaveClass('nav-item active');
    
    // 在激活状态的按钮上点击不应该有视觉变化
    fireEvent.click(screen.getByText('Home'));
    
    // 重新渲染后状态应该保持一致
    expect(homeButton).toHaveClass('nav-item active');
  });
});