import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideBar from '../../../components/SideBar';

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
let mockLocation = { pathname: '/test', state: null };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

// 创建路由容器辅助函数
const renderWithRouter = (initialPath = '/test') => {
  mockLocation.pathname = initialPath;
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <SideBar />
    </MemoryRouter>
  );
};

describe('SideBar Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocation = { pathname: '/test', state: null };
    // 清理可能存在的事件监听器
    document.removeEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  // 1. 汉堡按钮条件显示测试
  describe('Hamburger Button Visibility', () => {
    it('shows hamburger button on normal pages', () => {
      renderWithRouter('/optometrist/assess');
      
      expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
    });

    it('hides hamburger button on settings page', () => {
      renderWithRouter('/settings');
      
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });

    it('hides hamburger button on contact-us page', () => {
      renderWithRouter('/contact-us');
      
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });
  });

  // 2. 侧边栏开关状态测试
  describe('Sidebar Toggle Functionality', () => {
    it('opens sidebar when hamburger button is clicked', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      expect(screen.getByLabelText('Close navigation')).toBeInTheDocument();
      expect(document.querySelector('.sidebar.open')).toBeInTheDocument();
    });

    it('closes sidebar when hamburger button is clicked again', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      
      // 打开侧边栏
      fireEvent.click(hamburgerBtn);
      expect(screen.getByLabelText('Close navigation')).toBeInTheDocument();
      
      // 关闭侧边栏
      const closeBtn = screen.getByLabelText('Close navigation');
      fireEvent.click(closeBtn);
      expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
    });

    it('shows overlay when sidebar is open', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      expect(document.querySelector('.sidebar-overlay')).toBeInTheDocument();
    });

    it('closes sidebar when overlay is clicked', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      const overlay = document.querySelector('.sidebar-overlay');
      expect(overlay).toBeInTheDocument();
      
      fireEvent.click(overlay!);
      expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
    });
  });

  // 3. 侧边栏链接渲染测试
  describe('Sidebar Links', () => {
    it('renders settings and contact us links', () => {
      renderWithRouter('/test');
      
      // 打开侧边栏才能看到链接
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('links have correct href attributes', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      const settingsLink = screen.getByText('Settings').closest('a');
      const contactLink = screen.getByText('Contact Us').closest('a');
      
      expect(settingsLink).toHaveAttribute('href', '/settings');
      expect(contactLink).toHaveAttribute('href', '/contact-us');
    });
  });

  // 4. 路径变化时的行为测试
  describe('Path Change Behavior', () => {
    it('closes sidebar when navigating to settings page', () => {
      const { rerender } = renderWithRouter('/test');
      
      // 先打开侧边栏
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      expect(document.querySelector('.sidebar.open')).toBeInTheDocument();
      
      // 模拟路径变化到 settings
      mockLocation.pathname = '/settings';
      rerender(
        <MemoryRouter initialEntries={['/settings']}>
          <SideBar />
        </MemoryRouter>
      );
      
      // 侧边栏应该关闭，汉堡按钮应该隐藏
      expect(document.querySelector('.sidebar.open')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });

    it('closes sidebar when navigating to contact-us page', () => {
      const { rerender } = renderWithRouter('/test');
      
      // 先打开侧边栏
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      expect(document.querySelector('.sidebar.open')).toBeInTheDocument();
      
      // 模拟路径变化到 contact-us
      mockLocation.pathname = '/contact-us';
      rerender(
        <MemoryRouter initialEntries={['/contact-us']}>
          <SideBar />
        </MemoryRouter>
      );
      
      // 侧边栏应该关闭，汉堡按钮应该隐藏
      expect(document.querySelector('.sidebar.open')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });
  });

  // 5. 汉堡按钮样式状态测试
  describe('Hamburger Button State', () => {
    it('applies active class when sidebar is open', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      expect(hamburgerBtn).not.toHaveClass('active');
      
      fireEvent.click(hamburgerBtn);
      
      const activeBtn = screen.getByLabelText('Close navigation');
      expect(activeBtn).toHaveClass('active');
    });

    it('removes active class when sidebar is closed', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      
      // 打开
      fireEvent.click(hamburgerBtn);
      expect(screen.getByLabelText('Close navigation')).toHaveClass('active');
      
      // 关闭
      const closeBtn = screen.getByLabelText('Close navigation');
      fireEvent.click(closeBtn);
      expect(screen.getByLabelText('Open navigation')).not.toHaveClass('active');
    });
  });
});