//后续可以完善添加响应式适配测试，就是页面的resizing


import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import StartPage from '../../../../../pages/optometrist/assess/StartPage';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('StartPage Component Tests', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders logos, title and context lines', () => {
        render(
            <MemoryRouter>
                <StartPage />
            </MemoryRouter>
        );

        expect(screen.getByAltText('NHS logo')).toBeInTheDocument();
        expect(screen.getByAltText('DIPP Study logo')).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: 'StartPage' })).toBeInTheDocument();

        expect(screen.getByText('context line 1')).toBeInTheDocument();
        expect(screen.getByText('context line 2')).toBeInTheDocument();
        expect(screen.getByText('context line 3')).toBeInTheDocument();
    });

    it('navigates to questions/Q1 when clicking the Start now button', () => {
        render(
            <MemoryRouter>
                <StartPage />
            </MemoryRouter>
        );

        const startButton = screen.getByRole('button', { name: 'Start now' });
        expect(startButton).toBeInTheDocument();

        fireEvent.click(startButton);

        expect(mockNavigate).toHaveBeenCalledWith('questions/Q1');
    });

    //测试响应式适配
    it('renders correctly on small screen widths (responsive)', () => {
        // 模拟小屏设备
        window.innerWidth = 375;
        window.dispatchEvent(new Event('resize'));

        render(
            <MemoryRouter>
                <StartPage />
            </MemoryRouter>
        );

        // 基本渲染仍然正常
        expect(screen.getByRole('heading', { name: 'StartPage' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Start now' })).toBeInTheDocument();
    });


    //测试图片处理失败的边远情况
    it('handles logo image load failure gracefully', () => {
        render(
            <MemoryRouter>
                <StartPage />
            </MemoryRouter>
        );

        const nhsLogo = screen.getByAltText('NHS logo') as HTMLImageElement;

        // 模拟加载错误
        fireEvent.error(nhsLogo);

        // 图片仍在页面上（React 不会自动删除 img 元素）
        expect(nhsLogo).toBeInTheDocument();
    });



});
