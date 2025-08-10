import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../../components/Header';

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/test', state: null };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

// 创建路由容器辅助函数
const renderWithRouter = (props: any) => {
  return render(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // 1. 基础渲染测试
  it('renders title correctly', () => {
    renderWithRouter({ title: 'Assessment Page' });
    expect(screen.getByText('Assessment Page')).toBeInTheDocument();
  });

  it('renders all required logos', () => {
    renderWithRouter({ title: 'Test' });
    
    expect(screen.getByAltText('NHS logo')).toBeInTheDocument();
    expect(screen.getByAltText('DIPP Study logo')).toBeInTheDocument();
    expect(screen.getByAltText('Humbug logo')).toBeInTheDocument();
  });

  // 2. 标题变化测试
  it('displays different titles correctly', () => {
    const { rerender } = renderWithRouter({ title: 'Home' });
    expect(screen.getByText('Home')).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <Header title="Assessment" />
      </MemoryRouter>
    );
    expect(screen.getByText('Assessment')).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <Header title="Records" />
      </MemoryRouter>
    );
    expect(screen.getByText('Records')).toBeInTheDocument();
  });

  // 3. 汉堡按钮导航功能测试
  it('navigates to sidebar when hamburger button is clicked', () => {
    mockLocation.pathname = '/test'; // 确保在显示汉堡按钮的页面
    
    renderWithRouter({ title: 'Test' });
    
    const hamburgerBtn = screen.getByLabelText('Open navigation');
    expect(hamburgerBtn).toBeInTheDocument();
    
    hamburgerBtn.click();
    
    expect(mockNavigate).toHaveBeenCalledWith('/sidebar');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});